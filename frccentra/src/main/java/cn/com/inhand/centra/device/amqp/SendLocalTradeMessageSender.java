/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.Trade;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *本地交易统计发送
 * @author shixj
 */
@Component
public class SendLocalTradeMessageSender {
    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(SendLocalTradeMessageSender.class);
    
    public SendLocalTradeMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }

     public void publishOrderMessageSender(List<Trade> tradeList, ObjectId oid,boolean isOrder) {
        LinkedHashMap<String, Object> message = new LinkedHashMap<String, Object>();
        message.put("tradeList", tradeList);
        message.put("oid", oid);
        message.put("isOrder", isOrder);
        template.convertAndSend(Exchanges.TRADE, RoutingKeys.TRADE_TOTAL, message);
    }
    
     public void publishOutTradeMessageSender(List<Trade> tradeList, ObjectId oid,boolean isOrder) {
        LinkedHashMap<String, Object> message = new LinkedHashMap<String, Object>();
        message.put("tradeList", tradeList);
        message.put("oid", oid);
        message.put("isOrder", isOrder);
        template.convertAndSend(Exchanges.SEND_TRADE_MSG, RoutingKeys.SEND_TRADE_MSG, message);
    }
     
     public void publishOrderMessageAdminSender(List<Trade> tradeList, ObjectId oid,boolean isOrder) {
        LinkedHashMap<String, Object> message = new LinkedHashMap<String, Object>();
        message.put("tradeList", tradeList);
        message.put("oid", oid);
        message.put("isOrder", isOrder);
        template.convertAndSend(Exchanges.ADMIN_TRADE, RoutingKeys.ADMIN_TRADE_TOTAL, message);
    }

    public void publishOrderMessageDFAdminSender(List<Trade> tradeDFList, ObjectId xOId, boolean isOrder) {
        LinkedHashMap<String, Object> message = new LinkedHashMap<String, Object>();
        message.put("tradeList", tradeDFList);
        message.put("oid", xOId);
        message.put("isOrder", isOrder);
        message.put("type", "deliverfaliure");
        template.convertAndSend(Exchanges.ADMIN_TRADE, RoutingKeys.ADMIN_TRADE_TOTAL, message);
    }
}
