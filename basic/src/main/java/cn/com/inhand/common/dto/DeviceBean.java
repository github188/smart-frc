/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.dto;

import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public class DeviceBean {
    private String assetId;
    private String name;
    private ObjectId areaId;
    private String areaName;
    private ObjectId siteId;
    private String siteName;
    private ObjectId dealerId;
    private String dealerName;
    private ObjectId moduleId;
    private String moduleName;
    private String vender;
    private Integer online;     //0 在线  1离线
    private Integer deviceType;    //  0 未认证   1 已认证
    private List<ObjectId> dealerIds;
    private List<ObjectId> areaIds;

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public ObjectId getDealerId() {
        return dealerId;
    }

    public void setDealerId(ObjectId dealerId) {
        this.dealerId = dealerId;
    }

    public String getDealerName() {
        return dealerName;
    }

    public void setDealerName(String dealerName) {
        this.dealerName = dealerName;
    }

    public ObjectId getModuleId() {
        return moduleId;
    }

    public void setModuleId(ObjectId moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }

    public Integer getOnline() {
        return online;
    }

    public void setOnline(Integer online) {
        this.online = online;
    }

    public Integer getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(Integer deviceType) {
        this.deviceType = deviceType;
    }

    public List<ObjectId> getDealerIds() {
        return dealerIds;
    }

    public void setDealerIds(List<ObjectId> dealerIds) {
        this.dealerIds = dealerIds;
    }

    public List<ObjectId> getAreaIds() {
        return areaIds;
    }

    public void setAreaIds(List<ObjectId> areaIds) {
        this.areaIds = areaIds;
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
}
