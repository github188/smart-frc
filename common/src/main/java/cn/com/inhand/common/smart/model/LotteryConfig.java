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
 * @author cttc
 */
public class LotteryConfig {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	            //唯一标识
    private ObjectId oid;	            //机构ID
    private String lotteryName;                //抽奖名称
    private String desc;            //描述
    private List<LotteryDevice> devices;            //
    private int status;        //状态 1为保存状态   2 配置以下发状态
    private Lottery config;                 //
    private String xmlFileId;               //xmlid   
    private Long createTime;            //添加时间
    private Long updateTime;            //修改时间
    private String autoRun;
    private String canBuy;

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

    public String getLotteryName() {
        return lotteryName;
    }

    public void setLotteryName(String lotteryName) {
        this.lotteryName = lotteryName;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public List<LotteryDevice> getDevices() {
        return devices;
    }

    public void setDevices(List<LotteryDevice> devices) {
        this.devices = devices;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public Lottery getConfig() {
        return config;
    }

    public void setConfig(Lottery config) {
        this.config = config;
    }

    public String getXmlFileId() {
        return xmlFileId;
    }

    public void setXmlFileId(String xmlFileId) {
        this.xmlFileId = xmlFileId;
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

    public String getAutoRun() {
        return autoRun;
    }

    public void setAutoRun(String autoRun) {
        this.autoRun = autoRun;
    }

    public String getCanBuy() {
        return canBuy;
    }

    public void setCanBuy(String canBuy) {
        this.canBuy = canBuy;
    }
    
}
