/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;


/**
 *
 * @author liqiang
 */
public class OutInterfaceConfig {
       
    
    private Integer interfaceType;   //接口类型  1：http  2:webservice
    
    private String parameterWS;    //webservice接口有此参数
    
    private Integer accept=0;         //是否开启外部推送
    
    private String deviceMsgUrl;      //平台添加设备时推送地址
    
    private String tradeMsgUrl;     //产生交易时推送地址
    
    private String statusMsgUrl;   //设备状态发生变化时推送地址
    
    private String codeAuthMsgUrl;   //第三方取货码验证接口
    private Integer codeLength;     //取货码长度
    
    private String codeCancelMsgUrl;  //第三方取货码核销接口
    
    private String replenishMsgUrl;   //补货信息推送地址

    public String getParameterWS() {
        return parameterWS;
    }

    public void setParameterWS(String parameterWS) {
        this.parameterWS = parameterWS;
    }
    
    
    public Integer getInterfaceType() {
        return interfaceType;
    }

    public void setInterfaceType(Integer interfaceType) {
        this.interfaceType = interfaceType;
    }

    
    
    
    public Integer getCodeLength() {
        return codeLength;
    }

    public void setCodeLength(Integer codeLength) {
        this.codeLength = codeLength;
    }

    public Integer getAccept() {
        return accept;
    }

    public void setAccept(Integer accept) {
        this.accept = accept;
    }

    public String getDeviceMsgUrl() {
        return deviceMsgUrl;
    }

    public void setDeviceMsgUrl(String deviceMsgUrl) {
        this.deviceMsgUrl = deviceMsgUrl;
    }

    public String getTradeMsgUrl() {
        return tradeMsgUrl;
    }

    public void setTradeMsgUrl(String tradeMsgUrl) {
        this.tradeMsgUrl = tradeMsgUrl;
    }

    public String getStatusMsgUrl() {
        return statusMsgUrl;
    }

    public void setStatusMsgUrl(String statusMsgUrl) {
        this.statusMsgUrl = statusMsgUrl;
    }

    public String getCodeAuthMsgUrl() {
        return codeAuthMsgUrl;
    }

    public void setCodeAuthMsgUrl(String codeAuthMsgUrl) {
        this.codeAuthMsgUrl = codeAuthMsgUrl;
    }

    public String getCodeCancelMsgUrl() {
        return codeCancelMsgUrl;
    }

    public void setCodeCancelMsgUrl(String codeCancelMsgUrl) {
        this.codeCancelMsgUrl = codeCancelMsgUrl;
    }

    public String getReplenishMsgUrl() {
        return replenishMsgUrl;
    }

    public void setReplenishMsgUrl(String replenishMsgUrl) {
        this.replenishMsgUrl = replenishMsgUrl;
    }
    
    
    
    
}
