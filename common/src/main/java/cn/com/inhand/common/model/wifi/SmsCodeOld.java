package cn.com.inhand.common.model.wifi;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class SmsCodeOld {

    /**
     * SmsCode
     */
    @Id
    @JsonProperty("_id")
    private ObjectId id;

    /**
     * desc: been send to wifi user
     *       as the wifi user's password
     */
    private String varificationCode;

    /**
     * desc:wifi user's phone number
     */
    private String phone;

    private Date createTime;
    private Date expireTime;

    private Integer state;
    private String mac;
    
	/**
	 * @return the mac
	 */
	public String getMac() {
		return mac;
	}

	/**
	 * @param mac the mac to set
	 */
	public void setMac(String mac) {
		this.mac = mac;
	}

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
	 * @return the varificationCode
	 */
	public String getVarificationCode() {
		return varificationCode;
	}

	/**
	 * @param varificationCode the varificationCode to set
	 */
	public void setVarificationCode(String varificationCode) {
		this.varificationCode = varificationCode;
	}

	/**
	 * @return the phone
	 */
	public String getPhone() {
		return phone;
	}

	/**
	 * @param phone the phone to set
	 */
	public void setPhone(String phone) {
		this.phone = phone;
	}

	/**
	 * @return the createTime
	 */
	public Date getCreateTime() {
		return createTime;
	}

	/**
	 * @param createTime the createTime to set
	 */
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	/**
	 * @return the expireTime
	 */
	public Date getExpireTime() {
		return expireTime;
	}

	/**
	 * @param expireTime the expireTime to set
	 */
	public void setExpireTime(Date expireTime) {
		this.expireTime = expireTime;
	}

	/**
	 * @return the state
	 */
	public Integer getState() {
		return state;
	}

	/**
	 * @param state the state to set
	 */
	public void setState(Integer state) {
		this.state = state;
	}
    
    
}
