/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.mq.rabbitmq;

import cn.com.inhand.devicenetworks.ap.websocket.ConnectionInfo;
import cn.com.inhand.devicenetworks.ap.websocket.packet.DNMessage;
import cn.com.inhand.devicenetworks.ap.websocket.processor.DNMsgProcessorInterface;
import cn.com.inhand.devicenetworks.ap.websocket.packet.Parameter;
import com.rabbitmq.client.Channel;
import java.util.logging.Logger;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

/**
 *
 * @author han
 */
public class DeliveringNoticeConsumer implements MessageListener, ChannelAwareMessageListener {

    @Autowired
    AmqpTemplate template;
    private final static Logger logger = Logger.getLogger("DelivingNoticeConsumer[v1.1.0]");
    //
    private DNMsgProcessorInterface parser = null;
    

    private ConnectionInfo cinfo = null;

    public DeliveringNoticeConsumer(ConnectionInfo info, DNMsgProcessorInterface parser) {
        this.cinfo = info;
        this.parser = parser;
        //System.out.println("--~~~~~~~~~Debug in TranscationConsumer.contructor()~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~--");
    }

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        String str = new String(message.getBody());
        DNMessage msg = parser.unwrap(str.getBytes());
        logger.info("RECV a message From DeliverNotice MQ txid:["+msg.getTxid()+"] id:["+(String)msg.getParameter("_id").getValue()+"]");
        onMessage(message);
    }

    @Override
    public void onMessage(Message message) {
        // TODO Auto-generated method stub
        //在此接收消息
        listen(message);
    }
    
    public void listen(Message message) {
        String str = new String(message.getBody());
        try {
            DNMessage msg = parser.unwrap(str.getBytes());
            if (msg != null) {
                Parameter param = msg.getParameter("gwId");//("deviceId");
                if (param != null) {
                    String id = (String)param.getValue();
                    WebSocketSession ws = this.cinfo.getWssn(id);
                    if (ws != null) {
                        ws.sendMessage(new TextMessage(str));
                        logger.info("SEND A Deliver message to assetId:["+(String)msg.getParameter("asset_id").getValue()+"]-cid:["+(String)msg.getParameter("cid").getValue()+"] _id:["+(String)msg.getParameter("_id").getValue()+"]");
                    } else {
                        logger.info("NOT FIND SESSION BY GWID IS ["+id+"]  ");
                        //因为在负载均衡模式下可能有多个Websocket AP，不能因为本AP没有这个设备就认为设备不在线，所以以下在多AP模式下不成立
                        //设备不在线
//                        List list = new ArrayList();
//                        list.add(new Parameter("result", "30005"));
//                        list.add(new Parameter("reason", "The asset is offline."));
//                        list.add(msg.getParameter("id"));
//                        list.add(msg.getParameter("transcation_id"));
//                        list.add(msg.getParameter("asset_id"));
//                        DNMessage ack = new DNMessage(msg.getName(), "response", msg.getTxid(), list);
//
//                        MessageProperties properties =message.getMessageProperties();
////                        properties.setCorrelationId(correlationId);
//        
//                        producer.sendMessage(new String(parser.wrap(msg)));
//                        logger.info("The asset[" + asset_id + "] is not online, return a offline ack to source. msg=" + ack.toString());
//                        System.out.println("The asset[" + asset_id + "] is not online, return a offline ack to source. msg=" + ack.toString());
//                         //需要往rabbitmq rpc中回写
                        //--------------------------------
                    }
                } else {
                    //是否返回出错信息？
                }
            }
        } catch (Exception e) {
            logger.warning(e.getLocalizedMessage());
            
        }
    }

}
