package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;


import com.fasterxml.jackson.annotation.JsonProperty;

/**
 *
 * @author shixj
 *
 */
public class PayStyle {

    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private String name;
    private Object config;
    private Integer accept;    //0：接收  1：屏蔽
    private Object delayrefund; //延时退款
    private String backDomain;

    public String getBackDomain() {
        return backDomain;
    }

    public void setBackDomain(String backDomain) {
        this.backDomain = backDomain;
    }
    

    public Object getDelayrefund() {
        return delayrefund;
    }

    public void setDelayrefund(Object delayrefund) {
        this.delayrefund = delayrefund;
    }

    
    public PayStyle() {
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

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

}
