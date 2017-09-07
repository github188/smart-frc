package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.dto.OauthToken;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.OvdpInbox;
import cn.com.inhand.dn4.utils.DateUtils;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.query.Update;

@Service
public class DeviceKeyService extends MongoService implements DeviceKeyDAO {

    private static final Logger logger = LoggerFactory.getLogger(DeviceKeyService.class);

    @Override
    public OvdpDevice getDeviceByVid(String vid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        return template.findOne(Query.query(Criteria.where("assertId").is(vid)), OvdpDevice.class, Collections.SMART_SMART_DEVICE);
    }

    public OvdpDevice getDeviceByVidAndOid(String vid, ObjectId oid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("assertId").is(vid));
        query.addCriteria(Criteria.where("oId").is(oid));
        return template.findOne(query, OvdpDevice.class, Collections.SMART_SMART_DEVICE);
    }

    public void updateOvdpDeviceOnline(OvdpDevice device) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("assertId").is(device.getAssertId()));
        query.addCriteria(Criteria.where("oId").is(device.getoId()));
        template.updateFirst(query, new Update().set("online", device.getOnline()), Collections.SMART_SMART_DEVICE);
    }

    public OvdpInbox getInboxBySn(String sn) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("sn").is(sn));
        OvdpInbox inbox = template.findOne(query, OvdpInbox.class, Collections.SMART_OVDP_INBOX);
        return inbox;
    }

    public OvdpInbox getInboxBySnAndOid(String sn, ObjectId oid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("sn").is(sn));
        query.addCriteria(Criteria.where("oId").is(oid));
        OvdpInbox inbox = template.findOne(query, OvdpInbox.class, Collections.SMART_OVDP_INBOX);
        return inbox;
    }

    public void addOvdpInbox(OvdpInbox device) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        template.save(device, Collections.SMART_OVDP_INBOX);
    }

    @Override
    public boolean isDeviceKeyExists(ObjectId deviceId, ObjectId Oid) {
        Query query = new Query();
        query.addCriteria(Criteria.where("deviceId").is(deviceId));
        query.addCriteria(Criteria.where("oid").is(Oid));
        return exist(DBNames.SYSTEM, query, Collections.DEVICE_KEY);
    }

    @Override
    public void addDevuceKey(DeviceKey dkb) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        dkb.setCreateTime(DateUtils.getUTC());
        template.save(dkb, Collections.DEVICE_KEY);
    }

    public void deleteDeviceKeyByDeviceId(ObjectId deviceId) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        template.remove(Query.query(Criteria.where("deviceId").is(deviceId)), Collections.DEVICE_KEY);
    }

    public void deleteOauthTokenByDeviceId(ObjectId deviceId) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("deviceId").is(deviceId));
        DeviceKey key = template.findOne(query, DeviceKey.class, Collections.DEVICE_KEY);

        Query tokenQuery = new Query();
        tokenQuery.addCriteria(Criteria.where("token").is(key.getKey()));
        Map token = template.findOne(tokenQuery, Map.class, Collections.TOKEN);
        if (token != null) {
            template.remove(Query.query(Criteria.where("token").is(key.getKey())), Collections.TOKEN);
            template.remove(Query.query(Criteria.where("clientId").is(token.get("clientId"))), Collections.REFRESH_TOKEN);
        }

    }

    public DeviceKey getDeviceKeyByKey(String key) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(Query.query(Criteria.where("key").is(key)), DeviceKey.class, Collections.DEVICE_KEY);
    }

    public DeviceKey getDeviceKeyByDeviceId(ObjectId deviceId) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(Query.query(Criteria.where("deviceId").is(deviceId)), DeviceKey.class, Collections.DEVICE_KEY);
    }

    public OvdpDevice getOvdpDeviceByDeviceId(ObjectId deviceId, ObjectId oid) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.PP);
        Query query = new Query();
        query.addCriteria(Criteria.where("deviceId").is(deviceId));
        query.addCriteria(Criteria.where("oId").is(oid));
        return template.findOne(query, OvdpDevice.class, Collections.SMART_SMART_DEVICE);
    }

    public OauthToken getOauthToken(String token) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("token").is(token));
        query.fields();
        OauthToken oauthToken = template.findOne(query, OauthToken.class, Collections.TOKEN);
        return oauthToken;
    }
}
