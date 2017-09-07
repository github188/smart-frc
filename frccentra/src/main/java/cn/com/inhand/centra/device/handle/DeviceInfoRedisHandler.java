/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.common.service.RedisFactory;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class DeviceInfoRedisHandler {
    @Autowired
    private RedisFactory redisFactory;
    
    public void hmsetDeviceInfo(String key , Map<String,String> vlaues){
        redisFactory.hmset(key, vlaues);
    }
    
    public void deleteDeviceInfo(String key){
        redisFactory.del(key);
    }
    
    public Map<String,String> hgetDeviceInfo(String key){
        return redisFactory.hgetAll(key);
    }
    
    public void hsetDeviceLogOutSessionId(String deviceId,String sessionId){
        redisFactory.hset("DEVICE:LOGOUT", deviceId, sessionId);
    }
    
    public String hgetDeviceLogOutSessionId(String deviceId){
        return redisFactory.hget("DEVICE:LOGOUT", deviceId);
    }
}
