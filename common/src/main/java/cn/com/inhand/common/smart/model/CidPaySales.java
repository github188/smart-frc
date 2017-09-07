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
public class CidPaySales {
    
    private String cid;   //货柜编号
    private Integer machineType;  //货柜类型
    
    private PayStyleSales paySales;  //该货柜销售情况
    private List<ShelfPaySales> shelvesPaySales;  //各个货道销售情况

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

    public PayStyleSales getPaySales() {
        return paySales;
    }

    public void setPaySales(PayStyleSales paySales) {
        this.paySales = paySales;
    }

    public List<ShelfPaySales> getShelvesPaySales() {
        return shelvesPaySales;
    }

    public void setShelvesPaySales(List<ShelfPaySales> shelvesPaySales) {
        this.shelvesPaySales = shelvesPaySales;
    }
    
    
}
