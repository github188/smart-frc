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
public class UnionPay {
    private Integer accept;
    private String number;//商户号
    private String certificatePwd;//私钥证书密码
    private String certificate;//私钥证书

    public Integer getAccept() {
        return accept;
    }

    public void setAccept(Integer accept) {
        this.accept = accept;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getCertificatePwd() {
        return certificatePwd;
    }

    public void setCertificatePwd(String certificatePwd) {
        this.certificatePwd = certificatePwd;
    }

    public String getCertificate() {
        return certificate;
    }

    public void setCertificate(String certificate) {
        this.certificate = certificate;
    }
    
}
