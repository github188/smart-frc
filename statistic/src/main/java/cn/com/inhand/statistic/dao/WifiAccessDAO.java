package cn.com.inhand.statistic.dao;

import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Jerolin on 6/27/2014.
 */
public interface WifiAccessDAO {
	public List<Map> getTermimalAccess(ObjectId oId, String mac, Date start, Date end, int cursor, int limit);
	public long getTermimalAccessCount(ObjectId oId, String mac, Date start, Date end);
	public List<Map> getUserAccess(ObjectId oId, ObjectId userId, Date start, Date end, int cursor, int limit);
	public long getUserAccessCount(ObjectId oId, ObjectId userId, Date start, Date end);
}
