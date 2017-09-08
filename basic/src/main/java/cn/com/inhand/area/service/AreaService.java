/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.area.service;

import cn.com.inhand.area.dao.AreaDao;
import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.Area;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 *
 * @author lenovo
 */
@Service
public class AreaService extends MongoService implements AreaDao{

    public void createArea(ObjectId oid, Area area) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(area, Collections.SMART_FM_AREA);
    }

    public void updateArea(ObjectId oid, Area area) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(area.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(area, "_id");
        template.updateFirst(query, update, Collections.SMART_FM_AREA);
    }
    
    public String regexFilter(String regex) {
        if (regex.equals("*")) {
            return "\\" + regex;
        } else {
            return regex;
        }

    }

    public List<Area> findAreaByParam(ObjectId oid, AreaBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return mongoTemplate.find(query, Area.class, Collections.SMART_FM_AREA);
    }

    public void deleteArea(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_AREA);
    }

    public Area findAreaById(ObjectId oid, ObjectId id) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));
        return template.findOne(query, Area.class, Collections.SMART_FM_AREA);
    }

    public Long getCount(ObjectId oid, AreaBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getName()!=null && !queryBean.getName().equals("")){
            query.addCriteria(Criteria.where("name").regex(queryBean.getName()));
        }
        return template.count(query, Collections.SMART_FM_AREA);
    }
    
    public void deleteByIds(ObjectId oId, String[] idsArr) {
        Assert.notNull(idsArr);
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        mongoTemplate.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_AREA);
    }

    public boolean isAreaNameExists(ObjectId xOId, String name) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(xOId);
        Query query = new Query();
        query.addCriteria(Criteria.where("name").is(name));
        query.fields();
        long count = mongoTemplate.count(query, Collections.SMART_FM_AREA);
        if (count > 0) {
            return true;
        } else {
            return false;
        }
    }
}
