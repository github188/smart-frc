package cn.com.inhand.common.resource;

import cn.com.inhand.common.amqp.Exchanges;
import cn.com.inhand.common.amqp.RoutingKeys;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.util.Assert;

import java.util.HashMap;
import java.util.Map;

public class ResourceMessageSender {
    private AmqpTemplate template;
    private String exchange = Exchanges.RESOURCE;
    private static Logger logger = LoggerFactory.getLogger(ResourceMessageSender.class);

    public ResourceMessageSender(AmqpTemplate template) {
        this.template = template;
    }

    public AmqpTemplate getTemplate() {
        return template;
    }

    public void setTemplate(AmqpTemplate template) {
        this.template = template;
    }

    /**
     * Publish create resource message to resource service.
     *
     * @param oId
     * @param uId
     * @param resourceType ResourceType.USER | ResourceType.MODEL | ...
     * @param resourceId
     * @param resourceName
     */
    public void publishCreateMessage(ObjectId oId, ObjectId uId, int resourceType, ObjectId resourceId,
                                     String resourceName) {
        Map<String, Object> permissionsMap = new HashMap<String, Object>();
        permissionsMap.put("owner", uId);
        int[][] acl = {{0, 0}};
        permissionsMap.put("acl", acl);
        Map<String, Object> message = new HashMap<String, Object>();
        message.put("id", resourceId);
        message.put("oid", oId);
        message.put("type", resourceType);
        if (resourceName != null) {
            message.put("name", resourceName);
        }
        message.put("permissions", permissionsMap);
        String routingKey = RoutingKeys.ADD_RESOURCE + "." + oId + "." + resourceType;
        template.convertAndSend(exchange, routingKey, message);
        logger.info("Publish create resource {} message, user {}", resourceName, uId);
    }

    /**
     * Publish update resource message to resource service.
     *
     * @param oId
     * @param uId
     * @param resourceType ResourceType.USER | ResourceType.MODEL | ...
     * @param resourceId
     * @param resourceName
     */
    public void publishUpdateMessage(ObjectId oId, ObjectId uId, int resourceType, ObjectId resourceId,
                                     String resourceName) {
        Assert.notNull(resourceName);
        Map<String, Object> message = new HashMap<String, Object>();
        message.put("id", resourceId);
        message.put("oid", oId);
        message.put("type", resourceType);
        message.put("name", resourceName);
        String routingKey = RoutingKeys.UPDATE_RESOURCE + "." + oId + "." + resourceType;
        template.convertAndSend(exchange, routingKey, message);
        logger.info("Publish update resource {} message, user {}", resourceName, uId);
    }

    /**
     * Publish delete resource message to resource service.
     *
     * @param oId
     * @param uId
     * @param resourceType ResourceType.USER | ResourceType.MODEL | ...
     * @param resourceId
     */
    public void publishDeleteMessage(ObjectId oId, ObjectId uId, int resourceType, ObjectId resourceId) {
        Map<String, Object> message = new HashMap<String, Object>();
        message.put("id", resourceId);
        message.put("oid", oId);
        String routingKey = RoutingKeys.DELETE_RESOURCE + "." + oId + "." + resourceType;
        template.convertAndSend(exchange, routingKey, message);
        logger.info("Publish delete resource {} message, user {}", resourceId, uId);
    }
}
