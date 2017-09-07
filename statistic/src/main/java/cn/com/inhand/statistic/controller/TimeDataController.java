package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.statistic.dao.TimeDataDao;
import cn.com.inhand.statistic.dto.TimeDataListRequestBody;
import cn.com.inhand.statistic.dto.TimeDataParametsBean;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("api")
public class TimeDataController extends HandleExceptionController {

	@Autowired
	TimeDataDao timeDataService;

	@RequestMapping(value = "/rt_data", method = RequestMethod.POST)
	public
	@ResponseBody
	Object getRealTimeData(
			@RequestParam("access_token") String accessToken,
			@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
			@RequestParam(value = "oid", required = true) ObjectId oId,
			@RequestParam(required = false, value = "timestamp") Long timestamp,
			@RequestParam(required = false, value = "time_precise", defaultValue = "0") int timePrecise,
			@RequestBody TimeDataListRequestBody rtDataListRequestBody) {
		List<LinkedHashMap<String, Object>> rtData = new ArrayList<LinkedHashMap<String, Object>>();
		List<TimeDataParametsBean> devices = rtDataListRequestBody.getDevices();
		if (devices != null && devices.size() > 0) {
			if (timestamp == null || timestamp >= DateUtils.getUTC()) {
				for (TimeDataParametsBean rtDataBean : devices) {
					LinkedHashMap<String, Object> tempMap = new LinkedHashMap<String, Object>();
					ObjectId deviceId = rtDataBean.getDeviceId();
					tempMap.put("deviceId", deviceId);
					tempMap.put("vars", timeDataService.changeRTDataFormat(timeDataService.getRealTimeDataFromRTData(oId, deviceId, timePrecise), rtDataBean.getVarIds()));
					rtData.add(tempMap);
				}
			} else {
				for (TimeDataParametsBean rtDataBean : devices) {
					LinkedHashMap<String, Object> tempMap = new LinkedHashMap<String, Object>();
					ObjectId deviceId = rtDataBean.getDeviceId();
					List<Map<String, String>> historyData = timeDataService.getRealTimeDataFromData(oId, deviceId, rtDataBean.getVarIds(), timestamp, timePrecise);
					tempMap.put("deviceId", deviceId);
					tempMap.put("vars", historyData);
					rtData.add(tempMap);
				}
			}
		}
		OnlyResultDTO result = new OnlyResultDTO();
		result.setResult(rtData);
		return result;
	}

	@RequestMapping(value = "/data", method = RequestMethod.POST)
	public
	@ResponseBody
	Object getHistoryData(@RequestParam("access_token") String accessToken,
	                      @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
	                      @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
	                      @RequestHeader(value = "X-API-IP", required = false) String xIp,
	                      @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
	                      @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
	                      @RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
	                      @RequestParam(value = "oid", required = true) ObjectId oId,
	                      @RequestParam(required = false, value = "start_time") Long startTime,
	                      @RequestParam(required = false, value = "end_time") Long endTime,
	                      @RequestParam(required = false, value = "time_precise", defaultValue = "0") int timePrecise,
	                      @RequestBody TimeDataListRequestBody rtDataListRequestBody) {
		List<LinkedHashMap<String, Object>> rtData = new ArrayList<LinkedHashMap<String, Object>>();
		List<TimeDataParametsBean> devices = rtDataListRequestBody.getDevices();
		for (TimeDataParametsBean timeDataBean : devices) {
			LinkedHashMap<String, Object> tempLinkedMap = new LinkedHashMap<String, Object>();
			ObjectId deviceId = timeDataBean.getDeviceId();
			List<Map<String, Object>> varsData = timeDataService.changeVarsDataFormat(timeDataService.getHistoryDataFromData(oId, deviceId, timeDataBean.getVarIds(), startTime, endTime, timePrecise), timePrecise);
			tempLinkedMap.put("deviceId", deviceId);
			tempLinkedMap.put("vars", varsData);
			rtData.add(tempLinkedMap);
		}
		OnlyResultDTO result = new OnlyResultDTO();
		result.setResult(rtData);
		return result;
	}
}
