package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.common.model.wifi.User;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiUserStatusDAO;
import com.mongodb.WriteResult;
import org.apache.commons.lang.time.DateUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import static cn.com.inhand.common.service.Collections.*;
import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;
import static org.springframework.data.mongodb.core.query.Update.update;

/**
 * Created by Jerolin on 6/27/2014.
 */
@Service
public class WifiUserStatusDAOImpl extends MongoService implements WifiUserStatusDAO {

	private static Logger LOG = LoggerFactory.getLogger(WifiUserStatusDAOImpl.class);

	@Override
	public void saveNewOnlineUser(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);

		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("userId").is(access.getUserId())
				.and("mac").is(access.getMac()));
		TerminalAccess pre = template.findAndRemove(query, TerminalAccess.class, WIFI_USER_STATUS);
		if (pre != null) {
			pre.setId(null);

			pre.setTime(access.getTime() == null ? 0 : access.getTime());
			pre.setRx(access.getRx() == null ? 0 : access.getRx());
			pre.setTx(access.getTx() == null ? 0 : access.getTx());
			pre.setEndTime(DateUtils.addMinutes(access.getStartTime(), access.getTime()));

			pre.setTime(pre.getTime() == null ? 0 : pre.getTime());
			pre.setRx(pre.getRx() == null ? 0 : pre.getRx());
			pre.setTx(pre.getTx() == null ? 0 : pre.getTx());
			pre.setEndTime(DateUtils.addMinutes(pre.getStartTime(), pre.getTime()));
			template.insert(pre, WIFI_USER_ACCESS);
		}

		query = query(where("deviceId").is(access.getDeviceId())
				.and("userId").is(access.getUserId())
				.and("mac").is(access.getMac()));

		Update update = update("startTime", access.getStartTime()).set("updateTime", new Date());
		template.upsert(query, update, WIFI_USER_STATUS);
		LOG.debug("user {} online in {}", access.getMac(), access.getDeviceId());
	}

	@Override
	public void updateUserOfflineStatus(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("startTime").is(access.getStartTime())
				.and("userId").is(access.getUserId())
				.and("mac").is(access.getMac()));
		template.remove(query, WIFI_USER_STATUS);
		LOG.debug("user {} offline", access.getMac());
	}

	@Override
	public void updateUserStatus(ObjectId oId, TerminalAccess access) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("deviceId").is(access.getDeviceId())
				.and("userId").is(access.getUserId())
				.and("startTime").is(access.getStartTime())
				.and("mac").is(access.getMac()));
		Update update = update("startTime", access.getStartTime())
				.set("updateTime", new Date())
				.inc("time", access.getTime())
				.inc("rx", access.getRx())
				.inc("tx", access.getTx());
		WriteResult result = template.updateFirst(query, update, WIFI_USER_STATUS);
		if (!result.isUpdateOfExisting()) {
			query.addCriteria(where("startTime").is(access.getStartTime()));
			update = update("time", access.getTime()).set("rx", access.getRx()).set("tx", access.getTx());
			template.updateFirst(query, update, WIFI_USER_ACCESS);
		}
		LOG.debug("user {} trap, online time {}", access.getMac(), access.getTime());
	}

	@Override
	public List<Map> getUserStatusOfDevice(ObjectId oId, ObjectId deviceId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Date date = DateUtils.addMinutes(new Date(), -20);
		Query query = query(where("deviceId").is(deviceId).and("updateTime").gt(date));
		query.fields().exclude("_id").exclude("deviceId");
		return template.find(query, Map.class, WIFI_USER_STATUS);
	}

	@Override
	public String getNameOfWifiUser(ObjectId oId, ObjectId userId) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		User user = template.findById(userId, User.class, WIFI_USERS);
		if (user == null) {
			return null;
		} else {
			return user.getName();
		}
	}

	@Override
	public void cleanUserStatus(ObjectId oId) {
		Date date = DateUtils.addDays(new Date(), -1);
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = query(where("updateTime").lt(date));
//		query.fields().exclude("_id");
		List<TerminalAccess> list = template.findAllAndRemove(query, TerminalAccess.class, WIFI_USER_STATUS);
		for (TerminalAccess access : list) {
			access.setId(null);
			access.setTime(access.getTime() == null ? 0 : access.getTime());
			access.setRx(access.getRx() == null ? 0 : access.getRx());
			access.setTx(access.getTx() == null ? 0 : access.getTx());
			access.setEndTime(DateUtils.addMinutes(access.getStartTime(), access.getTime()));
		}
		template.insert(list, WIFI_USER_ACCESS);
	}
}
