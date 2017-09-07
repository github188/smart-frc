package cn.com.inhand.statistic.service;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.DeviceKeyDAO;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 * Created by Jerolin on 4/15/2014.
 */
@Service
public class DeviceKeyService extends MongoService implements DeviceKeyDAO {
	@Override
	public DeviceKey getDeviceKey(String key) {
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.findOne(Query.query(Criteria.where("key").is(key)), DeviceKey.class, Collections.DEVICE_KEY);
	}


}