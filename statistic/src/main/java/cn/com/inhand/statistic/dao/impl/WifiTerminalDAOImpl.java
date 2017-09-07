package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.model.wifi.WIFITerminal;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.constant.Vars;
import cn.com.inhand.statistic.dao.WifiTerminalDAO;
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

import java.util.*;

import static cn.com.inhand.common.service.Collections.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.update;

/**
 *
 * Created by Jerolin on 6/12/2014.
 */
@Service
public class WifiTerminalDAOImpl extends MongoService implements WifiTerminalDAO {
	@Override
	public long getTotalTerminals(ObjectId oId) {
		return factory.getMongoTemplateByOId(oId).count(null, WIFI_TERMINALS);
	}

	@Override
	public long getNewTerminals(ObjectId oId, Date startTime, Date endTime) {
		Query query = query(where("createTime").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).count(query, WIFI_TERMINALS);
	}

	@Override
	public long getTotalOnlineTerminals(ObjectId oId, Date startTime) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Criteria query = where("id").is(Vars.WIFI_ONLINE_TERMINALS).and("timestamp").gte(startTime);

		MatchOperation match = new MatchOperation(query);
		GroupOperation maxGroup = new GroupOperation(Fields.fields("deviceId")).max("value").as("max");
		GroupOperation sumGroup = new GroupOperation(Fields.fields()).sum("max").as("total");

		Aggregation aggregation = Aggregation.newAggregation(match, maxGroup, sumGroup);
		AggregationResults<Map> aggregate = template.aggregate(aggregation, HISTORY_DATA, Map.class);

		Map result = aggregate.getUniqueMappedResult();
		return MapUtils.getIntValue(result, "total", 0);
	}
/*


	@Override
	public long getTotalOnlineTerminals(ObjectId oId, Date startTime) {
		DBCollection coll = factory.getMongoTemplateByOId(oId).getCollection(HISTORY_DATA);
		DBObject query = where("id").is(Vars.WIFI_ONLINE_TERMINALS).and("timestamp").gte(startTime).getCriteriaObject();
		DBObject match = BasicDBObjectBuilder.start("$match", query).get();
		DBObject groupObject = BasicDBObjectBuilder.start("_id", "$deviceId")
				.add("max", new BasicDBObject("$max", "$value"))
				.get();
		DBObject group = BasicDBObjectBuilder.start("$group", groupObject).get();
		DBObject groupObject2 = BasicDBObjectBuilder.start("_id", "1")
				.add("total", new BasicDBObject("$sum", "$max"))
				.get();
		DBObject group2 = BasicDBObjectBuilder.start("$group", groupObject2).get();
		AggregationOutput output = coll.aggregate(match, group, group2);
		if (output.getCommandResult().get("result") instanceof List) {
			List result = (List) output.getCommandResult().get("result");
			if (result.size() > 0) {
				Object o = result.get(0);
				if (o instanceof Map) {
					return MapUtils.getIntValue((Map) o, "total");
				}
			}
		}
		return 0;
	}

*/
	@Override
	public void addNewTerminal(ObjectId oId, WIFITerminal terminal) {
		Query query = query(where("mac").is(terminal.getMac()));
		Update update = update("mac", terminal.getMac())
				.set("createTime", terminal.getCreateTime())
				.set("login", terminal.getLogin())
				.set("logout", terminal.getLogout());
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINALS);
	}

	@Override
	public WIFITerminal getTerminal(ObjectId oId, String mac) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("mac").is(mac));
		return template.findOne(query, WIFITerminal.class, WIFI_TERMINALS);
	}

	@Override
	public void updateTerminal(ObjectId oId, WIFITerminal terminal) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("mac").is(terminal.getMac()));
		template.save(terminal, WIFI_TERMINALS);
	}

	@Override
	public Set<String> getTerminalMacs(ObjectId oId) {
		Query query = new Query();
		query.fields().include("mac").exclude("_id");
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		List<WIFITerminal> terminals = template.find(query, WIFITerminal.class, WIFI_TERMINALS);
		Set<String> list = new HashSet<String>(terminals.size());
		for (WIFITerminal terminal : terminals) {
			list.add(terminal.getMac());
		}
		return list;
	}

	@Override
	public List<CountStatistic> getNewTerminalsStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_TERMINAL_NEW);
	}

	@Override
	public List<CountStatistic> getTotalTerminalsStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_TERMINAL_TOTAL);
	}

	@Override
	public List<CountStatistic> getOnlineTerminalsStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_TERMINAL_ONLINE);
	}

	@Override
	public void updateTotalTerminals(ObjectId oId, Date date, long count) {
		Query query = query(where("date").is(date));
		Update update = update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINAL_TOTAL);
	}

	@Override
	public void updateNewTerminals(ObjectId oId, Date date, long count) {
		Query query = query(where("date").is(date));
		Update update = update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINAL_NEW);
	}

	@Override
	public void updateOnlineTerminals(ObjectId oId, Date date, long count) {
		Query query = query(where("date").is(date));
		Update update = update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINAL_ONLINE);
	}

	@Override
	public long getDailyTotalOnlineCount(ObjectId oId, Date date) {
		Query query = Query.query(Criteria.where("date").gte(date));
		query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "count")));
		Map one = factory.getMongoTemplateByOId(oId).findOne(query, Map.class, WIFI_TERMINAL_ONLINE);
		Long count = MapUtils.getLong(one, "count");
		return (count == null) ? 0 : count;
	}

	@Override
	public void updateDailyOnlineCount(ObjectId oId, Date date, long count) {
		Query query = Query.query(Criteria.where("date").is(date));
		Update update = Update.update("count", count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINAL_ONLINE_DAILY);
	}

	@Override
	public List<CountStatistic> getWeeklyActiveTerminalsStat(ObjectId oId, Date startTime, Date endTime) {
		Query query = query(where("date").gte(startTime).lt(endTime));
		return factory.getMongoTemplateByOId(oId).find(query, CountStatistic.class, WIFI_TERMINAL_WEEKLY_ACTIVE);
	}

	@Override
	public void incWifiWeeklyActiveTerminals(ObjectId oId, Date date, int Count) {
		Query query = query(where("date").is(date));
		Update update = new Update().inc("count", Count);
		factory.getMongoTemplateByOId(oId).upsert(query, update, WIFI_TERMINAL_WEEKLY_ACTIVE);
	}
}
