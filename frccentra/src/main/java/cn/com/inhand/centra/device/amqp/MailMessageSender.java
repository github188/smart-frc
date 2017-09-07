package cn.com.inhand.centra.device.amqp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.com.inhand.centra.device.model.MailMessageBean;
import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;

/**
 *
 * @author puys
 */
@Component
public class MailMessageSender {
	
    @Autowired
    AmqpTemplate template;
    
    private static Logger LOGGER = LoggerFactory.getLogger(MailMessageSender.class);
   
    public void publishMessageSender(MailMessageBean bean){
    	LOGGER.debug("send Mail to customer {}" + bean.getToMailList().get(0));
        template.convertAndSend(Exchanges.MAIL, RoutingKeys.MAIL, bean);
    }
}
