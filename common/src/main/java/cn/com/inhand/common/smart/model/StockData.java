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
public class StockData {
    private SaleCount saleCount;
    private List<ShelvesSaleData> shelves;

    public SaleCount getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(SaleCount saleCount) {
        this.saleCount = saleCount;
    }

    public List<ShelvesSaleData> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesSaleData> shelves) {
        this.shelves = shelves;
    }
    
}
