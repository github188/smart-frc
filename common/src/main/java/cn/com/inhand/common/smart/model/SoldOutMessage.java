/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author liqiang
 */
public class SoldOutMessage {
    
    private ObjectId oid;
    private String cid;
    private String deviceId;
    private String assetId;
    List<ShelvesState> shelvesState;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    
    
    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public List<ShelvesState> getShelvesState() {
        return shelvesState;
    }

    public void setShelvesState(List<ShelvesState> shelvesState) {
        this.shelvesState = shelvesState;
    }
    
    
}
