package cn.com.inhand.oauth2.dto;

import java.util.Arrays;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Field;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ClientQueryBean {
	private List<ObjectId> resourceIds;
	private String name;
	private Integer[] subclass;
	private String type;
	private Integer roleType;
	private ObjectId oid;
	
	public ObjectId getOid() {
		return oid;
	}
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
	public Integer getRoleType() {
		return roleType;
	}
	public void setRoleType(Integer roleType) {
		this.roleType = roleType;
	}
	public List<ObjectId> getResourceIds() {
		return resourceIds;
	}
	public void setResourceIds(List<ObjectId> resourceIds) {
		this.resourceIds = resourceIds;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Integer[] getSubclass() {
		return subclass;
	}
	public void setSubclass(Integer[] subclass) {
		this.subclass = subclass;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Override
	public String toString() {
		return "ClientQueryBean ["
				+ (resourceIds != null ? "resourceIds=" + resourceIds + ", "
						: "")
				+ (name != null ? "name=" + name + ", " : "")
				+ (subclass != null ? "subclass=" + Arrays.toString(subclass)
						+ ", " : "")
				+ (type != null ? "type=" + type + ", " : "")
				+ (roleType != null ? "roleType=" + roleType + ", " : "")
				+ (oid != null ? "oid=" + oid : "") + "]";
	}
}
