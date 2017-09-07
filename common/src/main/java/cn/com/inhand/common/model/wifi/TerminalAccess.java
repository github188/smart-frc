package cn.com.inhand.common.model.wifi;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 6/11/2014.
 */
public class TerminalAccess {
	private ObjectId id;
	private Integer eId;
	private ObjectId deviceId;
	private String mac;
	private ObjectId userId;
	private Integer time;
	private Date startTime;
	private Date endTime;
	private Date updateTime;
	private Integer rx;
	private Integer tx;

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public ObjectId getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}

	public Integer geteId() {
		return eId;
	}

	public void seteId(Integer eId) {
		this.eId = eId;
	}

	public Integer getTime() {
		return time;
	}

	public void setTime(Integer time) {
		this.time = time;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public ObjectId getUserId() {
		return userId;
	}

	public void setUserId(ObjectId userId) {
		this.userId = userId;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Integer getRx() {
		return rx;
	}

	public void setRx(Integer rx) {
		this.rx = rx;
	}

	public Integer getTx() {
		return tx;
	}

	public void setTx(Integer tx) {
		this.tx = tx;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}
}
