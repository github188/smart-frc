package cn.com.inhand.statistic.dto;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DeviceFirstLoginBean {
    private ObjectId deviceId;
    private Long firstLogin;
	public ObjectId getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}
	public Long getFirstLogin() {
		return firstLogin;
	}
	public void setFirstLogin(Long firstLogin) {
		this.firstLogin = firstLogin;
	}
	@Override
	public String toString() {
		return "DeviceOnlineStateBean ["
				+ (deviceId != null ? "deviceId=" + deviceId + ", " : "")
				+ (firstLogin != null ? "firstLogin=" + firstLogin : "") + "]";
	}
    
}
