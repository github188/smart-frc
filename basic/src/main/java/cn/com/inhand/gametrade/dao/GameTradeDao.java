/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.gametrade.dao;

import cn.com.inhand.common.dto.GameTradeBean;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface GameTradeDao {
    
    public Long getCount(ObjectId oid,GameTradeBean queryBean);
    
    public List<TradeRecord> findTradeRecordByParam(ObjectId oid,GameTradeBean queryBean,int skip, int limit);
}
