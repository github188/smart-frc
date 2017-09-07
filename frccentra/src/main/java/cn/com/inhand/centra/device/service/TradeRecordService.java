/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.service;

import cn.com.inhand.centra.device.dao.TradeRecordDao;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class TradeRecordService extends MongoService implements TradeRecordDao{

    public void createTradeRecord(ObjectId oid, TradeRecord record) {
        MongoTemplate template = factory.getMongoTemplateByOId(oid);
        template.save(record, Collections.SMART_FM_TRADE);
    }
    
}
