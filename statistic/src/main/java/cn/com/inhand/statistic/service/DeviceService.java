package cn.com.inhand.statistic.service;

import cn.com.inhand.common.model.Device;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.DeviceDAO;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;


@Service
public class DeviceService extends MongoService implements DeviceDAO {
    
    private String collectionName = Collections.DEVICE;

    @Override
    public Device getDeviceById(ObjectId oId, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oId);
        return template.findById(id, Device.class, collectionName);
    }

    @Override
    public Device getDeviceBySiteId(ObjectId oId, ObjectId siteId) {
        Query query = Query.query(Criteria.where("siteId").is(siteId));
        return factory.getMongoTemplateByOId(oId).findOne(query, Device.class, collectionName);
    }
}
