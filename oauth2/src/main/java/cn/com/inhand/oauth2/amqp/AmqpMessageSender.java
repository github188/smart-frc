package cn.com.inhand.oauth2.amqp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;

@Service
public class AmqpMessageSender {

    @Autowired
    AmqpTemplate template;

    private static final Logger logger = LoggerFactory.getLogger(AmqpMessageSender.class);

    @Async
    public void publishAccessToken(Object message) {
        Assert.notNull(message);
        logger.info("Publish new token message {}", message);
        template.convertAndSend(Exchanges.AUTH, RoutingKeys.ADD_TOKEN, message);
    }

	@Async
	public void publishDeleteToken(Object message) {
		Assert.notNull(message);
		logger.info("Publish delete token message {}", message);
		template.convertAndSend(Exchanges.AUTH, RoutingKeys.DELETE_TOKEN, message);
	}
}
