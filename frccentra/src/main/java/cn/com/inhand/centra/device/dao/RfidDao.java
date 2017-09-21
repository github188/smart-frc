/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.smart.formulacar.model.Rfid;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface RfidDao {
    
    public Rfid findRfidByRfid(ObjectId oid,String rfid);
    
    public void updateRfidCount(ObjectId oid,Rfid rfid);
    
}
