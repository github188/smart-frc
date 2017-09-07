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
public class SaleData {
    
    private SaleCount saleCount;     //该点位销售情况
    
    private List<ShelvesSaleData> shelves;   //货道销量与累计数

    public List<ShelvesSaleData> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesSaleData> shelves) {
        this.shelves = shelves;
    }

    
    
    public SaleCount getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(SaleCount saleCount) {
        this.saleCount = saleCount;
    }

    
}
