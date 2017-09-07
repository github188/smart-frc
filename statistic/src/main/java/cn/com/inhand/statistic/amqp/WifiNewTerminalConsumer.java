package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.model.wifi.TerminalAccess;
import cn.com.inhand.common.model.wifi.WIFITerminal;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.statistic.dao.WifiTerminalDAO;
import cn.com.inhand.statistic.service.WifiTerminalService;
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

import java.util.Date;

/**
 * Created by Jerolin on 6/13/2014.
 */
@Component(value = "wifiNewTerminalConsumer")
public class WifiNewTerminalConsumer implements MessageListener, ChannelAwareMessageListener {

	private static Logger LOG = LoggerFactory.getLogger(WifiNewTerminalConsumer.class);

	@Autowired
	WifiTerminalService terminalService;

	@Autowired
	WifiTerminalDAO terminalDAO;

	@Autowired
	ObjectMapper mapper;

	@Override
	public void onMessage(Message message, Channel channel) throws Exception {
		ObjectId oId = Utils.getOIdFromWifiEventRoutingKey(message);
		TerminalAccess access = mapper.readValue(message.getBody(), TerminalAccess.class);
		LOG.debug("receive terminal access message {}", access.getMac());
		String mac = access.getMac();
		if (terminalService.isNewMac(oId, mac)) {
			WIFITerminal terminal = new WIFITerminal();
			terminal.setMac(mac);
			terminal.setCreateTime(new Date());
			terminal.setLogin(access.getStartTime());
			terminal.setLogout(access.getEndTime());
			terminalDAO.addNewTerminal(oId, terminal);
			terminalService.addNewMac(oId, mac);
			updateWeeklyActiveTerminals(oId, terminal.getLogin(), null);
			LOG.info("new mac {} added to {}", mac, oId);
		} else {
			WIFITerminal terminal = terminalDAO.getTerminal(oId, access.getMac());
			if (access.getStartTime().after(terminal.getLogin())) {
				terminal.setLastLogin(terminal.getLogin());
				terminal.setLastLogout(terminal.getLogout());
				terminal.setLogin(access.getStartTime());
				terminal.setLogout(access.getEndTime());
				terminalDAO.updateTerminal(oId, terminal);
				updateWeeklyActiveTerminals(oId, terminal.getLogin(), terminal.getLastLogin());
			} else if (terminal.getLastLogin() == null || access.getStartTime().after(terminal.getLastLogin())) {
				terminal.setLastLogin(access.getStartTime());
				terminal.setLastLogout(access.getEndTime());
				terminalDAO.updateTerminal(oId, terminal);
				updateWeeklyActiveTerminals(oId, terminal.getLogin(), terminal.getLastLogin());
			}
		}
	}

	private void updateWeeklyActiveTerminals(ObjectId oId, Date login, Date lastLogin) {
		Date date = DateUtils.firstDateOfWeek(login);
		if (lastLogin == null || date.getTime() > lastLogin.getTime()) {
			terminalDAO.incWifiWeeklyActiveTerminals(oId, date, 1);
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
