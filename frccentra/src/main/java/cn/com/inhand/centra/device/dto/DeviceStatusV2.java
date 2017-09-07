/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import java.util.List;

/**
 *
 * @author cttc
 */
public class DeviceStatusV2 {
    
    private String key;
    private int action;
    private String host;
    private String port;
    private String sid;   //登不退出的标识
    private List <AssetPlugins> plugins;
    private List <AssetAppConfig> apps;
    private String firmware;
    private List <AssetAppConfig> vendingData;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getAction() {
        return action;
    }

    public void setAction(int action) {
        this.action = action;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public List<AssetPlugins> getPlugins() {
        return plugins;
    }

    public void setPlugins(List<AssetPlugins> plugins) {
        this.plugins = plugins;
    }

    public List<AssetAppConfig> getApps() {
        return apps;
    }

    public void setApps(List<AssetAppConfig> apps) {
        this.apps = apps;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public String getFirmware() {
        return firmware;
    }

    public void setFirmware(String firmware) {
        this.firmware = firmware;
    }

    public List<AssetAppConfig> getVendingData() {
        return vendingData;
    }

    public void setVendingData(List<AssetAppConfig> vendingData) {
        this.vendingData = vendingData;
    }
   
}
