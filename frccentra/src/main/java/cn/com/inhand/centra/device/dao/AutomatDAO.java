/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.smart.model.Automat;
import org.bson.types.ObjectId;

/**
 *
 * @author cttc
 */
public interface AutomatDAO {
    
    public void updateAutomat(ObjectId oId, Automat automat);
    
    public Automat getAutomatById(ObjectId oId,ObjectId id);
    
    public Automat getAutomatByAssetId(ObjectId oid,String assetId);
}
