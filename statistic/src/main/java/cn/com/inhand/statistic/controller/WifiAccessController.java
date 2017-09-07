package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.statistic.dao.WifiAccessDAO;
import cn.com.inhand.statistic.dao.WifiTerminalStatusDAO;
import cn.com.inhand.statistic.dao.WifiUserStatusDAO;
import cn.com.inhand.statistic.dao.WifiUserTrafficDAO;
import cn.com.inhand.statistic.dto.WifiUserTrafficRequest;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * WIFI user statistic controller, contains all WIFI user count statistic API.
 * Created by Jerolin on 6/9/2014.
 */
@Controller
@RequestMapping("api")
public class WifiAccessController extends HandleExceptionController {
	private static final Logger LOG = LoggerFactory.getLogger(WifiAccessController.class);

	@Autowired
	WifiUserStatusDAO userStatusDAO;

	@Autowired
	WifiUserTrafficDAO trafficDAO;

	@Autowired
	WifiAccessDAO accessDAO;

	@Autowired
	WifiTerminalStatusDAO terminalStatusDAO;

	@RequestMapping(value = "/wifi/user/traffic", method = RequestMethod.POST)
	public
	@ResponseBody
	Object getWifiUsersTrafficOfMonth(
			@RequestParam(value = "oid", required = true) ObjectId oId,
			@RequestBody WifiUserTrafficRequest body) {
		LOG.debug("get users traffic.");
		List<Map> stats = trafficDAO.getTrafficByUserIds(oId, body.getUserIds());
		return new OnlyResultDTO(stats);
	}

	@RequestMapping(value = "/device/{id}/users", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWifiUsersOfDevice(
			@PathVariable ObjectId id,
			@RequestParam(value = "oid", required = true) ObjectId oId) {
		LOG.debug("get current users in device {}", id);
		List<Map> stats = userStatusDAO.getUserStatusOfDevice(oId, id);
		for (Map stat : stats) {
			ObjectId userId = (ObjectId) stat.get("userId");
			if (userId != null) {
				String username = userStatusDAO.getNameOfWifiUser(oId, userId);
				stat.put("name", username);
			}
		}
		return new OnlyResultDTO(stats);
	}

	@RequestMapping(value = "/device/{id}/terminals", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWifiTermiinalsOfDevice(
			@PathVariable ObjectId id,
			@RequestParam(value = "oid", required = true) ObjectId oId) {
		LOG.debug("get current users in device {}", id);
		List<Map> stats = terminalStatusDAO.getTerminalStatusOfDevice(oId, id);
		return new OnlyResultDTO(stats);
	}

	@RequestMapping(value = "/wifi/access/user", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getUserAccessHistory(
			@RequestParam ObjectId id,
			@RequestParam("start_time") Date startTime,
			@RequestParam("end_time") Date endTime,
			@RequestParam(defaultValue = "0") int cursor,
			@RequestParam(defaultValue = "30") int limit,
			@RequestParam(value = "oid") ObjectId oId) {
		LOG.debug("get user access history ", id);
		List<Map> stats = accessDAO.getUserAccess(oId, id, startTime, endTime, cursor, limit);
		long total = accessDAO.getUserAccessCount(oId, id, startTime, endTime);
		return new BasicResultDTO(total, cursor, limit, stats);
	}


	@RequestMapping(value = "/wifi/access/terminal", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getTerminalAccessHistory(
			@RequestParam String mac,
			@RequestParam("start_time") Date startTime,
			@RequestParam("end_time") Date endTime,
			@RequestParam(defaultValue = "0") int cursor,
			@RequestParam(defaultValue = "30") int limit,
			@RequestParam(value = "oid") ObjectId oId) {
		LOG.debug("get terminal access history ", mac);
		List<Map> stats = accessDAO.getTermimalAccess(oId, mac, startTime, endTime, cursor, limit);
		long total = accessDAO.getTermimalAccessCount(oId, mac, startTime, endTime);
		return new BasicResultDTO(total, cursor, limit, stats);
	}
}
