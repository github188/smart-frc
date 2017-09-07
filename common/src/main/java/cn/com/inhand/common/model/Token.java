package cn.com.inhand.common.model;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Token {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private ObjectId uid;
	private String username;
	private String ip;
	private ObjectId clientId;
	private String name;
	private Long expiresIn;
	private Long createTime;
	private Map<String, Object> privileges;
	private String token;
	private Integer roleType;
	public Integer getRoleType() {
		return roleType;
	}
	public void setRoleType(Integer roleType) {
		this.roleType = roleType;
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
	public ObjectId getUid() {
		return uid;
	}
	public void setUid(ObjectId uid) {
		this.uid = uid;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
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
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	@Override
	public String toString() {
		return "Token [" + (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (uid != null ? "uid=" + uid + ", " : "")
				+ (username != null ? "username=" + username + ", " : "")
				+ (ip != null ? "ip=" + ip + ", " : "")
				+ (clientId != null ? "clientId=" + clientId + ", " : "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (expiresIn != null ? "expiresIn=" + expiresIn + ", " : "")
				+ (createTime != null ? "createTime=" + createTime + ", " : "")
				+ (privileges != null ? "privileges=" + privileges + ", " : "")
				+ (token != null ? "token=" + token + ", " : "") + "roleType="
				+ roleType + "]";
	}
	
}
