/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.device.dao;

import cn.com.inhand.common.dto.DeviceBean;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface DeviceDao {
    
    public void createDevice(ObjectId oid,Device device);
    
    public void updateDevice(ObjectId oid,Device device);
    
    public List<Device> findSiteByParam(ObjectId oid,DeviceBean queryBean,int skip, int limit);
    
    public void deleteDevice(ObjectId oid,String[] idsArr);
    
    public Long getCount(ObjectId oid,DeviceBean queryBean);
    
    public Device findDeviceById(ObjectId oid,ObjectId id);
    
    public boolean isAssetIdExists(ObjectId xOId, String assetId);
    
}
