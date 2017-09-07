/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.dealers.dao;

import cn.com.inhand.smart.formulacar.model.Dealer;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface DealerDao {
    
    public void createDealer(ObjectId oid,Dealer dealer);
    
    public void updateDealer(ObjectId oid,Dealer dealer);
    
    public List<Dealer> findDealerByParam(ObjectId oid,Map<String,Object> params,int skip, int limit);
    
    public void deleteDealer(ObjectId oid,String[] idsArr);
    
}
