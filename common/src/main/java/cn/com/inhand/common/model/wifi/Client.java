package cn.com.inhand.common.model.wifi;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Client {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String appkey;
	private Integer state;
	private Long approvedTime;
	private String name;
	private String reliable;
	private String type;
	private Map<String, Object> privileges;
	private String redirectURI;
	private ObjectId logo;
	private String author;
	private String website;
	private String description;
	private Long createTime;
	private Long updateTime;
	private Integer subclass;
	private Integer acquiesce;
	private String url;
	private Long ageing;
	
	
	public String getAppkey() {
		return appkey;
	}
	public void setAppkey(String appkey) {
		this.appkey = appkey;
	}
	public String getReliable() {
		return reliable;
	}
	public void setReliable(String reliable) {
		this.reliable = reliable;
	}
	public Integer getAcquiesce() {
		return acquiesce;
	}
	public void setAcquiesce(Integer acquiesce) {
		this.acquiesce = acquiesce;
	}
	public Long getAgeing() {
		return ageing;
	}
	public void setAgeing(Long ageing) {
		this.ageing = ageing;
	}
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public ObjectId getOid() {
		return oid;
	}
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
	public String getAppKey() {
		return appkey;
	}
	public void setAppKey(String appKey) {
		this.appkey = appKey;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public Long getApprovedTime() {
		return approvedTime;
	}
	public void setApprovedTime(Long approvedTime) {
		this.approvedTime = approvedTime;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Map<String, Object> getPrivileges() {
		return privileges;
	}
	public void setPrivileges(Map<String, Object> privileges) {
		this.privileges = privileges;
	}
	public String getRedirectURI() {
		return redirectURI;
	}
	public void setRedirectURI(String redirectURI) {
		this.redirectURI = redirectURI;
	}
	public ObjectId getLogo() {
		return logo;
	}
	public void setLogo(ObjectId logo) {
		this.logo = logo;
	}
	public String getAuthor() {
		return author;
	}
	public void setAuthor(String author) {
		this.author = author;
	}
	public String getWebsite() {
		return website;
	}
	public void setWebsite(String website) {
		this.website = website;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	public Integer getSubclass() {
		return subclass;
	}
	public void setSubclass(Integer subclass) {
		this.subclass = subclass;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	@Override
	public String toString() {
		return "Client ["
				+ (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (appkey != null ? "appkey=" + appkey + ", " : "")
				+ (state != null ? "state=" + state + ", " : "")
				+ (approvedTime != null ? "approvedTime=" + approvedTime + ", "
						: "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (reliable != null ? "reliable=" + reliable + ", " : "")
				+ (type != null ? "type=" + type + ", " : "")
				+ (privileges != null ? "privileges=" + privileges + ", " : "")
				+ (redirectURI != null ? "redirectURI=" + redirectURI + ", "
						: "")
				+ (logo != null ? "logo=" + logo + ", " : "")
				+ (author != null ? "author=" + author + ", " : "")
				+ (website != null ? "website=" + website + ", " : "")
				+ (description != null ? "description=" + description + ", "
						: "")
				+ (createTime != null ? "createTime=" + createTime + ", " : "")
				+ (updateTime != null ? "updateTime=" + updateTime + ", " : "")
				+ (subclass != null ? "subclass=" + subclass + ", " : "")
				+ (acquiesce != null ? "acquiesce=" + acquiesce + ", " : "")
				+ (url != null ? "url=" + url + ", " : "")
				+ (ageing != null ? "ageing=" + ageing : "") + "]";
	}
	
}
