/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.gametrade.service;

import cn.com.inhand.common.dto.GameTradeBean;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.gametrade.dao.GameTradeDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import java.util.List;
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
public class GameTradeService extends MongoService implements GameTradeDao{

    public Long getCount(ObjectId oid, GameTradeBean queryBean) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if(queryBean.getStartTime() != null && queryBean.getEndTime() != null){
            query.addCriteria(Criteria.where("createTime").lte(queryBean.getStartTime()));
            query.addCriteria(Criteria.where("createTime").gte(queryBean.getEndTime()));
        }
        return template.count(query, Collections.SMART_FM_TRADE);
    }

    public List<TradeRecord> findTradeRecordByParam(ObjectId oid, GameTradeBean queryBean, int skip, int limit) {
        MongoTemplate mongoTemplate = factory.getMongoTemplateByOId(oid);
        Query query = new Query();
        if (limit != -1) {
            query.limit(limit);
            query.skip(skip);
        }
        if(queryBean.getStartTime() != null && queryBean.getEndTime() != null){
            query.addCriteria(Criteria.where("createTime").lte(queryBean.getStartTime()));
            query.addCriteria(Criteria.where("createTime").gte(queryBean.getEndTime()));
        }
        return mongoTemplate.find(query, TradeRecord.class, Collections.SMART_FM_TRADE);
    }
}
