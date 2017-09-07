/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class Dragon {
    private String merchantid;//商户代码
    private String posid;//商户柜台代码
    private String branchid;//分行代码
    private String pkcertificate;//公钥证书后30位

    public String getMerchantid() {
        return merchantid;
    }

    public void setMerchantid(String merchantid) {
        this.merchantid = merchantid;
    }

    public String getPosid() {
        return posid;
    }

    public void setPosid(String posid) {
        this.posid = posid;
    }

    public String getBranchid() {
        return branchid;
    }

    public void setBranchid(String branchid) {
        this.branchid = branchid;
    }

    public String getPkcertificate() {
        return pkcertificate;
    }

    public void setPkcertificate(String pkcertificate) {
        this.pkcertificate = pkcertificate;
    }
    
    
}
