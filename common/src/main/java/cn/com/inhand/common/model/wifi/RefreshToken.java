package cn.com.inhand.common.model.wifi;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class RefreshToken {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private String refreshToken;
	private ObjectId clientId;
	private Long expiresIn;
	private Long createTime;
	private String username;
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public String getRefreshToken() {
		return refreshToken;
	}
	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
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
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	@Override
	public String toString() {
		return "RefreshToken ["
				+ (id != null ? "id=" + id + ", " : "")
				+ (refreshToken != null ? "refreshToken=" + refreshToken + ", "
						: "")
				+ (clientId != null ? "clientId=" + clientId + ", " : "")
				+ (expiresIn != null ? "expiresIn=" + expiresIn + ", " : "")
				+ (createTime != null ? "createTime=" + createTime + ", " : "")
				+ (username != null ? "username=" + username : "") + "]";
	}
}
