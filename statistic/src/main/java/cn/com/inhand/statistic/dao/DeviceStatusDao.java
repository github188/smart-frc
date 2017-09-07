package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.dto.OnlyResultDTO;

import org.bson.types.ObjectId;

import java.util.List;

public interface DeviceStatusDao {

    public OnlyResultDTO getDeviceStatusData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime);
    
    public OnlyResultDTO queryDeviceStatusData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime);

}
