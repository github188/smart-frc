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
 * @author liqiang
 */
public class StockManagement {
    
    //出库计划
    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    
    private String number;              //出库计划编号
    
    private String executivePerson;   //执行人(补货)
    private String executivePersonId; //执行人ID
    
    private String createPerson;      //申请人
    private String createPersonId;   //申请人ID
    
    private Long executiveTime;   //  执行出库时间
    
    
    private Long planReplenishTime;   //预计补货时间(计划总数与此有关)
    
    private Integer status = 0;    //完成状态 0:默认状态 , 1:已出库  2:已退库
    private String epemail;     //执行人邮箱
    private String cpemail;    //申请人邮箱
    
    private Long createTime;      //  创建时间
    
    
    private List<String> lineNames;   //线路名称
    private DeliverInventory inventory;  //清单
    
    private List<LineReplenish> lines;

    public List<LineReplenish> getLines() {
        return lines;
    }

    public void setLines(List<LineReplenish> lines) {
        this.lines = lines;
    }

    
    
    
    public Long getPlanReplenishTime() {
        return planReplenishTime;
    }

    public void setPlanReplenishTime(Long planReplenishTime) {
        this.planReplenishTime = planReplenishTime;
    }

    public List<String> getLineNames() {
        return lineNames;
    }

    public void setLineNames(List<String> lineNames) {
        this.lineNames = lineNames;
    }

    public DeliverInventory getInventory() {
        return inventory;
    }

    public void setInventory(DeliverInventory inventory) {
        this.inventory = inventory;
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

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getExecutivePerson() {
        return executivePerson;
    }

    public void setExecutivePerson(String executivePerson) {
        this.executivePerson = executivePerson;
    }

    public String getExecutivePersonId() {
        return executivePersonId;
    }

    public void setExecutivePersonId(String executivePersonId) {
        this.executivePersonId = executivePersonId;
    }

    public String getCreatePerson() {
        return createPerson;
    }

    public void setCreatePerson(String createPerson) {
        this.createPerson = createPerson;
    }

    public String getCreatePersonId() {
        return createPersonId;
    }

    public void setCreatePersonId(String createPersonId) {
        this.createPersonId = createPersonId;
    }

    public Long getExecutiveTime() {
        return executiveTime;
    }

    public void setExecutiveTime(Long executiveTime) {
        this.executiveTime = executiveTime;
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

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
    
    
    
    
    
}
