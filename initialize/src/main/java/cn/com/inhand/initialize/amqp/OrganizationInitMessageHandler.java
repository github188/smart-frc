/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.amqp;

import cn.com.inhand.common.amqp.model.OrganizationData;
import cn.com.inhand.common.smart.model.Area;
import cn.com.inhand.common.smart.model.Line;
import cn.com.inhand.initialize.implement.initArea;
import cn.com.inhand.initialize.implement.initGoodType;
import cn.com.inhand.initialize.implement.initLine;
import cn.com.inhand.initialize.implement.initModel;
import cn.com.inhand.initialize.implement.initSite;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.*;
import java.util.HashMap;
import java.util.Map;
/**
 *
 * @author cttc
 */
@Component
public class OrganizationInitMessageHandler implements MessageListener, ChannelAwareMessageListener {

    private static Logger logger = LoggerFactory.getLogger(OrganizationInitMessageHandler.class);
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private initGoodType type;
    @Autowired
    private initArea area;
    @Autowired
    private initLine line;
    @Autowired
    private initSite site;
    @Autowired
    private initModel model;
    
    @Override
    public void onMessage(Message message) {
        byte[] vpnMessage = message.getBody();
        OrganizationData od = null;
        try {
            od = mapper.readValue(vpnMessage, OrganizationData.class);
        } catch (JsonParseException e) {
            e.printStackTrace();
        } catch (JsonMappingException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        logger.debug("----------------------------Organization initialize(initialize project )!------------------------------");
        logger.debug("Organization initialize message : " + new String(message.getBody()));
//        logger.debug("Organization initialize getName : " + od.getName());
        logger.debug("Organization initialize get_id : " + od.getId());
        ObjectId newOid = new ObjectId(od.getId());
        Map<String, Object> param = new HashMap<String, Object>();
        param.put("oid", newOid);
        type.statistic(param);//初始化商品类型信息
        
        Area areas = area.initDefaultArea(newOid);//初始化区域
        Line lines = line.initDefaultLine(newOid, areas.getId().toString(), areas.getName(),areas.getCreateTime());//初始化线路
        site.initDefaultSite(newOid, lines.getId().toString(), lines.getName(),lines.getCreateTime());//初始化点位
//        area.statistic(param);
//        model.statistic(param);
    }

    @Override
    public void onMessage(Message message, Channel channel) throws Exception {
        onMessage(message);
    }
}
