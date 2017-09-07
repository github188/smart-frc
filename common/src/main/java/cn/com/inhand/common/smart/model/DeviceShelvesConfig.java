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
public class DeviceShelvesConfig {
    private List <ShelvesConfig> shelves;
    private List<ContainerTaskInfo> containers;

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
