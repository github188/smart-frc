package cn.com.inhand.oauth2.dto;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientUpdateBean {
	@JsonProperty("_id")
    @Id
    private ObjectId id;
	private Integer state;
	private String name;
	private String type;
	private String redirectURI;
	private String logo;
	private String author;
	private String website;
	private String description;
	private Integer subclass;
	private Integer acquiesce;
	private String url;
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public Integer getState() {
		return state;
	}
	public void setState(Integer state) {
		this.state = state;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getRedirectURI() {
		return redirectURI;
	}
	public void setRedirectURI(String redirectURI) {
		this.redirectURI = redirectURI;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Integer getAcquiesce() {
		return acquiesce;
	}
	public void setAcquiesce(Integer acquiesce) {
		this.acquiesce = acquiesce;
	}
	@Override
	public String toString() {
		return "ClientUpdateBean ["
				+ (id != null ? "id=" + id + ", " : "")
				+ (state != null ? "state=" + state + ", " : "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (type != null ? "type=" + type + ", " : "")
				+ (redirectURI != null ? "redirectURI=" + redirectURI + ", "
						: "")
				+ (logo != null ? "logo=" + logo + ", " : "")
				+ (author != null ? "author=" + author + ", " : "")
				+ (website != null ? "website=" + website + ", " : "")
				+ (description != null ? "description=" + description + ", "
						: "")
				+ (subclass != null ? "subclass=" + subclass + ", " : "")
				+ (acquiesce != null ? "acquiesce=" + acquiesce + ", " : "")
				+ (url != null ? "url=" + url : "") + "]";
	}
	
}
