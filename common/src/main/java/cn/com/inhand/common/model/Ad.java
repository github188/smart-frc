/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.model;

import cn.com.inhand.common.smart.model.DeviceAd;
import cn.com.inhand.common.smart.model.Media;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import cn.com.inhand.common.smart.model.Policy;

/**
 *
 * @author cttc
 */
public class Ad {

    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oid;
    private String adName;
    private List<Media> mediaList;
    private List<DeviceAd> deviceList;
    
    private int status;
    private Long pushTime;
    private Long createTime;
    private Long updateTime;
    private String version;
    private String configId;
    private List<Policy> policyList;
    
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

    public String getAdName() {
        return adName;
    }

    public void setAdName(String adName) {
        this.adName = adName;
    }

    public List<Media> getMediaList() {
        return mediaList;
    }

    public void setMediaList(List<Media> mediaList) {
        this.mediaList = mediaList;
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

    public Long getPushTime() {
        return pushTime;
    }

    public void setPushTime(Long pushTime) {
        this.pushTime = pushTime;
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

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getConfigId() {
        return configId;
    }

    public void setConfigId(String configId) {
        this.configId = configId;
    }

    /**
     * @return the policyList
     */
    public List<Policy> getPolicyList() {
        return policyList;
    }

    /**
     * @param policyList the policyList to set
     */
    public void setPolicyList(List<Policy> policyList) {
        this.policyList = policyList;
    }
    
}
