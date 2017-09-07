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
public class SuggestReplenishment {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    
    private String deviceId;
    private String assetId;
    private String name;          //售货机名称
    private String siteId;	   //点位标识
    private String siteName; //点位名称
    private String lineId;//线路ID
    private String lineName;//线路
    
    private List<ContainerInfo> containers;

    private Integer suggestState=0;
    private Integer replenishState=0;
    
    private Long createTime;   //创建时间

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

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

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

    public List<ContainerInfo> getContainers() {
        return containers;
    }

    public void setContainers(List<ContainerInfo> containers) {
        this.containers = containers;
    }

    public Integer getSuggestState() {
        return suggestState;
    }

    public void setSuggestState(Integer suggestState) {
        this.suggestState = suggestState;
    }

    public Integer getReplenishState() {
        return replenishState;
    }

    public void setReplenishState(Integer replenishState) {
        this.replenishState = replenishState;
    }

    

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
    
    
    
}
