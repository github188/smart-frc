package cn.com.inhand.oauth2.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.amqp.model.DeviceSyncSecret;
import cn.com.inhand.common.amqp.model.WIFIUserSendSmsCode;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Service
public class DeviceSyncSecretMessageSender {

    @Autowired
    AmqpTemplate template;
    private ExecutorService executor;
    private static Logger logger = LoggerFactory.getLogger(DeviceSyncSecretMessageSender.class);
    
    public DeviceSyncSecretMessageSender() {
        this.executor = Executors.newSingleThreadExecutor();
    }
    
    public void publishDeviceKeyInfo(ObjectId oId, DeviceSyncSecret dss){
        logger.info("getDeviceKey:"+dss.getDeviceKey());
        logger.info("getSerialNumber:"+dss.getSerialNumber());
        logger.info("getDeviceId:"+dss.getDeviceId());
        logger.info("getoId:"+dss.getoId());
	    template.convertAndSend(Exchanges.WIFI_CONTENT_SYNC, RoutingKeys.WIFI_DEVICE_SECRET, dss);
    }
}
