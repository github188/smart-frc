package cn.com.inhand.oauth2.dao;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.OvdpDevice;
import org.bson.types.ObjectId;


public interface DeviceKeyDAO {
	public void addDeviceKey(DeviceKey dkb);
	
	public boolean isDeviceKeyExists(ObjectId deviceId);
	
	public OvdpDevice getDeviceBySN(String sn);
	
	public void deleteDeviceKey(ObjectId deviceId);
	
	public DeviceKey getDeviceKey(ObjectId deviceId);
}