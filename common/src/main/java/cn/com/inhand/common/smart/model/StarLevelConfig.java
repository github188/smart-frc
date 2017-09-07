package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * 星级配置
 * @author puys
 *
 */
public class StarLevelConfig {

	@Id
    @JsonProperty("_id")
	private ObjectId id;
	
	private ObjectId oid;
	
	private String fourStar;
	
	private String threeStar;
	
	private String twoStar;
	
	private String oneStar;

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public ObjectId getOid() {
		return oid;
	}

	public void setOid(ObjectId oid) {
		this.oid = oid;
	}

	public String getFourStar() {
		return fourStar;
	}

	public void setFourStar(String fourStar) {
		this.fourStar = fourStar;
	}

	public String getThreeStar() {
		return threeStar;
	}

	public void setThreeStar(String threeStar) {
		this.threeStar = threeStar;
	}

	public String getTwoStar() {
		return twoStar;
	}

	public void setTwoStar(String twoStar) {
		this.twoStar = twoStar;
	}

	public String getOneStar() {
		return oneStar;
	}

	public void setOneStar(String oneStar) {
		this.oneStar = oneStar;
	}
	
	
}
