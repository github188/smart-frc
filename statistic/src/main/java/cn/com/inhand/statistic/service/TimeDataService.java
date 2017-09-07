package cn.com.inhand.statistic.service;

import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.TimeDataDao;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TimeDataService extends MongoService implements TimeDataDao {

	private static String collectionTRDataName = Collections.REALTIME_DATA;
	private static String collectionDataName = Collections.HISTORY_DATA;

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Map<String, String>> getRealTimeDataFromRTData(ObjectId oId, ObjectId deviceId, int timePrecise) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = Query.query(Criteria.where("deviceId").is(deviceId));
		query.fields().exclude("_id").exclude("sensorId").exclude("deviceId");
		Map<String, Map<String, String>> trDataMap = (Map<String, Map<String, String>>) template.findOne(query, Map.class, collectionTRDataName);
		if (trDataMap != null && trDataMap.size() > 0) {
			for (String str : trDataMap.keySet()) {
				if (timePrecise == 0) {
					trDataMap.get(str).remove("timestampUs");
				} else if (timePrecise == 1) {
					trDataMap.get(str).remove("timestamp");
				} else {
					throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "time_precise");
				}
			}
		}
		return trDataMap;
	}

	@SuppressWarnings("unchecked")
	@Override
	public List<Map<String, String>> getRealTimeDataFromData(ObjectId oId, ObjectId deviceId, List<String> varIds, Long timestamp, int timePrecise) {
		List<Map<String, String>> dataList = new ArrayList<Map<String, String>>();
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		if (varIds != null && varIds.size() > 0) {
			for (String varId : varIds) {
				Criteria criteria = Criteria.where("deviceId").is(deviceId)
						.andOperator(Criteria.where("timestamp").lte(new Date(timestamp * 1000)), Criteria.where("id").is(varId));
				Query query = Query.query(criteria);
				query.fields().exclude("_id").exclude("sensorId").exclude("createTime").exclude("endTime").exclude("deviceId");
				if (timePrecise == 0) {
					query.fields().exclude("timestampUs");
				} else if (timePrecise == 1) {
					query.fields().exclude("timestamp");
				} else {
					throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "time_precise");
				}
				dataList.add(template.findOne(query, Map.class, collectionDataName));
			}
		}
		return dataList;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public Map<String, List<Map>> getHistoryDataFromData(ObjectId oId, ObjectId deviceId, List<String> varIds, Long startTime, Long endTime, int timePrecise) {
		Map<String, List<Map>> historyList = new HashMap<String, List<Map>>();
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		if (varIds != null && varIds.size() > 0) {
			for (String varId : varIds) {
				Criteria criteria = Criteria.where("deviceId").is(deviceId)
						.andOperator(Criteria.where("timestamp").lte(new Date(endTime * 1000)),
								Criteria.where("timestamp").gte(new Date(startTime * 1000)),
								Criteria.where("id").is(varId));
				Query query = Query.query(criteria);
				if (timePrecise == 0) {
					query.fields().exclude("timestampUs");
				} else if (timePrecise == 1) {
					query.fields().exclude("timestamp");
				} else {
					throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "time_precise");
				}
				List<Map> tempmap = template.find(query, Map.class, collectionDataName);
				historyList.put(varId, tempmap);
			}
		}
		return historyList;
	}

	/**
	 * 转换实时数据的格式
	 *
	 * @param mapData
	 * @return
	 */
	@Override
	public List<Map<String, String>> changeRTDataFormat(Map<String, Map<String, String>> mapData, List<String> varIds) {
		List<Map<String, String>> trData = new ArrayList<Map<String, String>>();
		if (varIds != null && varIds.size() > 0) {
			for (String varId : varIds) {
				Map<String, String> tempMap = new HashMap<String, String>();
				if (mapData != null && mapData.size() > 0 && mapData.get(varId) != null) {
					tempMap = mapData.get(varId);
				}
				tempMap.put("id", varId);
				trData.add(tempMap);
			}
		}
		return trData;
	}

	@SuppressWarnings("rawtypes")
	@Override
	public List<Map<String, Object>> changeVarsDataFormat(Map<String, List<Map>> varDataList, int timePrecise) {
		List<Map<String, Object>> varsData = new ArrayList<Map<String, Object>>();
		if (varDataList != null && varDataList.size() > 0) {
			for (String varId : varDataList.keySet()) {
				Map<String, Object> tempMap = new HashMap<String, Object>();
				List<Object[]> tempVarsList = new ArrayList<Object[]>();
				List<Map> tempList = varDataList.get(varId);
				if (tempList != null && tempList.size() > 0) {
					if (timePrecise == 0) {
						for (Map Tempmap : tempList) {
							tempVarsList.add(new Object[]{Tempmap.get("timestamp"), Tempmap.get("value")});
						}
					} else if (timePrecise == 1) {
						for (Map Tempmap : tempList) {
							tempVarsList.add(new Object[]{Tempmap.get("timestampUs"), Tempmap.get("value")});
						}
					} else {
						throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "time_precise");
					}
					tempMap.put("varId", tempList.get(0).get("id"));
					tempMap.put("values", tempVarsList);
					varsData.add(tempMap);
				}
			}
		}
		return varsData;
	}

}
