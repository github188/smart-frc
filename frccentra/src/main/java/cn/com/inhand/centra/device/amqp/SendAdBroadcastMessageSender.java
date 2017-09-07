package cn.com.inhand.centra.device.amqp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.AdBroadcastMessageBean;

/**
 * 发送广告播放统计消息
 * @author puys
 *
 */
@Component
public class SendAdBroadcastMessageSender {

	@Autowired
    AmqpTemplate template;
    
    private static Logger LOGGER = LoggerFactory.getLogger(SendAdBroadcastMessageSender.class);
   
    public void publishMessageSender(AdBroadcastMessageBean bean){
    	LOGGER.debug("send adrecord statics to customer,size is " + bean.getAdRecords().size());
        template.convertAndSend(Exchanges.BROADCAST_STATISTIC, RoutingKeys.AD_BROADCAST_STATISTIC, bean);
    }
}
