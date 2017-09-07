package cn.com.inhand.common.model.wifi.wechat;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WechatReply{
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private String devUserName;
	private String eventType;
	private String msgType;
	private String content;
	
	/**
	 * @return the id
	 */
	public ObjectId getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(ObjectId id) {
		this.id = id;
	}
	
	/**
	 * @return the devUserName
	 */
	public String getDevUserName() {
		return devUserName;
	}
	/**
	 * @param devUserName the devUserName to set
	 */
	public void setDevUserName(String devUserName) {
		this.devUserName = devUserName;
	}
	/**
	 * @return the eventType
	 */
	public String getEventType() {
		return eventType;
	}
	/**
	 * @param eventType the eventType to set
	 */
	public void setEventType(String eventType) {
		this.eventType = eventType;
	}
	/**
	 * @return the msgType
	 */
	public String getMsgType() {
		return msgType;
	}
	/**
	 * @param msgType the msgType to set
	 */
	public void setMsgType(String msgType) {
		this.msgType = msgType;
	}
	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}
	/**
	 * @param content the content to set
	 */
	public void setContent(String content) {
		this.content = content;
	}
	
	
}
