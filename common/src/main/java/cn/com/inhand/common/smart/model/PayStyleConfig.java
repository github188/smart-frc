/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author cttc
 */
public class PayStyleConfig {
    
    private String name;       //支付方式名称
    private Object config;     //支付配置
    private Integer accept;    //0：接收  1：屏蔽
    private Object delayrefund; //延时退款
    private String backDomain;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getConfig() {
        return config;
    }

    public void setConfig(Object config) {
        this.config = config;
    }

    public Integer getAccept() {
        return accept;
    }

    public void setAccept(Integer accept) {
        this.accept = accept;
    }

    public Object getDelayrefund() {
        return delayrefund;
    }

    public void setDelayrefund(Object delayrefund) {
        this.delayrefund = delayrefund;
    }

    public String getBackDomain() {
        return backDomain;
    }

    public void setBackDomain(String backDomain) {
        this.backDomain = backDomain;
    }
    
    
}
