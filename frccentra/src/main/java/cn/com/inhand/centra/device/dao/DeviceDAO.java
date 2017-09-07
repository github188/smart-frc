/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author cttc
 */
public interface DeviceDAO {
    
    public void updateAutomat(ObjectId oId, Automat automat,String business);
    
    public void createAutomat(ObjectId oid,Automat automat);
    
    public void createOvdpDevice(OvdpDevice ovdpDevice);
    
    public void updateOvdpDevice(OvdpDevice ovdpDevice);
    
    public Automat getAutomatById(ObjectId oId, ObjectId id);
    
    public Automat getAutomatByAssetId(ObjectId oId,String assetId);
    
    public Automat getAutomatByGwId(ObjectId oid,ObjectId gwId);
    
    public List <Automat> getAutomatBySn(ObjectId oid,String sn);
    
    public void createSmartInbox(ObjectId oid,SmartInbox inbox);
    
    public void updateSmartInbox(ObjectId oid,SmartInbox inbox);
    
    public SmartInbox getSmartInboxById(ObjectId oid,ObjectId id);
    
    public SmartInbox getSmartInboxBySn(ObjectId oid,String sn);
    
    public void updateSmartInboxById(ObjectId oid,SmartInbox inbox);
    
    public void updateAutomatStatus(ObjectId oid,ObjectId deviceId,Integer online);

    public Automat getAutomatByDeviceId(ObjectId oid, ObjectId objectId);
    
    
    //泥巴两个接口
    
    public List<Device> findDeviceListBySn(ObjectId oid,String sn);
    public void createDevice(ObjectId oid,Device device);
    public Device getDeviceById(ObjectId oId, ObjectId id);
    public void updateDevice(ObjectId oId, Device device,String business);
    
}
