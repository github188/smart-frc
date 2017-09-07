package cn.com.inhand.common.model.wifi;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class UserTraffic {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private Date date;
	private ObjectId userId;
	private Long tx;
	private Long rx;
	private Long time;
	private Long interval;
	/**
	 * @return the id
	 */
	public ObjectId getId() {
		return id;
	}
	/**
	 * @param id the id to set
	 */
	public void setId(ObjectId id) {
		this.id = id;
	}
	/**
	 * @return the date
	 */
	public Date getDate() {
		return date;
	}
	/**
	 * @param date the date to set
	 */
	public void setDate(Date date) {
		this.date = date;
	}
	/**
	 * @return the userId
	 */
	public ObjectId getUserId() {
		return userId;
	}
	/**
	 * @param userId the userId to set
	 */
	public void setUserId(ObjectId userId) {
		this.userId = userId;
	}
	/**
	 * @return the tx
	 */
	public Long getTx() {
		return tx;
	}
	/**
	 * @param tx the tx to set
	 */
	public void setTx(Long tx) {
		this.tx = tx;
	}
	/**
	 * @return the rx
	 */
	public Long getRx() {
		return rx;
	}
	/**
	 * @param rx the rx to set
	 */
	public void setRx(Long rx) {
		this.rx = rx;
	}
	/**
	 * @return the time
	 */
	public Long getTime() {
		return time;
	}
	/**
	 * @param time the time to set
	 */
	public void setTime(Long time) {
		this.time = time;
	}
	/**
	 * @return the interval
	 */
	public Long getInterval() {
		return interval;
	}
	/**
	 * @param interval the interval to set
	 */
	public void setInterval(Long interval) {
		this.interval = interval;
	}
	
	
	
}
