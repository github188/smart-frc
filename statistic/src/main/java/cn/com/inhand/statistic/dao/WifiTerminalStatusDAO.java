package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Jerolin on 6/27/2014.
 */
public interface WifiTerminalStatusDAO {
	public void saveNewOnlineTerminal(ObjectId oId, TerminalAccess access);
	public void updateTerminalOfflineStatus(ObjectId oId, TerminalAccess access);
	public void updateTerminalStatus(ObjectId oId, TerminalAccess access);
	public List<Map> getTerminalStatusOfDevice(ObjectId oId, ObjectId deviceId);
	public void cleanTerminalStatus(ObjectId oId);
	public Long updateTerminalStayTime(ObjectId oId, String mac, Date date, long time);
	public void cleanTerminalStayTime(ObjectId oId);
}
