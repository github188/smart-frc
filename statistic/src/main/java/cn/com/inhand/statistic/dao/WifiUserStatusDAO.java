package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import org.bson.types.ObjectId;

import java.util.List;
import java.util.Map;

/**
 * Created by Jerolin on 6/27/2014.
 */
public interface WifiUserStatusDAO {
	public void saveNewOnlineUser(ObjectId oId, TerminalAccess access);
	public void updateUserOfflineStatus(ObjectId oId, TerminalAccess access);
	public void updateUserStatus(ObjectId oId, TerminalAccess access);
	public List<Map> getUserStatusOfDevice(ObjectId oId, ObjectId deviceId);
	public String getNameOfWifiUser(ObjectId oId, ObjectId userId);
	public void cleanUserStatus(ObjectId oId);
}
