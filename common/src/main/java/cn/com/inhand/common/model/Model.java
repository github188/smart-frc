package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import java.util.List;
import java.util.Map;

public class Model {
    private ObjectId oid;
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String name;
    private Boolean gateway;
    private Boolean system;
    private String accessProto;// ovdp
    private String firmwareProto;// inhup
    private Integer delete;
    private String configFile;// ir7xx_config.tpl
    private Integer sensorType;
    private Integer ioType;
    private Integer plcTypeId;
    private List<PortInfo> portInfo;
    private List<VarInfo> varInfo;
    private ObjectId icon;
    private Map<String, Object> descriptions;
    private List<ObjectId> pics;
    private List<ObjectId> views;
    private ObjectId owner;
    private Long createTime;
    private Long updateTime;
    private String tag;

    public Boolean isSystem() {
        return system;
    }

    public void setSystem(Boolean system) {
        this.system = system;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean isGateway() {
        return gateway;
    }

    public void setGateway(Boolean gateway) {
        this.gateway = gateway;
    }

    public String getAccessProto() {
        return accessProto;
    }

    public void setAccessProto(String accessProto) {
        this.accessProto = accessProto;
    }

    public String getFirmwareProto() {
        return firmwareProto;
    }

    public void setFirmwareProto(String firmwareProto) {
        this.firmwareProto = firmwareProto;
    }

    public Integer getDelete() {
        return delete;
    }

    public void setDelete(Integer delete) {
        this.delete = delete;
    }

    public String getConfigFile() {
        return configFile;
    }

    public void setConfigFile(String configFile) {
        this.configFile = configFile;
    }

    public Integer getSensorType() {
        return sensorType;
    }

    public void setSensorType(Integer sensorType) {
        this.sensorType = sensorType;
    }

    public Integer getIoType() {
        return ioType;
    }

    public void setIoType(Integer ioType) {
        this.ioType = ioType;
    }

    public Integer getPlcTypeId() {
        return plcTypeId;
    }

    public void setPlcTypeId(Integer plcTypeId) {
        this.plcTypeId = plcTypeId;
    }

    public List<PortInfo> getPortInfo() {
        return portInfo;
    }

    public void setPortInfo(List<PortInfo> portInfo) {
        this.portInfo = portInfo;
    }

    public List<VarInfo> getVarInfo() {
        return varInfo;
    }

    public void setVarInfo(List<VarInfo> varInfo) {
        this.varInfo = varInfo;
    }

    public ObjectId getIcon() {
        return icon;
    }

    public void setIcon(ObjectId icon) {
        this.icon = icon;
    }

    public Map<String, Object> getDescriptions() {
        return descriptions;
    }

    public void setDescriptions(Map<String, Object> descriptions) {
        this.descriptions = descriptions;
    }

    public List<ObjectId> getPics() {
        return pics;
    }

    public void setPics(List<ObjectId> pics) {
        this.pics = pics;
    }

    public List<ObjectId> getViews() {
        return views;
    }

    public void setViews(List<ObjectId> views) {
        this.views = views;
    }

    public ObjectId getOwner() {
        return owner;
    }

    public void setOwner(ObjectId owner) {
        this.owner = owner;
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

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }


}
