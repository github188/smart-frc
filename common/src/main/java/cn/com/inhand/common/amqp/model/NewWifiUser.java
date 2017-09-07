package cn.com.inhand.common.amqp.model;

import java.util.Date;

import org.bson.types.ObjectId;

public class NewWifiUser {
	private ObjectId userId;
	private ObjectId siteId;
	private ObjectId deviceId;
	private ObjectId oId;
	private Date timeStamp;
	
	/**
	 * @return the userId
	 */
	public ObjectId getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(ObjectId userId) {
		this.userId = userId;
	}
	/**
	 * @return the siteId
	 */
	public ObjectId getSiteId() {
		return siteId;
	}
	/**
	 * @param siteId the siteId to set
	 */
	public void setSiteId(ObjectId siteId) {
		this.siteId = siteId;
	}
	/**
	 * @return the deviceId
	 */
	public ObjectId getDeviceId() {
		return deviceId;
	}
	/**
	 * @param deviceId the deviceId to set
	 */
	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}
	/**
	 * @return the oId
	 */
	public ObjectId getoId() {
		return oId;
	}
	/**
	 * @param oId the oId to set
	 */
	public void setoId(ObjectId oId) {
		this.oId = oId;
	}
	/**
	 * @return the timeStamp
	 */
	public Date getTimeStamp() {
		return timeStamp;
	}
	/**
	 * @param timeStamp the timeStamp to set
	 */
	public void setTimeStamp(Date timeStamp) {
		this.timeStamp = timeStamp;
	}
}
