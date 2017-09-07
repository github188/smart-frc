/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.amqp;

import cn.com.inhand.common.smart.model.Ap;
import cn.com.inhand.common.smart.model.ApInfo;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.initialize.dao.ApDAO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import java.io.IOException;
import java.util.logging.Level;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class ApInitializeMessageConsumer implements MessageListener, ChannelAwareMessageListener {

    private static Logger logger = LoggerFactory.getLogger(ApInitializeMessageConsumer.class);
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private ApDAO apDAO;

    public void onMessage(Message message) {
        try {
            logger.info("Ap initialize message consumer init Ap info ...");
            byte[] vpnMessage = message.getBody();
            ApInfo info = mapper.readValue(vpnMessage, ApInfo.class);
            Ap ap = apDAO.findApByKey(info.getKey());
            if (ap == null) {
                ap = new Ap();
                ap.setAlive(0);
                ap.setKey(info.getKey());
                ap.setLastAliveTime(DateUtils.getUTC());
                ap.setPort(info.getPort());
                ap.setUrl(info.getUrl());
                ap.setConns(0);
                apDAO.createApInfo(ap);
            }else {
                logger.info("Update Ap initialize message consumer init Ap info ...");
                ap.setAlive(0);
                ap.setConns(0);
                ap.setKey(info.getKey());
                ap.setPort(info.getPort());
                ap.setUrl(info.getUrl());
                ap.setLastAliveTime(DateUtils.getUTC());
                apDAO.updateAp(ap);
            }
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(ApInitializeMessageConsumer.class.getName()).log(Level.SEVERE, null, ex);
        }

    }

    public void onMessage(Message message, Channel channel) throws Exception {
        onMessage(message);
    }
}
