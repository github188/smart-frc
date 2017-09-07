/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author cttc
 */
public class EquipStatusV2 {
    
    private String assetId;  //售货机编号
    private Integer state=0;   //补货状态 1：已完成；0：未补货
    private String recordId;  //补货记录id
    private String siteName;  //点位名称
    private String site;
    private String address;
    private String forecastId;  //预计id
    private Float collectCash;  //取走现金金额 
    private List<ShelfGoodsRefill> shelves;

    private Long completeTime;

    public Float getCollectCash() {
        return collectCash;
    }

    public void setCollectCash(Float collectCash) {
        this.collectCash = collectCash;
    }

    
    
    public Long getCompleteTime() {
        return completeTime;
    }

    public void setCompleteTime(Long completeTime) {
        this.completeTime = completeTime;
    }
    
    public String getSite() {
        return site;
    }

    public void setSite(String site) {
        this.site = site;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    
    
    public List<ShelfGoodsRefill> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelfGoodsRefill> shelves) {
        this.shelves = shelves;
    }
    
    
    public String getForecastId() {
        return forecastId;
    }

    public void setForecastId(String forecastId) {
        this.forecastId = forecastId;
    }
    
    
    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }
    
    
    
    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }
    
    

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }
    
    
}
