/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.websocket.controller;

/**
 *
 * @author inhand
 */
public class AssetBean {
    private String id;
    private String assets;
    private String login_ts;
    private String last_msg;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLast_msg() {
        return last_msg;
    }

    public void setLast_msg(String last_msg) {
        this.last_msg = last_msg;
    }

    public String getLogin_ts() {
        return login_ts;
    }

    public void setLogin_ts(String login_ts) {
        this.login_ts = login_ts;
    }

    public String getAssets() {
        return assets;
    }

    public void setAssets(String assets) {
        this.assets = assets;
    }
    
    
}
