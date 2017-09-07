package cn.com.inhand.common.model.wifi;

import java.util.Date;

import cn.com.inhand.common.model.wifi.wechat.WechatConfig;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class OrganizationConfig {
	
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private SmsConfig smsConfig;
	private WechatConfig wechatConfig;
	
	
	/**
	 * @return the wechatConfig
	 */
	public WechatConfig getWechatConfig() {
		return wechatConfig;
	}
	/**
	 * @param wechatConfig the wechatConfig to set
	 */
	public void setWechatConfig(WechatConfig wechatConfig) {
		this.wechatConfig = wechatConfig;
	}
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
	 * @return the oid
	 */
	public ObjectId getOid() {
		return oid;
	}
	/**
	 * @param oid the oid to set
	 */
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
	/**
	 * @return the smsConfig
	 */
	public SmsConfig getSmsConfig() {
		return smsConfig;
	}
	/**
	 * @param smsConfig the smsConfig to set
	 */
	public void setSmsConfig(SmsConfig smsConfig) {
		this.smsConfig = smsConfig;
	}
	
	
	
}
