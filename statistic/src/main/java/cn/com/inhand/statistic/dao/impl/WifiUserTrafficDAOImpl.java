package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiUserTrafficDAO;

import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.time.DateUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static cn.com.inhand.common.service.Collections.WIFI_USER_TRAFFIC;
import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.update;

/**
 *
 * Created by Jerolin on 6/27/2014.
 */
@Service
public class WifiUserTrafficDAOImpl extends MongoService implements WifiUserTrafficDAO {

	@Override
	public Long saveTraffic(ObjectId oId, ObjectId userId, long tx, long rx, Date date, long time) {
		date = DateUtils.truncate(date, Calendar.MONTH);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("userId").is(userId).and("date").is(date));
		Update update = new Update().inc("tx", tx).inc("rx", rx).inc("time", time);
		Map map = template.findAndModify(query, update, options().upsert(true), Map.class, WIFI_USER_TRAFFIC);
		return MapUtils.getLong(map, "time");
	}

	@Override
	public List<Map> getTrafficByUserIds(ObjectId oId, List<ObjectId> userIds) {
		Date date = DateUtils.truncate(new Date(), Calendar.MONTH);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("userId").in(userIds).and("date").is(date));
		query.fields().exclude("_id");
		return template.find(query, Map.class, WIFI_USER_TRAFFIC);
	}

	@Override
	public Long updateUserAccessInterval(ObjectId oId, ObjectId userId, Date date, long interval) {
		date = DateUtils.truncate(date, Calendar.MONTH);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("userId").is(userId).and("date").is(date));
		Map map = template.findOne(query, Map.class, WIFI_USER_TRAFFIC);

		if (map == null) {
			template.upsert(query, update("time", 0), WIFI_USER_TRAFFIC);
		}

		Update update = update("interval", interval);
		query.addCriteria(new Criteria().orOperator(where("interval").gt(interval), where("interval").is(null)));
		template.updateFirst(query, update, WIFI_USER_TRAFFIC);
		return MapUtils.getLong(map, "interval");
	}
 
}
