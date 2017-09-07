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
public class SaleDataV5 {
    
    private SaleCount saleCount;     //该点位销售情况
    
    private List<CidSaleData> cidSales;  //各个货柜销售情况

    public List<CidSaleData> getCidSales() {
        return cidSales;
    }

    public void setCidSales(List<CidSaleData> cidSales) {
        this.cidSales = cidSales;
    }

    
    public SaleCount getSaleCount() {
        return saleCount;
    }

    public void setSaleCount(SaleCount saleCount) {
        this.saleCount = saleCount;
    }

    
}
