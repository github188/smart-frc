/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class ShelvesSaleDataV1 {

    private String locationId;
    private Integer saleNum = 0;
    private Integer saleM = 0;
    private Integer capacity = 0;
    private Integer stock = 0;
    private Integer platformSaleNum = 0;
    private Integer wechatNum = 0;
    private Integer alipayNum = 0;
    private Integer cashNum = 0;

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public Integer getSaleNum() {
        return saleNum;
    }

    public void setSaleNum(Integer saleNum) {
        this.saleNum = saleNum;
    }

    public Integer getSaleM() {
        return saleM;
    }

    public void setSaleM(Integer saleM) {
        this.saleM = saleM;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Integer getPlatformSaleNum() {
        return platformSaleNum;
    }

    public void setPlatformSaleNum(Integer platformSaleNum) {
        this.platformSaleNum = platformSaleNum;
    }

    public Integer getWechatNum() {
        return wechatNum;
    }

    public void setWechatNum(Integer wechatNum) {
        this.wechatNum = wechatNum;
    }

    public Integer getAlipayNum() {
        return alipayNum;
    }

    public void setAlipayNum(Integer alipayNum) {
        this.alipayNum = alipayNum;
    }

    public Integer getCashNum() {
        return cashNum;
    }

    public void setCashNum(Integer cashNum) {
        this.cashNum = cashNum;
    }
    
}
