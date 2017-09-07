package cn.com.inhand.statistic.dto;

import java.util.List;

import org.bson.types.ObjectId;

public class TimeDataParametsBean {

	private ObjectId deviceId;
	private List<String> varIds;

	public ObjectId getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
	}

	public List<String> getVarIds() {
		return varIds;
	}

	public void setVarIds(List<String> varIds) {
		this.varIds = varIds;
	}

}
