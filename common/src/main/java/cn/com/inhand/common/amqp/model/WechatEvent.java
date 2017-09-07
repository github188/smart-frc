package cn.com.inhand.common.amqp.model;

import org.bson.types.ObjectId;

import java.util.Date;

public class WechatEvent {
	
	private ObjectId oId;
	
	private ObjectId siteId;
	
	/**
	 * eventType example:
	 * 	public static final Integer EVENT_TYPE_SUBSCRIBE_INT=1;
		public static final Integer EVENT_TYPE_UNSUBSCRIBE_INT=2;
		public static final Integer EVENT_TYPE_SCAN_INT=3;
		public static final Integer EVENT_TYPE_LOCATION_INT=4;
		public static final Integer EVENT_TYPE_MENU_CLICK_INT=5;
		public static final Integer EVENT_TYPE_MENU_VIEW_INT=6;
	 */
	private Integer eventType;
	
	private String fromUser;
	
	private Date createTime;
	
	
	
	
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
	 * @return the eventType
	 */
	public Integer getEventType() {
		return eventType;
	}
	/**
	 * @param eventType the eventType to set
	 */
	public void setEventType(Integer eventType) {
		this.eventType = eventType;
	}
	/**
	 * @return the fromUser
	 */
	public String getFromUser() {
		return fromUser;
	}
	/**
	 * @param fromUser the fromUser to set
	 */
	public void setFromUser(String fromUser) {
		this.fromUser = fromUser;
	}
	/**
	 * @return the createTime
	 */
	public Date getCreateTime() {
		return createTime;
	}
	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	
	
}
