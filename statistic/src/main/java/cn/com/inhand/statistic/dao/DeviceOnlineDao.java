package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.dto.OnlyResultDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface DeviceOnlineDao {

    public OnlyResultDTO getDeviceOnlineData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime);

}
