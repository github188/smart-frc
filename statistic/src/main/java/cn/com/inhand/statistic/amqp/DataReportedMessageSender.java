package cn.com.inhand.statistic.amqp;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import cn.com.inhand.common.dto.DeviceDataMessage;
import cn.com.inhand.statistic.dto.TLVData;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;

@Component
public class DataReportedMessageSender {
	
	@Autowired
	AmqpTemplate template;

	private static Logger logger = LoggerFactory.getLogger(DataReportedMessageSender.class);

    /**
     * 下发消息 
     * @param oId
     * @param deviceId
     * @param sensorId
     * @param message
     */
    public void publishCreateMessage(ObjectId oId, ObjectId deviceId, int sensorId, Map<String, Object> message) {
        String routingKey = RoutingKeys.DEVICE_TLV + "." + oId + "." + deviceId + "." + sensorId;
	    template.convertAndSend(Exchanges.OVDP, routingKey, message);
        logger.info("Publish reported TLV from device {}", deviceId);
    }

	public void publishDeviceDataMessage(ObjectId oId, ObjectId deviceId, TLVData data, Date startTime, Date endTime) {
		String routingKey = RoutingKeys.DEVICE_DATA + "." + data.getId();
		DeviceDataMessage message = new DeviceDataMessage();
		message.setoId(oId);
		message.setDeviceId(deviceId);
		message.setStartTime(startTime);
		message.setEndTime(endTime);
		message.setId(data.getId());
		message.setValue(data.getValue());

		template.convertAndSend(Exchanges.OVDP, routingKey, message);
	}
    
    public void publishDeviceLocationMessage(ObjectId oId, ObjectId deviceId, int sensorId, Map<String, Object> message) {
    	
    	String routingKey = RoutingKeys.DEVICE_LOC + "." + oId + "." + deviceId + "." + sensorId;
    	template.convertAndSend(Exchanges.OVDP, routingKey, message);
        logger.info("Publish reported device location from device {}", deviceId);
    }
    
}
