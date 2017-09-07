package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.constant.Vars;
import cn.com.inhand.statistic.dao.WifiUserDAO;
import cn.com.inhand.statistic.dto.CountStatistic;
import org.apache.commons.collections.MapUtils;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.*;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static cn.com.inhand.common.service.Collections.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;

/**
 * Created by Jerolin on 6/12/2014.
 */
@Service
public class WifiUserDAOImpl extends MongoService implements WifiUserDAO {
	@Override
	public long getTotalUsers(ObjectId oId) {
		return factory.getMongoTemplateByOId(oId).count(null, WIFI_USERS);
	}

	@Override
	public long getNewUsers(ObjectId oId, Date startTime, Date endTime) {
		Query query = Query.query(where("createTime").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).count(query, WIFI_USERS);
	}

	@Override
	public long getDailyTotalOnlineCount(ObjectId oId, Date date) {
		Query query = Query.query(where("date").gte(date));
		query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "count")));
		Map one = factory.getMongoTemplateByOId(oId).findOne(query, Map.class, WIFI_USER_ONLINE);
		Long count = MapUtils.getLong(one, "count");
		return (count == null) ? 0 : count;
	}

	@Override
	public long getTotalOnlineUsers(ObjectId oId, Date startTime) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Criteria query = where("id").is(Vars.WIFI_ONLINE_USERS).and("timestamp").gte(startTime);

		MatchOperation match = new MatchOperation(query);
		GroupOperation maxGroup = new GroupOperation(Fields.fields("deviceId")).max("value").as("max");
		GroupOperation sumGroup = new GroupOperation(Fields.fields()).sum("max").as("total");

		Aggregation aggregation = Aggregation.newAggregation(match, maxGroup, sumGroup);
		AggregationResults<Map> aggregate = template.aggregate(aggregation, HISTORY_DATA, Map.class);

		Map result = aggregate.getUniqueMappedResult();
		return MapUtils.getIntValue(result, "total", 0);



//		DBCollection coll = template.getCollection(HISTORY_DATA);
//		DBObject queryObject = query.getCriteriaObject();
//		DBObject match = BasicDBObjectBuilder.start("$match", queryObject).get();
//		DBObject groupObject = BasicDBObjectBuilder.start("_id", "$deviceId")
//				.add("max", new BasicDBObject("$max", "$value"))
//				.get();
//		DBObject group = BasicDBObjectBuilder.start("$group", groupObject).get();
//		DBObject groupObject2 = BasicDBObjectBuilder.start("_id", "1")
//				.add("total", new BasicDBObject("$sum", "$max"))
//				.get();
//		DBObject group2 = BasicDBObjectBuilder.start("$group", groupObject2).get();

//		AggregationOutput output = coll.aggregate(match, group, group2);
//		if (output.getCommandResult().get("result") instanceof List) {
//			List result = (List) output.getCommandResult().get("result");
//			if (result.size() > 0) {
//				Object o = result.get(0);
//				if (o instanceof Map) {
//					return MapUtils.getIntValue((Map) o, "total");
//				}
//			}
//		}
//
//		return 0;
	}

	@Override
	public List<CountStatistic> getNewUsersStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = Query.query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_USER_NEW);
	}

	@Override
	public List<CountStatistic> getTotalUsersStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = Query.query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_USER_TOTAL);
	}

	@Override
	public List<CountStatistic> getOnlineUsersStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = Query.query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_USER_ONLINE);
	}

	@Override
	public List<CountStatistic> getWeeklyActiveUsersStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = Query.query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_USER_WEEKLY_ACTIVE);
	}

	@Override
	public void updateTotalUsers(ObjectId oId, Date date, long count) {
		Query query = Query.query(where("date").is(date));
		Update update = Update.update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_USER_TOTAL);
	}

	@Override
	public void updateNewUsers(ObjectId oId, Date date, long count) {
		Query query = Query.query(where("date").is(date));
		Update update = Update.update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_USER_NEW);
	}

	@Override
	public void updateOnlineUsers(ObjectId oId, Date date, long count) {
		Query query = Query.query(where("date").is(date));
		Update update = Update.update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_USER_ONLINE);
	}

	@Override
	public void updateDailyOnlineCount(ObjectId oId, Date date, long count) {
		Query query = Query.query(where("date").is(date));
		Update update = Update.update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_USER_ONLINE_DAIYLY);
	}

	@Override
	public void incWIFIWeeklyActiveUsers(ObjectId oId, Date date, int Count) {
		Query query = Query.query(where("date").is(date));
		Update update = new Update().inc("count", Count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_USER_WEEKLY_ACTIVE);
	}
}
