package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Scada {

    /**
     * 监控画面标识
     */
    @Id
    @JsonProperty("_id")
    private ObjectId id;

    /**
     * 监控画面对象
     */
    private Object content;

    /**
     * 监控画面名称
     */
    private String name;

    /**
     * 监控画面类型
     * 目前只有  现场类和全局类
     */
    private Integer type;

    /**
     * 拥有者
     */
    private ObjectId owner;

    /**
     * 创建时间
     */
    private Integer createTime;

    /**
     * 更新时间
     */
    private Integer updateTime;

    /**
     * 对应现场ID
     */
    private ObjectId siteId;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public ObjectId getOwner() {
        return owner;
    }

    public void setOwner(ObjectId owner) {
        this.owner = owner;
    }

    public Integer getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Integer createTime) {
        this.createTime = createTime;
    }

    public Integer getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Integer updateTime) {
        this.updateTime = updateTime;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

}
