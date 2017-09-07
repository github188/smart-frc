package cn.com.inhand.statistic.util;

import org.bson.types.ObjectId;
import org.springframework.amqp.core.Message;

/**
 * Created by Jerolin on 6/27/2014.
 */
public class Utils {
	public static ObjectId getOIdFromWifiEventRoutingKey(Message message) {
		String routingKey = message.getMessageProperties().getReceivedRoutingKey();
		String[] split = routingKey.split("\\.");
		return new ObjectId(split[4]);
	}
}
