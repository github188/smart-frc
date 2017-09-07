package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiAccessDAO;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static cn.com.inhand.common.service.Collections.WIFI_TERMINAL_ACCESS;
import static cn.com.inhand.common.service.Collections.WIFI_USER_ACCESS;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/**
 *
 * Created by Jerolin on 6/27/2014.
 */
@Service
public class WifiAccessDAOImpl extends MongoService implements WifiAccessDAO {

	@Override
	public List<Map> getTermimalAccess(ObjectId oId, String mac, Date start, Date end, int cursor, int limit) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("mac").is(mac).and("startTime").gt(start).lt(end));
		query.limit(limit).skip(cursor);
		query.fields().exclude("_id");
		query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "startTime")));
		return template.find(query, Map.class, WIFI_TERMINAL_ACCESS);
	}

	@Override
	public long getTermimalAccessCount(ObjectId oId, String mac, Date start, Date end) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("mac").is(mac).and("startTime").gt(start).lt(end));
		return template.count(query, WIFI_TERMINAL_ACCESS);
	}

	@Override
	public List<Map> getUserAccess(ObjectId oId, ObjectId userId, Date start, Date end, int cursor, int limit) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("userId").is(userId).and("startTime").gt(start).lt(end));
		query.limit(limit).skip(cursor);
		query.fields().exclude("_id");
		query.with(new Sort(new Sort.Order(Sort.Direction.DESC, "startTime")));
		return template.find(query, Map.class, WIFI_USER_ACCESS);
	}

	@Override
	public long getUserAccessCount(ObjectId oId, ObjectId userId, Date start, Date end) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("userId").is(userId).and("startTime").gt(start).lt(end));
		return template.count(query, WIFI_USER_ACCESS);
	}

}
