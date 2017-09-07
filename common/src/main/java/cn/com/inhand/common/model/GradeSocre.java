package cn.com.inhand.common.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GradeSocre {
	
	@Id
    @JsonProperty("_id")
    private ObjectId id;
	
	/** 交易id */
	private String tradeId;
	
	/** 打分 */
	private String score;
	
	/** 创建时间 */
	private Long createTime;  
	
	/** 机构ID */
	private ObjectId oid;
	
	/** 邮件地址 */
	private String address;
	
	public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
    
    /**
	 * 获取交易id
	 * 
	 * @return tradeId 交易id
	 */
	public String getTradeId() {
		return tradeId;
	}

	/**
	 * 设置交易id
	 * 
	 * @param tradeId
	 *            交易id
	 */
	public void setTradeId(String tradeId) {
		this.tradeId = tradeId;
	}

	/**
	 * 获取打分
	 * 
	 * @return score 打分
	 */
	public String getScore() {
		return score;
	}

	/**
	 * 设置打分
	 * 
	 * @param score 打分
	 */
	public void setScore(String score) {
		this.score = score;
	}

	/**
	 * @return  createTime 创建时间
	 */
	public Long getCreateTime() {
		return createTime;
	}

	/**
	 * @param createTime 创建时间
	 */
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	/**
	 * @return oid 机构ID
	 */
	public ObjectId getOid() {
		return oid;
	}

	/**
	 * @param oid 机构ID
	 */
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}

	/**
	 * 获取邮件地址
	 * 
	 * @return address 邮件地址
	 */
	public String getAddress() {
		return address;
	}

	/**
	 * 设置邮件地址
	 * 
	 * @param address
	 *            邮件地址
	 */
	public void setAddress(String address) {
		this.address = address;
	}
	
}
