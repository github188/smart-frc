package cn.com.inhand.common.model.wifi.wechat;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WechatGlobalToken{
	
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oId;
	private String token;
	private Date expireTime;
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
	 * @return the token
	 */
	public String getToken() {
		return token;
	}
	/**
	 * @param token the token to set
	 */
	public void setToken(String token) {
		this.token = token;
	}
	/**
	 * @return the expireTime
	 */
	public Date getExpireTime() {
		return expireTime;
	}
	/**
	 * @param expireTime the expireTime to set
	 */
	public void setExpireTime(Date expireTime) {
		this.expireTime = expireTime;
	}
}
