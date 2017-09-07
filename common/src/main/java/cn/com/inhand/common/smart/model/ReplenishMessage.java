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
public class ReplenishMessage {
    
    
    private String assetId;  //售货机编号
    
    private String sign;
    private String nonce_str;
    private String clientId;
    
    private String siteName;  //点位名称
    private String lineName;  //线路名称
    private Long lastTime;  //上次补货时间
    private Long createTime;  //本次补货时间
    
    private PayStyleSales paySales;  //该货柜销售情况
    
    private List<CidPaySales> cidPaySales;

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    
    
    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public String getNonce_str() {
        return nonce_str;
    }

    public void setNonce_str(String nonce_str) {
        this.nonce_str = nonce_str;
    }

    
    
    
    public List<CidPaySales> getCidPaySales() {
        return cidPaySales;
    }

    public void setCidPaySales(List<CidPaySales> cidPaySales) {
        this.cidPaySales = cidPaySales;
    }

    
    
    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }


    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public Long getLastTime() {
        return lastTime;
    }

    public void setLastTime(Long lastTime) {
        this.lastTime = lastTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public PayStyleSales getPaySales() {
        return paySales;
    }

    public void setPaySales(PayStyleSales paySales) {
        this.paySales = paySales;
    }
    
    
}
