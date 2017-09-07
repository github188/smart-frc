package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class ContentPublished {
	@Id
	@JsonProperty("_id")
	private ObjectId id;

	private ObjectId oid;
	private String version;
	private ObjectId publishPointId;
	private List<String> deviceList;
	private String groupName;
	private String uri;
	private Long fileSize;
	private Date createTime;
	private List<ContentBack> backRecord;
	private ObjectId operationId;
	private String operationName;
	
	
	/**
	 * @return the backRecord
	 */
	public List<ContentBack> getBackRecord() {
		return backRecord;
	}
	/**
	 * @param backRecord the backRecord to set
	 */
	public void setBackRecord(List<ContentBack> backRecord) {
		this.backRecord = backRecord;
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
	 * @return the version
	 */
	public String getVersion() {
		return version;
	}
	/**
	 * @param version the version to set
	 */
	public void setVersion(String version) {
		this.version = version;
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
	 * @return the deviceList
	 */
	public List<String> getDeviceList() {
		return deviceList;
	}
	/**
	 * @param deviceList the deviceList to set
	 */
	public void setDeviceList(List<String> deviceList) {
		this.deviceList = deviceList;
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
	 * @return the uri
	 */
	public String getUri() {
		return uri;
	}
	/**
	 * @param uri the uri to set
	 */
	public void setUri(String uri) {
		this.uri = uri;
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
	
	
}
