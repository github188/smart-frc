/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.DeviceStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.LinkedHashMap;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author liqiang
 */
@Component
public class DeviceStatusPushHandler {
    
    @Autowired
    AmqpTemplate template;
    @Autowired
    ObjectMapper mapper;
    public void sendDeviceStatusRQ(Automat automat){
        
            DeviceStatus deviceStatus = mapper.convertValue(automat.getVendingState(), DeviceStatus.class);
            deviceStatus.setAssetId(automat.getAssetId());
            deviceStatus.setOnline(automat.getOnline());
            deviceStatus.setLineName(automat.getLineName());
            deviceStatus.setSiteName(automat.getSiteName());
            
            LinkedHashMap<String, Object> message = new LinkedHashMap<String, Object>();
            message.put("deviceStatus", deviceStatus);
            message.put("oid", automat.getOid());
            message.put("isOrder", true);
            template.convertAndSend(Exchanges.SEND_DEVICE_STATUS_MSG, RoutingKeys.SEND_DEVICE_STATUS_MSG, message);
        
    }
}
