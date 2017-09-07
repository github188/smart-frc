package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.statistic.dao.WifiUserStatusDAO;
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

import static cn.com.inhand.common.model.wifi.WIFIAccessType.*;

/**
 *
 * Created by Jerolin on 6/13/2014.
 */
@Component
public class WifiUserStatusMessageConsumer implements MessageListener, ChannelAwareMessageListener {

	private static Logger LOG = LoggerFactory.getLogger(WifiUserStatusMessageConsumer.class);

	@Autowired
	WifiUserStatusDAO dao;

	@Autowired
	ObjectMapper mapper;

	@Override
	public void onMessage(Message message, Channel channel) throws Exception {
		ObjectId oId = Utils.getOIdFromWifiEventRoutingKey(message);
		TerminalAccesses data = mapper.readValue(message.getBody(), TerminalAccesses.class);
		for (TerminalAccess access : data.getAccesses()) {
			switch (access.geteId()) {
				case START:
					dao.saveNewOnlineUser(oId, access); break;
				case UPDATE:
					dao.updateUserStatus(oId, access); break;
				case END:
					dao.updateUserOfflineStatus(oId, access); break;
				default:
					LOG.error("unknown wifi terminal event type {}", access.geteId());
					break;
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
