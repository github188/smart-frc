/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *工商银行
 * 融e联支付
 * @author shixj
 */
public class IcbcPay {
    private String appId;
    private String localPubKey;//本地公钥文件名称
    private String localPrivKey;//本地私钥文件名称
    private String platformPubKey;//平台公钥文件名称

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId;
    }

    public String getLocalPubKey() {
        return localPubKey;
    }

    public void setLocalPubKey(String localPubKey) {
        this.localPubKey = localPubKey;
    }

    public String getLocalPrivKey() {
        return localPrivKey;
    }

    public void setLocalPrivKey(String localPrivKey) {
        this.localPrivKey = localPrivKey;
    }

    public String getPlatformPubKey() {
        return platformPubKey;
    }

    public void setPlatformPubKey(String platformPubKey) {
        this.platformPubKey = platformPubKey;
    }
    
    
}
