package cn.com.inhand.statistic.controller;

import java.util.List;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.ResourceIdListRequestBody;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.statistic.dao.SignalDAO;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Controller
@RequestMapping(value = "api2/signal")
public class SignalController extends HandleExceptionController {

    @Autowired
    private SignalDAO service;

    private static final Logger logger = LoggerFactory.getLogger(SignalController.class);

    @RequestMapping(value = "", method = RequestMethod.POST)
    public
    @ResponseBody
    Object getDeviceSignalList(
    		@RequestParam("start_time") int startTime, 
    		@RequestParam("end_time") int endTime,
    		@RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
			@RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
			@RequestHeader(value = "X-API-IP", required = false) String xIp,
			@RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
			@RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
			@RequestHeader(value = "X-API-ROLE-TYPE", required = true) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId,
    		@RequestBody ResourceIdListRequestBody body, 
    		HttpServletRequest request, HttpServletResponse response) throws Exception {
        logger.debug("Get Device Signal, device id " + body.getResourceIds());
        OnlyResultDTO signalResult = service.getDevicesSignalStatistic(oId, body.getResourceIds(), startTime, endTime);
        return signalResult;
    }
}
