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
 * @author shixj
 */
public class AllStatisticDay {
        @Id
	@JsonProperty("_id")
	private ObjectId id;	              //唯一标识
	private ObjectId oid;	              //机构ID
        private Long amountOnLine;            //线上金额
        private Long sumOnLine;               //线上笔数
        private Long amountOutLine;           //线下金额
        private Long sumOutLine;              //线下笔数
        private Long amount;                  //总金额
        private Long sum;                     //总笔数
        
        private Long wechatAmount;            //微信金额
        private Long alipayAmount;            //支付宝金额
        private Long baifubaoAmount;          //百付宝金额
        private Long otherAmount;             //其他金额
        
        private Long wechatSum;               //微信笔数
        private Long alipaySum;               //支付宝笔数
        private Long baifubaoSum;             //百付宝笔数
        private Long otherSum;                //其他笔数
        
        private Long statisticTime;
        private Long createTime;
        private Long updateTime;

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

    public Long getAmountOnLine() {
        return amountOnLine;
    }

    public void setAmountOnLine(Long amountOnLine) {
        this.amountOnLine = amountOnLine;
    }

    public Long getSumOnLine() {
        return sumOnLine;
    }

    public void setSumOnLine(Long sumOnLine) {
        this.sumOnLine = sumOnLine;
    }

    public Long getAmountOutLine() {
        return amountOutLine;
    }

    public void setAmountOutLine(Long amountOutLine) {
        this.amountOutLine = amountOutLine;
    }

    public Long getSumOutLine() {
        return sumOutLine;
    }

    public void setSumOutLine(Long sumOutLine) {
        this.sumOutLine = sumOutLine;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getSum() {
        return sum;
    }

    public void setSum(Long sum) {
        this.sum = sum;
    }

    public Long getWechatAmount() {
        return wechatAmount;
    }

    public void setWechatAmount(Long wechatAmount) {
        this.wechatAmount = wechatAmount;
    }

    public Long getAlipayAmount() {
        return alipayAmount;
    }

    public void setAlipayAmount(Long alipayAmount) {
        this.alipayAmount = alipayAmount;
    }

    public Long getBaifubaoAmount() {
        return baifubaoAmount;
    }

    public void setBaifubaoAmount(Long baifubaoAmount) {
        this.baifubaoAmount = baifubaoAmount;
    }

    public Long getOtherAmount() {
        return otherAmount;
    }

    public void setOtherAmount(Long otherAmount) {
        this.otherAmount = otherAmount;
    }

    public Long getWechatSum() {
        return wechatSum;
    }

    public void setWechatSum(Long wechatSum) {
        this.wechatSum = wechatSum;
    }

    public Long getAlipaySum() {
        return alipaySum;
    }

    public void setAlipaySum(Long alipaySum) {
        this.alipaySum = alipaySum;
    }

    public Long getBaifubaoSum() {
        return baifubaoSum;
    }

    public void setBaifubaoSum(Long baifubaoSum) {
        this.baifubaoSum = baifubaoSum;
    }

    public Long getOtherSum() {
        return otherSum;
    }

    public void setOtherSum(Long otherSum) {
        this.otherSum = otherSum;
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
        
}
