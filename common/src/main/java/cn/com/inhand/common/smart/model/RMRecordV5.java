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
 * @author lenovo
 */
public class RMRecordV5 {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oid;
    
    private ObjectId deviceId;
    private String deviceName;
    
    private ObjectId siteId;
    private String siteName;
    private ObjectId lineId;
    private String lineName;
    
    private String assetId;

    private Integer type;  //补货记录状态 0:正在补货 ; 1:补货完成
    
    private Float cashAmount;   //上报现金金额
    private Float noteIncome;   //纸币收入
    private Float coinInExpense;   //硬币收支
    
    private String cashMark;   //判断现金上报信息
    
    private String serialNumber;     //本次流水号
    private String nextSerialNumber;  //下次流水号
    
    private SaleDataV5 saleData;       //结账
    
    private Long createTime;
    private Long startTime;   //补货开始时间
    
    private Long lastTime;//上次补货时间
    
    private String lastReplenishId;  //上次补货id
    
    private List<CidReplenishRecord> cidRecord;     //货柜补货情况，补货开始时生成

    
    private Long endTime;    //补货结束时间
    
    private String soldoutCount;  //售空数量
    
  //  private Integer dataType;    //是否能上报数据
    
    private String operatorId;    //操作员ID
    private String stockRate;     //库存百分比
    
    private String replanId;     //补货计划ID  
    
    private Integer valve;
    
    private String replenishPersonId;  //补货人ID
    private String replenishPersonName; //补货人名字
    private String epemail;

    public String getLastReplenishId() {
        return lastReplenishId;
    }

    public void setLastReplenishId(String lastReplenishId) {
        this.lastReplenishId = lastReplenishId;
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

    
    
    public Float getCashAmount() {
        return cashAmount;
    }

    public void setCashAmount(Float cashAmount) {
        this.cashAmount = cashAmount;
    }

    
    
    public Long getLastTime() {
        return lastTime;
    }

    public void setLastTime(Long lastTime) {
        this.lastTime = lastTime;
    }

    
    
    public String getReplanId() {
        return replanId;
    }

    public void setReplanId(String replanId) {
        this.replanId = replanId;
    }

    
    
    public Integer getValve() {
        return valve;
    }

    public void setValve(Integer valve) {
        this.valve = valve;
    }

    public List<CidReplenishRecord> getCidRecord() {
        return cidRecord;
    }

    public void setCidRecord(List<CidReplenishRecord> cidRecord) {
        this.cidRecord = cidRecord;
    }

     
    
    
    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    
    public String getEpemail() {
        return epemail;
    }

    public void setEpemail(String epemail) {
        this.epemail = epemail;
    }
    
    

    public String getReplenishPersonId() {
        return replenishPersonId;
    }

    public void setReplenishPersonId(String replenishPersonId) {
        this.replenishPersonId = replenishPersonId;
    }

    

    public String getReplenishPersonName() {
        return replenishPersonName;
    }

    public void setReplenishPersonName(String replenishPersonName) {
        this.replenishPersonName = replenishPersonName;
    }

    
    public String getStockRate() {
        return stockRate;
    }

    public void setStockRate(String stockRate) {
        this.stockRate = stockRate;
    }
    
    

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }


    
    public String getSoldoutCount() {
        return soldoutCount;
    }

    public void setSoldoutCount(String soldoutCount) {
        this.soldoutCount = soldoutCount;
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

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }


    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public SaleDataV5 getSaleData() {
        return saleData;
    }

    public void setSaleData(SaleDataV5 saleData) {
        this.saleData = saleData;
    }
    

    
}
