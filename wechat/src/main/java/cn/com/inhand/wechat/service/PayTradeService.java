/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.common.util.UpdateUtils;
import cn.com.inhand.smart.formulacar.model.PayTrade;
import cn.com.inhand.wechat.dao.PayTradeDao;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class PayTradeService extends MongoService implements PayTradeDao {

    public void saveTrade(ObjectId oid, PayTrade trade) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(trade,Collections.SMART_FM_PAYTRADE);
    }

    public PayTrade getTradeByOrderNo(ObjectId oid, String orderNo) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("orderNo").is(orderNo));
        return template.findOne(query, PayTrade.class, Collections.SMART_FM_PAYTRADE);
    }

    public void updateTrade(ObjectId oid, PayTrade trade) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(trade.getId()));
        template.updateFirst(query, UpdateUtils.convertBeanToUpdate(trade, "_id"), Collections.SMART_FM_PAYTRADE);
    }
    
}
