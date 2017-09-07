package cn.com.inhand.centra.device.dao;

import cn.com.inhand.centra.device.dto.OauthToken;
import org.bson.types.ObjectId;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.OvdpInbox;

public interface DeviceKeyDAO {

    public boolean isDeviceKeyExists(ObjectId deviceId, ObjectId Oid);

    public void addDevuceKey(DeviceKey dkb);

    public OvdpDevice getDeviceByVid(String vid);

    public OvdpDevice getDeviceByVidAndOid(String vid, ObjectId oid);
    
    public OvdpDevice getOvdpDeviceByDeviceId(ObjectId deviceId,ObjectId oid);
    
    public void updateOvdpDeviceOnline(OvdpDevice device);

    public OvdpInbox getInboxBySn(String sn);

    public OvdpInbox getInboxBySnAndOid(String sn, ObjectId oid);

    public void addOvdpInbox(OvdpInbox device);

    public DeviceKey getDeviceKeyByKey(String key);

    public DeviceKey getDeviceKeyByDeviceId(ObjectId deviceId);

    public void deleteDeviceKeyByDeviceId(ObjectId deviceId);
    
    public void deleteOauthTokenByDeviceId(ObjectId deviceId);
    
    public OauthToken getOauthToken(String token);
}
