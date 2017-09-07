package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.statistic.dao.WifiStatDAO;
import cn.com.inhand.statistic.dto.WifiStatDTO;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

/**
 * WIFI user statistic controller, contains all WIFI user count statistic API.
 * Created by Jerolin on 6/9/2014.
 */
@Controller
@RequestMapping("api/wifi")
public class WiFiStatisticController extends HandleExceptionController {
	private static final Logger LOG = LoggerFactory.getLogger(WiFiStatisticController.class);

	@Autowired
	private WifiStatDAO statDAO;

	@RequestMapping(value = "/stat", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWifiStatByTypes(@RequestParam("oid") ObjectId oId,
	                          @RequestParam Integer[] types,
	                          @RequestParam(required = false, value = "object_id") ObjectId objectId,
	                          @RequestParam("start_time") Date startTime,
	                          @RequestParam("end_time") Date endTime) {
		LOG.debug("get wifi stat of types {}, start {}, end {}", types, startTime, endTime);
		List<WifiStatDTO> stats = statDAO.getValueAsArray(oId, startTime, endTime, objectId, types);
		return new OnlyResultDTO(stats);
	}
}
