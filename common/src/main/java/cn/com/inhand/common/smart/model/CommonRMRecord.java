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
public class CommonRMRecord {
       
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oid;
    private ObjectId deviceId;  
    private String assetId;
    private ObjectId siteId;
    private String siteNumber;
    private String siteName;
    private ObjectId lineId;
    private String lineName;
    private Integer type;  //补货记录状态 0:正在补货 ; 1:补货完成
    private Float cashAmount;   //上报现金金额
    private Float noteIncome;   //纸币收入
    private Float coinInExpense;   //硬币收支
    private String cashMark;   //判断现金上报信息
    private String serialNumber;     //本次流水号
    private String nextSerialNumber;  //下次流水号
       
    private List<CidCheckOutData> cidSales;  //各个货柜销售情况
    
    private PayStyleCheckOutData payStyleData;  //各种支付方式销售数据
    
    private PayStyleCheckOutData payStyleData2;  //上次补货到本次补货期间各种支付方式销售情况
    
    private Long createTime;   //本次补货时间
    
    private Long lastTime;//上次补货时间
    
    private String lastReplenishId;  //上次补货id
    
    private String operatorId;    //操作员ID
    
    private String stockRate;    //库存情况
    
    private String soldoutCount;  //售空个数
    
    private Integer confirmBill;  //确认报账
    
    private Long confirmTime;  //确认时间

    public Long getConfirmTime() {
        return confirmTime;
    }

    public void setConfirmTime(Long confirmTime) {
        this.confirmTime = confirmTime;
    }

    
    public String getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(String siteNumber) {
        this.siteNumber = siteNumber;
    }

    
    
    public Integer getConfirmBill() {
        return confirmBill;
    }

    public void setConfirmBill(Integer confirmBill) {
        this.confirmBill = confirmBill;
    }
    
    

    public PayStyleCheckOutData getPayStyleData2() {
        return payStyleData2;
    }

    public void setPayStyleData2(PayStyleCheckOutData payStyleData2) {
        this.payStyleData2 = payStyleData2;
    }

    
    
    public String getStockRate() {
        return stockRate;
    }

    public void setStockRate(String stockRate) {
        this.stockRate = stockRate;
    }

    public String getSoldoutCount() {
        return soldoutCount;
    }

    public void setSoldoutCount(String soldoutCount) {
        this.soldoutCount = soldoutCount;
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

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
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

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Float getCashAmount() {
        return cashAmount;
    }

    public void setCashAmount(Float cashAmount) {
        this.cashAmount = cashAmount;
    }

    public Float getNoteIncome() {
        return noteIncome;
    }

    public void setNoteIncome(Float noteIncome) {
        this.noteIncome = noteIncome;
    }

    public Float getCoinInExpense() {
        return coinInExpense;
    }

    public void setCoinInExpense(Float coinInExpense) {
        this.coinInExpense = coinInExpense;
    }

    public String getCashMark() {
        return cashMark;
    }

    public void setCashMark(String cashMark) {
        this.cashMark = cashMark;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public String getNextSerialNumber() {
        return nextSerialNumber;
    }

    public void setNextSerialNumber(String nextSerialNumber) {
        this.nextSerialNumber = nextSerialNumber;
    }

    public List<CidCheckOutData> getCidSales() {
        return cidSales;
    }

    public void setCidSales(List<CidCheckOutData> cidSales) {
        this.cidSales = cidSales;
    }

    public PayStyleCheckOutData getPayStyleData() {
        return payStyleData;
    }

    public void setPayStyleData(PayStyleCheckOutData payStyleData) {
        this.payStyleData = payStyleData;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getLastTime() {
        return lastTime;
    }

    public void setLastTime(Long lastTime) {
        this.lastTime = lastTime;
    }

    public String getLastReplenishId() {
        return lastReplenishId;
    }

    public void setLastReplenishId(String lastReplenishId) {
        this.lastReplenishId = lastReplenishId;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }
     
    
    
    
}
