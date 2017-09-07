package cn.com.inhand.statistic.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.statistic.dao.WifiLogDAO;
import cn.com.inhand.statistic.dto.WifiLog;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import com.mongodb.gridfs.GridFSDBFile;

import org.apache.commons.io.IOUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.zip.GZIPInputStream;

/**
 * WIFI user statistic controller, contains all WIFI user count statistic API.
 * Created by Jerolin on 6/9/2014.
 */
@Controller
@RequestMapping("api/wifi")
public class WifiLogController extends HandleExceptionController {
	private static final Logger LOG = LoggerFactory.getLogger(WifiLogController.class);
	CsvSchema schema = CsvSchema.builder()
			.addColumn("mac")
			.addColumn("sIp")
			.addColumn("sPort")
			.addColumn("natSourceIp")
			.addColumn("natSourcePort")
			.addColumn("dIp")
			.addColumn("dPort")
			.addColumn("proto")
			.addColumn("timestamp")
			.build().withHeader();
	@Autowired
	private WifiLogDAO logDAO;

	@RequestMapping(value = "/log", method = RequestMethod.GET)
	public
	@ResponseBody
	Object getWifiLog(@RequestParam(value = "oid", required = true) ObjectId oId,
	                  @RequestParam(value = "mac", required = false) String mac,
	                  @RequestParam(value = "cursor", defaultValue = "0") int cursor,
	                  @RequestParam("device_id") ObjectId deviceId,
	                  @RequestParam("start_time") Date startTime,
	                  @RequestParam("end_time") Date endTime) {
		GridFSDBFile file = logDAO.getWifiLog(oId, deviceId, startTime, endTime, cursor);
		if (file == null) {
			return new OnlyResultDTO(null);
		}
		long total = logDAO.getWifiLogCount(oId, deviceId, startTime, endTime);
		try {
			InputStream stream;
			if (file.getMetaData().get("encoding").equals("gzip")) {
				stream = new GZIPInputStream(file.getInputStream());
			} else {
				stream = file.getInputStream();
			}
			CsvMapper mapper = new CsvMapper();
			MappingIterator<WifiLog> it;

			if (mac == null) {
				it = mapper.reader(WifiLog.class).with(schema).readValues(stream);
			} else {
				List<String> list = IOUtils.readLines(stream);
				StringBuilder builder = new StringBuilder();
				builder.append(list.get(0)).append("\n");
				for (String s : list) {
					if (s.startsWith(mac)) {
						builder.append(s).append("\n");
					}
				}
				it = mapper.reader(WifiLog.class).with(schema).readValues(builder.toString());
			}
			List<WifiLog> log = filterLogsByTimes(it.readAll(), startTime, endTime);
			return new BasicResultDTO(total, cursor, 1, log);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return new OnlyResultDTO(null);
	}
	
	protected List<WifiLog> filterLogsByTimes(List<WifiLog> logs, Date starttime, Date endtime) {
		
		List<WifiLog> wifiLogs = new ArrayList<WifiLog>();
		if (logs!=null&&logs.size()>0) {
			
			for (WifiLog wifiLog : logs) {
				if (!wifiLog.getTimestamp().before(starttime)&&!wifiLog.getTimestamp().after(endtime)) {
					wifiLogs.add(wifiLog);
				}
			}
		}
		return wifiLogs;
	}
	
}
