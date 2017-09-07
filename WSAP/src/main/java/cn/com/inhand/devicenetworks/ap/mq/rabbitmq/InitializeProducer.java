/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.mq.rabbitmq;

import cn.com.inhand.common.smart.model.ApInfo;
import cn.com.inhand.devicenetworks.ap.websocket.Config;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import net.sf.json.JSONObject;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.InitializingBean;

/**
 *
 * @author lenovo
 */
public class InitializeProducer implements InitializingBean {

    private String exchange;
    private String routingKey;
    private RabbitTemplate rabbitTemplate;
    private final static Logger logger = Logger.getLogger(" InitializeProducer [v1.1.0]");

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public void setRoutingKey(String routingKey) {
        this.routingKey = routingKey;
    }

    public void setRabbitTemplate(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    @Override
    public void afterPropertiesSet(){
        InputStream in = null;
        try {
            Properties prop = new Properties();
            in = new FileInputStream(new File("/home/inhand/Applications/config/config.properties"));
            prop.load(in);
            ApInfo info = new ApInfo();
            info.setKey(prop.getProperty("key"));
            info.setPort(prop.getProperty("port"));
            info.setUrl(prop.getProperty("url"));
            logger.info("WSAP V1 Initialize Producer on 46 Line Read Config port is ["+info.getPort()+"] url is ["+info.getUrl()+"]");
            Config.key = info.getKey();
            rabbitTemplate.convertAndSend(exchange, routingKey, JSONObject.fromObject(info).toString());
        } catch (Exception ex) {
            Logger.getLogger(InitializeProducer.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                in.close();
            } catch (IOException ex) {
                Logger.getLogger(InitializeProducer.class.getName()).log(Level.SEVERE, null, ex);
            }
        }
    }
}
