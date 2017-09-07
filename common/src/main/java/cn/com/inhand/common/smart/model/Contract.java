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
 * @author 晓洁
 */
public class Contract {
    @Id
    @JsonProperty("_id")
    private ObjectId id;	            //唯一标识
    private ObjectId oid;	            //机构ID
    private String number;//合同编号
    private Integer style;          //合作方式 1租赁 2购买
    private Long startTime;            //租金起收日
    private Long endTime;              //租金截止日
    private String cycle;//付款周期
    private Long deliveryDate;            //租金交付日
    private Long collectionDay;              //租金催收日
    private List<ContractDevice> deviceInfo;
    private String email;
    private Long createTime;            //创建时间
    private Long updateTime;              //修改时间
    private List<ContractHistory> historyInfo;

    public List<ContractHistory> getHistoryInfo() {
        return historyInfo;
    }

    public void setHistoryInfo(List<ContractHistory> historyInfo) {
        this.historyInfo = historyInfo;
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

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public Integer getStyle() {
        return style;
    }

    public void setStyle(Integer style) {
        this.style = style;
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

    public String getCycle() {
        return cycle;
    }

    public void setCycle(String cycle) {
        this.cycle = cycle;
    }

    public Long getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(Long deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public Long getCollectionDay() {
        return collectionDay;
    }

    public void setCollectionDay(Long collectionDay) {
        this.collectionDay = collectionDay;
    }

    public List<ContractDevice> getDeviceInfo() {
        return deviceInfo;
    }

    public void setDeviceInfo(List<ContractDevice> deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
