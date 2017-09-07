package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiStatDAO;
import cn.com.inhand.statistic.dto.WifiStatDTO;
import cn.com.inhand.statistic.model.WifiStat;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.*;

import static cn.com.inhand.common.service.Collections.WIFI_STAT;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.*;

/**
 * Created by Jerolin on 7/13/2014.
 */
@Service
public class WifiStatDAOImpl extends MongoService implements WifiStatDAO {

	private static final Logger LOG = LoggerFactory.getLogger(WifiStatDAO.class);

	@Override
	public void incCounter(ObjectId oId, ObjectId objectId, int type, Date date, long value) {
		LOG.debug("inc {} stat of type {} in oid {}", value, type , oId);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("type").is(type).and("date").is(date).and("objectId").is(objectId));
		Update update = new Update().inc("value", value);
		template.upsert(query, update, WIFI_STAT);
	}

	@Override
	public void updateValue(ObjectId oId, ObjectId objectId, int type, Date date, long value) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("type").is(type).and("date").is(date).and("objectId").is(objectId));
		Update update = update("value", value);
		template.upsert(query, update, WIFI_STAT);
	}

	@Override
	public List<WifiStat> getValue(ObjectId oId, Date start, Date end, ObjectId objectId, Integer... types) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("type").in(types).and("objectId").is(objectId).and("date").gte(start).lte(end));
		query.fields().exclude("_id");
		return template.find(query, WifiStat.class, WIFI_STAT);
	}

	@Override
	public List<WifiStatDTO> getValueAsArray(ObjectId oId, Date start, Date end, ObjectId objectId, Integer... types) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("type").in(types).and("objectId").is(objectId).and("date").gte(start).lte(end));
		query.fields().exclude("_id");
		List<WifiStat> list = template.find(query, WifiStat.class, WIFI_STAT);
		Map<Integer, List<WifiStat>> map = new HashMap<Integer, List<WifiStat>>(types.length);
		for (WifiStat stat : list) {
			List<WifiStat> stats = map.get(stat.getType());
			if (stats == null) {
				stats = new ArrayList<WifiStat>();
				map.put(stat.getType(), stats);
			}
			stats.add(stat);
		}

		List<WifiStatDTO> result = new ArrayList<WifiStatDTO>(types.length);
		for (Integer type : map.keySet()) {
			List<WifiStat> stats = map.get(type);
			List<List<Long>> statArray = new ArrayList<List<Long>>(stats.size());
			for (WifiStat stat : stats) {
				statArray.add(Arrays.asList(stat.getDate().getTime(), stat.getValue()));
			}
			result.add(new WifiStatDTO(type, objectId, statArray));
		}
		return result;
	}

	@Override
	public void incCounter(ObjectId oId, int type, Date date, long value) {
		incCounter(oId, null, type, date, value);
	}

	@Override
	public void updateValue(ObjectId oId, int type, Date date, long value) {
		updateValue(oId, null, type, date, value);
	}

	@Override
	public List<WifiStat> getValue(ObjectId oId, Date start, Date end, Integer... types) {
		return getValue(oId, start, end, null, types);
	}

	@Override
	public List<WifiStatDTO> getValueAsArray(ObjectId oId, Date start, Date end, Integer... types) {
		return getValueAsArray(oId, start, end, null, types);
	}
}
