/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class InboxConfig {
    private String fireware;  //固件版信息
    private List<DeviceAppInfo> apps;   //APP列表
    private List<VendingData> vendingData;  //售货机信息 type 8001为广告

    public String getFireware() {
        return fireware;
    }

    public void setFireware(String fireware) {
        this.fireware = fireware;
    }

    public List<DeviceAppInfo> getApps() {
        return apps;
    }

    public void setApps(List<DeviceAppInfo> apps) {
        this.apps = apps;
    }

    public List<VendingData> getVendingData() {
        return vendingData;
    }

    public void setVendingData(List<VendingData> vendingData) {
        this.vendingData = vendingData;
    }
    
}
