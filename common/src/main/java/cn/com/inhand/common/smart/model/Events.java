/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import net.sf.json.JSONObject;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author lenovo
 */
public class Events {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private Integer event_type;              //类型： 1 事件  2 告警
    private String assetId;
    private String cid;
    private String deviceName;
    private String siteName;
    private String siteNumber;   //点位编号
    private ObjectId lineId;
    private String lineName;
    private Integer event_class;   //事件类型  1 门开事件  2 同步货道配置  3 同步商品信息  4 补货  5 VCS重新注册  6 APP升级  7 同步广告文件  8 同步抽奖配置  9 门关 10 修改货道配置  11 同步机型配置  12  固件版本升  13 VSI升级 14 补货开始  15 工控重启
    private String sold_out_alarm_key;
    private String content;
    private Integer level;   //级别   1 一般  2 重要  3 严重
    private Long startTime;
    private Long endTime;
    private Integer action;    //  1 产生状态  2 自动恢愎   3  手动恢愎
    private Long updateTime;
    private Long createTime;
    private JSONObject la;

    public String getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(String siteNumber) {
        this.siteNumber = siteNumber;
    }

    
    
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

    public Integer getEvent_type() {
        return event_type;
    }

    public void setEvent_type(Integer event_type) {
        this.event_type = event_type;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public ObjectId getLineId() {
        return lineId;
    }

    public void setLineId(ObjectId lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public Integer getEvent_class() {
        return event_class;
    }

    public void setEvent_class(Integer event_class) {
        this.event_class = event_class;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

  

    public Integer getAction() {
        return action;
    }

    public void setAction(Integer action) {
        this.action = action;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getSold_out_alarm_key() {
        return sold_out_alarm_key;
    }

    public void setSold_out_alarm_key(String sold_out_alarm_key) {
        this.sold_out_alarm_key = sold_out_alarm_key;
    }

    public JSONObject getLa() {
        return la;
    }

    public void setLa(JSONObject la) {
        this.la = la;
    }
    
    
}
