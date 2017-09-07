package cn.com.inhand.common.amqp.model;

import java.util.Map;

public class ResourceData {
	private String id;
	private String oid;
	private int type;
	private String name;
	private Map<String, Object> permissions;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOid() {
		return oid;
	}
	public void setOid(String oid) {
		this.oid = oid;
	}
	public int getType() {
		return type;
	}
	public void setType(int type) {
		this.type = type;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Map<String, Object> getPermissions() {
		return permissions;
	}
	public void setPermissions(Map<String, Object> permissions) {
		this.permissions = permissions;
	}
	
	
	
	
}
