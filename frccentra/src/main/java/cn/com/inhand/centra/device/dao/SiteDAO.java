/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.smart.formulacar.model.Device;
import cn.com.inhand.smart.formulacar.model.Site;
import org.bson.types.ObjectId;

/**
 *
 * @author fenghl
 */
public interface SiteDAO {
    
    public Device getDeviceByAssetId(ObjectId oid,String assetId);
    public Site getSiteById(ObjectId oid,ObjectId id);
    
}
