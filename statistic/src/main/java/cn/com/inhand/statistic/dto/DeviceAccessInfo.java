package cn.com.inhand.statistic.dto;

import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 6/10/2014.
 */
public class DeviceAccessInfo {
	private Date startTime;
	private Date endTime;
	private int users;
	private int netTerminals;
	private int wifiTerminals;
	private ObjectId deviceId;
	private ObjectId oId;

	public ObjectId getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}

	public ObjectId getoId() {
		return oId;
	}

	public void setoId(ObjectId oId) {
		this.oId = oId;
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

	public int getUsers() {
		return users;
	}

	public void setUsers(int users) {
		this.users = users;
	}

	public int getNetTerminals() {
		return netTerminals;
	}

	public void setNetTerminals(int netTerminals) {
		this.netTerminals = netTerminals;
	}

	public int getWifiTerminals() {
		return wifiTerminals;
	}

	public void setWifiTerminals(int wifiTerminals) {
		this.wifiTerminals = wifiTerminals;
	}
}
