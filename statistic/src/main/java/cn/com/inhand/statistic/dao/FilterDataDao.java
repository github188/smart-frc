package cn.com.inhand.statistic.dao;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

public interface FilterDataDao {
	
	public Map<String, LinkedHashMap<String, Long>> getHistoryDatas(ObjectId oId, ObjectId deviceId, List<String> varIds, Long timeStamp, Long valid);
	
}
