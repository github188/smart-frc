/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.wechat.dao.SpecialDao;
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
public class SpecialService extends MongoService implements SpecialDao{

    public Special findSpecialByTime(ObjectId oid, Long nowTime) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("startTime").lte(nowTime));
        query.addCriteria(Criteria.where("endTime").gte(nowTime));
        return template.findOne(query, Special.class, Collections.SMART_FM_SPECIAL);
    }
    
}
