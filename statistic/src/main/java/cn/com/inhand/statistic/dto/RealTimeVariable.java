package cn.com.inhand.statistic.dto;

import javax.validation.constraints.NotNull;

public class RealTimeVariable {
	/**
	 * 变量名
	 */
	@NotNull
	private String id;
	
	@NotNull
	private String value;
	private Long timestamp;
	private Long endTime;
	private Integer quality;
	private Long timestampUs;
	
	@NotNull
	private Integer type;
	private Boolean isAliam = false;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Long getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}

	public Long getEndTime() {
		return endTime;
	}

	public void setEndTime(Long endTime) {
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

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public Boolean getIsAliam() {
		return isAliam;
	}

	public void setIsAliam(Boolean isAliam) {
		this.isAliam = isAliam;
	};

}
