package cn.com.inhand.statistic.dao;

import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 *
 * Created by Jerolin on 6/27/2014.
 */
public interface WifiUserTrafficDAO {
	public Long saveTraffic(ObjectId oId, ObjectId userId, long tx, long rx, Date date, long time);
	public List<Map> getTrafficByUserIds(ObjectId oId, List<ObjectId> userIds);
	public Long updateUserAccessInterval(ObjectId oId, ObjectId userId, Date date, long interval);
}
