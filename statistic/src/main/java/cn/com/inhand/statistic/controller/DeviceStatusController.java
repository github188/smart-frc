package cn.com.inhand.statistic.controller;

import java.util.ArrayList;
import java.util.List;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.ResourceIdListRequestBody;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.dn4.utils.DateUtils;
import cn.com.inhand.statistic.dao.DeviceStatusDao;
import cn.com.inhand.statistic.dto.DeviceStatusDTO;
import cn.com.inhand.statistic.util.DeviceOnlineStatsUtil;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/online_stat")
public class DeviceStatusController extends HandleExceptionController {

    @Autowired
    private DeviceStatusDao service;

    private static final Logger logger = LoggerFactory.getLogger(DeviceStatusController.class);

    @RequestMapping(value = "/list", method = RequestMethod.POST)
    public
    @ResponseBody
    Object getDeviceStatusList(
    		@RequestParam(required = false, value = "start_time") Long startTime,
    		@RequestParam(required = false, value = "end_time") Long endTime, 
    		@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId,
    		@RequestBody ResourceIdListRequestBody requestBody) {

        Long nowTime = DateUtils.getUTC();
        Long defaultEndTime = nowTime;
        Long defaultStartTime = nowTime - DeviceOnlineStatsUtil.DAY;

        // 查询起始时间
        if (startTime == null) {
            startTime = defaultStartTime;
        }

        // 查询结束时间
        if (endTime == null) {
            endTime = defaultEndTime;
        }

        // 时间查询条件的校验
//		if (endTime > nowTime) {
//			endTime = defaultEndTime;
//		}
        if (endTime - startTime < 0) {
            logger.error("The end_time mast greater than the start_time!");
            throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, "start_time and end_time");
        }
        
        if(requestBody.getResourceIds()==null||requestBody.getResourceIds().size()<1) {
        	//定义保存计算结果的List
            List<DeviceStatusDTO> resultData = new ArrayList<DeviceStatusDTO>();
        	OnlyResultDTO resule = new OnlyResultDTO();
        	resule.setResult(resultData);
        	return resule;
        }

        //OnlyResultDTO deviceStatus = service.getDeviceStatusData(oId, requestBody.getResourceIds(), startTime, endTime);
        OnlyResultDTO deviceStatus = service.queryDeviceStatusData(oId, requestBody.getResourceIds(), startTime, endTime);
        return deviceStatus;
    }

}
