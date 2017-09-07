package cn.com.inhand.common.model.wifi.wechat;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class WechatQrCode{
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oId;
        private ObjectId deviceId;
	private ObjectId siteId;
	private Integer sceneId;
	private String url;
	private String ticket;
	private Date createTime;
	private ObjectId operationId;
	private String operationName;
	private String reponseInfo;
	private String getQrCodeUrl;

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }
	
	
	
	/**
	 * @return the getQrCodeUrl
	 */
	public String getGetQrCodeUrl() {
		return getQrCodeUrl;
	}
	/**
	 * @param getQrCodeUrl the getQrCodeUrl to set
	 */
	public void setGetQrCodeUrl(String getQrCodeUrl) {
		this.getQrCodeUrl = getQrCodeUrl;
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
	 * @return the sceneId
	 */
	public Integer getSceneId() {
		return sceneId;
	}
	/**
	 * @param sceneId the sceneId to set
	 */
	public void setSceneId(Integer sceneId) {
		this.sceneId = sceneId;
	}
	/**
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}
	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
	}
	/**
	 * @return the ticket
	 */
	public String getTicket() {
		return ticket;
	}
	/**
	 * @param ticket the ticket to set
	 */
	public void setTicket(String ticket) {
		this.ticket = ticket;
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
	/**
	 * @return the operationId
	 */
	public ObjectId getOperationId() {
		return operationId;
	}
	/**
	 * @param operationId the operationId to set
	 */
	public void setOperationId(ObjectId operationId) {
		this.operationId = operationId;
	}
	/**
	 * @return the operationName
	 */
	public String getOperationName() {
		return operationName;
	}
	/**
	 * @param operationName the operationName to set
	 */
	public void setOperationName(String operationName) {
		this.operationName = operationName;
	}
	/**
	 * @return the reponseInfo
	 */
	public String getReponseInfo() {
		return reponseInfo;
	}
	/**
	 * @param reponseInfo the reponseInfo to set
	 */
	public void setReponseInfo(String reponseInfo) {
		this.reponseInfo = reponseInfo;
	}
	
	
	
	
}
