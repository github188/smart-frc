package cn.com.inhand.oauth2.service;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.OvdpDevice;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.oauth2.dao.DeviceKeyDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class DeviceKeyService extends MongoService implements DeviceKeyDAO {

	@Override
	public void addDeviceKey(DeviceKey dkb){
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		dkb.setCreateTime(DateUtils.getUTC());
		template.save(dkb, Collections.DEVICE_KEY);
	}

	@Override
	public OvdpDevice getDeviceBySN(String sn) {
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
		return template.findOne(Query.query(Criteria.where("sn").is(sn)), OvdpDevice.class, Collections.OVDP_DEVICE);
	}

	@Override
	public void deleteDeviceKey(ObjectId deviceId) {
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		template.remove(Query.query(Criteria.where("deviceId").is(deviceId)), Collections.DEVICE_KEY);
	}
	
	@Override
	public boolean isDeviceKeyExists(ObjectId deviceId) {
		return exist(DBNames.SYSTEM, Query.query(Criteria.where("deviceId").is(deviceId)), Collections.DEVICE_KEY);
	}

	@Override
	public DeviceKey getDeviceKey(ObjectId deviceId) {
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
		return template.findOne(Query.query(Criteria.where("deviceId").is(deviceId)), DeviceKey.class, Collections.DEVICE_KEY);
	}

}
