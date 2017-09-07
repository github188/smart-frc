package cn.com.inhand.common.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;


public class ResourceTag {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId tagId;
	private ObjectId resourceId;
	private Integer resourceType;
	private String tagName;
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
	 * @return the tagId
	 */
	public ObjectId getTagId() {
		return tagId;
	}
	/**
	 * @param tagId the tagId to set
	 */
	public void setTagId(ObjectId tagId) {
		this.tagId = tagId;
	}
	/**
	 * @return the resourceId
	 */
	public ObjectId getResourceId() {
		return resourceId;
	}
	/**
	 * @param resourceId the resourceId to set
	 */
	public void setResourceId(ObjectId resourceId) {
		this.resourceId = resourceId;
	}
	/**
	 * @return the resourceType
	 */
	public Integer getResourceType() {
		return resourceType;
	}
	/**
	 * @param resourceType the resourceType to set
	 */
	public void setResourceType(Integer resourceType) {
		this.resourceType = resourceType;
	}
	/**
	 * @return the tagName
	 */
	public String getTagName() {
		return tagName;
	}
	/**
	 * @param tagName the tagName to set
	 */
	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	
	
}
