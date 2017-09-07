/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.smart.model.GoodsType;
import cn.com.inhand.initialize.dao.GoodsTypeDAO;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author shixj
 */
@Service
public class GoodTypeService extends MongoService implements GoodsTypeDAO{
    private static final String collection = Collections.SMART_GOODS_TYPE;

    public void addGoodsType(ObjectId oid, GoodsType typeBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(typeBean, collection);
    }
      
}
