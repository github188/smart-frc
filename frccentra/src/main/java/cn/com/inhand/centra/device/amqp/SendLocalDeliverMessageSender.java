/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.smart.model.DeliverMessage;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *出货统计消息发送
 * @author lenovo
 */
@Component
public class SendLocalDeliverMessageSender {
    
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(SendLocalDeliverMessageSender.class);
    
    public SendLocalDeliverMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }

     public void publishOrderMessageSender(DeliverMessage message) {
        logger.info("Send Local Deliver message to smart statistic model");
        template.convertAndSend("dn.exchange.deliverStatistic", "dn.key.trade.deliver.Statistic",message);
    }
    
}
