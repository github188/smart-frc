package cn.com.inhand.oauth2;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;
import org.springframework.web.context.support.ServletRequestHandledEvent;

@Component
public class RequestMappingEventHandler implements ApplicationListener<ServletRequestHandledEvent> {

    private static Logger logger = LoggerFactory.getLogger(RequestMappingEventHandler.class);

    @Override
    public void onApplicationEvent(ServletRequestHandledEvent event) {
//        logger.debug("URI: {}, method: {}, time: {}", event.getRequestUrl(), event.getMethod(), event.getProcessingTimeMillis());
    }

}
