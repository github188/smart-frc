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
public class DeviceReplenishForecast {
    
    
    private String assetId;
    private String lineId;
    private String lineName;
    
    private List<ShelfGoodsRefill> shelves;

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public List<ShelfGoodsRefill> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelfGoodsRefill> shelves) {
        this.shelves = shelves;
    }
    
    
}
