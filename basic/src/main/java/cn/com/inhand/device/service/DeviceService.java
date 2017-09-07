/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.device.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.device.dao.DeviceDao;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class DeviceService extends MongoService implements DeviceDao{

    public void createDevice(ObjectId oid, Device device) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(device, Collections.SMART_FM_DEVICE);
    }

    public void updateDevice(ObjectId oid, Device device) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(device.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(device, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_DEVICE);
    }

    public List<Device> findSiteByParam(ObjectId oid, Map<String, Object> params, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        return mongoTemplate.find(query, Device.class, Collections.SMART_FM_DEVICE);
    }

    public void deleteDevice(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_SITE);
    }
    
    
}
