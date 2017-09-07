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
 *售货机销售数量
 * @author shixj
 */
public class AutomatSaleSum {
    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private ObjectId deviceId;
    private String deviceName;
    private String assetId;    //售货机编号
    private List<ShelfSum> goodsConfig;//售货机货道信息
    private List<Containers> containers;//扩展柜信息
    private int status;//补货状态 1：只开门上报，0：开门且确认上报
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

    public List<ShelfSum> getGoodsConfig() {
        return goodsConfig;
    }

    public void setGoodsConfig(List<ShelfSum> goodsConfig) {
        this.goodsConfig = goodsConfig;
    }

    public List<Containers> getContainers() {
        return containers;
    }

    public void setContainers(List<Containers> containers) {
        this.containers = containers;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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
