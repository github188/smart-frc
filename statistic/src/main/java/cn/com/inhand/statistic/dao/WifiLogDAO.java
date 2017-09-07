package cn.com.inhand.statistic.dao;

import com.mongodb.gridfs.GridFSDBFile;
import org.bson.types.ObjectId;

import java.util.Date;

/**
 * Created by Jerolin on 7/1/2014.
 */
public interface WifiLogDAO {

	public GridFSDBFile getWifiLog(ObjectId oId, ObjectId deviceId, Date startTime, Date endTime, int skip);
	public long getWifiLogCount(ObjectId oId, ObjectId deviceId, Date startTime, Date endTime);
}
