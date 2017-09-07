package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.common.model.wifi.WIFIAccessType;
import cn.com.inhand.statistic.dao.WifiStatDAO;
import cn.com.inhand.statistic.dao.WifiTerminalStatusDAO;
import cn.com.inhand.statistic.dto.TerminalAccesses;
import cn.com.inhand.statistic.util.Utils;
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

/**
 *
 * Created by Jerolin on 6/13/2014.
 */
@Component
public class WifiTerminalStatusMessageConsumer implements MessageListener, ChannelAwareMessageListener {

	private static Logger LOG = LoggerFactory.getLogger(WifiTerminalStatusMessageConsumer.class);

	@Autowired
	WifiTerminalStatusDAO dao;

	@Autowired
	WifiStatDAO statDAO;

	@Autowired
	ObjectMapper mapper;

	@Override
	public void onMessage(Message message, Channel channel) throws Exception {
		ObjectId oId = Utils.getOIdFromWifiEventRoutingKey(message);
		TerminalAccesses data = mapper.readValue(message.getBody(), TerminalAccesses.class);
		for (TerminalAccess access : data.getAccesses()) {
			if (access.geteId() == WIFIAccessType.START) {
				dao.saveNewOnlineTerminal(oId, access);
			} else if (access.geteId() == WIFIAccessType.UPDATE) {
				dao.updateTerminalStatus(oId, access);
			} else if (access.geteId() == WIFIAccessType.END) {
				dao.updateTerminalOfflineStatus(oId, access);
			} else {
				LOG.error("unknown wifi terminal event type {}", access.geteId());
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

}
