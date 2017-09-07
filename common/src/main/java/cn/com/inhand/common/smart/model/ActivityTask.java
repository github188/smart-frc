package cn.com.inhand.common.smart.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
/**
 * 优惠活动同步任务表
 * @author shixj
 *
 */
public class ActivityTask {
	@Id
	@JsonProperty("_id")
	private ObjectId id;	             //唯一标识
	private ObjectId oid;	             //机构ID
	private String deviceId;             //设备ID
	private String vmId;                 //售货机编号
 	private Long createTime;             //创建任务时间
	private Long startTime;              //开始时间
	private Long endTime;                //结束时间
	private int  sync;                   //同步状态  0:已同步  1：未同步 2:同步失败 3：终止
	private String version;              //版本号
	private List<PriceBean> goodsInfo;   //商品信息
	private int type;                    //类型：1：活动任务(1表示优惠活动任务.....) 1到100
	                                           //2：应用任务(101表示货道配置任务....) 101到200
	                                           //3：系统任务(201....) 201到300
	private String activityId;           //活动ID
	
	public ActivityTask() {

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

	public Long getStartTime() {
		return startTime;
	}

	public void setStartTime(Long startTime) {
		this.startTime = startTime;
	}

	public Long getEndTime() {
		return endTime;
	}

	public void setEndTime(Long endTime) {
		this.endTime = endTime;
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

	public List<PriceBean> getGoodsInfo() {
		return goodsInfo;
	}

	public void setGoodsInfo(List<PriceBean> goodsInfo) {
		this.goodsInfo = goodsInfo;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getActivityId() {
		return activityId;
	}

	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}


	
}
