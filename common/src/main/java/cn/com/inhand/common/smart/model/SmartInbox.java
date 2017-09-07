/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author cttc
 */
public class SmartInbox {

    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oId;
    private String name;
    private Integer online;
    private String sn;
    private String net;
    private String signal;
    private String iccid;
    private String phone;
    private String imei;
    private String nctime;
    private String bootTime;
    private String temp;
    private String assetId;
    private String ip;
    private Lbs lbs;
    private InboxConfig inboxConfig;
    private Long createTime;
    private Long updateTime;
    
    
    private String screen_dpi;//屏幕分辨率
    private String android_version;//系统版本
    private String screen_ori;//屏幕类型
    private String model;//型号
    private String baseband;//基带版本

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getoId() {
        return oId;
    }

    public void setoId(ObjectId oId) {
        this.oId = oId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getOnline() {
        return online;
    }

    public void setOnline(Integer online) {
        this.online = online;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public String getNet() {
        return net;
    }

    public void setNet(String net) {
        this.net = net;
    }

    public String getIccid() {
        return iccid;
    }

    public void setIccid(String iccid) {
        this.iccid = iccid;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getImei() {
        return imei;
    }

    public void setImei(String imei) {
        this.imei = imei;
    }

    public String getSignal() {
        return signal;
    }

    public void setSignal(String signal) {
        this.signal = signal;
    }

    public String getNctime() {
        return nctime;
    }

    public void setNctime(String nctime) {
        this.nctime = nctime;
    }

    public String getBootTime() {
        return bootTime;
    }

    public void setBootTime(String bootTime) {
        this.bootTime = bootTime;
    }

    public String getTemp() {
        return temp;
    }

    public void setTemp(String temp) {
        this.temp = temp;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public InboxConfig getInboxConfig() {
        return inboxConfig;
    }

    public void setInboxConfig(InboxConfig inboxConfig) {
        this.inboxConfig = inboxConfig;
    }

    public Lbs getLbs() {
        return lbs;
    }

    public void setLbs(Lbs lbs) {
        this.lbs = lbs;
    }  

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
