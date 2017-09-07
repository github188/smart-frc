package cn.com.inhand.common.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DeviceKey {
	
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId deviceId;  //Inbox Id 
	private ObjectId oid;
	private String key;
	private Long createTime;
	
	public ObjectId getOid() {
		return oid;
	}
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public ObjectId getDeviceId() {
		return deviceId;
	}
	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}
	public String getKey() {
		return key;
	}
	public void setKey(String key) {
		this.key = key;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
}
