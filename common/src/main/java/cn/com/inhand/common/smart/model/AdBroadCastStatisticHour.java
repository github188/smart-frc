package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 广告播放统计数据
 * 
 * @author puys
 *
 */
public class AdBroadCastStatisticHour {

	@Id
	@JsonProperty("_id")
	private ObjectId id; // 唯一标识
	private ObjectId oid; // 机构ID
	private String assetId; // 售货机编号
	private String fileName; // 文件名称
	private String path; // 文件路径
	private Long totalDuration; // 总时长
	private Long totalNums; // 总次数
	private Long timestamp; // 时间戳
	
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
	 * @return the oid
	 */
	public ObjectId getOid() {
		return oid;
	}
	/**
	 * @param oid the oid to set
	 */
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
	/**
	 * @return the assetId
	 */
	public String getAssetId() {
		return assetId;
	}
	/**
	 * @param assetId the assetId to set
	 */
	public void setAssetId(String assetId) {
		this.assetId = assetId;
	}
	/**
	 * @return the fileName
	 */
	public String getFileName() {
		return fileName;
	}
	/**
	 * @param fileName the fileName to set
	 */
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	/**
	 * @return the path
	 */
	public String getPath() {
		return path;
	}
	/**
	 * @param path the path to set
	 */
	public void setPath(String path) {
		this.path = path;
	}
	/**
	 * @return the totalDuration
	 */
	public Long getTotalDuration() {
		return totalDuration;
	}
	/**
	 * @param totalDuration the totalDuration to set
	 */
	public void setTotalDuration(Long totalDuration) {
		this.totalDuration = totalDuration;
	}
	/**
	 * @return the totalNums
	 */
	public Long getTotalNums() {
		return totalNums;
	}
	/**
	 * @param totalNums the totalNums to set
	 */
	public void setTotalNums(Long totalNums) {
		this.totalNums = totalNums;
	}
	/**
	 * @return the timestamp
	 */
	public Long getTimestamp() {
		return timestamp;
	}
	/**
	 * @param timestamp the timestamp to set
	 */
	public void setTimestamp(Long timestamp) {
		this.timestamp = timestamp;
	}
}
