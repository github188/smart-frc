package cn.com.inhand.common.log;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.core.AmqpTemplate;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class BusinessLogger {
    public static int TRACE = 1;
    public static int DEBUG = 2;
    public static int INFO = 3;
    public static int WARN = 4;
    public static int ERROR = 5;
    public static int FATAL = 6;

    private AmqpTemplate template;
    private Logger logger = LoggerFactory.getLogger(BusinessLogger.class);
    private ExecutorService service = Executors.newSingleThreadExecutor();

    public BusinessLogger(AmqpTemplate template) {
        this.template = template;
    }

    public AmqpTemplate getTemplate() {
        return template;
    }

    public void setTemplate(AmqpTemplate template) {
        this.template = template;
    }

    private String getRoutingKey(ObjectId oId) {
        return RoutingKeys.BUSINESS_LOG + "." + oId + ".1";
    }

    public void log(final int level, final ObjectId oId, final BusinessLogBean bean) {
        service.execute(new Runnable() {
            public void run() {
                bean.setLevel(level);
                try {
                    template.convertAndSend(Exchanges.LOG, getRoutingKey(oId), bean);
                } catch (AmqpException e) {
                    e.printStackTrace();
                    logger.error("Publish business error: " + e.getMessage());
                }
            }
        });
    }

    public void trace(ObjectId oId, BusinessLogBean bean) {
        this.log(TRACE, oId, bean);
    }

    public void trace(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.info(oId, new BusinessLogBean(code, userId, params, username, ip));
    }

    public void debug(ObjectId oId, BusinessLogBean bean) {
        this.log(DEBUG, oId, bean);
    }

    public void debug(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.debug(oId, new BusinessLogBean(code, userId, params, username, ip));
    }

    public void info(ObjectId oId, BusinessLogBean bean) {
        this.log(INFO, oId, bean);
    }

    public void info(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.info(oId, new BusinessLogBean(code, userId, params, username, ip));
    }

    public void warn(ObjectId oId, BusinessLogBean bean) {
        this.log(WARN, oId, bean);
    }

    public void warn(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.warn(oId, new BusinessLogBean(code, userId, params, username, ip));
    }

    public void error(ObjectId oId, BusinessLogBean bean) {
        this.log(ERROR, oId, bean);
    }

    public void error(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.error(oId, new BusinessLogBean(code, userId, params, username, ip));
    }

    public void fatal(ObjectId oId, BusinessLogBean bean) {
        this.log(FATAL, oId, bean);
    }

    public void fatal(ObjectId oId, LogCode code, ObjectId userId, String username, String ip, String... params) {
        this.fatal(oId, new BusinessLogBean(code, userId, params, username, ip));
    }
}
