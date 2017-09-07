package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.List;

public class User {
	@Id
	@JsonProperty("_id")
	private ObjectId id;

	private ObjectId oid;

	/**
	 * desc:phone number
	 * or 3rd party username
	 */
	private String username;

	private String password;

	/**
	 * desc:the gateway's ID ,which give the wifi service to this user
	 */
	private ObjectId deviceId;
	
	private ObjectId siteId;
	
	private String phone;

	/**
	 * desc:current mac address
	 * will be update when wifi user relogin
	 */
	private String mac;

	/**
	 * desc:wifi user's history mac address
	 * it's length can only be 10
	 */
	private List<String> mac_array;

	/**
	 * desc:for sms code varification
	 * and be user's password
	 */
	private String smsVarifiCode;

	/**
	 * desc:one minute
	 */
	private Date smsExpireTime;

	private String name;
	
	private String email;

	
	/**
	 * desc:1=blacklist、0=whitelist
	 */
	private Integer blackOrWhite;
	
	/**
     * desc:will be the username about 3rd party user
     */
	private String socialName;
	private String socialInfo;
	private Integer asType;

	private String groupId;

	/**
	 * desc:user type
	 * 1,registe from phone number user
	 * 2,registe from 3rd party user
	 */
	private Integer type;

	/**
	 * desc:
	 * 1,logout
	 * 2,logined
	 * 3,locked
	 */
	private Integer state;

	private Date lockTime;
	private Date login;
	private Date lastLogin;
	private String lastIp;
	private String thisIp;
	private Date lastLogout;
	private Date lastLoginFailed;
	private Integer totalLogin;
	private Date createTime;
	private Date updateTime;
	
	/**
	 * @return the login
	 */
	public Date getLogin() {
		return login;
	}

	/**
	 * @param login the login to set
	 */
	public void setLogin(Date login) {
		this.login = login;
	}

	/**
	 * @return the siteId
	 */
	public ObjectId getSiteId() {
		return siteId;
	}

	/**
	 * @param siteId the siteId to set
	 */
	public void setSiteId(ObjectId siteId) {
		this.siteId = siteId;
	}

	/**
	 * @return the socialInfo
	 */
	public String getSocialInfo() {
		return socialInfo;
	}

	/**
	 * @param socialInfo the socialInfo to set
	 */
	public void setSocialInfo(String socialInfo) {
		this.socialInfo = socialInfo;
	}

	/**
	 * @return the asType
	 */
	public Integer getAsType() {
		return asType;
	}

	/**
	 * @param asType the asType to set
	 */
	public void setAsType(Integer asType) {
		this.asType = asType;
	}

	/**
	 * @return the deviceId
	 */
	public ObjectId getDeviceId() {
		return deviceId;
	}

	/**
	 * @param deviceId the deviceId to set
	 */
	public void setDeviceId(ObjectId deviceId) {
		this.deviceId = deviceId;
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
	 * @return the blackOrWhite
	 */
	public Integer getBlackOrWhite() {
		return blackOrWhite;
	}
	/**
	 * @param blackOrWhite the blackOrWhite to set
	 */
	public void setBlackOrWhite(Integer blackOrWhite) {
		this.blackOrWhite = blackOrWhite;
	}
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
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
	 * @return the username
	 */
	public String getUsername() {
		return username;
	}

	/**
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	/**
	 * @return the password
	 */
	public String getPassword() {
		return password;
	}

	/**
	 * @param password the password to set
	 */
	public void setPassword(String password) {
		this.password = password;
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
	 * @return the mac_array
	 */
	public List<String> getMac_array() {
		return mac_array;
	}

	/**
	 * @param mac_array the mac_array to set
	 */
	public void setMac_array(List<String> mac_array) {
		this.mac_array = mac_array;
	}

	/**
	 * @return the smsVarifiCode
	 */
	public String getSmsVarifiCode() {
		return smsVarifiCode;
	}

	/**
	 * @param smsVarifiCode the smsVarifiCode to set
	 */
	public void setSmsVarifiCode(String smsVarifiCode) {
		this.smsVarifiCode = smsVarifiCode;
	}

	/**
	 * @return the smsExpireTime
	 */
	public Date getSmsExpireTime() {
		return smsExpireTime;
	}

	/**
	 * @param smsExpireTime the smsExpireTime to set
	 */
	public void setSmsExpireTime(Date smsExpireTime) {
		this.smsExpireTime = smsExpireTime;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the socialName
	 */
	public String getSocialName() {
		return socialName;
	}

	/**
	 * @param socialName the socialName to set
	 */
	public void setSocialName(String socialName) {
		this.socialName = socialName;
	}

	/**
	 * @return the groupId
	 */
	public String getGroupId() {
		return groupId;
	}

	/**
	 * @param groupId the groupId to set
	 */
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}

	/**
	 * @return the type
	 */
	public Integer getType() {
		return type;
	}

	/**
	 * @param type the type to set
	 */
	public void setType(Integer type) {
		this.type = type;
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

	/**
	 * @return the lockTime
	 */
	public Date getLockTime() {
		return lockTime;
	}

	/**
	 * @param lockTime the lockTime to set
	 */
	public void setLockTime(Date lockTime) {
		this.lockTime = lockTime;
	}

	/**
	 * @return the lastLogin
	 */
	public Date getLastLogin() {
		return lastLogin;
	}

	/**
	 * @param lastLogin the lastLogin to set
	 */
	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}

	/**
	 * @return the lastIp
	 */
	public String getLastIp() {
		return lastIp;
	}

	/**
	 * @param lastIp the lastIp to set
	 */
	public void setLastIp(String lastIp) {
		this.lastIp = lastIp;
	}

	/**
	 * @return the thisIp
	 */
	public String getThisIp() {
		return thisIp;
	}

	/**
	 * @param thisIp the thisIp to set
	 */
	public void setThisIp(String thisIp) {
		this.thisIp = thisIp;
	}

	/**
	 * @return the lastLogout
	 */
	public Date getLastLogout() {
		return lastLogout;
	}

	/**
	 * @param lastLogout the lastLogout to set
	 */
	public void setLastLogout(Date lastLogout) {
		this.lastLogout = lastLogout;
	}

	/**
	 * @return the lastLoginFailed
	 */
	public Date getLastLoginFailed() {
		return lastLoginFailed;
	}

	/**
	 * @param lastLoginFailed the lastLoginFailed to set
	 */
	public void setLastLoginFailed(Date lastLoginFailed) {
		this.lastLoginFailed = lastLoginFailed;
	}

	/**
	 * @return the totalLogin
	 */
	public Integer getTotalLogin() {
		return totalLogin;
	}

	/**
	 * @param totalLogin the totalLogin to set
	 */
	public void setTotalLogin(Integer totalLogin) {
		this.totalLogin = totalLogin;
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
	 * @return the updateTime
	 */
	public Date getUpdateTime() {
		return updateTime;
	}

	/**
	 * @param updateTime the updateTime to set
	 */
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	
}
