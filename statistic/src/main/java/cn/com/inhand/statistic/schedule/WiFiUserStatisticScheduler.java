package cn.com.inhand.statistic.schedule;

import cn.com.inhand.common.model.Organization;
import cn.com.inhand.statistic.dao.*;
import org.apache.commons.lang3.time.DateUtils;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * User: Jerolin
 * Date: 13-10-12
 */
@Component
public class WiFiUserStatisticScheduler {
	private static final Logger LOG = LoggerFactory.getLogger(WiFiUserStatisticScheduler.class);
	@Autowired
	TaskExecutor executor;
	@Autowired
	WifiUserStatusDAO userStatusDAO;
	@Autowired
	WifiTerminalStatusDAO terminalStatusDAO;
	@Autowired
	private WifiUserDAO wifiUserDAO;
	@Autowired
	private WifiTerminalDAO wifiTerminalDAO;
	@Autowired
	private OrganizationDAO organizationDAO;

	@Scheduled(cron = "0 0/10 * * * ?")
//    @Scheduled(cron = "0/5 * * * * ?")
	public void totalWifiUsersStat() {
		LOG.info("stat wifi users.");
		List<Organization> allOrganization = organizationDAO.getAllOrganization(false);
		ObjectId oId;
		Date today = DateUtils.truncate(new Date(), Calendar.DATE);
		for (Organization org : allOrganization) {
			oId = org.getId();
			executor.execute(new WifiUserStatRunner(oId, org.getName(), today));

		}
	}

	@Scheduled(cron = "0 0/10 * * * ?")
	public void onlineWifiUsersStat() {
		LOG.info("stat online wifi users.");
		List<Organization> allOrganization = organizationDAO.getAllOrganization(false);
		ObjectId oId;
		Date date = DateUtils.truncate(new Date(), Calendar.MINUTE);
		Calendar calendar = DateUtils.toCalendar(date);
		calendar.set(Calendar.MINUTE, calendar.get(Calendar.MINUTE) >= 30 ? 30 : 0);
		for (Organization org : allOrganization) {
			oId = org.getId();
			executor.execute(new WifiOnlineStatRunner(oId, org.getName(), calendar.getTime()));
		}
	}

	@Scheduled(cron = "0 0 0/4 * * ?")
	public void cleanUserStatus() {
		LOG.info("clean online wifi user and terminals.");
		List<Organization> allOrganization = organizationDAO.getAllOrganization(false);

		for (Organization org : allOrganization) {
			final ObjectId oId = org.getId();
			executor.execute(new Runnable() {
				@Override
				public void run() {
					userStatusDAO.cleanUserStatus(oId);
					terminalStatusDAO.cleanTerminalStatus(oId);
				}
			});
		}
	}

	@Scheduled(cron = "0 0 0 1 * ?")
	public void cleanTerminalStayRecords() {
		LOG.info("clean wifi terminals stay records.");
		List<Organization> allOrganization = organizationDAO.getAllOrganization(false);

		for (Organization org : allOrganization) {
			final ObjectId oId = org.getId();
			executor.execute(new Runnable() {
				@Override
				public void run() {
					terminalStatusDAO.cleanTerminalStayTime(oId);
				}
			});
		}
	}


	@Scheduled(cron = "0 0 0/1 * * ?")
	public void wifiStayTimeStat() {
		LOG.info("stat stay of wifi user and terminals.");
		List<Organization> orgs = organizationDAO.getAllOrganization(false);

		for (Organization org : orgs) {
			final ObjectId oId = org.getId();
			executor.execute(new Runnable() {
				@Override
				public void run() {
					userStatusDAO.cleanUserStatus(oId);
					terminalStatusDAO.cleanTerminalStatus(oId);
				}
			});
		}
	}

	private class WifiOnlineStatRunner implements Runnable {
		private ObjectId oId;
		private String orgName;
		private Date date;

		private WifiOnlineStatRunner(ObjectId oId, String orgName, Date date) {
			this.oId = oId;
			this.orgName = orgName;
			this.date = date;
		}

		@Override
		public void run() {
			long count;
			count = wifiUserDAO.getTotalOnlineUsers(oId, date);
			wifiUserDAO.updateOnlineUsers(oId, date, count);
			LOG.debug("stat org online users of {}, time: {}, online: {}", orgName, date, count);

			count = wifiTerminalDAO.getTotalOnlineTerminals(oId, date);
			wifiTerminalDAO.updateOnlineTerminals(oId, date, count);
			LOG.debug("stat org online terminals of {}, time: {}, online: {}", orgName, date, count);
		}
	}

	private class  WifiUserStatRunner implements Runnable {
		private ObjectId oId;
		private String orgName;
		private Date date;

		private WifiUserStatRunner(ObjectId oId, String orgName, Date date) {
			this.oId = oId;
			this.orgName = orgName;
			this.date = date;
		}

		@Override
		public void run() {
			long count;
			LOG.info("stat for org {}", orgName);
			count = wifiUserDAO.getTotalUsers(oId);
			LOG.debug("stat total wifi users, count {}", count);
			wifiUserDAO.updateTotalUsers(oId, date, count);

			Date now = new Date();
			count = wifiUserDAO.getNewUsers(oId, date, now);
			LOG.debug("stat new wifi users, count {}", count);
			wifiUserDAO.updateNewUsers(oId, date, count);

			count = wifiTerminalDAO.getTotalTerminals(oId);
			LOG.debug("stat total terminals users, count {}", count);
			wifiTerminalDAO.updateTotalTerminals(oId, date, count);

			count = wifiTerminalDAO.getNewTerminals(oId, date, now);
			LOG.debug("stat new terminals users, count {}", count);
			wifiTerminalDAO.updateNewTerminals(oId, date, count);
		}
	}

}
