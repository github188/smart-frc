package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.wifi.WIFITerminal;
import cn.com.inhand.statistic.dto.CountStatistic;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * Created by Jerolin on 6/12/2014.
 */
public interface WifiTerminalDAO {
	public long getTotalTerminals(ObjectId oId);

	public long getNewTerminals(ObjectId oId, Date startTime, Date endTime);

	long getTotalOnlineTerminals(ObjectId oId, Date startTime);

	void addNewTerminal(ObjectId oId, WIFITerminal terminal);

	WIFITerminal getTerminal(ObjectId oId, String mac);

	void updateTerminal(ObjectId oId, WIFITerminal terminal);

	Set<String> getTerminalMacs(ObjectId oId);

	List<CountStatistic> getNewTerminalsStat(ObjectId oId, Date startTime, Date endTime);

	List<CountStatistic> getTotalTerminalsStat(ObjectId oId, Date startTime, Date endTime);

	List<CountStatistic> getOnlineTerminalsStat(ObjectId oId, Date startTime, Date endTime);

	void updateTotalTerminals(ObjectId oId, Date date, long count);

	void updateNewTerminals(ObjectId oId, Date date, long count);

	void updateOnlineTerminals(ObjectId oId, Date date, long count);

	void incWifiWeeklyActiveTerminals(ObjectId oId, Date date, int Count);

	long getDailyTotalOnlineCount(ObjectId oId, Date date);

	void updateDailyOnlineCount(ObjectId oId, Date date, long count);

	List<CountStatistic> getWeeklyActiveTerminalsStat(ObjectId oId, Date startTime, Date endTime);
}
