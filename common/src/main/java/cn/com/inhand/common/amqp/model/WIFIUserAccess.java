package cn.com.inhand.common.amqp.model;

import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 6/18/2014.
 */
public class WIFIUserAccess {
	private Date timestamp;
	private ObjectId oId;
	private ObjectId uId;
	private Date lastLogin;
	private ObjectId siteId;
	private ObjectId deviceId;

	
	
	
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

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public ObjectId getoId() {
		return oId;
	}

	public void setoId(ObjectId oId) {
		this.oId = oId;
	}

	public ObjectId getuId() {
		return uId;
	}

	public void setuId(ObjectId uId) {
		this.uId = uId;
	}

	public Date getLastLogin() {
		return lastLogin;
	}

	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}
}
