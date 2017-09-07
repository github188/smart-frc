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
 * @author liqiang
 */
//结算
public class SettlementRecord {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    
    private String areaId;           //区域ID
    private String areaname;          //区域名称
        
    //wechat
    private Float wechatAmount;    //订单总金额
    private Float wechatRefundAmount;   //退款金额
    private Float wechatIncomeAmount;   //净收入
    
    private Float wechatCounterFee;   //手续费
    private Float wechatReceivableAmount;  //应给款
    
    //alipay
    private Float alipayAmount;
    private Float alipayRefundAmount;
    private Float alipayIncomeAmount;
    
    private Float alipayCounterFee;
    private Float alipayReceivableAmount;  
    
    
    private Long startTime;    //交易开始时间
    private Long endTime;       //交易结束时间
    
    private String tradeRangeTime;  //交易时间区间

    
    private Long settleTime;         //结算时间

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

    public String getAreaId() {
        return areaId;
    }

    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    public String getAreaname() {
        return areaname;
    }

    public void setAreaname(String areaname) {
        this.areaname = areaname;
    }


    

    public Float getWechatAmount() {
        return wechatAmount;
    }

    public void setWechatAmount(Float wechatAmount) {
        this.wechatAmount = wechatAmount;
    }

    public Float getWechatRefundAmount() {
        return wechatRefundAmount;
    }

    public void setWechatRefundAmount(Float wechatRefundAmount) {
        this.wechatRefundAmount = wechatRefundAmount;
    }

    public Float getWechatIncomeAmount() {
        return wechatIncomeAmount;
    }

    public void setWechatIncomeAmount(Float wechatIncomeAmount) {
        this.wechatIncomeAmount = wechatIncomeAmount;
    }

    public Float getWechatCounterFee() {
        return wechatCounterFee;
    }

    public void setWechatCounterFee(Float wechatCounterFee) {
        this.wechatCounterFee = wechatCounterFee;
    }

    public Float getWechatReceivableAmount() {
        return wechatReceivableAmount;
    }

    public void setWechatReceivableAmount(Float wechatReceivableAmount) {
        this.wechatReceivableAmount = wechatReceivableAmount;
    }

    public Float getAlipayAmount() {
        return alipayAmount;
    }

    public void setAlipayAmount(Float alipayAmount) {
        this.alipayAmount = alipayAmount;
    }

    public Float getAlipayRefundAmount() {
        return alipayRefundAmount;
    }

    public void setAlipayRefundAmount(Float alipayRefundAmount) {
        this.alipayRefundAmount = alipayRefundAmount;
    }

    public Float getAlipayIncomeAmount() {
        return alipayIncomeAmount;
    }

    public void setAlipayIncomeAmount(Float alipayIncomeAmount) {
        this.alipayIncomeAmount = alipayIncomeAmount;
    }

    public Float getAlipayCounterFee() {
        return alipayCounterFee;
    }

    public void setAlipayCounterFee(Float alipayCounterFee) {
        this.alipayCounterFee = alipayCounterFee;
    }

    public Float getAlipayReceivableAmount() {
        return alipayReceivableAmount;
    }

    public void setAlipayReceivableAmount(Float alipayReceivableAmount) {
        this.alipayReceivableAmount = alipayReceivableAmount;
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

    public String getTradeRangeTime() {
        return tradeRangeTime;
    }

    public void setTradeRangeTime(String tradeRangeTime) {
        this.tradeRangeTime = tradeRangeTime;
    }

    public Long getSettleTime() {
        return settleTime;
    }

    public void setSettleTime(Long settleTime) {
        this.settleTime = settleTime;
    }
    

    
    
    
    
    
    
}
