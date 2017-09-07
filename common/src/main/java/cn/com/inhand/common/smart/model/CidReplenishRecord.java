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
public class CidReplenishRecord {
    
    private String cid;
    private Integer machineType;
    private List<ShelfReplenRecord> shelvesRecord;

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

    public List<ShelfReplenRecord> getShelvesRecord() {
        return shelvesRecord;
    }

    public void setShelvesRecord(List<ShelfReplenRecord> shelvesRecord) {
        this.shelvesRecord = shelvesRecord;
    }
    
    
    
}
