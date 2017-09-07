package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class SyncPoint {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	
	private String name;
	private ObjectId deviceId;
	private ObjectId publishPointId;
	private String version;
	private Integer state;
	private ObjectId contentPublishedId;
	private SyncModule syncModule;
	
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
	/**
	 * @return the syncModule
	 */
	public SyncModule getSyncModule() {
		return syncModule;
	}
	/**
	 * @param syncModule the syncModule to set
	 */
	public void setSyncModule(SyncModule syncModule) {
		this.syncModule = syncModule;
	}
	
	
	
}
