package cn.com.inhand.common.smart.model;

import java.util.List;

import org.bson.types.ObjectId;

/**
 * 广告播放统计消息
 * @author puys
 *
 */
public class AdBroadcastMessageBean {

	private ObjectId oid; // 机构id
	
	private String assetId; // 售货机编号
	
	private List<AdRecord> adRecords; //结束记录

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
	 * @return the adRecords
	 */
	public List<AdRecord> getAdRecords() {
		return adRecords;
	}

	/**
	 * @param adRecords the adRecords to set
	 */
	public void setAdRecords(List<AdRecord> adRecords) {
		this.adRecords = adRecords;
	}
	
}
