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
 * @author cttc
 */
public class SmartTrafficStatistic {
       @Id
    @JsonProperty("_id")
    private ObjectId id;	             //唯一标识
    private ObjectId oid;	             //机构ID
    /**
     * 序列号
     */
    private String sn;
    private String name;//售货机名称
    /**
     * 设备编号
     */
    private String assetId;
    
    private String lineId;//线路ID
    private String lineName;//线路 
    private String siteId;	   //点位标识
    private String siteName; //点位名称
    
       /**
     * 上行流量
     */
    private Long updata;
    /**
     * 下行流量
     */
    private Long downdata;
    private Long statisticTime;
    private Long createTime;
    private Long updateTime;
    private int type;           //1 表示日  2 表示月  3 表示年

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
     * @return the sn
     */
    public String getSn() {
        return sn;
    }

    /**
     * @param sn the sn to set
     */
    public void setSn(String sn) {
        this.sn = sn;
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
     * @return the statisticTime
     */
    public Long getStatisticTime() {
        return statisticTime;
    }

    /**
     * @param statisticTime the statisticTime to set
     */
    public void setStatisticTime(Long statisticTime) {
        this.statisticTime = statisticTime;
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

    /**
     * @return the updateTime
     */
    public Long getUpdateTime() {
        return updateTime;
    }

    /**
     * @param updateTime the updateTime to set
     */
    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * @return the type
     */
    public int getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(int type) {
        this.type = type;
    }

    /**
     * @return the updata
     */
    public Long getUpdata() {
        return updata;
    }

    /**
     * @param updata the updata to set
     */
    public void setUpdata(Long updata) {
        this.updata = updata;
    }

    /**
     * @return the downdata
     */
    public Long getDowndata() {
        return downdata;
    }

    /**
     * @param downdata the downdata to set
     */
    public void setDowndata(Long downdata) {
        this.downdata = downdata;
    }


    
}
