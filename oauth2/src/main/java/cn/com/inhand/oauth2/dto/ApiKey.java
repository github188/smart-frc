package cn.com.inhand.oauth2.dto;

import org.bson.types.ObjectId;

public class ApiKey {

	private ObjectId _id;
	private Integer sn;
	private String keyCode;
	private ObjectId clientId;

	public ObjectId get_id() {
		return _id;
	}

	public void set_id(ObjectId _id) {
		this._id = _id;
	}

	public Integer getSn() {
		return sn;
	}

	public void setSn(Integer sn) {
		this.sn = sn;
	}

	public String getKeyCode() {
		return keyCode;
	}

	public void setKeyCode(String keyCode) {
		this.keyCode = keyCode;
	}

	public ObjectId getClientId() {
		return clientId;
	}

	public void setClientId(ObjectId clientId) {
		this.clientId = clientId;
	}

}
