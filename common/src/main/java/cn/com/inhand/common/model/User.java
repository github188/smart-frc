package cn.com.inhand.common.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String name;
	private String email;
	private ObjectId roleId;
	
	public ObjectId getRoleId() {
		return roleId;
	}
	public void setRoleId(ObjectId roleId) {
		this.roleId = roleId;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	@Override
	public String toString() {
		return "User [" + (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (email != null ? "email=" + email + ", " : "")
				+ (roleId != null ? "roleId=" + roleId : "") + "]";
	}
	
}
