/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.RfidDao;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Rfid;
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
public class RfidService extends MongoService implements RfidDao{

    public Rfid findRfidByRfid(ObjectId oid, String rfid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("rfid").is(rfid));
        return template.findOne(query, Rfid.class, Collections.SMART_FM_RFID);
    }

    public void updateRfidCount(ObjectId oid, Rfid rfid) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(rfid.getId()));
        template.updateFirst(query, UpdateUtils.convertBeanToUpdate(rfid, "_id"), Collections.SMART_FM_RFID);
    }
    
}
