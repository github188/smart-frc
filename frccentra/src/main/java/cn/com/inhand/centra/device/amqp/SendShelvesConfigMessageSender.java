/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.Automat;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *货道配置消息发送
 * @author lenovo
 */
@Component
public class SendShelvesConfigMessageSender {
    
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(SendShelvesConfigMessageSender.class);
    
    public SendShelvesConfigMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }
    
    public void publishAlipayMessageSender(Automat automat){
        logger.debug("Automat upload config Send Shelves Config message to contomer");
        template.convertAndSend(Exchanges.SHELVES_CONFIG, RoutingKeys.SHELVES_INFO, automat);
    }
    
}
