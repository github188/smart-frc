/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.ApDAO;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Ap;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class ApService extends MongoService implements ApDAO{

    public Ap getApInfoByIeisure() {
        MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.SYSTEM);
        Query query = new Query();
        query.addCriteria(Criteria.where("alive").is(0));
        query.addCriteria(Criteria.where("conns").lt(1300));
        query.with(new Sort(Sort.Direction.ASC, "conns"));
        return template.findOne(query, Ap.class, Collections.SMART_AP);
    }
    
}
