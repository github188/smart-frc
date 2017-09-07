package cn.com.inhand.common.amqp.model;

/**
 * Created by Inhand 
 */
public class WIFIUserSendSmsCode {
	private String oid;
	private String phone;
	private String varificationCode;
	private String language;
	
	
	public String getLanguage() {
		return language;
	}
	public void setLanguage(String language) {
		this.language = language;
	}
	/**
	 * @return the oid
	 */
	public String getOid() {
		return oid;
	}
	/**
	 * @param oid the oid to set
	 */
	public void setOid(String oid) {
		this.oid = oid;
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
	
	
}
