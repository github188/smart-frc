package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class Party3Code {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	
	private String code;
	private Integer asType;
	private Date createTime;
	private Date updateTime;
	private Integer state;
	private Date repealTime;
	private ObjectId operationId;
	private String operationName;
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
	 * @return the code
	 */
	public String getCode() {
		return code;
	}
	/**
	 * @param code the code to set
	 */
	public void setCode(String code) {
		this.code = code;
	}
	/**
	 * @return the asType
	 */
	public Integer getAsType() {
		return asType;
	}
	/**
	 * @param asType the asType to set
	 */
	public void setAsType(Integer asType) {
		this.asType = asType;
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
	 * @return the repealTime
	 */
	public Date getRepealTime() {
		return repealTime;
	}
	/**
	 * @param repealTime the repealTime to set
	 */
	public void setRepealTime(Date repealTime) {
		this.repealTime = repealTime;
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
	
	
	
}
