/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class JDPay {
    private String merchantNo;//京东支付商户号
    private String privateKey; //扫一扫密钥
    private String codepayKey; //付款码密钥

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey;
    }

    public String getCodepayKey() {
        return codepayKey;
    }

    public void setCodepayKey(String codepayKey) {
        this.codepayKey = codepayKey;
    }

    
    public String getMerchantNo() {
        return merchantNo;
    }

    public void setMerchantNo(String merchantNo) {
        this.merchantNo = merchantNo;
    }
    
    
}
