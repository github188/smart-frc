/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Area;
import cn.com.inhand.initialize.dao.AreaDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author shixj
 */
@Service
public class AreaService extends MongoService implements AreaDAO{
 private static final String collection = Collections.SMART_AREA;
    public void addArea(ObjectId oid, Area area) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(area, collection);
    }
    
}
