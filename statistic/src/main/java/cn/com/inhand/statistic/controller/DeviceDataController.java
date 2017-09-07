package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.model.Device;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.Machine;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.statistic.amqp.DataReportedMessageSender;
import cn.com.inhand.statistic.dao.*;
import cn.com.inhand.statistic.dto.FilterDataListRequestBody;
import cn.com.inhand.statistic.dto.RealTimeVariable;
import cn.com.inhand.statistic.dto.ReportedDataBean;
import cn.com.inhand.statistic.dto.TLVData;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.*;

@Controller
@RequestMapping(value = "api/device")
public class DeviceDataController extends HandleExceptionController {

	@Autowired
	DataDAO service;
	@Autowired
	DataReportedMessageSender messageSender;
	@Autowired
	DeviceDAO deviceService;
	@Autowired
	MachineDAO machineService;
	@Autowired
	TokenDAO tokenService;
	@Autowired
	FilterDataDao filterDataDao;
	@Autowired
	DeviceKeyDAO deviceKeyDAO;

	private static final Logger logger = LoggerFactory.getLogger(DeviceDataController.class);

	@RequestMapping(value = "/{id}/data", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getDeviceSignalList(
			@PathVariable("id") ObjectId deviceId,
			@RequestParam("start_time") int startTime,
			@RequestParam("end_time") int endTime,
			@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
			@RequestParam(value = "oid", required = true) ObjectId oId,
			@RequestParam("var_ids") ArrayList<String> varIds) throws Exception {
		logger.debug("Get history data of device " + deviceId + ", var ids " + varIds + ", startTime " + startTime);
		return service.getDeviceHistoryData(oId, deviceId, varIds, startTime, endTime);
	}

	@RequestMapping(value = "/{id}/data", method = RequestMethod.POST)
	public
	@ResponseBody
	Object uploadDeviceData(
			@PathVariable ObjectId id,
			@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = false) Integer roleType,
			@RequestParam(value = "access_token", required = true) String accessToken,
			@RequestParam(value = "oid", required = false) ObjectId oId,
			@Valid @RequestBody ReportedDataBean rReportedDataBean) {

		long nowTimeTemp = System.currentTimeMillis();
//	    DeviceKey deviceKey = deviceKeyDAO.getDeviceKey(key);
		if (oId == null) {
			Token token = tokenService.getTokenByTokenCode(accessToken);
			if (token != null) {
				oId = token.getOid();
			} else {
				throw new ErrorCodeException(ErrorCode.TOKEN_ERROR, accessToken);
			}

			DeviceKey key = tokenService.getDeviceKeyByToken(accessToken);
			if (key == null || !key.getDeviceId().equals(id)) {
				throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
			}
		}
		int plcId = 0;
		ObjectId deviceId = null;
		int sensorId = 0;

		Device device = deviceService.getDeviceById(oId, id);
		if (device != null) {
			plcId = 0;
			deviceId = device.getId();
			sensorId = device.getSensorId();
		} else {
			Machine machine = machineService.getMachineById(oId, id);
			if (machine != null) {
				plcId = machine.getPlcId();
				ObjectId siteId = machine.getSiteId();
				if (siteId != null) {
					device = deviceService.getDeviceBySiteId(oId, siteId);
					if (device != null) {
						deviceId = device.getId();
						sensorId = device.getSensorId();
					} else {
						logger.error("Without gateway who's siteId is :" + siteId);
						throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, siteId);
					}
				} else {
					logger.error("the machine's siteId is null!");
					throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
				}
			} else {
				logger.error("Without machine who's id is :" + id);
				throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
			}
		}

		List<RealTimeVariable> vars = rReportedDataBean.getVars();

		for (RealTimeVariable var : vars) {
			Map<String, Object> message = new HashMap<String, Object>();
			int tag = 0x7010;
			if (var.getIsAliam() != null && var.getIsAliam()) {
				tag = 0x7011;
			} else if (var.getEndTime() != null) {
				tag = 0x7012;
			}
			message.put("tag", tag);
			message.put("startTime", var.getTimestamp());
			message.put("endTime", var.getEndTime());
			message.put("gatewayId", deviceId);
			message.put("oid", oId);
			message.put("sensorId", sensorId);
			message.put("plcId", plcId);
			message.put("timestampUs", var.getTimestampUs());


			TLVData tlvData = new TLVData();
			tlvData.setId(Integer.valueOf(var.getId()));
			tlvData.setType(var.getType());
			tlvData.setValue(var.getValue());

			Date startTime = new Date(var.getTimestamp() * 1000);
			Date endTime = var.getEndTime() == null ? startTime : new Date(var.getEndTime() * 1000);
			messageSender.publishDeviceDataMessage(oId, deviceId, tlvData, startTime, endTime);
			List<TLVData> listData = new ArrayList<TLVData>();
			listData.add(tlvData);
			message.put("data", listData);
			messageSender.publishCreateMessage(oId, deviceId, sensorId, message);
			
			if (Integer.valueOf(var.getId())==310004) {
				Map<String, Object> locmsg = new HashMap<String, Object>();
				locmsg.put("loc", var.getValue());
				locmsg.put("time", var.getTimestampUs());
				locmsg.put("deviceId", id);
				messageSender.publishDeviceLocationMessage(oId, deviceId, sensorId, locmsg);
			}
		}
		logger.debug("Upload datas, total length is : " + vars.size() + " , and use time : " + (System.currentTimeMillis() - nowTimeTemp) + " millisecond.");
		OnlyResultDTO result = new OnlyResultDTO();
		result.setResult("OK");
		return result;
	}

	@RequestMapping(value = "/{id}/data/common", method = RequestMethod.POST)
	public
	@ResponseBody
	Object getHistoryDataByFilter(
			@PathVariable ObjectId id,
			@RequestParam("access_token") String accessToken,
			@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = false) Integer roleType,
			@RequestParam(value = "oid", required = true) ObjectId oId,
			@Valid @RequestBody FilterDataListRequestBody filterDataListRequestBody) {
		LinkedHashMap<String, Object> rtData = new LinkedHashMap<String, Object>();
		List<String> varIds = filterDataListRequestBody.getVarIds();
		List<Long> timestamps = filterDataListRequestBody.getTimestamps();
		List<Map<String, Object>> datas = new ArrayList<Map<String, Object>>();
		Map<String, List<Map<String, Long>>> datasdMap = new HashMap<String, List<Map<String, Long>>>();
		for (Long timestamp : timestamps) {
			Map<String, LinkedHashMap<String, Long>> tempDataMap = filterDataDao.getHistoryDatas(oId, id, varIds, timestamp, filterDataListRequestBody.getRange());
			for (String varId : varIds) {
				if (datasdMap.get(varId) == null) {
					datasdMap.put(varId, new ArrayList<Map<String, Long>>());
				}
				List<Map<String, Long>> dataList = datasdMap.get(varId);
				dataList.add(tempDataMap.get(varId));
			}
		}
		for (String varId : varIds) {
			Map<String, Object> varMap = new HashMap<String, Object>();
			varMap.put("varId", varId);
			varMap.put("data", datasdMap.get(varId));
			datas.add(varMap);
		}
		rtData.put("deviceId", id);
		rtData.put("datas", datas);
		OnlyResultDTO result = new OnlyResultDTO();
		result.setResult(rtData);
		return result;
	}

}
