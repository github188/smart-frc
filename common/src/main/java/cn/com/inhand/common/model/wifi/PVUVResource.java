package cn.com.inhand.common.model.wifi;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 6/23/2014.
 */
public class PVUVResource {
	@JsonProperty("_id")
	private ObjectId id;
	private String rId;
	private String rName;
	private String tId;
	private Date updateTime;
	private PVUVStatistic current;
	private PVUVStatistic last;
	private PVUVStatistic total;

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getrId() {
		return rId;
	}

	public void setrId(String rId) {
		this.rId = rId;
	}

	public String getrName() {
		return rName;
	}

	public void setrName(String rName) {
		this.rName = rName;
	}

	public String gettId() {
		return tId;
	}

	public void settId(String tId) {
		this.tId = tId;
	}

	public PVUVStatistic getCurrent() {
		return current;
	}

	public void setCurrent(PVUVStatistic current) {
		this.current = current;
	}

	public PVUVStatistic getLast() {
		return last;
	}

	public void setLast(PVUVStatistic last) {
		this.last = last;
	}

	public PVUVStatistic getTotal() {
		return total;
	}

	public void setTotal(PVUVStatistic total) {
		this.total = total;
	}

}
