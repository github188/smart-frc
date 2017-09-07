/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.AutomatDAO;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.util.UpdateUtils;
import com.mongodb.BasicDBObject;
import com.mongodb.DBObject;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

/**
 *
 * @author cttc
 */
@Service
public class AutomatService extends MongoService implements AutomatDAO  {
    private static final String collectionName = Collections.SMART_AUTOMAT;
    
    public void updateAutomat(ObjectId oId, Automat automat) {
        Assert.notNull(automat.getOid());
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(automat.getId()));
        Update update = UpdateUtils.convertBeanToUpdate(automat, "_id");
        mongoTemplate.updateFirst(query, update, collectionName);
    }

    public Automat getAutomatById(ObjectId oId, ObjectId id) {
        Assert.notNull(id);
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oId);
        BasicDBObject query = new BasicDBObject();
        query.put("_id", id);
        BasicDBObject keys = new BasicDBObject();
        keys.put("_id", 1);
        keys.put("assetId", 1);
        DBObject cursor = mongoTemplate.getCollection(collectionName).findOne(query, keys);
        return mapper.convertValue(cursor, Automat.class);

    }

    public Automat getAutomatByAssetId(ObjectId oid, String assetId) {

        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("assetId").is(assetId));
        query.fields();
        return mongoTemplate.findOne(query, Automat.class, Collections.SMART_AUTOMAT);
    }
    
    public Automat getAutomatByDeviceId(ObjectId oid, String deviceId) {

        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(deviceId));
        query.fields();
        return mongoTemplate.findOne(query, Automat.class, Collections.SMART_AUTOMAT);
    }
}
