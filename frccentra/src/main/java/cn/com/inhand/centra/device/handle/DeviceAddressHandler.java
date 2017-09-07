/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.common.constant.Constant;
import javax.annotation.Resource;
import net.sf.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author liqiang
 */
@Component
public class DeviceAddressHandler {
    
    private final static Logger logger = LoggerFactory.getLogger(DeviceAddressHandler.class);
    @Resource
    RestTemplate restTemplate;
    
    public JSONObject getDeviceAddress(String mcc,String mnc,String lac,String ci){

        String uri = Constant.GET_DEVICE_ADDRESS_INFO+"?mcc="+mcc+"&mnc="+mnc+"&lac="+lac+"&ci="+ci+"&output="+Constant.DATA_TYPE_JSON;
        JSONObject res = restTemplate.getForObject(uri, JSONObject.class);
        return res;
        
    }
    
}
