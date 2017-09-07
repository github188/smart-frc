package cn.com.inhand.common.model.wifi;


import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import cn.com.inhand.common.model.wifi.wechat.WhiteList;

import com.fasterxml.jackson.annotation.JsonProperty;

public class GlobalPublicConfig {

	@Id
    @JsonProperty("_id")
    private ObjectId id;
	
	private String name;
	
	private String common;
	
	private String commonFront;
	
	private String version;
	
	/*private String ssidPart;
	
	private String loginPart;
	
	private String pushPart;
	
	private String authPart;
	
	private String syncPart;
	
	private String endPart;*/
	
	private LinkedHashMap<String, String> parts;
	
	private Map<String, String> closeParts;  //for example, loginPart,pushPart etc
 	
	private List<WhiteList> whiteList;
	
	private List<WhiteList> blackList;

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getCommon() {
		return common;
	}

	public void setCommon(String common) {
		this.common = common;
	}

	public String getCommonFront() {
		return commonFront;
	}

	public void setCommonFront(String commonFront) {
		this.commonFront = commonFront;
	}

	public List<WhiteList> getWhiteList() {
		return whiteList;
	}

	public void setWhiteList(List<WhiteList> whiteList) {
		this.whiteList = whiteList;
	}

	public List<WhiteList> getBlackList() {
		return blackList;
	}

	public void setBlackList(List<WhiteList> blackList) {
		this.blackList = blackList;
	}

	public Map<String, String> getParts() {
		return parts;
	}

	public void setParts(LinkedHashMap<String, String> parts) {
		this.parts = parts;
	}

	public Map<String, String> getCloseParts() {
		return closeParts;
	}

	public void setCloseParts(Map<String, String> closeParts) {
		this.closeParts = closeParts;
	}
}
