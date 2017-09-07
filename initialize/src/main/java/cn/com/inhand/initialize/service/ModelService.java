/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Area;
import cn.com.inhand.common.smart.model.Model;
import cn.com.inhand.initialize.dao.ModelDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author shixj
 */
@Service
public class ModelService extends MongoService implements ModelDAO{
    private static final String collection = Collections.SMART_MODEL;
        public void addModel(ObjectId oid, Model model) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(model, collection);
    }
}
