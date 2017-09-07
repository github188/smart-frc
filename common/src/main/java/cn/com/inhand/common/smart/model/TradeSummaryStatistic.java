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
 * @author lenovo
 */
public class TradeSummaryStatistic {
    @Id
    @JsonProperty("_id")
    private ObjectId id;	 //唯一标识
    private ObjectId oid;	 //机构ID
    private String assetId;
    private Long statisticTime;
    private ObjectId deviceId;
    private String deviceName;
    private ObjectId siteId;
    private String siteName;
    private ObjectId lineId;
    private String lineName;
    private ObjectId areaId;
    private String areaName;
    private Integer wechatTradeSummary;     //微信交易总量
    private Integer wechatTradeAmount;      //微信交易总金额
    private Integer wechatRefundTradeSummary;   //微信退款总量
    private Integer wechatRefundTradeAmount;    //微信退款总金额
    private Integer wechatTradeFee;             //微信交易手续费
    
    private Integer alipayTradeSummary;     //微信交易总量
    private Integer alipayTradeAmount;      //微信交易总金额
    private Integer alipayRefundTradeSummary;   //微信退款总量
    private Integer alipayRefundTradeAmount;    //微信退款总金额
    private Integer alipayTradeFee;             //微信交易手续费
    
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

    public Long getStatisticTime() {
        return statisticTime;
    }

    public void setStatisticTime(Long statisticTime) {
        this.statisticTime = statisticTime;
    }

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public ObjectId getLineId() {
        return lineId;
    }

    public void setLineId(ObjectId lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public ObjectId getAreaId() {
        return areaId;
    }

    public void setAreaId(ObjectId areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    public Integer getWechatTradeSummary() {
        return wechatTradeSummary;
    }

    public void setWechatTradeSummary(Integer wechatTradeSummary) {
        this.wechatTradeSummary = wechatTradeSummary;
    }

    public Integer getWechatTradeAmount() {
        return wechatTradeAmount;
    }

    public void setWechatTradeAmount(Integer wechatTradeAmount) {
        this.wechatTradeAmount = wechatTradeAmount;
    }

    public Integer getWechatRefundTradeSummary() {
        return wechatRefundTradeSummary;
    }

    public void setWechatRefundTradeSummary(Integer wechatRefundTradeSummary) {
        this.wechatRefundTradeSummary = wechatRefundTradeSummary;
    }

    public Integer getWechatRefundTradeAmount() {
        return wechatRefundTradeAmount;
    }

    public void setWechatRefundTradeAmount(Integer wechatRefundTradeAmount) {
        this.wechatRefundTradeAmount = wechatRefundTradeAmount;
    }

    public Integer getWechatTradeFee() {
        return wechatTradeFee;
    }

    public void setWechatTradeFee(Integer wechatTradeFee) {
        this.wechatTradeFee = wechatTradeFee;
    }

    public Integer getAlipayTradeSummary() {
        return alipayTradeSummary;
    }

    public void setAlipayTradeSummary(Integer alipayTradeSummary) {
        this.alipayTradeSummary = alipayTradeSummary;
    }

    public Integer getAlipayTradeAmount() {
        return alipayTradeAmount;
    }

    public void setAlipayTradeAmount(Integer alipayTradeAmount) {
        this.alipayTradeAmount = alipayTradeAmount;
    }

    public Integer getAlipayRefundTradeSummary() {
        return alipayRefundTradeSummary;
    }

    public void setAlipayRefundTradeSummary(Integer alipayRefundTradeSummary) {
        this.alipayRefundTradeSummary = alipayRefundTradeSummary;
    }

    public Integer getAlipayRefundTradeAmount() {
        return alipayRefundTradeAmount;
    }

    public void setAlipayRefundTradeAmount(Integer alipayRefundTradeAmount) {
        this.alipayRefundTradeAmount = alipayRefundTradeAmount;
    }

    public Integer getAlipayTradeFee() {
        return alipayTradeFee;
    }

    public void setAlipayTradeFee(Integer alipayTradeFee) {
        this.alipayTradeFee = alipayTradeFee;
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

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }
    
}
