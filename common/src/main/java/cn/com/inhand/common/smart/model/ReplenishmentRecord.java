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
 * @author shixj
 */
public class ReplenishmentRecord {
     @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private ObjectId deviceId;
    private String deviceName;
    private String assetId;    //售货机编号
    private Long timestamp;   //售货机产生的数据
    private String lineId;  //线路ID
    private String lineName;  //线路名称
    private Integer recordType; //补货记录类型  1：售货机上报  2：手工导入
    private List<Integer> coin;  //补币数量，
    private List<ShelfSum> shelves;//售货机货道信息
    private List<Containers> containers;//扩展柜信息
    private String siteId;
    private String siteName;
    
    private List<GoodsRecord> goodsRecords;
    private List<GoodsRecord> goodsRecordsApp;
    
    //商品List 表示应补数量
    private int type;//补货记录状态 1：当前活跃记录，0：历史补货记录
    private Long createTime;//产生时间
    private Long updateTime;//结束时间

    
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

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public List<ShelfSum> getShelves() {
        return shelves;
    }

    public void setShelves(List<ShelfSum> shelves) {
        this.shelves = shelves;
    }

    public List<Containers> getContainers() {
        return containers;
    }

    public void setContainers(List<Containers> containers) {
        this.containers = containers;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
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

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public List<Integer> getCoin() {
        return coin;
    }

    public void setCoin(List<Integer> coin) {
        this.coin = coin;
    }

    public List<GoodsRecord> getGoodsRecords() {
        return goodsRecords;
    }

    public void setGoodsRecords(List<GoodsRecord> goodsRecords) {
        this.goodsRecords = goodsRecords;
    }

    public List<GoodsRecord> getGoodsRecordsApp() {
        return goodsRecordsApp;
    }

    public void setGoodsRecordsApp(List<GoodsRecord> goodsRecordsApp) {
        this.goodsRecordsApp = goodsRecordsApp;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public Integer getRecordType() {
        return recordType;
    }

    public void setRecordType(Integer recordType) {
        this.recordType = recordType;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }
    
}
