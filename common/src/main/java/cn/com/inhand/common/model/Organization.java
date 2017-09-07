package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 * Created with IntelliJ IDEA.
 * User: Jerolin
 * Date: 13-11-21
 */
public class Organization {
    @JsonProperty("_id")
    @Id
    private ObjectId id;
    private String address;
    private long approvedTime;
    private long createTime;
    private String creator;
    private String email;
    private String fax;
    private String name;
    private ObjectId owner;
    private String phone;
    private int state;
    private long updateTime;
    private String website;
    private Long validTime;//帐号有效期时间
    private String discount;//折扣
    private int charge;//是否收费  1不收费  非1:收费
    private int payStyle;//付费方式  1:后付费  2:预付费
    private String billEmail;//账单接收email
    private int siteNum;//点数
    private int change;//标记  1预付费转后付费的  非1
    private String mark;//备注
    private String timeZoneID;//时区  国家id
    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }
    
    
    
    public int getSiteNum() {
        return siteNum;
    }

    public void setSiteNum(int siteNum) {
        this.siteNum = siteNum;
    }
    
    

    public int getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(int payStyle) {
        this.payStyle = payStyle;
    }

    public String getBillEmail() {
        return billEmail;
    }

    public void setBillEmail(String billEmail) {
        this.billEmail = billEmail;
    }
    

    public int getCharge() {
        return charge;
    }

    public void setCharge(int charge) {
        this.charge = charge;
    }
    
    

    public String getDiscount() {
        return discount;
    }

    public void setDiscount(String discount) {
        this.discount = discount;
    }
    
    
    
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public long getApprovedTime() {
        return approvedTime;
    }

    public void setApprovedTime(long approvedTime) {
        this.approvedTime = approvedTime;
    }

    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFax() {
        return fax;
    }

    public void setFax(String fax) {
        this.fax = fax;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ObjectId getOwner() {
        return owner;
    }

    public void setOwner(ObjectId owner) {
        this.owner = owner;
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

    public long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(long updateTime) {
        this.updateTime = updateTime;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }



    /**
     * @return the validTime
     */
    public Long getValidTime() {
        return validTime;
    }

    /**
     * @param validTime the validTime to set
     */
    public void setValidTime(Long validTime) {
        this.validTime = validTime;
    }

    /**
     * @return the change
     */
    public int getChange() {
        return change;
    }

    /**
     * @param change the change to set
     */
    public void setChange(int change) {
        this.change = change;
    }

    /**
     * @return the timeZoneID
     */
    public String getTimeZoneID() {
        return timeZoneID;
    }

    /**
     * @param timeZoneID the timeZoneID to set
     */
    public void setTimeZoneID(String timeZoneID) {
        this.timeZoneID = timeZoneID;
    }
}
