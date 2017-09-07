package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 任务汇总表
 *
 * @author shixj
 *
 */
public class Task {

    @JsonProperty("_id")
    private ObjectId id;	             //唯一标识
    private ObjectId oid;	             //机构ID
    private String userName;
    private String taskName;                //任务名称
    private String ip;
    private String uid;
    private String deviceId;             //设备ID
    private String gwId;              //Inbox ID
    private String assetId;                 //售货机编号
    private int sync;                   //同步状态  0:初始状态  1：已同步 2:同步失败 3：终止 4:正在执行
    private long createTime;            //创建时间
    private long updateTime;           //设备取走时间

    private int type;        //任务类型  1:远程控制  ,2:广告下发 3:远程升级 4:导出excel
  //  private ResData data;
    
    private Object data;

    public String getTaskName() {
        return taskName;
    }

    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    
    
    // private List<PushAd> ads;          //下发广告
    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    
    
    
    public Task() {
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
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

    public int getSync() {
        return sync;
    }

    public void setSync(int sync) {
        this.sync = sync;
    }


    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getGwId() {
        return gwId;
    }

    public void setGwId(String gwId) {
        this.gwId = gwId;
    }

    


    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }
    
    
}
