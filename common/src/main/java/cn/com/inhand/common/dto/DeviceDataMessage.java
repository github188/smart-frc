package cn.com.inhand.common.dto;

import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 9/3/2014.
 */
public class DeviceDataMessage {
	private ObjectId oId;
	private ObjectId deviceId;
	private Date startTime;
	private Date endTime;
	private int id;
	private String value;

	public ObjectId getoId() {
		return oId;
	}

	public void setoId(ObjectId oId) {
		this.oId = oId;
	}

	public ObjectId getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
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

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}
}
