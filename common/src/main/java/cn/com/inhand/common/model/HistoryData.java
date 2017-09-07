package cn.com.inhand.common.model;

import org.bson.types.ObjectId;

import java.util.Date;

public class HistoryData {
    private ObjectId _id;
    private ObjectId deviceId;
    private Integer sensorId;
    private String id;
    private Date timestamp;
    private Object value;
    private Date createTime;
    private Date endTime;
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

    public Integer getSensorId() {
        return sensorId;
    }

    public void setSensorId(Integer sensorId) {
        this.sensorId = sensorId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

	public Long getTimestampUs() {
		return timestampUs;
	}

	public void setTimestampUs(Long timestampUs) {
		this.timestampUs = timestampUs;
	}

}
