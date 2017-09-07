package cn.com.inhand.dn4.utils;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

public class RabbitMQUtil {
    public static Connection initMQ(String hostIP, String username, String password, int port) throws IOException {
        ConnectionFactory factory = new ConnectionFactory();
        factory.setHost(hostIP);
        if (username != null && password != null) {
            factory.setUsername(username);
            factory.setPassword(password);
            factory.setPort(port);
        }
        Connection connection = factory.newConnection();

        return connection;
    }

    public static void basicPublish(Connection connection, String exchangeName, String routingKey
            , Map<String, Object> paramMap) throws IOException {
        Channel channel = connection.createChannel();
        ObjectMapper objectMapper = new ObjectMapper();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        objectMapper.writeValue(baos, paramMap);
        String message = baos.toString();
        byte[] messageBodyBytes = message.getBytes();
//		 channel.exchangeDeclare(exchangeName, "topic", true);
        channel.basicPublish(exchangeName, routingKey, null, messageBodyBytes);
        channel.close();
    }

    public static void basicPublish(Connection connection, String exchangeName, String routingKey
            , Object obj) throws IOException {
        Channel channel = connection.createChannel();
        String json = JsonUtils.writeObjectJson(obj);
        byte[] messageBodyBytes = json.getBytes();
//		 channel.exchangeDeclare(exchangeName, "topic", true);
        channel.basicPublish(exchangeName, routingKey, null, messageBodyBytes);
        channel.close();
    }
}
