/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.entity.api;

import java.util.List;

/**
 *
 * @author inhand
 */
public class LoginExtRsp {
    private List<String> registered;
    private List<String> unregistered;
    private String gwId;

    public List<String> getRegistered() {
        return registered;
    }

    public void setRegistered(List<String> registered) {
        this.registered = registered;
    }

    public List<String> getUnregistered() {
        return unregistered;
    }

    public void setUnregistered(List<String> unregistered) {
        this.unregistered = unregistered;
    }

    public String getGwId() {
        return gwId;
    }

    public void setGwId(String gwId) {
        this.gwId = gwId;
    }

    @Override
    public String toString() {
        return "LoginExtRsp{" + "registered=" + registered + ", unregistered=" + unregistered + ", gwId=" + gwId + '}';
    }
    
    
}
