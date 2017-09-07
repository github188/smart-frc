package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.statistic.dao.WifiTerminalDAO;
import cn.com.inhand.statistic.dao.WifiUserDAO;
import cn.com.inhand.statistic.dto.CountStatistic;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * WIFI user statistic controller, contains all WIFI user count statistic API.
 * Created by Jerolin on 6/9/2014.
 */
@Controller
@RequestMapping("api/stat")
public class WiFiUserStatisticController extends HandleExceptionController {
	private static final Logger LOG = LoggerFactory.getLogger(WiFiUserStatisticController.class);

	@Autowired
	private WifiUserDAO userDAO;
	@Autowired
	private WifiTerminalDAO terminalDAO;

	@RequestMapping(value = "/wifi_terminal/active/weekly", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWeeklyActiveTerminalStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                               @RequestParam(required = true, value = "start_time") long startTime,
	                               @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi terminal weekly active stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = terminalDAO.getWeeklyActiveTerminalsStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_terminal/online", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getOnlinelTerminalStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                              @RequestParam(required = true, value = "start_time") long startTime,
	                              @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi terminal online stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = terminalDAO.getOnlineTerminalsStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_terminal/total", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getTotalTerminalStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                            @RequestParam(required = true, value = "start_time") long startTime,
	                            @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi terminal total stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = terminalDAO.getTotalTerminalsStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_terminal/new", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getNewTerminalStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                          @RequestParam(required = true, value = "start_time") long startTime,
	                          @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get new wifi user stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = terminalDAO.getNewTerminalsStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_user/active/weekly", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWeeklyActiveUserStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                          @RequestParam(required = true, value = "start_time") long startTime,
	                          @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi user weekly active stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = userDAO.getWeeklyActiveUsersStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_user/online", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getOnlinelUserStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                          @RequestParam(required = true, value = "start_time") long startTime,
	                          @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi user online stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = userDAO.getOnlineUsersStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_user/total", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getTotalUserStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                        @RequestParam(required = true, value = "start_time") long startTime,
	                        @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get wifi user total stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = userDAO.getTotalUsersStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}

	@RequestMapping(value = "/wifi_user/new", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getNewUserStat(@RequestParam(value = "oid", required = true) ObjectId oId,
	                      @RequestParam(required = true, value = "start_time") long startTime,
	                      @RequestParam(required = true, value = "end_time") long endTime) {
		Date date1 = new Date(startTime);
		Date date2 = new Date(endTime);
		LOG.debug("get new wifi user stat, start {}, end {}", date1, date2);
		List<CountStatistic> stats = userDAO.getNewUsersStat(oId, date1, date2);
		List<long[]> list = convertStatsToList(stats);
		return new OnlyResultDTO(list);
	}


	private List<long[]> convertStatsToList(List<CountStatistic> stats) {
		List<long[]> list = new ArrayList<long[]>(stats.size());
		for (CountStatistic stat : stats) {
			list.add(new long[]{stat.getDate().getTime(), stat.getCount()});
		}
		return list;
	}
}
