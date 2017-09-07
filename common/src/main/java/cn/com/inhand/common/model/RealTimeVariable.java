package cn.com.inhand.common.model;


import java.util.Date;

public class RealTimeVariable {
    /**
     * 变量名
     */
    private String id;
    private Object value;
    private Date timestamp;
    private Date endTime;
    private Integer quality;
    private Long timestampUs;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Object getValue() {
        return value;
    }

    public void setValue(Object value) {
        this.value = value;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Integer getQuality() {
        return quality;
    }

    public void setQuality(Integer quality) {
        this.quality = quality;
    }

	public Long getTimestampUs() {
		return timestampUs;
	}

	public void setTimestampUs(Long timestampUs) {
		this.timestampUs = timestampUs;
	}

}
