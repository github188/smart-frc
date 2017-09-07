/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author fenghl
 */
public class TradeSiteSum {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	 //唯一标识
    private ObjectId oid;	 //机构ID
    private Long statisticTime;
    private Long createTime;
    private Long updateTime;
    private Long tradeSum;
    private Long amountSum;
    private ObjectId siteId;

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

    public Long getStatisticTime() {
        return statisticTime;
    }

    public void setStatisticTime(Long statisticTime) {
        this.statisticTime = statisticTime;
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

    public Long getTradeSum() {
        return tradeSum;
    }

    public void setTradeSum(Long tradeSum) {
        this.tradeSum = tradeSum;
    }

    public Long getAmountSum() {
        return amountSum;
    }

    public void setAmountSum(Long amountSum) {
        this.amountSum = amountSum;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }
}
