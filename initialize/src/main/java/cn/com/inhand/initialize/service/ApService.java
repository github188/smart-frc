/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Ap;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.initialize.dao.ApDAO;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.BasicQuery;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class ApService extends MongoService implements ApDAO{

    public void createApInfo(Ap ap) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        template.save(ap, Collections.SMART_AP);
    }

    public Ap findApByKey(String key) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("key").is(key));
        return template.findOne(query, Ap.class, Collections.SMART_AP);
    }

    public void updateAp(Ap ap) {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = BasicQuery.query(Criteria.where("_id").is(ap.getId()));
        template.updateFirst(query, UpdateUtils.convertBeanToUpdate(ap, "_id"), Collections.SMART_AP);
    }

    public List<Ap> getApList() {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("alive").is(0));
        return template.find(query, Ap.class, Collections.SMART_AP);
    }
    
}
