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
public class OvdpInbox {

    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private ObjectId oId;
    private String name;
    private ObjectId gwId;  
    private ObjectId siteId;
    private String siteName;
    private String sn;
    private Long createTime;
    private Long updateTime;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getoId() {
        return oId;
    }

    public void setoId(ObjectId oId) {
        this.oId = oId;
    }

    public String getName() {
        return name;
    }

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
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

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
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
