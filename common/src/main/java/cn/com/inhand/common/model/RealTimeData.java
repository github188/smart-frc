package cn.com.inhand.common.model;

import org.bson.types.ObjectId;

import java.util.List;

public class RealTimeData {
    private ObjectId _id;
    private ObjectId deviceId;
    private Long updateTime;
    private Integer sensorId;
    private List<RealTimeVariable> vars;
    private Long timestampUs;

    public ObjectId get_id() {
        return _id;
    }

    public void set_id(ObjectId _id) {
        this._id = _id;
    }

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getSensorId() {
        return sensorId;
    }

    public void setSensorId(Integer sensorId) {
        this.sensorId = sensorId;
    }

    public List<RealTimeVariable> getVars() {
        return vars;
    }

    public void setVars(List<RealTimeVariable> vars) {
        this.vars = vars;
    }

	public Long getTimestampUs() {
		return timestampUs;
	}

	public void setTimestampUs(Long timestampUs) {
		this.timestampUs = timestampUs;
	}

}
