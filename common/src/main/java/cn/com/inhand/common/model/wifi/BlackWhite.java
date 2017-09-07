package cn.com.inhand.common.model.wifi;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class BlackWhite {

    /**
     * BlackWhite
     */
    @Id
    @JsonProperty("_id")
    private ObjectId id;

    /**
     * desc:phone number or 
     *      web site link
     */
    private String name;

    /**
     * desc:
     * 1,web site link
     * 2,wifi user's username
     * 3,wifi user's mac address
     */
    private Integer type;

    /**
     * desc:
     * 1,black list
     * 2,white list
     */
    private Integer blackOrWhite;

    /**
	 * @return the operationUserId
	 */
	public ObjectId getOperationUserId() {
		return operationUserId;
	}
	/**
	 * @param operationUserId the operationUserId to set
	 */
	public void setOperationUserId(ObjectId operationUserId) {
		this.operationUserId = operationUserId;
	}
	private Date createTime;
    private Date updateTime;
    private ObjectId operationUserId;
    private String operationName;
    private ObjectId userId;
    
    
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
	 * @return the updateTime
	 */
	public Date getUpdateTime() {
		return updateTime;
	}
	/**
	 * @param updateTime the updateTime to set
	 */
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	private String reason;
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
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the type
	 */
	public Integer getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(Integer type) {
		this.type = type;
	}
	/**
	 * @return the blackOrWhite
	 */
	public Integer getBlackOrWhite() {
		return blackOrWhite;
	}
	/**
	 * @param blackOrWhite the blackOrWhite to set
	 */
	public void setBlackOrWhite(Integer blackOrWhite) {
		this.blackOrWhite = blackOrWhite;
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
	 * @return the reason
	 */
	public String getReason() {
		return reason;
	}
	/**
	 * @param reason the reason to set
	 */
	public void setReason(String reason) {
		this.reason = reason;
	}
}
