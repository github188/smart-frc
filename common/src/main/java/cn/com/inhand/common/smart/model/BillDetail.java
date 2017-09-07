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
public class BillDetail {
            @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private ObjectId deviceId;
    private String assetId;    //售货机编号
    
    private String money;//金额
    private ObjectId billId;//账单id
    
    private Integer sum;//交易量
    private Long createTime;

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
     * @return the deviceId
     */
    public ObjectId getDeviceId() {
        return deviceId;
    }

    /**
     * @param deviceId the deviceId to set
     */
    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
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
     * @return the billId
     */
    public ObjectId getBillId() {
        return billId;
    }

    /**
     * @param billId the billId to set
     */
    public void setBillId(ObjectId billId) {
        this.billId = billId;
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
     * @return the sum
     */
    public Integer getSum() {
        return sum;
    }

    /**
     * @param sum the sum to set
     */
    public void setSum(Integer sum) {
        this.sum = sum;
    }

    /**
     * @return the money
     */
    public String getMoney() {
        return money;
    }

    /**
     * @param money the money to set
     */
    public void setMoney(String money) {
        this.money = money;
    }
    
}
