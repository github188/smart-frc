/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.smart.formulacar.model.TradeRecord;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface TradeRecordDao {
    
    public void createTradeRecord(ObjectId oid,TradeRecord record);
    
}
