/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class BestPay {
    
    private String accountNo;//翼支付账号
    private String accountName;//翼支付企业名称
    private String cashierChannelNo;//透传渠道号,由翼支付分配
    private String platCode;//平台号
    private String loginCode;//登录号
    private String publicKey;
    private Integer certificate;//是否上传私钥

    public Integer getCertificate() {
        return certificate;
    }

    public void setCertificate(Integer certificate) {
        this.certificate = certificate;
    }
    
    

    public String getPlatCode() {
        return platCode;
    }

    public void setPlatCode(String platCode) {
        this.platCode = platCode;
    }

    public String getLoginCode() {
        return loginCode;
    }

    public void setLoginCode(String loginCode) {
        this.loginCode = loginCode;
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey;
    }
    
    

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public String getCashierChannelNo() {
        return cashierChannelNo;
    }

    public void setCashierChannelNo(String cashierChannelNo) {
        this.cashierChannelNo = cashierChannelNo;
    }
    
    
    
}
