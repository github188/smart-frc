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
public class StockDataV1 {

    private SaleCount saleCount;
    private List<ShelvesSaleDataV1> shelves;

    public SaleCount getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(SaleCount saleCount) {
        this.saleCount = saleCount;
    }

    public List<ShelvesSaleDataV1> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelvesSaleDataV1> shelves) {
        this.shelves = shelves;
    }
}
