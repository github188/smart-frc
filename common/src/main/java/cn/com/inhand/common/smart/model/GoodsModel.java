package cn.com.inhand.common.smart.model;

import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import com.fasterxml.jackson.annotation.JsonProperty;

public class GoodsModel {
	@Id
	@JsonProperty("_id")
	private ObjectId id;	            //唯一标识
	private ObjectId oid;	            //机构ID
	private String name; //货道模板名称
	private String modelId;//机型id
	private String modelName;//机型名称
	private Long createTime;//创建时间
	private List<GoodsConfig> goodsConfigs;  //具体货道详细信息
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
	public String getModelId() {
		return modelId;
	}
	public void setModelId(String modelId) {
		this.modelId = modelId;
	}
	public String getModelName() {
		return modelName;
	}
	public void setModelName(String modelName) {
		this.modelName = modelName;
	}
	public List<GoodsConfig> getGoodsConfigs() {
		return goodsConfigs;
	}
	public void setGoodsConfigs(List<GoodsConfig> goodsConfigs) {
		this.goodsConfigs = goodsConfigs;
	}
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public ObjectId getOid() {
		return oid;
	}
	public void setOid(ObjectId oid) {
		this.oid = oid;
	}
}
