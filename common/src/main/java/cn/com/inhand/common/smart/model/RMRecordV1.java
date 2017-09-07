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
public class RMRecordV1 {

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
    private String cid;
    private Integer type;
    private Integer machineType;
    private SaleDataV1 saleData;
    private StockDataV1 stockData;
    private Long createTime;
    private String soldoutCount;
    private Integer dataType;
    private String operatorId;
    private String stockRate;
    private String replenishPersonId;
    private String replenishPersonName;
    private String epemail;

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

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getMachineType() {
        return machineType;
    }

    public void setMachineType(Integer machineType) {
        this.machineType = machineType;
    }

    public SaleDataV1 getSaleData() {
        return saleData;
    }

    public void setSaleData(SaleDataV1 saleData) {
        this.saleData = saleData;
    }

    public StockDataV1 getStockData() {
        return stockData;
    }

    public void setStockData(StockDataV1 stockData) {
        this.stockData = stockData;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public String getSoldoutCount() {
        return soldoutCount;
    }

    public void setSoldoutCount(String soldoutCount) {
        this.soldoutCount = soldoutCount;
    }

    public Integer getDataType() {
        return dataType;
    }

    public void setDataType(Integer dataType) {
        this.dataType = dataType;
    }

    public String getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    public String getStockRate() {
        return stockRate;
    }

    public void setStockRate(String stockRate) {
        this.stockRate = stockRate;
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

    public String getEpemail() {
        return epemail;
    }

    public void setEpemail(String epemail) {
        this.epemail = epemail;
    }
}
