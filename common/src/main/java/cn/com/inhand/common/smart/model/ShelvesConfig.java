/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class ShelvesConfig {
    private String shelveId;
    private String goodsId;
    private Integer price;
    private String payment_url;
    private String alipay_url;

    public String getShelveId() {
        return shelveId;
    }

    public void setShelveId(String shelveId) {
        this.shelveId = shelveId;
    }

    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getPayment_url() {
        return payment_url;
    }

    public void setPayment_url(String payment_url) {
        this.payment_url = payment_url;
    }

    public String getAlipay_url() {
        return alipay_url;
    }

    public void setAlipay_url(String alipay_url) {
        this.alipay_url = alipay_url;
    }
}
