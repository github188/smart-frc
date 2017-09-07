package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 应用任务表
 *
 * @author shixj
 *
 */
public class AppTask {

    @Id
    @JsonProperty("_id")
    private ObjectId id;	             //唯一标识
    private ObjectId oid;	             //机构ID
    private String name;                  //任务名称
    private String deviceId;             //设备ID
    private ObjectId gwId;                 //inboxId
    private String vmId;                 //售货机编号
    private Long createTime;             //创建任务时间
    private int sync;                   //同步状态  0:已同步  1：未同步 2:同步失败 3：终止
    private String version;              //版本号
    private int type;                    //类型：1：优惠活动   101:货道配置  201：升级配置  
    private Object config;               //配置信息
    private List <ContainerDto> containers;  //售货机货柜信息，当配置为货道配置时有这个参数
    public AppTask() {
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

    public String getVmId() {
        return vmId;
    }

    public void setVmId(String vmId) {
        this.vmId = vmId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public int getSync() {
        return sync;
    }

    public void setSync(int sync) {
        this.sync = sync;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Object getConfig() {
        return config;
    }

    public void setConfig(Object config) {
        this.config = config;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
    }

    public List<ContainerDto> getContainers() {
        return containers;
    }

    public void setContainers(List<ContainerDto> containers) {
        this.containers = containers;
    }
    

}
