/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *扩展柜
 * @author shixj
 */
public class Containers {
    private String cid;//扩展柜ID
    private String type;//扩展柜类型 1:饮料机 2：弹簧机 3：格子柜
    private List<ShelfSum> shelves;//扩展柜货道信息

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<ShelfSum> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelfSum> shelves) {
        this.shelves = shelves;
    }
    
    
}
