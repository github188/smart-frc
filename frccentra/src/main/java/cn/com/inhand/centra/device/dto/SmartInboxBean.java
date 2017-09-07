/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import cn.com.inhand.common.smart.model.Lbs;

/**
 *
 * @author lenovo
 */
public class SmartInboxBean {
    private String sn;
    private String net;
    private Integer signal;
    private String iccid;
    private String phone;
    private String imei;
    private Long nctime;
    private Long bootTime;
    private Integer temp;
    private Lbs lbs;
   
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

    public Integer getSignal() {
        return signal;
    }

    public void setSignal(Integer signal) {
        this.signal = signal;
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

    public Long getNctime() {
        return nctime;
    }

    public void setNctime(Long nctime) {
        this.nctime = nctime;
    }

    public Long getBootTime() {
        return bootTime;
    }

    public void setBootTime(Long bootTime) {
        this.bootTime = bootTime;
    }

    public Integer getTemp() {
        return temp;
    }

    public void setTemp(Integer temp) {
        this.temp = temp;
    }

    public Lbs getLbs() {
        return lbs;
    }

    public void setLbs(Lbs lbs) {
        this.lbs = lbs;
    }

}
