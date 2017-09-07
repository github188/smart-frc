package cn.com.inhand.common.model.wifi;

import java.util.ArrayList;
import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class AdPublished {
	
    @Id
    @JsonProperty("_id")
    private ObjectId id;
	private ObjectId adId;
	private ArrayList<String> oids;
	private ArrayList<String> banners;
	private Date createTime;
	
	
	
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public ObjectId getId() {
		return id;
	}
	public void setId(ObjectId id) {
		this.id = id;
	}
	public ObjectId getAdId() {
		return adId;
	}
	public void setAdId(ObjectId adId) {
		this.adId = adId;
	}
	public ArrayList<String> getOids() {
		return oids;
	}
	public void setOids(ArrayList<String> oids) {
		this.oids = oids;
	}
	public ArrayList<String> getBanners() {
		return banners;
	}
	public void setBanners(ArrayList<String> banners) {
		this.banners = banners;
	}
	
	
}
