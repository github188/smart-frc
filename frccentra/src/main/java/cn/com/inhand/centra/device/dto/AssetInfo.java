/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import cn.com.inhand.common.smart.model.ContainerTaskInfo;
import cn.com.inhand.common.smart.model.ShelvesConfig;
import java.util.List;

/**
 *
 * @author lenovo
 */
public class AssetInfo {
    private String deviceId;
    private List <ShelvesConfig> shelves;
    private List<ContainerTaskInfo> containers;

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public List<ShelvesConfig> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesConfig> shelves) {
        this.shelves = shelves;
    }

    public List<ContainerTaskInfo> getContainers() {
        return containers;
    }

    public void setContainers(List<ContainerTaskInfo> containers) {
        this.containers = containers;
    }

    
}
