package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
/**
 * 配送人员信息
 * @author shixj
 *
 */
public class Deliverys {
	@Id
	@JsonProperty("_id")
	private ObjectId id;	   //唯一标识
	private ObjectId oid;	   //机构ID
	private Long createTime;   //添加时间
	private Long updateTime;   //修改时间
	private String number;     //编号
	private String name;       //配送员名称
	private String phone;      //电话
	private int state;         //状态  0:在职
	private String descript;   //描述
	
	
	
	
	public Deliverys() {
		
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
	public Long getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Long createTime) {
		this.createTime = createTime;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	public String getDescript() {
		return descript;
	}
	public void setDescript(String descript) {
		this.descript = descript;
	}
	public Long getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Long updateTime) {
		this.updateTime = updateTime;
	}
	
	
}
