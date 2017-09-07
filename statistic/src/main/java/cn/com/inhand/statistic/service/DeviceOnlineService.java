package cn.com.inhand.statistic.service;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.DeviceOnlineDao;
import cn.com.inhand.statistic.dto.DeviceOnlineState;
import cn.com.inhand.statistic.model.DeviceStatusBean;
import cn.com.inhand.statistic.util.DeviceOnlineStatsUtil;
import org.apache.commons.collections.IteratorUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DeviceOnlineService extends MongoService implements DeviceOnlineDao {

	@SuppressWarnings("unchecked")
	@Override
	public OnlyResultDTO getDeviceOnlineData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime) {
		OnlyResultDTO resule = new OnlyResultDTO();
		endTime = checkTime(endTime) + 1;

		ArrayList<LinkedHashMap<String, Object>> resultData = new ArrayList<LinkedHashMap<String, Object>>();
		Map<ObjectId, ArrayList<DeviceOnlineState>> dataTempMap = new HashMap<ObjectId, ArrayList<DeviceOnlineState>>();
		if (deviceIds != null && deviceIds.size() > 0) {

			// 取得数据集合
			List<DeviceStatusBean> list;
			String reduceFunction = "function(doc, prev){prev.devicestats.push(doc);}";
			String inputCollectionName = Collections.DEVICE_ONLINE_STAT;
			Criteria criteria = Criteria.where("deviceId").in(deviceIds).andOperator(Criteria.where("login").lte(endTime)).orOperator(Criteria.where("logout").gte(startTime), Criteria.where("logout").is(null));
			GroupBy groupBy = GroupBy.key("deviceId").initialDocument("{devicestats: []}").reduceFunction(reduceFunction);
			GroupByResults<DeviceStatusBean> group = factory.getMongoTemplateByOId(oId).group(criteria, inputCollectionName, groupBy, DeviceStatusBean.class);
			list = IteratorUtils.toList(group.iterator());

			// 将数据存入map,以便后面遍历
			if (list != null && list.size() > 0) {
				for (DeviceStatusBean aList : list) {
					dataTempMap.put(aList.getDeviceId(), aList.getDevicestats());
				}
			}
			long nowTime = new Date().getTime() / 1000;
			// 计算---初始化
			for (ObjectId objectId : deviceIds) {
				LinkedHashMap<String, Object> lhm = new LinkedHashMap<String, Object>();
				List<Long[]> dataArray = new ArrayList<Long[]>();
				if (dataTempMap.get(objectId) != null) {
					dataArray = DeviceOnlineStatsUtil.caculateOnlineData(DeviceOnlineStatsUtil.getInitData(dataTempMap.get(objectId), startTime, endTime, nowTime), startTime, endTime, nowTime);
					lhm.put("deviceId", objectId);
					lhm.put("data", dataArray);
				} else {
					dataArray = DeviceOnlineStatsUtil.caculateOnlineData(null, startTime, endTime, nowTime);
					lhm.put("deviceId", objectId);
					lhm.put("data", dataArray);
				}
				resultData.add(lhm);
			}
		}
		resule.setResult(resultData);
		return resule;
	}

	/**
	 * 检查结束时间
	 *
	 * @param endTime
	 * @return
	 */
	private Long checkTime(Long endTime) {
		Long Time = new Date().getTime() / 1000;
		return endTime > Time ? Time : endTime;
	}

}
