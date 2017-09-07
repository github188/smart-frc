/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public class ShelvesConfigBean {
    
    private String deviceId;
    private ObjectId gwId;
    private String assetId;
    private int type;
    private String description;
    private Object config;

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Object getConfig() {
        return config;
    }

    public void setConfig(Object config) {
        this.config = config;
    }
    
}
