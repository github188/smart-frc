/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author liqiang
 */
public class SpecialOffer {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	            //唯一标识
    private ObjectId oid;	            //机构ID
    
    private String name;                  //优惠活动名称
    private Object config;              //具体配置
    private Integer type;              //类型，1:关注送水 ,2:买一送一  ,3:立减   ,4:折扣
    
    private List<String> payStyles;   //参与优惠活动的支付方式
    
    private String pickupMethod;//取货方式 1正常取货 2取货码取货
    
    private Integer status;     //下发状态  1：保存  2:下发
    
    private Long startTime;           //活动开始时间
    private Long endTime;             //活动结束时间
    
    private Long createTime;        //创建时间
    private Long updateTime;         //更新时间

    public String getPickupMethod() {
        return pickupMethod;
    }

    public void setPickupMethod(String pickupMethod) {
        this.pickupMethod = pickupMethod;
    }
    
    

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
  
    
    public List<String> getPayStyles() {
        return payStyles;
    }

    public void setPayStyles(List<String> payStyles) {
        this.payStyles = payStyles;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }
    
    
    
}
