package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Policy {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String policyName;
    private Object sourcePolicy;
    private ObjectId oid;
    private ObjectId operatorId;
    private ObjectId deviceId;
    private Long createTime;
    private Long updateTime;
    private String model;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getPolicyName() {
        return policyName;
    }

    public void setPolicyName(String policyName) {
        this.policyName = policyName;
    }

    public Object getSourcePolicy() {
        return sourcePolicy;
    }

    public void setSourcePolicy(Object sourcePolicy) {
        this.sourcePolicy = sourcePolicy;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public ObjectId getOperatorId() {
        return operatorId;
    }

    public void setOperatorId(ObjectId operatorId) {
        this.operatorId = operatorId;
    }

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
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
