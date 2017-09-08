/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.module.service;

import cn.com.inhand.common.dto.ModuleBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.module.dao.ModuleDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Module;
import java.util.Arrays;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

/**
 *
 * @author lenovo
 */
public class ModuleService extends MongoService implements ModuleDao {

    public void createModule(ObjectId oid, Module module) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(module, Collections.SMART_FM_MODULE);
    }

    public void updateModule(ObjectId oid, Module module) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(module.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(module, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_MODULE);
    }

    public Module findModuleById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Module.class, Collections.SMART_FM_MODULE);
    }

    public List<Module> findModuleByParam(ObjectId oid, ModuleBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getModuleNum() != null && !queryBean.getModuleNum().equals("")){
            query.addCriteria(Criteria.where("moduleNum").regex(".*" + regexFilter(queryBean.getModuleNum()) + ".*"));
        }
        return mongoTemplate.find(query, Module.class, Collections.SMART_FM_MODULE);

    }
    
    public String regexFilter(String regex) {
        if (regex.equals("*")) {
            return "\\" + regex;
        } else {
            return regex;
        }
    }

    public void deleteModule(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_MODULE);
    }

    public Long getCount(ObjectId oid, ModuleBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getModuleNum() != null && !queryBean.getModuleNum().equals("")){
            query.addCriteria(Criteria.where("moduleNum").regex(".*" + regexFilter(queryBean.getModuleNum()) + ".*"));
        }
        return template.count(query, Collections.SMART_FM_MODULE);
    }

    public boolean isModuleNameExists(ObjectId xOId, String moduleNum) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("moduleNum").is(moduleNum));
        return mongoTemplate.exists(query, Collections.SMART_FM_MODULE);
    }
}
