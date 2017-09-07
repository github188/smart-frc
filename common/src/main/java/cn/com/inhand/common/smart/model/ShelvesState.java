/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class ShelvesState {

    private String cid;
    private String shelvesId;
    private Integer state;  //是否售空  1售空 0未售空
    private String soldoutTime;
    private Integer machineType;

    public Integer getMachineType() {
        return machineType;
    }

    public void setMachineType(Integer machineType) {
        this.machineType = machineType;
    }

    
    
    public String getSoldoutTime() {
        return soldoutTime;
    }

    public void setSoldoutTime(String soldoutTime) {
        this.soldoutTime = soldoutTime;
    }

    public String getShelvesId() {
        return shelvesId;
    }

    public void setShelvesId(String shelvesId) {
        this.shelvesId = shelvesId;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }
}
