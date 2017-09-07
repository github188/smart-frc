/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

/**
 *
 * @author shixj
 */
public class InboxStaticStateBean {
    private String screen_dpi;//屏幕分辨率
    private String android_version;//系统版本
    private String screen_ori;//屏幕类型
    private String model;//型号
    private String baseband;//基带版本

    public String getScreen_dpi() {
        return screen_dpi;
    }

    public void setScreen_dpi(String screen_dpi) {
        this.screen_dpi = screen_dpi;
    }

    public String getAndroid_version() {
        return android_version;
    }

    public void setAndroid_version(String android_version) {
        this.android_version = android_version;
    }


    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBaseband() {
        return baseband;
    }

    public void setBaseband(String baseband) {
        this.baseband = baseband;
    }

    public String getScreen_ori() {
        return screen_ori;
    }

    public void setScreen_ori(String screen_ori) {
        this.screen_ori = screen_ori;
    }

    
}
