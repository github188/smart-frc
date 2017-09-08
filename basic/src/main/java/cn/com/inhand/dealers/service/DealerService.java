/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.dealers.service;

import cn.com.inhand.common.dto.DealerBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.dealers.dao.DealerDao;
import cn.com.inhand.smart.formulacar.model.Dealer;
import java.util.Arrays;
import java.util.List;
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
public class DealerService extends MongoService implements DealerDao{
    
    public void createDealer(ObjectId oid, Dealer dealer) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(dealer, Collections.SMART_FM_DEALER);
    }

    public void updateDealer(ObjectId oid, Dealer dealer) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(dealer.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(dealer, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_DEALER);
    }

    public List<Dealer> findDealerByParam(ObjectId oid, DealerBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getName() != null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(".*" + regexFilter(queryBean.getName()) + ".*"));
        }
        return mongoTemplate.find(query, Dealer.class, Collections.SMART_FM_DEALER);
    }

    public void deleteDealer(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_DEALER);
    }

    public Dealer findAreaById (ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Dealer.class, Collections.SMART_FM_DEALER);
    }

    public Long getCount(ObjectId oid, DealerBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getName() != null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(".*" + regexFilter(queryBean.getName()) + ".*"));
        }
        return template.count(query, Collections.SMART_FM_DEALER);
    }

    public boolean dealerExist(ObjectId oid, String name) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return template.exists(query, Collections.SMART_FM_DEALER);
    }
    
    public String regexFilter(String regex) {
        if (regex.equals("*")) {
            return "\\" + regex;
        } else {
            return regex;
        }
    }

}
