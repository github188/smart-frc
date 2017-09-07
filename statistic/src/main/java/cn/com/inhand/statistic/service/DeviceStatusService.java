package cn.com.inhand.statistic.service;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.dn4.utils.DateUtils;
import cn.com.inhand.statistic.dao.DeviceStatusDao;
import cn.com.inhand.statistic.dto.DeviceFirstLoginBean;
import cn.com.inhand.statistic.dto.DeviceOnlineState;
import cn.com.inhand.statistic.dto.DeviceStatusDTO;
import cn.com.inhand.statistic.model.DeviceStatusBean;
import cn.com.inhand.statistic.util.DeviceOnlineStatsUtil;
import org.apache.commons.collections.IteratorUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import java.math.BigDecimal;
import java.util.*;

import static cn.com.inhand.common.service.Collections.DEVICE_ONLINE_STAT;
import static org.springframework.data.mongodb.core.mapreduce.GroupBy.*;
import static org.springframework.data.mongodb.core.query.Criteria.*;

@Service
public class DeviceStatusService extends MongoService implements DeviceStatusDao {

	private static final Logger LOGGER = LoggerFactory.getLogger(DeviceStatusService.class);
	String collectionName = DEVICE_ONLINE_STAT;

	@SuppressWarnings("unchecked")
	@Override
	public OnlyResultDTO getDeviceStatusData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime) {
		endTime = checkTime(endTime) + 1;
		OnlyResultDTO resule = new OnlyResultDTO();
		List<DeviceStatusDTO> resultData = new ArrayList<DeviceStatusDTO>();
		Map<ObjectId, ArrayList<DeviceOnlineState>> dataTempMap = new HashMap<ObjectId, ArrayList<DeviceOnlineState>>();
		if (deviceIds != null && deviceIds.size() > 0) {

			// 取得数据集合
			List<DeviceStatusBean> list = new ArrayList<DeviceStatusBean>();
			String reduceFunction = "function(doc, prev){prev.devicestats.push(doc);}";
			String inputCollectionName = DEVICE_ONLINE_STAT;
			Criteria criteria = where("deviceId").in(deviceIds)
					.andOperator(where("login").lte(endTime))
					.orOperator(where("logout").gte(startTime), where("logout").is(null));
			GroupBy groupBy = key("deviceId").initialDocument("{devicestats: []}").reduceFunction(reduceFunction);
			GroupByResults<DeviceStatusBean> group = factory.getMongoTemplateByOId(oId).group(criteria, inputCollectionName, groupBy, DeviceStatusBean.class);
			list = IteratorUtils.toList(group.iterator());

			// 将数据存入map,以便后面遍历
			if (list != null && list.size() > 0) {
				for (DeviceStatusBean aList : list) {
					dataTempMap.put(aList.getDeviceId(), aList.getDevicestats());
				}
			}

			long nowTime = new Date().getTime() / 1000;
			// 计算---解决了顺序问题
			for (ObjectId objectId : deviceIds) {
				if (dataTempMap.get(objectId) != null) {
					resultData.add(DeviceOnlineStatsUtil.getCalculateData(DeviceOnlineStatsUtil.getInitData(dataTempMap.get(objectId), startTime, endTime, nowTime), objectId.toString(), endTime, nowTime));
				} else {
					resultData.add(DeviceOnlineStatsUtil.getCalculateData(null, objectId.toString(), endTime, nowTime));
				}
			}
		}
		resule.setResult(resultData);
		return resule;
	}

	public OnlyResultDTO queryDeviceStatusData(ObjectId oId, List<ObjectId> deviceIds, Long startTime, Long endTime) {

		endTime = checkTime(endTime) + 1;
		/*Criteria criteria = Criteria.where("deviceId").in(deviceIds).andOperator(Criteria.where("login").gte(startTime).and("logout").lte(endTime))
				                     .orOperator(Criteria.where("login").lte(startTime).and("logout").gte(startTime))
    			                     .orOperator(Criteria.where("login").lte(endTime).and("logout").gte(endTime))
    			                     .orOperator(Criteria.where("logout").is(null));*/

		Criteria criteria1 = where("deviceId").in(deviceIds).orOperator(where("login").gte(startTime).and("logout").lte(endTime),
				where("login").lte(startTime).and("logout").gte(startTime),
				where("login").lte(endTime).and("logout").gte(endTime),
				where("logout").is(null).and("login").lte(endTime));

		GroupBy groupBy = key("deviceId").initialDocument("{devicestats:[]}").reduceFunction("function(doc, prev){prev.devicestats.push(doc);}");
		GroupByResults<DeviceStatusBean> group = null;
		try {
			//查询在线统计数据
			group = factory.getMongoTemplateByOId(oId).group(criteria1, collectionName, groupBy, DeviceStatusBean.class);
		} catch (Exception e1) {
			if (LOGGER.isErrorEnabled()) {
				LOGGER.error("query the device online status data error!", e1);
			}
			throw new ErrorCodeException(ErrorCode.SYSTEM_ERROR);
		}

		//定义返回的结果集
		OnlyResultDTO result = new OnlyResultDTO();
		//定义保存计算结果的List
		List<DeviceStatusDTO> resultData = new ArrayList<DeviceStatusDTO>();

		Map<ObjectId, Long> firstLoginDataMap = getFirstLoginTime(oId, deviceIds);

		if (group == null || group.getCount() == 0) {
			resultData = getAllDevicesMsg(deviceIds, null, resultData);
			setOfflineDataByNull(resultData, firstLoginDataMap, startTime, endTime);
			result.setResult(resultData);
			return result;
		}

		if (group.getCount() == 0) {
			if (LOGGER.isErrorEnabled()) {
				LOGGER.error("data missed in List<DeviceStatusBean>!");
			}
			resultData = getAllDevicesMsg(deviceIds, null, resultData);
			setOfflineDataByNull(resultData, firstLoginDataMap, startTime, endTime);
			result.setResult(resultData);
			return result;
		}

		long firstLogin = 0;
		long totalTime = endTime - startTime;

		long lastLogout = 0l;
		//遍历List<DeviceStatusBean>，计算结果
		List<DeviceStatusBean> list = new ArrayList<DeviceStatusBean>();
		for (DeviceStatusBean device : group) {
			list.add(device);
			List<DeviceOnlineState> states = device.getDevicestats();
			if (states == null || states.size() == 0) {
				DeviceStatusDTO statusDTO = new DeviceStatusDTO();
				statusDTO.setDeviceId(device.getDeviceId() == null ? "" : device.getDeviceId().toString());
				resultData.add(statusDTO);
				continue;
			}

			//根据登陆时间升序
			java.util.Collections.sort(states, ascSort());

			//处理给定的时间
			//states = dealDatas(states, startTime, endTime);

			List<Long> online = new ArrayList<Long>();
			List<Long> offline = new ArrayList<Long>();
			int exceptionCount = 0;
			boolean hasGetFristLoginTime = false;
			for (int i = 0; i < states.size(); i++) {
				long login = states.get(i).getLogin();
				Long logout = states.get(i).getLogout();
				if (logout == null/* && i == (states.size() - 1)*/) {
					logout = endTime;
				}
				ObjectId deviceId = new ObjectId(states.get(i).getDeviceId());

				if (!hasGetFristLoginTime) {
					try {
						firstLogin = firstLoginDataMap.get(deviceId);
					} catch (Exception e) {
						LOGGER.error("get device:" + deviceId.toString() + " first login time failed " + e.getMessage());
						e.printStackTrace();
					}
					if (startTime < firstLogin) {
						totalTime = endTime - firstLogin;
					}
					hasGetFristLoginTime = true;
				}

				if (i == 0) {
					if (firstLogin <= startTime && startTime < login) {
						offline.add(login - startTime);
					}
				} else if (i == (states.size() - 1) && i != 0) {
					offline.add(login - lastLogout);
					if (logout < endTime) {
						offline.add(endTime - logout);
					}
				} else {
					offline.add(login - lastLogout);
				}
				
				if (states.size()==1&&logout!=null&&logout<endTime) {
					offline.add(endTime - logout);
				}

				if (states.get(i).getException() == 1) {
					exceptionCount++;
				}

				if (startTime <= login && endTime < logout) {
					online.add(endTime - login);
				} else if (login <= startTime && endTime <= logout) {
					online.add(endTime - startTime);
				} else if (login <= startTime && logout < endTime) {
					online.add(logout - startTime);
				} else {
					online.add(logout - login);
				}
/*    			if(login < startTime && startTime < logout){
					online.add(logout - startTime);
				}else{
					online.add(logout - login);
				}*/
				lastLogout = logout;
			}

			//根据计算结果封装数据
			DeviceStatusDTO statusDTO = bulidData(device.getDeviceId().toString(), exceptionCount, online, offline, states.size(), totalTime, firstLogin);
			resultData.add(statusDTO);
		}
		resultData = getAllDevicesMsg(deviceIds, list, resultData);
		result.setResult(resultData);
		return result;
	}

	public void setOfflineDataByNull(List<DeviceStatusDTO> resultData, Map<ObjectId, Long> firstLoginDataMap, long startTime, long endTime) {
		Assert.notNull(resultData);
		long intervel = endTime - startTime;
		for (DeviceStatusDTO status : resultData) {
			ObjectId deviceId = new ObjectId(status.getDeviceId());
			Long fristLogin = firstLoginDataMap.get(deviceId);
			if (fristLogin != null && endTime > fristLogin && startTime <= endTime) {
				status.setMaxOffline(intervel);
				status.setTotalOffline(intervel);
			}
		}
	}

	@SuppressWarnings("rawtypes")
	public Map<ObjectId, Long> getFirstLoginTime(ObjectId oId, List<ObjectId> deviceIds) {
		Map<ObjectId, Long> firstLoginMap = new HashMap<ObjectId, Long>();
		Criteria criteria1 = where("deviceId").in(deviceIds);
		String reduce = "function(doc, prev){";
		reduce += "if(prev.firstLogin > doc.login){";
		reduce += "prev.firstLogin = doc.login; }";
		reduce += "}";
		GroupBy groupBy = key("deviceId").initialDocument("{ firstLogin : " + DateUtils.getUTC() + " }").reduceFunction(reduce);
		GroupByResults<DeviceFirstLoginBean> group = null;
		try {
			//查询在线统计数据
			group = factory.getMongoTemplateByOId(oId).group(criteria1, DEVICE_ONLINE_STAT, groupBy, DeviceFirstLoginBean.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		if (group != null) {
			for (DeviceFirstLoginBean dflb : group) {
				firstLoginMap.put(dflb.getDeviceId(), dflb.getFirstLogin());
			}
		}
		return firstLoginMap;
	}

	//循环遍历，返回所以结果
	public List<DeviceStatusDTO> getAllDevicesMsg(List<ObjectId> deviceIds, List<DeviceStatusBean> list, List<DeviceStatusDTO> resultData) {

		if (list == null || list.size() < 1) {

			for (ObjectId id : deviceIds) {
				DeviceStatusDTO statusDTO = new DeviceStatusDTO();
				statusDTO.setDeviceId(id == null ? "" : id.toString());
				resultData.add(statusDTO);
			}
		} else {
			if (list.size() < deviceIds.size()) {
				for (ObjectId id : deviceIds) {
					boolean flag = false;
					for (DeviceStatusBean dsb : list) {
						//判断当前结果中不包含的设备
						if (!id.equals(dsb.getDeviceId())) {
							flag = true;

						} else {
							flag = false;
							break;
						}
					}
					if (flag) {
						DeviceStatusDTO statusDTO = new DeviceStatusDTO();
						statusDTO.setDeviceId(id == null ? "" : id.toString());
						resultData.add(statusDTO);
					}
				}
			}
		}
		return resultData;
	}

/*    public List<DeviceOnlineState> dealDatas(List<DeviceOnlineState> states, long starttime, long endtime) {
    	
    	if(states.get(0).getLogin() < starttime) {
    		states.get(0).setLogin(starttime);
    	}
    	if((states.get(states.size()-1).getLogout() == null ? endtime : states.get(states.size()-1).getLogout()) >= endtime) {
    		states.get(states.size()-1).setLogout(endtime);
    	}
    	return states;
    }*/

	public DeviceStatusDTO bulidData(String deviceId, int exceptionCount, List<Long> online, List<Long> offline, long loginCount, long totaltime, long firstlogin) {

		DeviceStatusDTO statusDTO = new DeviceStatusDTO();
		statusDTO.setDeviceId(deviceId);
		statusDTO.setException(exceptionCount);
		statusDTO.setLogin(loginCount);
		statusDTO.setMaxOnline(java.util.Collections.max(online));
		statusDTO.setFirstlogin(firstlogin);

		//若一直在线，则掉线时间为0
		if (offline == null || offline.size() < 1) {
			statusDTO.setMaxOffline(0);
			statusDTO.setTotalOffline(0);
		} else {
			statusDTO.setMaxOffline(java.util.Collections.max(offline));
			statusDTO.setTotalOffline(getSumOfList(offline));
		}
		long totalOnline = getSumOfList(online);
		statusDTO.setTotalOnline(totalOnline);

		//计算在线率，保留4位有效数字
		BigDecimal bd1 = new BigDecimal(Long.toString(totalOnline));
		BigDecimal bd2 = new BigDecimal(Long.toString(totaltime));
		Double avg = bd1.divide(bd2, 4, BigDecimal.ROUND_HALF_UP).doubleValue();

		statusDTO.setOnlineRate(avg);

		return statusDTO;

	}

	public long getSumOfList(List<Long> list) {

		long sum = 0;
		for (long s : list) {
			sum += s;
		}
		return sum;
	}


	public Comparator<DeviceOnlineState> ascSort() {

		Comparator<DeviceOnlineState> comparator = new Comparator<DeviceOnlineState>() {
			@Override
			public int compare(DeviceOnlineState d1, DeviceOnlineState d2) {
				if (d1.getLogin() > d2.getLogin()) {
					return 1;
				} else if (d1.getLogin() < d2.getLogin()) {
					return -1;
				}
				return 0;
			}

		};
		return comparator;
	}


	/**
	 * 检查结束时间
	 *
	 * @param endTime
	 * @return
	 */
	private Long checkTime(Long endTime) {
		Long Time = DateUtils.getUTC();
		return endTime > Time ? Time : endTime;
	}

}
