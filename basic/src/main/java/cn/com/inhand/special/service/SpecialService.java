/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.special.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.special.dao.SpecialDao;
import cn.com.inhand.special.dto.SpecialBean;
import java.util.Arrays;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

/**
 *
 * @author liqiang
 */
@Service
public class SpecialService extends MongoService implements SpecialDao{

    public void createSpecial(ObjectId oid, Special special) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(special, Collections.SMART_FM_SPECIAL);
    }

    public void updateSpecial(ObjectId oid, Special special) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(special.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(special, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_SPECIAL);
    }

    public List<Special> findSpecialByParam(ObjectId oid, SpecialBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        if(queryBean.getTypes() != null&&queryBean.getTypes().size()>0){
            query.addCriteria(Criteria.where("type").in(queryBean.getTypes()));
        }
        return mongoTemplate.find(query, Special.class, Collections.SMART_FM_SPECIAL);
    }

    public Special findSpecialById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Special.class, Collections.SMART_FM_SPECIAL);
    }

    public void deleteSpecial(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_SPECIAL);
    }

    public Long getCount(ObjectId oid, SpecialBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        if(queryBean.getTypes() != null&&queryBean.getTypes().size()>0){
            query.addCriteria(Criteria.where("type").in(queryBean.getTypes()));
        }
        return template.count(query, Collections.SMART_FM_SPECIAL);
    }

    public boolean isSpecialNameExists(ObjectId xOId, String name) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        return mongoTemplate.exists(query, Collections.SMART_FM_SPECIAL);
    }

    public List<Special> getEnableListSpecial(ObjectId xOId, SpecialBean sqb, String id) {
        Query query = new Query();     
        
        if(id != null && !id.equals("")){
           query.addCriteria(Criteria.where("_id").ne(new ObjectId(id))); 
        }
        
        if(sqb.getStartTime() != null && sqb.getEndTime() != null){
            query.addCriteria(Criteria.where("startTime").lte(sqb.getEndTime())); 
            query.addCriteria(Criteria.where("endTime").gte(sqb.getStartTime())); 
            //query.addCriteria(new Criteria().orOperator(Criteria.where("startTime").gte(sqb.getStartTime()).lte(sqb.getEndTime()),Criteria.where("endTime").gte(sqb.getStartTime()).lte(sqb.getEndTime())));
        }

        query.with(new Sort(Sort.Direction.DESC, "createTime"));
        MongoTemplate template = factory.getMongoTemplateByOId(xOId);
        return template.find(query, Special.class,Collections.SMART_FM_SPECIAL);
    }
    
}
