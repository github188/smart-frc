package cn.com.inhand.statistic.service;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.FilterDataDao;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapreduce.MapReduceResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FileterDataService extends MongoService implements FilterDataDao {

	private static final String collectionDataName = Collections.HISTORY_DATA;

	@SuppressWarnings({"unchecked", "rawtypes"})
	@Override
	public Map<String, LinkedHashMap<String, Long>> getHistoryDatas(ObjectId oId, ObjectId deviceId, List<String> varIds, Long timeStamp, Long valid) {
		MongoTemplate template = factory.getMongoTemplateByOId(oId);
		Query query = Query.query(Criteria.where("deviceId").is(deviceId).andOperator(Criteria.where("id").in(varIds), Criteria.where("timestamp").gte(timeStamp - valid), Criteria.where("timestamp").lte(timeStamp + valid)));
		String mapFunction = "function() {emit(this.id, this);}";
		String reduceFunction = "function (key, values) {" +
				"var reduced = null;" +
				"var time = 9999999999;" +
				"values.forEach(function(val) {" +
				"var tempTime = val.timestamp - " + timeStamp + ";" +
				"if(tempTime < 0){" +
				"tempTime *= -1;" +
				"}if(tempTime < time){" +
				"time = tempTime;" +
				"reduced = val;" +
				"}" +
				"});" +
				"return reduced;" +
				"}";
		MapReduceResults<Map> results = template.mapReduce(query, collectionDataName, mapFunction, reduceFunction, Map.class);
		Iterator<Map> iterator = results.iterator();
		Map<String, LinkedHashMap<String, Long>> dataMap = new HashMap<String, LinkedHashMap<String, Long>>();
		for (String varId : varIds) {
			LinkedHashMap<String, Long> temp = new LinkedHashMap<String, Long>();
			temp.put("timestamp", timeStamp);
			temp.put("specificTime", null);
			temp.put("value", null);
			dataMap.put(varId, temp);
		}
		while (iterator.hasNext()) {
			Map<String, Object> output = iterator.next();
			Map<String, Object> valueMap = (Map<String, Object>) output.get("value");
			LinkedHashMap<String, Long> tempHashMap = dataMap.get(output.get("_id").toString());
			tempHashMap.put("specificTime", Long.valueOf(valueMap.get("timestamp").toString()));
			tempHashMap.put("value", Long.valueOf(valueMap.get("value").toString()));
		}
		return dataMap;
	}

}
