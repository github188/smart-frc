package cn.com.inhand.dn4.log;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;

import java.io.ByteArrayOutputStream;

public class HandleLog {//单例类
    private static HandleLog instance = null;

    private HandleLog() {//构造方法私有化

    }

    public static HandleLog getInstance() {//单例
        if (instance == null) {
            instance = new HandleLog();
        }
        return instance;
    }

    public boolean biz(String routingKey, MessageBean messageBean, Connection con, String exchangeName) {
        Channel channel = null;
        String message = "";
        try {
            channel = con.createChannel();
            ObjectMapper objectMapper = new ObjectMapper();
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            objectMapper.writeValue(baos, messageBean);
            message = baos.toString();
            channel.basicPublish(exchangeName, routingKey, null, message.getBytes());
            channel.close();
        } catch (Exception e) {
            return false;
        }
        return true;
    }
}
