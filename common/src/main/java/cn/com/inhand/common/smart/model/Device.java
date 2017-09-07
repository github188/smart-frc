package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
/**
 * 
 * @author shixj
 *
 */
public class Device {
	private ObjectId deviceId;	     //设备ID
	private String vmId;	         //设备编号
	private String name;             //设备名称
	public Device(){
		
	}
	public ObjectId getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}
	public String getVmId() {
		return vmId;
	}
	public void setVmId(String vmId) {
		this.vmId = vmId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
}
