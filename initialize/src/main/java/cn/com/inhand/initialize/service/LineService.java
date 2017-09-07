/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Line;
import cn.com.inhand.initialize.dao.LineDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author liqiang
 */
@Service
public class LineService  extends MongoService implements LineDAO{
 private static final String collection = Collections.SMART_LINE;
    public void addLine(ObjectId oid, Line line) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(line, collection);
    }
    
}
