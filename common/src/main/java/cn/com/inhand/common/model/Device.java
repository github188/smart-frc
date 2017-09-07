package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.Date;

/**
 * @author Jerolin 设备管理模块中的设备实体类
 */
public class Device {
	@Id
	@JsonProperty("_id")
	private ObjectId id;
	private ObjectId oid;
	private String name;
	private String model;
	private ObjectId modelId;

	private String mobileNumber;
	private String IMSI;
	private Integer plcId;
	private Integer sensorId;
	private Integer maxSensorId;

	private Integer maxPlcId;

	private ObjectId siteId;
	private String siteName;

	private Contact contact;
	private Integer vendorId;

	private String priIp;// 设备私网ip

	private Integer priPort;

	private String address;

	private Location location;

	private Integer timezone;

	private Integer businessState;

	private String serialNumber;

	private ObjectId owner;

	private Long createTime;
	private Long updateTime;
	private Integer online;
	private String pubIp;// 设备公网ip
	private Integer pubPort;
	private Integer singnalStrength;

	private Integer syncState;
	private Config config;

	private Info info;

	private DeviceConfig deviceConfig;
	private ObjectId groupId;
	private Date lastAlive;

	public Date getLastAlive() {
		return lastAlive;
	}

	public void setLastAlive(Date lastAlive) {
		this.lastAlive = lastAlive;
	}

	public Device copy() {
		Device device = new Device();
		device.id = this.id;
		device.oid = this.oid;
		device.groupId = this.groupId;
		device.name = this.name;
		device.model = this.model;
		device.modelId = this.modelId;
		device.mobileNumber = this.mobileNumber;
		device.IMSI = this.IMSI;
		device.sensorId = this.sensorId;
		device.plcId = this.plcId;
		device.maxSensorId = this.maxSensorId;
		device.maxPlcId = this.maxPlcId;
		device.siteId = this.siteId;
		device.siteName = this.siteName;
		device.contact = this.contact;
		device.vendorId = this.vendorId;
		device.priIp = this.priIp;
		device.priPort = this.priPort;
		device.address = this.address;
		device.location = this.location;
		device.timezone = this.timezone;
		device.businessState = this.businessState;
		device.serialNumber = this.serialNumber;
		device.owner = this.owner;
		device.createTime = this.createTime;
		device.updateTime = this.updateTime;
		device.online = this.online;
		device.pubIp = this.pubIp;
		device.pubPort = this.pubPort;
		device.singnalStrength = this.singnalStrength;
		device.syncState = this.syncState;
		device.config = this.config;
		device.info = this.info;
		device.deviceConfig = this.deviceConfig;
		return device;
	}

	// /**
	// * 设备与平台配置冲突时同步的准则 （0忽略 1以平台为主 2以设备为主）
	// */
	// private Integer sync = 2;
	//
	// private Integer timeout = 300000;
	// private Integer ackTimeout = 2000*60;
	// private Integer ackRetries = 3;

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public ObjectId getGroupId() {
		return groupId;
	}

	public void setGroupId(ObjectId groupId) {
		this.groupId = groupId;
	}

	public Integer getBusinessState() {
		return businessState;
	}

	public void setBusinessState(Integer businessState) {
		this.businessState = businessState;
	}

	public Config getConfig() {
		return config;
	}

	public void setConfig(Config config) {
		this.config = config;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}

	public Long getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}

	public DeviceConfig getDeviceConfig() {
		return deviceConfig;
	}

	public void setDeviceConfig(DeviceConfig deviceConfig) {
		this.deviceConfig = deviceConfig;
	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getIMSI() {
		return IMSI;
	}

	public void setIMSI(String iMSI) {
		IMSI = iMSI;
	}

	public Info getInfo() {
		return info;
	}

	public void setInfo(Info info) {
		this.info = info;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public Integer getMaxPlcId() {
		return maxPlcId;
	}

	public void setMaxPlcId(Integer maxPlcId) {
		this.maxPlcId = maxPlcId;
	}

	public Integer getMaxSensorId() {
		return maxSensorId;
	}

	public void setMaxSensorId(Integer maxSensorId) {
		this.maxSensorId = maxSensorId;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getModel() {
		return model;
	}

	public void setModel(String model) {
		this.model = model;
	}

	public ObjectId getModelId() {
		return modelId;
	}

	public void setModelId(ObjectId modelId) {
		this.modelId = modelId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public ObjectId getOid() {
		return oid;
	}

	public void setOid(ObjectId oid) {
		this.oid = oid;
	}

	public Integer getOnline() {
		return online;
	}

	public void setOnline(Integer online) {
		this.online = online;
	}

	public ObjectId getOwner() {
		return owner;
	}

	public void setOwner(ObjectId owner) {
		this.owner = owner;
	}

	public Integer getPlcId() {
		return plcId;
	}

	public void setPlcId(Integer plcId) {
		this.plcId = plcId;
	}

	public String getPriIp() {
		return priIp;
	}

	public void setPriIp(String priIp) {
		this.priIp = priIp;
	}

	public Integer getPriPort() {
		return priPort;
	}

	public void setPriPort(Integer priPort) {
		this.priPort = priPort;
	}

	public String getPubIp() {
		return pubIp;
	}

	public void setPubIp(String pubIp) {
		this.pubIp = pubIp;
	}

	public Integer getPubPort() {
		return pubPort;
	}

	public void setPubPort(Integer pubPort) {
		this.pubPort = pubPort;
	}

	/**
	 * @return the sensorId
	 */
	public Integer getSensorId() {
		return sensorId;
	}

	/**
	 * @param sensorId the sensorId to set
	 */
	public void setSensorId(Integer sensorId) {
		this.sensorId = sensorId;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public Integer getSingnalStrength() {
		return singnalStrength;
	}

	public void setSingnalStrength(Integer singnalStrength) {
		this.singnalStrength = singnalStrength;
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

	public Integer getSyncState() {
		return syncState;
	}

	public void setSyncState(Integer syncState) {
		this.syncState = syncState;
	}

	public Integer getTimezone() {
		return timezone;
	}

	public void setTimezone(Integer timezone) {
		this.timezone = timezone;
	}

	public Long getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}

	public Integer getVendorId() {
		return vendorId;
	}

	public void setVendorId(Integer vendorId) {
		this.vendorId = vendorId;
	}


	/*
	 * (non-Javadoc)
	 * 
	 * @see java.lang.Object#toString()
	 */
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("Device [");
		if (id != null) {
			builder.append("id=");
			builder.append(id);
			builder.append(", ");
		}
		if (oid != null) {
			builder.append("oid=");
			builder.append(oid);
			builder.append(", ");
		}
		if (name != null) {
			builder.append("name=");
			builder.append(name);
			builder.append(", ");
		}
		if (model != null) {
			builder.append("model=");
			builder.append(model);
			builder.append(", ");
		}
		if (modelId != null) {
			builder.append("modelId=");
			builder.append(modelId);
			builder.append(", ");
		}
		if (mobileNumber != null) {
			builder.append("mobileNumber=");
			builder.append(mobileNumber);
			builder.append(", ");
		}
		if (IMSI != null) {
			builder.append("IMSI=");
			builder.append(IMSI);
			builder.append(", ");
		}
		if (plcId != null) {
			builder.append("plcId=");
			builder.append(plcId);
			builder.append(", ");
		}
		if (maxSensorId != null) {
			builder.append("maxSensorId=");
			builder.append(maxSensorId);
			builder.append(", ");
		}
		if (maxPlcId != null) {
			builder.append("maxPlcId=");
			builder.append(maxPlcId);
			builder.append(", ");
		}
		if (siteId != null) {
			builder.append("siteId=");
			builder.append(siteId);
			builder.append(", ");
		}
		if (siteName != null) {
			builder.append("siteName=");
			builder.append(siteName);
			builder.append(", ");
		}
		if (contact != null) {
			builder.append("contact=");
			builder.append(contact);
			builder.append(", ");
		}
		if (vendorId != null) {
			builder.append("vendorId=");
			builder.append(vendorId);
			builder.append(", ");
		}
		if (priIp != null) {
			builder.append("priIp=");
			builder.append(priIp);
			builder.append(", ");
		}
		if (priPort != null) {
			builder.append("priPort=");
			builder.append(priPort);
			builder.append(", ");
		}
		if (address != null) {
			builder.append("address=");
			builder.append(address);
			builder.append(", ");
		}
		if (location != null) {
			builder.append("location=");
			builder.append(location);
			builder.append(", ");
		}
		if (timezone != null) {
			builder.append("timezone=");
			builder.append(timezone);
			builder.append(", ");
		}
		if (businessState != null) {
			builder.append("businessState=");
			builder.append(businessState);
			builder.append(", ");
		}
		if (serialNumber != null) {
			builder.append("serialNumber=");
			builder.append(serialNumber);
			builder.append(", ");
		}
		if (owner != null) {
			builder.append("owner=");
			builder.append(owner);
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
		if (online != null) {
			builder.append("online=");
			builder.append(online);
			builder.append(", ");
		}
		if (pubIp != null) {
			builder.append("pubIp=");
			builder.append(pubIp);
			builder.append(", ");
		}
		if (pubPort != null) {
			builder.append("pubPort=");
			builder.append(pubPort);
			builder.append(", ");
		}
		if (singnalStrength != null) {
			builder.append("singnalStrength=");
			builder.append(singnalStrength);
			builder.append(", ");
		}
		if (syncState != null) {
			builder.append("syncState=");
			builder.append(syncState);
			builder.append(", ");
		}
		if (config != null) {
			builder.append("config=");
			builder.append(config);
			builder.append(", ");
		}
		if (info != null) {
			builder.append("info=");
			builder.append(info);
			builder.append(", ");
		}
		if (deviceConfig != null) {
			builder.append("deviceConfig=");
			builder.append(deviceConfig);
			builder.append(", ");
		}
		builder.append("]");
		return builder.toString();
	}

}
