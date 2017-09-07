package cn.com.inhand.statistic.dao;

import org.bson.types.ObjectId;

import java.util.List;
import java.util.Map;

@SuppressWarnings("rawtypes")
public interface TimeDataDao {
	public Map<String, Map<String, String>> getRealTimeDataFromRTData(ObjectId oId, ObjectId deviceId, int timePrecise);
	public List<Map<String, String>> getRealTimeDataFromData(ObjectId oId, ObjectId deviceId, List<String> varIds, Long timestamp, int timePrecise);
	public Map<String, List<Map>> getHistoryDataFromData(ObjectId oId, ObjectId deviceId, List<String> varIds, Long startTime, Long endTime, int timePrecise);
	public List<Map<String, String>> changeRTDataFormat(Map<String, Map<String, String>> mapData, List<String> varIds);
	public List<Map<String, Object>> changeVarsDataFormat(Map<String, List<Map>> varDataList, int timePrecise);
	
}
