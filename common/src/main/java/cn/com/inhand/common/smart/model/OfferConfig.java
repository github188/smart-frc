/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author liqiang
 */
public class OfferConfig {
    
    private String deviceId;   //id
    private String assetId;   //编号
    
    private List<Counter> offerCids;  //活动货柜

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public List<Counter> getOfferCids() {
        return offerCids;
    }

    public void setOfferCids(List<Counter> offerCids) {
        this.offerCids = offerCids;
    }
    
    
    
}
