package cn.com.inhand.common.model;

import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Role {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String name;
	private Integer type;
	private Map<String, Object> privileges;
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
	public Integer getType() {
		return type;
	}
	public void setType(Integer type) {
		this.type = type;
	}
	public Map<String, Object> getPrivileges() {
		return privileges;
	}
	public void setPrivileges(Map<String, Object> privileges) {
		this.privileges = privileges;
	}
	@Override
	public String toString() {
		return "Role [" + (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (type != null ? "type=" + type + ", " : "")
				+ (privileges != null ? "privileges=" + privileges : "") + "]";
	}
}
