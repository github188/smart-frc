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
 * @author liqiang
 */
public class ModelTreat {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机型机构ID
    private String deviceId;           //售货机ID
    private String assetId;           //售货机编号
    private String cid;               //货柜编号
    private String modelPicId;      //机型图片ID
    private String modelPicName;    //机型图片名称
    private String createPerson;   //创建人
    private String cpemail;     //邮箱
    
    private String model;//型号
    private Integer state;//状态
    
    private Long createTime;  //创建时间
    private Long updateTime;

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }

    
    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
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

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getModelPicId() {
        return modelPicId;
    }

    public void setModelPicId(String modelPicId) {
        this.modelPicId = modelPicId;
    }

    public String getModelPicName() {
        return modelPicName;
    }

    public void setModelPicName(String modelPicName) {
        this.modelPicName = modelPicName;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getCpemail() {
        return cpemail;
    }

    public void setCpemail(String cpemail) {
        this.cpemail = cpemail;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
    
    
    
}
