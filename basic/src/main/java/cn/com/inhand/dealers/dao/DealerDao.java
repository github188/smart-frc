/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.dealers.dao;

import cn.com.inhand.common.dto.DealerBean;
import cn.com.inhand.smart.formulacar.model.Dealer;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface DealerDao {
    
    public void createDealer(ObjectId oid,Dealer dealer);
    
    public void updateDealer(ObjectId oid,Dealer dealer);
    
    public Dealer findAreaById(ObjectId oid,ObjectId id);
    
    public Long getCount(ObjectId oid,DealerBean queryBean);
    
    public boolean dealerExist(ObjectId oid,String name);
    
    public List<Dealer> findDealerByParam(ObjectId oid,DealerBean queryBean,int skip, int limit);
    
    public void deleteDealer(ObjectId oid,String[] idsArr);
    
}
