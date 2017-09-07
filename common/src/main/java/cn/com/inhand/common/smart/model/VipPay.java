/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class VipPay {
    
    private Integer accept;
    private String vipInfoUrl;   //获取用户会员信息接口
    private String tradeNoticeUrl;  //发送会员支付交易通知
    private String shipmentNoticeUrl;  //出货通知
    
    private String appId;
    private String appSecret;
    private String mchId;//商户号
    private String clientSecret;//api秘钥
    private String callback_url;
    private String registerUrl;
    private Integer certificate;//证书
    
    private String mode;   //方式  1,用自己的支付页面 青创    2,统一支付页面 京环  3积分银行 4会员支付
    
    private String partner;//开户账户(积分银行)
    private String password;//登录密码(积分银行)
    
    private String getCodeUrl;//获取二维码地址
    private String deliverNoticeUrl;//出货结果通知地址

    public String getGetCodeUrl() {
        return getCodeUrl;
    }

    public void setGetCodeUrl(String getCodeUrl) {
        this.getCodeUrl = getCodeUrl;
    }

    public String getDeliverNoticeUrl() {
        return deliverNoticeUrl;
    }

    public void setDeliverNoticeUrl(String deliverNoticeUrl) {
        this.deliverNoticeUrl = deliverNoticeUrl;
    }
    

    public String getPartner() {
        return partner;
    }

    public void setPartner(String partner) {
        this.partner = partner;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    

    public Integer getCertificate() {
        return certificate;
    }

    public void setCertificate(Integer certificate) {
        this.certificate = certificate;
    }
    
    

    public String getMchId() {
        return mchId;
    }

    public void setMchId(String mchId) {
        this.mchId = mchId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
    }

    public String getCallback_url() {
        return callback_url;
    }

    public void setCallback_url(String callback_url) {
        this.callback_url = callback_url;
    }
    
    

    public String getRegisterUrl() {
        return registerUrl;
    }

    public void setRegisterUrl(String registerUrl) {
        this.registerUrl = registerUrl;
    }

    
    
    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getAppSecret() {
        return appSecret;
    }

    public void setAppSecret(String appSecret) {
        this.appSecret = appSecret;
    }

    
    
    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }   
       

    public Integer getAccept() {
        return accept;
    }

    public void setAccept(Integer accept) {
        this.accept = accept;
    }
    
    public String getVipInfoUrl() {
        return vipInfoUrl;
    }

    public void setVipInfoUrl(String vipInfoUrl) {
        this.vipInfoUrl = vipInfoUrl;
    }

    public String getTradeNoticeUrl() {
        return tradeNoticeUrl;
    }

    public void setTradeNoticeUrl(String tradeNoticeUrl) {
        this.tradeNoticeUrl = tradeNoticeUrl;
    }

    public String getShipmentNoticeUrl() {
        return shipmentNoticeUrl;
    }

    public void setShipmentNoticeUrl(String shipmentNoticeUrl) {
        this.shipmentNoticeUrl = shipmentNoticeUrl;
    }
    
    
}
