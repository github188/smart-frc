package cn.com.inhand.statistic.dao;

import org.bson.types.ObjectId;

import java.util.Date;

/**
 *
 * Created by Jerolin on 6/12/2014.
 */
public interface TerminalAccessDAO {
	public int getTotalUsers(ObjectId oId);
	public int getNewUsers(ObjectId oId, Date startTime, Date endTime);
	public int getOnlineUsers(ObjectId oId, Date startTime, Date endTime);
}
