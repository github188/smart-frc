/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.rfid.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.rfid.dao.RfidDao;
import cn.com.inhand.rfid.dto.RfidBean;
import cn.com.inhand.smart.formulacar.model.Rfid;
import java.util.Arrays;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 *
 * @author shixj
 */
@Service
public class RfidService extends MongoService implements RfidDao{

    public long getCount(ObjectId xOId, RfidBean bean) {
        MongoTemplate template = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        if(bean.getRfid()!=null && !bean.getRfid().equals("")){
            query.addCriteria(Criteria.where("rfid").regex(bean.getRfid()));
        }
        return template.count(query, Collections.SMART_FM_RFID);
    }

    public List<Rfid> findRfidByParam(ObjectId xOId, RfidBean bean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(bean.getRfid()!=null && !bean.getRfid().equals("")){
            query.addCriteria(Criteria.where("rfid").regex(bean.getRfid()));
        }
        return mongoTemplate.find(query, Rfid.class, Collections.SMART_FM_RFID);
    }

    public boolean isRfidExists(ObjectId xOId, String rfid) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("rfid").is(rfid));
        query.fields();
        long count = mongoTemplate.count(query, Collections.SMART_FM_RFID);
        if (count > 0) {
            return true;
        } else {
            return false;
        }
    }

    public void createRfid(ObjectId xOId, Rfid area) {
        MongoTemplate template = factory.getMongoTemplateByOId(xOId);
        template.save(area, Collections.SMART_FM_RFID);
    }
     public void updateRfid(ObjectId oid, Rfid area) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(area.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(area, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_RFID);
    }

    public Rfid findRfidById(ObjectId xOId, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Rfid.class, Collections.SMART_FM_RFID);
    }

    public void deleteByIds(ObjectId xOId, String[] idsArr) {
        Assert.notNull(idsArr);
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        mongoTemplate.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_RFID);
    }
    
}
