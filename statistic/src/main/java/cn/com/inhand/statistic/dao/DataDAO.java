package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.dto.OnlyResultDTO;
import org.bson.types.ObjectId;

import java.util.ArrayList;

public interface DataDAO {
    public OnlyResultDTO getDeviceHistoryData(ObjectId oId, ObjectId deviceId, ArrayList<String> varIds, int startTime, int endTime);
}
