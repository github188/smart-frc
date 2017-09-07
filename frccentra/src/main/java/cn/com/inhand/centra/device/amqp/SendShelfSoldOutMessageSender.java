/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.SoldOutMessage;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author liqiang
 */
@Component
public class SendShelfSoldOutMessageSender {
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(SendShelfSoldOutMessageSender.class);
    
    public SendShelfSoldOutMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }
    
    public void publishShelfSoldoutMessageSender(SoldOutMessage message){
        template.convertAndSend(Exchanges.SHELF_SOLD_OUT_EXCHANGE, RoutingKeys.SHELF_SOLD_OUT_KEY, message);
    }
}
