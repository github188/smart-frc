/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.entity.api;

import cn.com.inhand.devicenetworks.ap.entity.App;
import cn.com.inhand.devicenetworks.ap.entity.Asset;
import cn.com.inhand.devicenetworks.ap.entity.Plugin;
import java.util.List;

/**
 *
 * @author inhand
 */
public class LoginExtReq {
    private String key;
    private int action;
    private String host;
    private int port;
    private List<Asset> assets;
    private List<App> apps;
    private List<Plugin> plugins;

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

    public int getPort() {
        return port;
    }

    public void setPort(int port) {
        this.port = port;
    }

    public List<Asset> getAssets() {
        return assets;
    }

    public void setAssets(List<Asset> assets) {
        this.assets = assets;
    }

    public List<App> getApps() {
        return apps;
    }

    public void setApps(List<App> apps) {
        this.apps = apps;
    }

    public List<Plugin> getPlugins() {
        return plugins;
    }

    public void setPlugins(List<Plugin> plugins) {
        this.plugins = plugins;
    }

    @Override
    public String toString() {
        return "LoginExtReq{" + "key=" + key + ", action=" + action + ", host=" + host + ", port=" + port + ", assets=" + assets + ", apps=" + apps + ", plugins=" + plugins + '}';
    }
    
    
}
