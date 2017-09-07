/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.factory;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.smart.model.Site;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Device;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 *
 * @author cttc
 */
@Component
public class DeviceStatusFactory {
    
    private static final Logger logger = LoggerFactory.getLogger(DeviceStatusFactory.class);
    
    public Device analyzeDeviceStatusAction(int action){
        Device entity = new Device();
        switch (action){
                case Constant.DEVICE_STATUS_ACTION_LOGIN : 
                    entity.setOnline(0);
                    entity.setActivationTime(DateUtils.getUTC());
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_HEARTBEAT : 
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_INBOX:
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_UPGRADE : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_SYNC_CONFIG : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_TIMEOUT : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_ERROR_DEVICE : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                case Constant.DEVICE_STATUS_ACTION_LOGOUT_WEIHU : 
                    entity.setOnline(1);
                    entity.setLastAlveTime(DateUtils.getUTC());
                    break;
                default :
                    throw new ErrorCodeException(ErrorCode.DEVICE_ACTION_NOT_EXISIT,action);
        }
        return entity;
    }
    
    
    public Site analyzeSiteStatusAction(int action){
        Site entity = new Site();
        
        if(action == Constant.DEVICE_STATUS_ACTION_LOGIN){
            entity.setOnline(0);
        }else if(action > Constant.DEVICE_STATUS_ACTION_HEARTBEAT){
            entity.setOnline(1);
        }
        return entity;
    }
    
}
