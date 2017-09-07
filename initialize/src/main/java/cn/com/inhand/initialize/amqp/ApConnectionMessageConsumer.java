/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.amqp;

import cn.com.inhand.common.smart.model.Ap;
import cn.com.inhand.common.smart.model.ApStatus;
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
public class ApConnectionMessageConsumer implements MessageListener, ChannelAwareMessageListener {

    private static Logger logger = LoggerFactory.getLogger(ApConnectionMessageConsumer.class);
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private ApDAO apDAO;

    public void onMessage(Message message) {
        try {
            byte[] msg = message.getBody();
            ApStatus status = mapper.readValue(msg, ApStatus.class);
            if (status.getAction().equals("conns")) {
//                logger.debug("Ap status Consumer action is [" + status.getAction() + "] key is [" + status.getKey() + "]");
                Ap ap = apDAO.findApByKey(status.getKey());
                if (ap != null) {
                    ap.setAlive(0);
                    ap.setLastAliveTime(DateUtils.getUTC());
                    ap.setConns(status.getConns());
                    apDAO.updateAp(ap);
                }
            }
        } catch (IOException ex) {
            java.util.logging.Logger.getLogger(ApConnectionMessageConsumer.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void onMessage(Message message, Channel channel) throws Exception {
        onMessage(message);
    }
}
