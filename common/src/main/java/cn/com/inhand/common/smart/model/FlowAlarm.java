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
 * @author xupeijiao
 */
public class FlowAlarm {
     @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private String name;
    private String assetId;    //售货机编号
    
        
    private String lineId;//线路ID
    private String lineName;//线路 
    private String siteId;	   //点位标识
    private String siteName; //点位名称
    private String flowPackage;//流量套餐 b
    private String flowUsed;//已使用流量 b
    private String residueFlow;//剩余流量 b
    private Integer level;//级别 
    private Long createTime;//创建时间

    /**
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * @return the oid
     */
    public ObjectId getOid() {
        return oid;
    }

    /**
     * @param oid the oid to set
     */
    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the assetId
     */
    public String getAssetId() {
        return assetId;
    }

    /**
     * @param assetId the assetId to set
     */
    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    /**
     * @return the lineId
     */
    public String getLineId() {
        return lineId;
    }

    /**
     * @param lineId the lineId to set
     */
    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    /**
     * @return the lineName
     */
    public String getLineName() {
        return lineName;
    }

    /**
     * @param lineName the lineName to set
     */
    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    /**
     * @return the siteId
     */
    public String getSiteId() {
        return siteId;
    }

    /**
     * @param siteId the siteId to set
     */
    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    /**
     * @return the siteName
     */
    public String getSiteName() {
        return siteName;
    }

    /**
     * @param siteName the siteName to set
     */
    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    /**
     * @return the flowPackage
     */
    public String getFlowPackage() {
        return flowPackage;
    }

    /**
     * @param flowPackage the flowPackage to set
     */
    public void setFlowPackage(String flowPackage) {
        this.flowPackage = flowPackage;
    }

    /**
     * @return the flowUsed
     */
    public String getFlowUsed() {
        return flowUsed;
    }

    /**
     * @param flowUsed the flowUsed to set
     */
    public void setFlowUsed(String flowUsed) {
        this.flowUsed = flowUsed;
    }

    /**
     * @return the residueFlow
     */
    public String getResidueFlow() {
        return residueFlow;
    }

    /**
     * @param residueFlow the residueFlow to set
     */
    public void setResidueFlow(String residueFlow) {
        this.residueFlow = residueFlow;
    }

    /**
     * @return the level
     */
    public Integer getLevel() {
        return level;
    }

    /**
     * @param level the level to set
     */
    public void setLevel(Integer level) {
        this.level = level;
    }

    /**
     * @return the createTime
     */
    public Long getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime the createTime to set
     */
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
}
