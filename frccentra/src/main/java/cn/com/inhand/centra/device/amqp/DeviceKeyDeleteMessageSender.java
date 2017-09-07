/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class DeviceKeyDeleteMessageSender {
    
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(DeviceKeyDeleteMessageSender.class);
 
    public DeviceKeyDeleteMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }
    
    public void publishDeviceKeyDeleteMessageSender(String tokan){
        logger.debug("------send delete device key message sender ........");
        Map<String,String> tokenMap = new HashMap<String,String>();
        tokenMap.put("token", tokan);
        template.convertAndSend(Exchanges.AUTH, RoutingKeys.DELETE_TOKEN, tokenMap);
    }
}
