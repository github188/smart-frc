package cn.com.inhand.common.model.wifi.wechat;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WechatConfig{
	
	private String devUserName;
	private String appId;
	private String appSecret;
	private String handShakeUrl;
	private String handShakeToken;
	
	
	
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
	 * @return the appId
	 */
	public String getAppId() {
		return appId;
	}
	/**
	 * @param appId the appId to set
	 */
	public void setAppId(String appId) {
		this.appId = appId;
	}
	/**
	 * @return the appSecret
	 */
	public String getAppSecret() {
		return appSecret;
	}
	/**
	 * @param appSecret the appSecret to set
	 */
	public void setAppSecret(String appSecret) {
		this.appSecret = appSecret;
	}
	/**
	 * @return the handShakeUrl
	 */
	public String getHandShakeUrl() {
		return handShakeUrl;
	}
	/**
	 * @param handShakeUrl the handShakeUrl to set
	 */
	public void setHandShakeUrl(String handShakeUrl) {
		this.handShakeUrl = handShakeUrl;
	}
	/**
	 * @return the handShakeToken
	 */
	public String getHandShakeToken() {
		return handShakeToken;
	}
	/**
	 * @param handShakeToken the handShakeToken to set
	 */
	public void setHandShakeToken(String handShakeToken) {
		this.handShakeToken = handShakeToken;
	}
	
	
	
}
