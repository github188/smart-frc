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
public class ContainerTaskInfo {
    
    private String cid;
    private List<ShelvesConfig> shelves;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public List<ShelvesConfig> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesConfig> shelves) {
        this.shelves = shelves;
    }
    
    
}
