/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.area.service;

import cn.com.inhand.area.dao.AreaDao;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Automat;
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

    public List<Area> findAreaByParam(ObjectId oid, Map<String, Object> params, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        return mongoTemplate.find(query, Area.class, Collections.SMART_FM_AREA);
    }

    public void deleteArea(ObjectId oid, String[] idsArr) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.remove(Query.query(Criteria.where("_id").in(Arrays.asList(idsArr))), Collections.SMART_FM_AREA);
    }
    
}
