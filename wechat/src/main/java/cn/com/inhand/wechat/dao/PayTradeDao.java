/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.dao;

import cn.com.inhand.smart.formulacar.model.PayTrade;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface PayTradeDao {
    
    public void saveTrade(ObjectId oid,PayTrade trade);
    
    public PayTrade getTradeByOrderNo(ObjectId oid,String orderNo);
    
    public void updateTrade(ObjectId oid,PayTrade trade);
    
}
