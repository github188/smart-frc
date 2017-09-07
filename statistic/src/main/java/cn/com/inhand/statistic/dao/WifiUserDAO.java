package cn.com.inhand.statistic.dao;

import cn.com.inhand.statistic.dto.CountStatistic;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

/**
 *
 * Created by Jerolin on 6/12/2014.
 */
public interface WifiUserDAO {
	public long getTotalUsers(ObjectId oId);
	public long getNewUsers(ObjectId oId, Date startTime, Date endTime);
	public long getDailyTotalOnlineCount(ObjectId oId, Date date);
	public long getTotalOnlineUsers(ObjectId oId, Date startTime);
	public List<CountStatistic> getNewUsersStat(ObjectId oId, Date startTime, Date endTime);
	public List<CountStatistic> getTotalUsersStat(ObjectId oId, Date startTime, Date endTime);
	public List<CountStatistic> getOnlineUsersStat(ObjectId oId, Date startTime, Date endTime);
	public void updateTotalUsers(ObjectId oId, Date date, long count);
	public void updateNewUsers(ObjectId oId, Date date, long count);
	public void updateOnlineUsers(ObjectId oId, Date date, long count);
	public void updateDailyOnlineCount(ObjectId oId, Date date, long count);
	public void incWIFIWeeklyActiveUsers(ObjectId oId, Date date, int Count);
	public List<CountStatistic> getWeeklyActiveUsersStat(ObjectId oId, Date startTime, Date endTime);
}
