package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class SyncLog {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	
	private ObjectId deviceId;
	private String deviceName;
	private ObjectId publishPointId;
	private String publishPointName;
	private String groupName;
	private String currentVersion;
	private String syncVersion;
	private Long fileSize;
	private Date createTime;
	private Date syncStartTime;
	private Date syncEndTime;
	private Integer state;
	private String publishUserName;
	private String operationUserName;
	private ObjectId contentPublishedId;
	
	
	/**
	 * @return the publishUserName
	 */
	public String getPublishUserName() {
		return publishUserName;
	}
	/**
	 * @param publishUserName the publishUserName to set
	 */
	public void setPublishUserName(String publishUserName) {
		this.publishUserName = publishUserName;
	}
	/**
	 * @return the operationUserName
	 */
	public String getOperationUserName() {
		return operationUserName;
	}
	/**
	 * @param operationUserName the operationUserName to set
	 */
	public void setOperationUserName(String operationUserName) {
		this.operationUserName = operationUserName;
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
	 * @return the deviceName
	 */
	public String getDeviceName() {
		return deviceName;
	}
	/**
	 * @param deviceName the deviceName to set
	 */
	public void setDeviceName(String deviceName) {
		this.deviceName = deviceName;
	}
	/**
	 * @return the groupName
	 */
	public String getGroupName() {
		return groupName;
	}
	/**
	 * @param groupName the groupName to set
	 */
	public void setGroupName(String groupName) {
		this.groupName = groupName;
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
	 * @return the publishPointId
	 */
	public ObjectId getPublishPointId() {
		return publishPointId;
	}
	/**
	 * @param publishPointId the publishPointId to set
	 */
	public void setPublishPointId(ObjectId publishPointId) {
		this.publishPointId = publishPointId;
	}
	/**
	 * @return the publishPointName
	 */
	public String getPublishPointName() {
		return publishPointName;
	}
	/**
	 * @param publishPointName the publishPointName to set
	 */
	public void setPublishPointName(String publishPointName) {
		this.publishPointName = publishPointName;
	}
	/**
	 * @return the currentVersion
	 */
	public String getCurrentVersion() {
		return currentVersion;
	}
	/**
	 * @param currentVersion the currentVersion to set
	 */
	public void setCurrentVersion(String currentVersion) {
		this.currentVersion = currentVersion;
	}
	/**
	 * @return the syncVersion
	 */
	public String getSyncVersion() {
		return syncVersion;
	}
	/**
	 * @param syncVersion the syncVersion to set
	 */
	public void setSyncVersion(String syncVersion) {
		this.syncVersion = syncVersion;
	}
	/**
	 * @return the fileSize
	 */
	public Long getFileSize() {
		return fileSize;
	}
	/**
	 * @param fileSize the fileSize to set
	 */
	public void setFileSize(Long fileSize) {
		this.fileSize = fileSize;
	}
	/**
	 * @return the syncStartTime
	 */
	public Date getSyncStartTime() {
		return syncStartTime;
	}
	/**
	 * @param syncStartTime the syncStartTime to set
	 */
	public void setSyncStartTime(Date syncStartTime) {
		this.syncStartTime = syncStartTime;
	}
	/**
	 * @return the syncEndTime
	 */
	public Date getSyncEndTime() {
		return syncEndTime;
	}
	/**
	 * @param syncEndTime the syncEndTime to set
	 */
	public void setSyncEndTime(Date syncEndTime) {
		this.syncEndTime = syncEndTime;
	}
	/**
	 * @return the state
	 */
	public Integer getState() {
		return state;
	}
	/**
	 * @param state the state to set
	 */
	public void setState(Integer state) {
		this.state = state;
	}
	/**
	 * @return the contentPublishedId
	 */
	public ObjectId getContentPublishedId() {
		return contentPublishedId;
	}
	/**
	 * @param contentPublishedId the contentPublishedId to set
	 */
	public void setContentPublishedId(ObjectId contentPublishedId) {
		this.contentPublishedId = contentPublishedId;
	}
	
	
}
