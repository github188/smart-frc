package cn.com.inhand.statistic.dto;

import org.bson.types.ObjectId;

import java.util.List;

/**
 * Created by Jerolin on 7/13/2014.
 */
public class WifiStatDTO {
	private int type;
	private ObjectId objectId;
	private List<List<Long>> values;

	public WifiStatDTO(int type, ObjectId siteId, List<List<Long>> values) {
		this.type = type;
		this.objectId = siteId;
		this.values = values;
	}

	public ObjectId getObjectId() {
		return objectId;
	}

	public void setObjectId(ObjectId objectId) {
		this.objectId = objectId;
	}

	public List<List<Long>> getValues() {
		return values;
	}

	public void setValues(List<List<Long>> values) {
		this.values = values;
	}

	public int getType() {

		return type;
	}

	public void setType(int type) {
		this.type = type;
	}
}
