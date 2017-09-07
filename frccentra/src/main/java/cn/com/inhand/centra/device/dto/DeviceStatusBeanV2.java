/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class DeviceStatusBeanV2 {
    
    private List <String> registered;
    private List <String> unregistered;
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
    
}
