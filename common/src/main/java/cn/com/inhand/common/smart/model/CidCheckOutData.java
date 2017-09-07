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
public class CidCheckOutData {
    private Integer dataType;    //是否能上报数据
    private String cid;    //货柜编号
    private Integer machineType;  //货柜类型
    private SaleCount saleCount;    //货柜销售情况
    private List<ShelvesCheckOutData> shelves;   //货道销量与累计数

    public Integer getDataType() {
        return dataType;
    }

    public void setDataType(Integer dataType) {
        this.dataType = dataType;
    }

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

    public SaleCount getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(SaleCount saleCount) {
        this.saleCount = saleCount;
    }

    public List<ShelvesCheckOutData> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesCheckOutData> shelves) {
        this.shelves = shelves;
    }
    
    
}
