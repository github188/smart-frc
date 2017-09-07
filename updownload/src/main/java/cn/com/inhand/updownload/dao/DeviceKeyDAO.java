/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.updownload.dao;

import cn.com.inhand.common.model.DeviceKey;

/**
 *
 * @author lenovo
 */
public interface DeviceKeyDAO {
    
    public DeviceKey findDeviceKeyByKey(String key);
    
}
