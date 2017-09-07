package cn.com.inhand.statistic.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang.builder.ToStringBuilder;
import org.apache.commons.lang.builder.ToStringStyle;
import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 7/13/2014.
 */
public class WifiStat {
	private Integer type;
	@JsonProperty("_id")
	private ObjectId id;
	private long value;
	private Date date;
	private ObjectId siteId;

	public ObjectId getSiteId() {
		return siteId;
	}

	public void setSiteId(ObjectId siteId) {
		this.siteId = siteId;
	}

	@Override
	public String toString() {
		return ToStringBuilder.reflectionToString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public long getValue() {
		return value;
	}

	public void setValue(long value) {
		this.value = value;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}
}
