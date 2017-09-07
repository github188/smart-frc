package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.dto.OnlyResultDTO;
import org.bson.types.ObjectId;

import java.util.List;

public interface SignalDAO {
    public OnlyResultDTO getDevicesSignalStatistic(ObjectId oId, List<ObjectId> deviceIds, int startTime, int endTime);
}
