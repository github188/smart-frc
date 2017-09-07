package cn.com.inhand.common.model.wifi.wechat;

import java.util.Date;

public class WhiteList {
	
	private String value;
	
	private Date createTime;
	
	private int type;  //1 wechat 2 sina 3 qq   

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}
	
	

}
