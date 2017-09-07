/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.amqp;

import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.handle.DeviceInfoRedisHandler;
import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.util.DateUtils;
import com.rabbitmq.client.Channel;
import java.util.HashMap;
import java.util.Map;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.core.MessageListener;
import org.springframework.amqp.rabbit.core.ChannelAwareMessageListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author lenovo
 */
@Service
public class DeviceHeartBeatMessageHandler implements MessageListener, ChannelAwareMessageListener {

    private static Logger logger = LoggerFactory.getLogger(DeviceHeartBeatMessageHandler.class);
    @Autowired
    private DeviceInfoRedisHandler deviceRedisHandler;
    @Autowired
    private DeviceDAO deviceDAO;

    @Override
    public void onMessage(Message msg, Channel chnl) throws Exception {
        onMessage(msg);
    }

    @Override
    public void onMessage(Message message) {
        //AP端发过来的协议体
        //{"name":"heartbeat","type":"request","txid":"9065","params":[{"name":"gwId","value":"55c2c7020cf24f0d98bf11bf"},{"name":"oid","value":"55c09090325cf17f4c000005"},{"name":"deviceIds","value":["561f75150cf27c10d6ba2a77"]}]}

        byte[] hbMessage = message.getBody();
//        logger.debug("Device Heart beat Message toString is " + new String(hbMessage));
        JSONObject messageObj = JSONObject.fromObject(new String(hbMessage));
        String name = messageObj.getString("name");
        if (name.equals("heartbeat")) {
            JSONArray array = messageObj.getJSONArray("params");
            String oid = this.getValueByName("oid", array);
            String gwId = this.getValueByName("gwId", array);
            String[] deviceArray = this.getValueArrayByName("deviceIds", array);
            this.setDeviceLastAliveTime(oid, deviceArray);
        }
    }

    public String getValueByName(String name, JSONArray array) {
        String value = "";
        for (int i = 0; i < array.size(); i++) {
            JSONObject obj = array.getJSONObject(i);
            if (obj.getString("name").equals(name)) {
                value = obj.getString("value");
            }
        }
        return value;
    }

    public String[] getValueArrayByName(String name, JSONArray array) {
        String[] deviceArray = null;
        for (int i = 0; i < array.size(); i++) {
            JSONObject obj = array.getJSONObject(i);
            if (obj.getString("name").equals(name)) {
                JSONArray deviceObj = obj.getJSONArray("value");
                if (deviceObj != null) {
                    deviceArray = new String[deviceObj.size()];
                    for (int j = 0; j < deviceObj.size(); j++) {
                        deviceArray[j] = deviceObj.getString(j);
                    }
                }
            }
        }
        return deviceArray;
    }

    public void setDeviceLastAliveTime(String oid, String[] deviceArray) {
        if (deviceArray != null) {
            for (int i = 0; i < deviceArray.length; i++) {
                Map<String, String> redisDeviceMap = deviceRedisHandler.hgetDeviceInfo(deviceArray[i] + ":" + Constant.REDIS_DEVICE_INFO_KEY);
                if(redisDeviceMap != null && redisDeviceMap.get("sn") == null){
                    redisDeviceMap.put("sn", "");
                }
                if (redisDeviceMap != null && !redisDeviceMap.get("sn").equals("0000")) {
                    Map<String, String> deviceMap = new HashMap<String, String>();
                    deviceMap.put("lastAlive", DateUtils.getUTC() + "");
                    deviceMap.put("online", Constant.DEVICE_ONLINE_STATUS_LOGIN+"");
                    deviceRedisHandler.hmsetDeviceInfo(deviceArray[i] + ":" + Constant.REDIS_DEVICE_INFO_KEY, deviceMap);
                }
            }
        }
    }
}
