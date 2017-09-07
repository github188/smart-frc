/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.model;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class Container {
    private String cid;
    private Integer type;
    private List shelves;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public List getShelves() {
        return shelves;
    }

    public void setShelves(List shelves) {
        this.shelves = shelves;
    }
    
}
