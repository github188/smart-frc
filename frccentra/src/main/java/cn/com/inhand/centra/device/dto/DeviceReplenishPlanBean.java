/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import org.bson.types.ObjectId;

/**
 *
 * @author cttc
 */
public class DeviceReplenishPlanBean {
    private ObjectId oid;	         //机构ID
    
    private ObjectId replenishplanId;    //补货计划Id
    private String assetId;              //设备编号
    private String executivePerson;      //执行人
    private String executivePersonId;   //执行人ID
    private Long executiveTime;         //执行时间
    
    private Integer state=0;              //补货状态
    private String cid;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }
    

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public ObjectId getReplenishplanId() {
        return replenishplanId;
    }

    public void setReplenishplanId(ObjectId replenishplanId) {
        this.replenishplanId = replenishplanId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getExecutivePerson() {
        return executivePerson;
    }

    public void setExecutivePerson(String executivePerson) {
        this.executivePerson = executivePerson;
    }

    public String getExecutivePersonId() {
        return executivePersonId;
    }

    public void setExecutivePersonId(String executivePersonId) {
        this.executivePersonId = executivePersonId;
    }

    public Long getExecutiveTime() {
        return executiveTime;
    }

    public void setExecutiveTime(Long executiveTime) {
        this.executiveTime = executiveTime;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }
    
    
}
