/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.SmartInboxDAO;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.SmartInbox;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class SmartInboxService extends MongoService implements SmartInboxDAO{

    public SmartInbox getSmartInboxInfo(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, SmartInbox.class, Collections.SMART_INBOX);
    }
    
}
