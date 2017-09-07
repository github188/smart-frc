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
public class ReplenishForecast {
    
    
    private List<GoodsReplenishForecast> goodsForecast;  //商品总预测
    
    private List<DeviceReplenishForecast> deviceForecast;  //设备商品预测

    public List<GoodsReplenishForecast> getGoodsForecast() {
        return goodsForecast;
    }

    public void setGoodsForecast(List<GoodsReplenishForecast> goodsForecast) {
        this.goodsForecast = goodsForecast;
    }

    public List<DeviceReplenishForecast> getDeviceForecast() {
        return deviceForecast;
    }

    public void setDeviceForecast(List<DeviceReplenishForecast> deviceForecast) {
        this.deviceForecast = deviceForecast;
    }
    
    
}
