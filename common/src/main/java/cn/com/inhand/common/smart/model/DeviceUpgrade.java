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
public class DeviceUpgrade {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oid;
    private String upgradeName;//升级名称
    private String content_desc;//描述
    private int upgradeType;//升级类型 1(app升级) 2(固件升级) 3(VMC升级)
    private List<AppUpgrade> appList;
    private List<FirmwareUpgrade> firmwareList;
    private List<VmcUpgrade> vmcList;
    private List<DeviceAd> deviceList;
    private int status;//1 (已下发)
    private String configId;
    private Long createTime;
    private Long updateTime;
    
    private String vender;

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }
    
    

    public List<VmcUpgrade> getVmcList() {
        return vmcList;
    }

    public void setVmcList(List<VmcUpgrade> vmcList) {
        this.vmcList = vmcList;
    }

    
    
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getContent_desc() {
        return content_desc;
    }

    public void setContent_desc(String content_desc) {
        this.content_desc = content_desc;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public String getUpgradeName() {
        return upgradeName;
    }

    public void setUpgradeName(String upgradeName) {
        this.upgradeName = upgradeName;
    }

    public int getUpgradeType() {
        return upgradeType;
    }

    public void setUpgradeType(int upgradeType) {
        this.upgradeType = upgradeType;
    }

    public List<AppUpgrade> getAppList() {
        return appList;
    }

    public void setAppList(List<AppUpgrade> appList) {
        this.appList = appList;
    }

    public List<FirmwareUpgrade> getFirmwareList() {
        return firmwareList;
    }

    public void setFirmwareList(List<FirmwareUpgrade> firmwareList) {
        this.firmwareList = firmwareList;
    }

    public List<DeviceAd> getDeviceList() {
        return deviceList;
    }

    public void setDeviceList(List<DeviceAd> deviceList) {
        this.deviceList = deviceList;
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

    public String getConfigId() {
        return configId;
    }

    public void setConfigId(String configId) {
        this.configId = configId;
    }
    
}
