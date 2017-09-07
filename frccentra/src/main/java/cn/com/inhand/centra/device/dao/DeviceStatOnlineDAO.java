/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import org.bson.types.ObjectId;

/**
 *
 * @author cttc
 */
public interface DeviceStatOnlineDAO {
    
    public void addDeviceStatOnline(ObjectId oid,ObjectId deviceId,String ip,String port,int action,String sid);
    
    public void addDeviceStatOffline(ObjectId oid,ObjectId deviceId,int exception,String sid);
    
    
    
    
}
