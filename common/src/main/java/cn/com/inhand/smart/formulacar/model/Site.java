/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.smart.formulacar.model;

import cn.com.inhand.common.smart.model.Location;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author lenovo
 */
public class Site {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private String siteNum;
    private String name;
    private ObjectId dealerId;
    private String dealerName;
    private Location location;     //点位位置信息
    private Integer price;
    private Long startTime;
    private List<SiteModules> modules;
    private String siteType;  //行业
    private String desc;  //备注
    private Long createTime;
    private Long updateTime;

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

    public String getSiteNum() {
        return siteNum;
    }

    public void setSiteNum(String siteNum) {
        this.siteNum = siteNum;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getSiteType() {
        return siteType;
    }

    public void setSiteType(String siteType) {
        this.siteType = siteType;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
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

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public List<SiteModules> getModules() {
        return modules;
    }

    public void setModules(List<SiteModules> modules) {
        this.modules = modules;
    }
    
}
