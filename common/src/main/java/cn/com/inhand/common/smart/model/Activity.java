package cn.com.inhand.common.smart.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;


import com.fasterxml.jackson.annotation.JsonProperty;
/**
 * 优惠活动
 * @author shixj
 *
 */
public class Activity {
	@Id
	@JsonProperty("_id")
	private ObjectId id;	             //唯一标识
	private ObjectId oid;	             //机构ID
	private String name;                 //活动名称
	private Long createTime;             //创建时间
	private int type;//活动类型 1、立减 2、折扣
        private int status;//活动状态 1、保存 2、保存并激活 3、停止
        private BasicConfig basicConfig;
        private UseConfig useConfig;
        private UseCount usecount;
        private List<String> deviceIds;
	public Activity() {

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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public BasicConfig getBasicConfig() {
        return basicConfig;
    }

    public void setBasicConfig(BasicConfig basicConfig) {
        this.basicConfig = basicConfig;
    }

    public UseConfig getUseConfig() {
        return useConfig;
    }

    public void setUseConfig(UseConfig useConfig) {
        this.useConfig = useConfig;
    }

    public UseCount getUsecount() {
        return usecount;
    }

    public void setUsecount(UseCount usecount) {
        this.usecount = usecount;
    }

    public List<String> getDeviceIds() {
        return deviceIds;
    }

    public void setDeviceIds(List<String> deviceIds) {
        this.deviceIds = deviceIds;
    }
	
	
}
