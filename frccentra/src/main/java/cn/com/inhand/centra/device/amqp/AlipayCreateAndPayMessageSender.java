/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.AlipayTradeModel;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *支付宝声波支付和反扫支付发送体
 * @author lenovo
 */
@Component
public class AlipayCreateAndPayMessageSender {
    
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(AlipayCreateAndPayMessageSender.class);
    
    public AlipayCreateAndPayMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }
    
    public void publishAlipayMessageSender(AlipayTradeModel model){
        template.convertAndSend(Exchanges.ALIPAY_CREATEANDPAY_CONFIG, RoutingKeys.ALIPAY_CREATEANDPAY_INFO, model);
    }
    
}
