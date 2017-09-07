/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dto;

import javax.validation.constraints.NotNull;

import cn.com.inhand.common.smart.model.ModelConfig;
import cn.com.inhand.common.smart.model.Shelf;
import java.util.List;

/**
 *
 * @author shixj
 *
 */
public class ModelBean {
    @NotNull
    private String name;
    private String vender;
    private int machineType;
    private Long createTime;
    private Long updateTime;
    private List<Shelf> shelves;
    private List<ModelConfig> config;

    public ModelBean() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }

    public int getMachineType() {
        return machineType;
    }

    public void setMachineType(int machineType) {
        this.machineType = machineType;
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

    public List<Shelf> getShelves() {
        return shelves;
    }

    public void setShelves(List<Shelf> shelves) {
        this.shelves = shelves;
    }

    public List<ModelConfig> getConfig() {
        return config;
    }

    public void setConfig(List<ModelConfig> config) {
        this.config = config;
    }

   
}
