/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class TemperState {
    
    private String cid;
    private TemperDetail temperDetail;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public TemperDetail getTemperDetail() {
        return temperDetail;
    }

    public void setTemperDetail(TemperDetail temperDetail) {
        this.temperDetail = temperDetail;
    }
    
    
}
