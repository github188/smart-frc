package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class PublishPoint {
	@Id
	@JsonProperty("_id")
	private ObjectId id;

	private ObjectId oid;
	/**
	 * desc:can not be repeat
	 */
	private String name;
	private Integer priority;
	
	/**
	 * ms
	 */
	private Long syncCycleTime;
	
	/**
	 * desc:example:
	 *  day-23:00~23:30
		Week.day.23:00~23:30
		month.day.23:00~23:30
	 */
	private String syncTimeInterval;
	private Integer policy;
	private String devicePath;
	private String path;
	
	/**
	 * 1-available,0-devailble
	 */
	private Integer status;
	
	
	
	
	/**
	 * @return the status
	 */
	public Integer getStatus() {
		return status;
	}
	/**
	 * @param status the status to set
	 */
	public void setStatus(Integer status) {
		this.status = status;
	}
	/**
	 * @return the devicePath
	 */
	public String getDevicePath() {
		return devicePath;
	}
	/**
	 * @param devicePath the devicePath to set
	 */
	public void setDevicePath(String devicePath) {
		this.devicePath = devicePath;
	}
	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}
	/**
	 * @param path the path to set
	 */
	public void setPath(String path) {
		this.path = path;
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
	 * @return the priority
	 */
	public Integer getPriority() {
		return priority;
	}
	/**
	 * @param priority the priority to set
	 */
	public void setPriority(Integer priority) {
		this.priority = priority;
	}
	
	/**
	 * @return the syncCycleTime
	 */
	public Long getSyncCycleTime() {
		return syncCycleTime;
	}
	/**
	 * @param syncCycleTime the syncCycleTime to set
	 */
	public void setSyncCycleTime(Long syncCycleTime) {
		this.syncCycleTime = syncCycleTime;
	}
	/**
	 * @return the syncTimeInterval
	 */
	public String getSyncTimeInterval() {
		return syncTimeInterval;
	}
	/**
	 * @param syncTimeInterval the syncTimeInterval to set
	 */
	public void setSyncTimeInterval(String syncTimeInterval) {
		this.syncTimeInterval = syncTimeInterval;
	}
	/**
	 * @return the policy
	 */
	public Integer getPolicy() {
		return policy;
	}
	/**
	 * @param policy the policy to set
	 */
	public void setPolicy(Integer policy) {
		this.policy = policy;
	}
}
