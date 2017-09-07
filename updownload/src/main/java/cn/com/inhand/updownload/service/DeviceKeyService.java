/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.updownload.service;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.updownload.dao.DeviceKeyDAO;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class DeviceKeyService extends MongoService implements DeviceKeyDAO{

    public DeviceKey findDeviceKeyByKey(String key) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        return template.findOne(Query.query(Criteria.where("key").is(key)), DeviceKey.class, Collections.DEVICE_KEY);
    }
    
}
