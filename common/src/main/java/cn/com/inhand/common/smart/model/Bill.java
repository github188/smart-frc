/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author xupeijiao
 */
public class Bill {
         @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    
    private String number; //账单编号
    
    private String name;       //机构简称
    
    private String fullName;//机构全称
    
    private String saler;//销售员
    
    private String contact;//公司联系人
    
    private String phone;//联系电话
    
    private Integer nums;//机器总数
    
    private String money;//应付金额
    
    private String payAmount;//实付金额
    
    private Long deadline;//付款截止时间
    
    private Long payTime;//实际付款时间
    
    private Integer status=0;//缴费状态 0 未缴费，1已缴费 , 2 保存
    
    private Long startTime;//计费开始，月初
    
    private Long endTime;//计费结束，月末
    
    private Long createTime;//创建时间
    
    private Integer months;//月数 6个月 12个月
    
    private Integer type=0;//0 后付费的账单 1 续费账单 2 增点账单
    
    private String mark;//备注
    

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }
    
    
    /**
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * @return the oid
     */
    public ObjectId getOid() {
        return oid;
    }

    /**
     * @param oid the oid to set
     */
    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    /**
     * @return the nums
     */
    public Integer getNums() {
        return nums;
    }

    /**
     * @param nums the nums to set
     */
    public void setNums(Integer nums) {
        this.nums = nums;
    }

    /**
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(Integer status) {
        this.status = status;
    }

    /**
     * @return the startTime
     */
    public Long getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public Long getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the name
     */
    public String getName() {
        return name;
    }

    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return the createTime
     */
    public Long getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime the createTime to set
     */
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }



    /**
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }

    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }


    /**
     * @return the deadline
     */
    public Long getDeadline() {
        return deadline;
    }

    /**
     * @param deadline the deadline to set
     */
    public void setDeadline(Long deadline) {
        this.deadline = deadline;
    }

    /**
     * @return the payTime
     */
    public Long getPayTime() {
        return payTime;
    }

    /**
     * @param payTime the payTime to set
     */
    public void setPayTime(Long payTime) {
        this.payTime = payTime;
    }

    /**
     * @return the fullName
     */
    public String getFullName() {
        return fullName;
    }

    /**
     * @param fullName the fullName to set
     */
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    /**
     * @return the saler
     */
    public String getSaler() {
        return saler;
    }

    /**
     * @param saler the saler to set
     */
    public void setSaler(String saler) {
        this.saler = saler;
    }

    /**
     * @return the contact
     */
    public String getContact() {
        return contact;
    }

    /**
     * @param contact the contact to set
     */
    public void setContact(String contact) {
        this.contact = contact;
    }

    /**
     * @return the number
     */
    public String getNumber() {
        return number;
    }

    /**
     * @param number the number to set
     */
    public void setNumber(String number) {
        this.number = number;
    }

    /**
     * @return the money
     */
    public String getMoney() {
        return money;
    }

    /**
     * @param money the money to set
     */
    public void setMoney(String money) {
        this.money = money;
    }

    /**
     * @return the payAmount
     */
    public String getPayAmount() {
        return payAmount;
    }

    /**
     * @param payAmount the payAmount to set
     */
    public void setPayAmount(String payAmount) {
        this.payAmount = payAmount;
    }

    /**
     * @return the months
     */
    public Integer getMonths() {
        return months;
    }

    /**
     * @param months the months to set
     */
    public void setMonths(Integer months) {
        this.months = months;
    }

    /**
     * @return the type
     */
    public Integer getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(Integer type) {
        this.type = type;
    }

    
}
