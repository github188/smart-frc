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
public class ReplenishPlanV2 {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    
    private String number;              //计划编号
    private String remark;              //备注
    
    private String name;              //补货计划名称 
    
    private String executivePerson;   //执行人
    private String executivePersonId; //执行人ID
    
    private String createPerson;      //创建人
    private String createPersonId;   //创建人ID
    
    private Long planReplenishTime;   //  预计补货时间
    
    private Long completeTime;    //完成时间
    private String completeRate;   //完成度
    
    private List<String> lineIds;  //线路列表
    
    private List<String> lines;   //线路名称
    
    private List<EquipStatusV2> equipStatus; //设备补货状态列表

    private List<GoodsReplenishForecast> inventory;   //计划商品清单
    
    
    private Integer status = 0;    //完成状态 0:未完成 , 1:已完成
    private String epemail;     //执行人邮箱
    private String cpemail;    //创建人邮箱
    
    private String personId;
    
    private Long createTime;      //  创建时间
    private String warehouseId;//出货仓库
    private String warehouseName;
    
    private Routes routes;//路线

    private Long updateTime;

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }
    
    
    
    public List<String> getLines() {
        return lines;
    }

    public void setLines(List<String> lines) {
        this.lines = lines;
    }

    
    
    public String getPersonId() {
        return personId;
    }

    public void setPersonId(String personId) {
        this.personId = personId;
    }
    
    
    
    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    
    
    public List<String> getLineIds() {
        return lineIds;
    }

    public void setLineIds(List<String> lineIds) {
        this.lineIds = lineIds;
    }
    

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    
    
    public String getEpemail() {
        return epemail;
    }

    public void setEpemail(String epemail) {
        this.epemail = epemail;
    }

    public String getCpemail() {
        return cpemail;
    }

    public void setCpemail(String cpemail) {
        this.cpemail = cpemail;
    }
    
    
    public String getExecutivePersonId() {
        return executivePersonId;
    }

    public void setExecutivePersonId(String executivePersonId) {
        this.executivePersonId = executivePersonId;
    }

    public String getCreatePersonId() {
        return createPersonId;
    }

    public void setCreatePersonId(String createPersonId) {
        this.createPersonId = createPersonId;
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

    public String getExecutivePerson() {
        return executivePerson;
    }

    public void setExecutivePerson(String executivePerson) {
        this.executivePerson = executivePerson;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }


    public Long getCompleteTime() {
        return completeTime;
    }

    public void setCompleteTime(Long completeTime) {
        this.completeTime = completeTime;
    }

    public String getCompleteRate() {
        return completeRate;
    }

    public void setCompleteRate(String completeRate) {
        this.completeRate = completeRate;
    }

    public List<EquipStatusV2> getEquipStatus() {
        return equipStatus;
    }

    public void setEquipStatus(List<EquipStatusV2> equipStatus) {
        this.equipStatus = equipStatus;
    }

    

    /**
     * @return the warehouseId
     */
    public String getWarehouseId() {
        return warehouseId;
    }

    /**
     * @param warehouseId the warehouseId to set
     */
    public void setWarehouseId(String warehouseId) {
        this.warehouseId = warehouseId;
    }

    /**
     * @return the warehouseName
     */
    public String getWarehouseName() {
        return warehouseName;
    }

    /**
     * @param warehouseName the warehouseName to set
     */
    public void setWarehouseName(String warehouseName) {
        this.warehouseName = warehouseName;
    }

    /**
     * @return the routes
     */
    public Routes getRoutes() {
        return routes;
    }

    /**
     * @param routes the routes to set
     */
    public void setRoutes(Routes routes) {
        this.routes = routes;
    }

    public Long getPlanReplenishTime() {
        return planReplenishTime;
    }

    public void setPlanReplenishTime(Long planReplenishTime) {
        this.planReplenishTime = planReplenishTime;
    }

    public List<GoodsReplenishForecast> getInventory() {
        return inventory;
    }

    public void setInventory(List<GoodsReplenishForecast> inventory) {
        this.inventory = inventory;
    }
   
    
    
}
