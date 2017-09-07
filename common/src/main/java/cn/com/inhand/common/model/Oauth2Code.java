package cn.com.inhand.common.model;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Oauth2Code {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String ip;
	private ObjectId clientId;
	private Long expiresIn;
	private Long createTime;
	private Map<String, Object> privileges;
	private String code;
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
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public ObjectId getClientId() {
		return clientId;
	}
	public void setClientId(ObjectId clientId) {
		this.clientId = clientId;
	}
	public Long getExpiresIn() {
		return expiresIn;
	}
	public void setExpiresIn(Long expiresIn) {
		this.expiresIn = expiresIn;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public Map<String, Object> getPrivileges() {
		return privileges;
	}
	public void setPrivileges(Map<String, Object> privileges) {
		this.privileges = privileges;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	@Override
	public String toString() {
		return "Oauth2Code [" + (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (ip != null ? "ip=" + ip + ", " : "")
				+ (clientId != null ? "clientId=" + clientId + ", " : "")
				+ (expiresIn != null ? "expiresIn=" + expiresIn + ", " : "")
				+ (createTime != null ? "createTime=" + createTime + ", " : "")
				+ (privileges != null ? "privileges=" + privileges + ", " : "")
				+ (code != null ? "code=" + code : "") + "]";
	}
}
