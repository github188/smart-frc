package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.amqp.model.WIFIUserAccess;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.statistic.dao.WifiTerminalDAO;
import cn.com.inhand.statistic.dao.WifiUserDAO;
import cn.com.inhand.statistic.dao.WifiStatDAO;
import cn.com.inhand.statistic.dao.WifiUserTrafficDAO;
import cn.com.inhand.statistic.service.WifiTerminalService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;

import static cn.com.inhand.common.model.wifi.StatType.*;

/**
 * Created by Jerolin on 6/13/2014.
 */
@Component(value = "wifiActiveUserMessageConsumer")
public class WifiActiveUserMessageConsumer implements MessageListener, ChannelAwareMessageListener {

	private static Logger LOG = LoggerFactory.getLogger(WifiActiveUserMessageConsumer.class);

	@Autowired
	WifiTerminalService terminalService;

	@Autowired
	WifiTerminalDAO terminalDAO;

	@Autowired
	WifiUserTrafficDAO userTrafficDAO;

	@Autowired
	WifiUserDAO userDAO;

	@Autowired
	WifiStatDAO statDAO;

	@Autowired
	ObjectMapper mapper;

	@Override
	public void onMessage(Message message, Channel channel) throws Exception {
		WIFIUserAccess access = mapper.readValue(message.getBody(), WIFIUserAccess.class);
		LOG.debug("receive user access message {}", access.getuId());
		Date date = DateUtils.firstDateOfWeek(new Date());
		ObjectId oId = access.getoId();
		if (access.getLastLogin() == null) {
			userDAO.incWIFIWeeklyActiveUsers(oId, date, 1);
		} else {
			Date time = access.getTimestamp();
			long intervalNew = (time.getTime() - access.getLastLogin().getTime()) / 1000;
			LOG.debug("user {} access interval {}", access.getuId(), intervalNew);
			if (intervalNew > 0) {
				Long intervalOld = userTrafficDAO.updateUserAccessInterval(oId, access.getuId(), time, intervalNew);

				LOG.debug("user {} access interval {}", access.getuId(), intervalOld);
				Date month = org.apache.commons.lang.time.DateUtils.truncate(time, Calendar.MONTH);
				if (intervalOld == null) {
					statDAO.incCounter(oId, getStatType(intervalNew), month, 1);
				} else {
					int before = getStatType(intervalOld);
					int after = getStatType(intervalNew);
					if (after < before) {
						statDAO.incCounter(oId, before, month, -1);
						statDAO.incCounter(oId, after, month, 1);
					}
				}
			}
			if (date.getTime() > access.getLastLogin().getTime()) {
				userDAO.incWIFIWeeklyActiveUsers(oId, date, 1);
			}
		}
	}

	@Override
	public void onMessage(Message message) {
		try {
			onMessage(message, null);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public int getStatType(Long val) {
		if (val == null || val <= 86400) {
			return USER_ACCESS_INTERVAL1;
		} else if (val <= 172800) {
			return USER_ACCESS_INTERVAL2;
		} else if (val <= 259200) {
			return USER_ACCESS_INTERVAL3;
		} else {
			return USER_ACCESS_INTERVAL4;
		}
	}

}
