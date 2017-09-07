package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.statistic.dao.WifiStatDAO;
import cn.com.inhand.statistic.dao.WifiUserTrafficDAO;
import cn.com.inhand.statistic.util.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.apache.commons.lang.time.DateUtils;
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
 *
 * Created by Jerolin on 6/13/2014.
 */
@Component
public class WifiUserTrafficMessageConsumer implements MessageListener, ChannelAwareMessageListener {

	private static final Logger LOG = LoggerFactory.getLogger(WifiUserTrafficMessageConsumer.class);

	@Autowired
	WifiUserTrafficDAO trafficDAO;
	@Autowired
	WifiStatDAO statDAO;

	@Autowired
	ObjectMapper mapper;

	@Override
	public void onMessage(Message message, Channel channel) throws Exception {
		ObjectId oId = Utils.getOIdFromWifiEventRoutingKey(message);
		TerminalAccess access = mapper.readValue(message.getBody(), TerminalAccess.class);
		LOG.debug("receive user traffic update {}", access.getUserId());
		long time = 0;
		if (access.getTime() != null) {
			time = access.getTime();
		}
		Long last = trafficDAO.saveTraffic(oId, access.getUserId(), access.getTx(), access.getRx(), access.getStartTime(), time);

		LOG.debug("user {} last stay {}, this stay {}", access.getUserId(), last, time);
		Date date = DateUtils.truncate(access.getStartTime(), Calendar.MONTH);
		if (last == null) {
			statDAO.incCounter(oId, getTimeLevel(time), date, 1);
		} else {
			int before = getTimeLevel(last);
			int after = getTimeLevel(last + time);

			if (before != after) {
				statDAO.incCounter(oId, after, date, 1);
				statDAO.incCounter(oId, before, date, -1);
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


	public int getTimeLevel(Long val) {
		if (val == null || val <= 7200) {
			return USER_STAY_MIN;
		} else if (val <= 18000) {
			return USER_STAY_MED;
		} else {
			return USER_STAY_MAX;
		}
	}
}
