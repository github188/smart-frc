package cn.com.inhand.common.model.wifi;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class SmsConfig {
	
    private String url;
    private String httpBody;
    private String httpMethod;
	private String account;
	private String passwd;
	private String content;
	private String provider;
    private Date createTime;
    private Integer state;
    private List<SmsContent> smscontent;
    
    public String getProvider() {
		return provider;
	}


	public SmsConfig() {
    	smscontent = new ArrayList<SmsContent>();
    }
    
	
	public List<SmsContent> getSmscontent() {
		return smscontent;
	}

	public void setSmscontent(List<SmsContent> smscontent) {
		this.smscontent = smscontent;
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
	 * @return the url
	 */
	public String getUrl() {
		return url;
	}
	/**
	 * @param url the url to set
	 */
	public void setUrl(String url) {
		this.url = url;
	}
	/**
	 * @return the httpBody
	 */
	public String getHttpBody() {
		return httpBody;
	}
	/**
	 * @param httpBody the httpBody to set
	 */
	public void setHttpBody(String httpBody) {
		this.httpBody = httpBody;
	}
	/**
	 * @return the httpMethod
	 */
	public String getHttpMethod() {
		return httpMethod;
	}
	/**
	 * @param httpMethod the httpMethod to set
	 */
	public void setHttpMethod(String httpMethod) {
		this.httpMethod = httpMethod;
	}
	/**
	 * @return the account
	 */
	public String getAccount() {
		return account;
	}
	/**
	 * @param account the account to set
	 */
	public void setAccount(String account) {
		this.account = account;
	}
	/**
	 * @return the passwd
	 */
	public String getPasswd() {
		return passwd;
	}
	/**
	 * @param passwd the passwd to set
	 */
	public void setPasswd(String passwd) {
		this.passwd = passwd;
	}
	/**
	 * @return the content
	 */
	public String getContent() {
		return content;
	}
	/**
	 * @param content the content to set
	 */
	public void setContent(String content) {
		this.content = content;
	}
	/**
	 * @return the provider
	 
	public String getProvider() {
		return provider;
	}
	/**
	 * @param provider the provider to set
	 */
	public void setProvider(String provider) {
		this.provider = provider;
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
    
    
    
 
}
