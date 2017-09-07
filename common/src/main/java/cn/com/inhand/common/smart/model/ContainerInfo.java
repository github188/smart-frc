/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author liqiang
 */
public class ContainerInfo {
    
    
    private String cid;
    private Integer machineType;
    private List<ShelvesSales> shelves;
    
    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getMachineType() {
        return machineType;
    }

    public void setMachineType(Integer machineType) {
        this.machineType = machineType;
    }

   

    public List<ShelvesSales> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesSales> shelves) {
        this.shelves = shelves;
    }
    
    
    
}
