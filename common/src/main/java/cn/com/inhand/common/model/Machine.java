package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Machine {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String name;
    private String serialNumber;
    private ObjectId modelId;
    private String model;
    private String siteName;
    private ObjectId siteId;
    private ObjectId gatewayId;
    private ObjectId oid;
    private ObjectId owner;
    private ObjectId groupId;
    private Integer sensorId;
    private Integer plcId;
    private Integer type;
    private Long createTime;
    private Long updateTime;
    private Integer timezone;
    private MachineConfig machineConfig;
    private String alias;
    
    public ObjectId getGroupId() {
		return groupId;
	}

	public void setGroupId(ObjectId groupId) {
		this.groupId = groupId;
	}

	public Long getCreateTime() {
        return createTime;
    }

    /**
     * @return the gatewayId
     */
    public ObjectId getGatewayId() {
        return gatewayId;
    }

    public ObjectId getId() {
        return id;
    }

    public MachineConfig getMachineConfig() {
        return machineConfig;
    }

    public String getModel() {
        return model;
    }

    public ObjectId getModelId() {
        return modelId;
    }

    public String getName() {
        return name;
    }

    public ObjectId getOid() {
        return oid;
    }

    public ObjectId getOwner() {
        return owner;
    }

    public Integer getPlcId() {
        return plcId;
    }

    /**
     * @return the sensorId
     */
    public Integer getSensorId() {
        return sensorId;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public Integer getTimezone() {
        return timezone;
    }

    public Integer getType() {
        return type;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    /**
     * @param gatewayId the gatewayId to set
     */
    public void setGatewayId(ObjectId gatewayId) {
        this.gatewayId = gatewayId;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public void setMachineConfig(MachineConfig machineConfig) {
        this.machineConfig = machineConfig;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setModelId(ObjectId modelId) {
        this.modelId = modelId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public void setOwner(ObjectId owner) {
        this.owner = owner;
    }

    public void setPlcId(Integer plcId) {
        this.plcId = plcId;
    }

    /**
     * @param sensorId the sensorId to set
     */
    public void setSensorId(Integer sensorId) {
        this.sensorId = sensorId;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public void setTimezone(Integer timezone) {
        this.timezone = timezone;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	/* (non-Javadoc)
     * @see java.lang.Object#toString()
     */
    @Override
    public String toString() {
        StringBuilder builder = new StringBuilder();
        builder.append("Machine [");
        if (id != null) {
            builder.append("id=");
            builder.append(id);
            builder.append(", ");
        }
        if (name != null) {
            builder.append("name=");
            builder.append(name);
            builder.append(", ");
        }
        if (serialNumber != null) {
            builder.append("serialNumber=");
            builder.append(serialNumber);
            builder.append(", ");
        }
        if (modelId != null) {
            builder.append("modelId=");
            builder.append(modelId);
            builder.append(", ");
        }
        if (model != null) {
            builder.append("model=");
            builder.append(model);
            builder.append(", ");
        }
        if (siteName != null) {
            builder.append("siteName=");
            builder.append(siteName);
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
        if (oid != null) {
            builder.append("oid=");
            builder.append(oid);
            builder.append(", ");
        }
        if (owner != null) {
            builder.append("owner=");
            builder.append(owner);
            builder.append(", ");
        }
        if (sensorId != null) {
            builder.append("sensorId=");
            builder.append(sensorId);
            builder.append(", ");
        }
        if (plcId != null) {
            builder.append("plcId=");
            builder.append(plcId);
            builder.append(", ");
        }
        if (type != null) {
            builder.append("Type=");
            builder.append(type);
            builder.append(", ");
        }
        if (createTime != null) {
            builder.append("createTime=");
            builder.append(createTime);
            builder.append(", ");
        }
        if (updateTime != null) {
            builder.append("updateTime=");
            builder.append(updateTime);
            builder.append(", ");
        }
        if (timezone != null) {
            builder.append("timezone=");
            builder.append(timezone);
            builder.append(", ");
        }
        if (machineConfig != null) {
            builder.append("machineConfig=");
            builder.append(machineConfig);
        }
        if (alias != null) {
        	builder.append("alias=");
        	builder.append(alias);
        }
        builder.append("]");
        return builder.toString();
    }

}
