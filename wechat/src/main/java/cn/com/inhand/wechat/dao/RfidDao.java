/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.dao;

import cn.com.inhand.smart.formulacar.model.Rfid;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface RfidDao {
    public Rfid findRfidByRfid(ObjectId oid,String rfid);
    
    public void updateRfidCount(ObjectId oid,Rfid rfid);
    
    public void deleteRfid(ObjectId oid,String rfid);
    
}
