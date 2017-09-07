/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author cttc
 */
public class ModelManage {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private String oName;          //机构简称
    private String executeOName;   //执行机构
    private String name;          //版本分组名称
    private String versionmodel;  //机型
    private String version;
    private Config config;
    private String desc;          //版本描述
    private List<App> apps;
    private String server;
    private Long createTime;   //添加时间
    private Long updateTime;   //修改时间

    public String getExecuteOName() {
        return executeOName;
    }

    public void setExecuteOName(String executeOName) {
        this.executeOName = executeOName;
    }

    
    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    
    
    public String getVersionmodel() {
        return versionmodel;
    }

    public void setVersionmodel(String versionmodel) {
        this.versionmodel = versionmodel;
    }

    
    public Config getConfig() {
        return config;
    }

    public void setConfig(Config config) {
        this.config = config;
    }

    
    public String getServer() {
        return server;
    }

    public void setServer(String server) {
        this.server = server;
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

    public String getoName() {
        return oName;
    }

    public void setoName(String oName) {
        this.oName = oName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public List<App> getApps() {
        return apps;
    }

    public void setApps(List<App> apps) {
        this.apps = apps;
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
