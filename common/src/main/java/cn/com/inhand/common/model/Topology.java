package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Topology {
    @Id
    @JsonProperty("_id")
    private ObjectId id;

    private ObjectId siteId;

    private ObjectId gatewayId;

    private Integer sensorId;

    private Integer sensorType;

    private Integer plcId;

    private ObjectId modelId;

    private ObjectId machineId;

    private int ioType;

    private long createTime;

    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    public ObjectId getGatewayId() {
        return gatewayId;
    }

    public ObjectId getId() {
        return id;
    }

    public int getIoType() {
        return ioType;
    }

    public ObjectId getMachineId() {
        return machineId;
    }

    public ObjectId getModelId() {
        return modelId;
    }

    public Integer getPlcId() {
        return plcId;
    }

    public Integer getSensorId() {
        return sensorId;
    }

    public Integer getSensorType() {
        return sensorType;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setGatewayId(ObjectId gatewayId) {
        this.gatewayId = gatewayId;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public void setIoType(int ioType) {
        this.ioType = ioType;
    }

    public void setMachineId(ObjectId machineId) {
        this.machineId = machineId;
    }

    public void setModelId(ObjectId modelId) {
        this.modelId = modelId;
    }

    public void setPlcId(Integer plcId) {
        this.plcId = plcId;
    }

    public void setSensorId(Integer sensorId) {
        this.sensorId = sensorId;
    }

    public void setSensorType(Integer sensorType) {
        this.sensorType = sensorType;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    /* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Topology [");
        if (id != null) {
            builder.append("id=");
            builder.append(id);
            builder.append(", ");
        }
        if (siteId != null) {
            builder.append("siteId=");
            builder.append(siteId);
            builder.append(", ");
        }
        if (gatewayId != null) {
            builder.append("gatewayId=");
            builder.append(gatewayId);
            builder.append(", ");
        }
        if (sensorId != null) {
            builder.append("sensorId=");
            builder.append(sensorId);
            builder.append(", ");
        }
        if (sensorType != null) {
            builder.append("sensorType=");
            builder.append(sensorType);
            builder.append(", ");
        }
        if (plcId != null) {
            builder.append("plcId=");
            builder.append(plcId);
            builder.append(", ");
        }
        if (modelId != null) {
            builder.append("modelId=");
            builder.append(modelId);
            builder.append(", ");
        }
        if (machineId != null) {
            builder.append("machineId=");
            builder.append(machineId);
            builder.append(", ");
        }
        builder.append("ioType=");
        builder.append(ioType);
        builder.append(", createTime=");
        builder.append(createTime);
        builder.append("]");
        return builder.toString();
    }

}
