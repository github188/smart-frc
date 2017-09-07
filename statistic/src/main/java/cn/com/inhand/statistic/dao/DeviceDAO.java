package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.Device;
import org.bson.types.ObjectId;

public interface DeviceDAO {
	
    public Device getDeviceById(ObjectId oId, ObjectId id);

    public Device getDeviceBySiteId(ObjectId oId, ObjectId siteId);

}
