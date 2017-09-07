package cn.com.inhand.oauth2.dto;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserDbs {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String username;
	private String dbName;
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getDbName() {
		return dbName;
	}
	public void setDbName(String dbName) {
		this.dbName = dbName;
	}
	@Override
	public String toString() {
		return "UserDbs [" + (id != null ? "id=" + id + ", " : "")
				+ (oid != null ? "oid=" + oid + ", " : "")
				+ (username != null ? "username=" + username + ", " : "")
				+ (dbName != null ? "dbName=" + dbName : "") + "]";
	}
}
