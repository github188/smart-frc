package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiTerminalStatusDAO;
import com.mongodb.WriteResult;
import org.apache.commons.collections.MapUtils;
import org.apache.commons.lang.time.DateUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import static cn.com.inhand.common.service.Collections.*;
import static org.springframework.data.mongodb.core.FindAndModifyOptions.options;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.update;

/**
 *
 * Created by Jerolin on 6/27/2014.
 */
@Service
public class WifiTerminalStatusDAOImpl extends MongoService implements WifiTerminalStatusDAO {

	private static Logger LOG = LoggerFactory.getLogger(WifiTerminalStatusDAOImpl.class);

	@Override
	public void saveNewOnlineTerminal(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);

		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("mac").is(access.getMac()));
		TerminalAccess pre = template.findAndRemove(query, TerminalAccess.class, WIFI_TERMINAL_STATUS);
		if (pre != null) {
			pre.setId(null);
			pre.setTime(pre.getTime() == null ? 0 : pre.getTime());
			pre.setRx(pre.getRx() == null ? 0 : pre.getRx());
			pre.setTx(pre.getTx() == null ? 0 : pre.getTx());
			pre.setEndTime(DateUtils.addSeconds( pre.getStartTime(), pre.getTime()));
			template.insert(pre, WIFI_TERMINAL_ACCESS);
		}

		query = query(where("deviceId").is(access.getDeviceId())
				.and("mac").is(access.getMac()));
		Update update = update("startTime", access.getStartTime()).set("updateTime", new Date());
		template.upsert(query, update, WIFI_TERMINAL_STATUS);
		LOG.debug("terminal {} online in {} at {}", access.getMac(), access.getDeviceId(), access.getStartTime());
	}

	@Override
	public void updateTerminalOfflineStatus(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("startTime").is(access.getStartTime())
				.and("mac").is(access.getMac()));
		template.remove(query, WIFI_TERMINAL_STATUS);
		LOG.debug("terminal {} offline", access.getMac());
	}

	@Override
	public void updateTerminalStatus(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("mac").is(access.getMac()));
		Update update = update("startTime", access.getStartTime())
				.set("updateTime", new Date())
				.inc("time", access.getTime())
				.inc("rx", access.getRx())
				.inc("tx", access.getTx());
		WriteResult result = template.updateFirst(query, update, WIFI_TERMINAL_STATUS);
		if (!result.isUpdateOfExisting()) {
			query.addCriteria(where("startTime").is(access.getStartTime()));
			update = update("time", access.getTime()).set("rx", access.getRx()).set("tx", access.getTx());
			template.updateFirst(query, update, WIFI_TERMINAL_ACCESS);
		}
		LOG.debug("terminal {} trap", access.getMac());
	}

	@Override
	public List<Map> getTerminalStatusOfDevice(ObjectId oId, ObjectId deviceId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Date date = DateUtils.addMinutes(new Date(), -20);
		Query query = query(where("deviceId").is(deviceId).and("updateTime").gt(date));
		query.fields().exclude("_id").exclude("deviceId");
		return template.find(query, Map.class, WIFI_TERMINAL_STATUS);
	}

	@Override
	public void cleanTerminalStatus(ObjectId oId) {
		Date date = DateUtils.addDays(new Date(), -1);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("updateTime").lt(date));
//		query.fields().exclude("_id");
		List<TerminalAccess> list = template.findAllAndRemove(query, TerminalAccess.class, WIFI_TERMINAL_STATUS);
		for (TerminalAccess access : list) {
			access.setId(null);
			access.setTime(access.getTime() == null ? 0 : access.getTime());
			access.setRx(access.getRx() == null ? 0 : access.getRx());
			access.setTx(access.getTx() == null ? 0 : access.getTx());
			access.setEndTime(DateUtils.addMinutes(access.getStartTime(), access.getTime()));
		}
		template.insert(list, WIFI_TERMINAL_ACCESS);
	}

	@Override
	public Long updateTerminalStayTime(ObjectId oId, String mac, Date date, long time) {
		date = DateUtils.truncate(date, Calendar.MONTH);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("date").is(date).and("mac").is(mac));
		Update update = new Update().inc("time", time);
		Map map = template.findAndModify(query, update, options().upsert(true), Map.class, WIFI_TERMINAL_STAY);
		return MapUtils.getLong(map, "time");
	}

	@Override
	public void cleanTerminalStayTime(ObjectId oId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		template.remove(new Query(), WIFI_TERMINAL_STAY);
	}
}
