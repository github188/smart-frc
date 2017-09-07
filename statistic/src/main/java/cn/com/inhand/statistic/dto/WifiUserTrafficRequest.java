package cn.com.inhand.statistic.dto;

import org.bson.types.ObjectId;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Created by Jerolin on 6/27/2014.
 */
public class WifiUserTrafficRequest {
	@NotNull
	private List<ObjectId> userIds;

	public List<ObjectId> getUserIds() {
		return userIds;
	}

	public void setUserIds(List<ObjectId> userIds) {
		this.userIds = userIds;
	}
}
