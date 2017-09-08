/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.smart.formulacar.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author lenovo
 */
public class TradeRecord {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private String recordFlag;
    private String assetId;    //赛台编号
    private String tid;          //跑道编号
    private String cardId;      //跑车rfid
    private Long time;     //用时
    private String weight;  //重量
    private Integer ranking;  //比赛名次
    private String userName;   //用户名
    private ObjectId siteId;
    private String siteName;   //店面名称
    private ObjectId dealerId;
    private String dealerName;  //经销商
    private ObjectId moduleId;
    private String moduleNum;   //赛台类型
    private Integer price;
    private String userName1;   //比赛对手1
    private String userName2;   //比赛对手2
    private String imageId;
    private Long createTime;
    private Long updateTime;

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

    public String getRecordFlag() {
        return recordFlag;
    }

    public void setRecordFlag(String recordFlag) {
        this.recordFlag = recordFlag;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getTid() {
        return tid;
    }

    public void setTid(String tid) {
        this.tid = tid;
    }

    public String getCardId() {
        return cardId;
    }

    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    public Long getTime() {
        return time;
    }

    public void setTime(Long time) {
        this.time = time;
    }

    public String getWeight() {
        return weight;
    }

    public void setWeight(String weight) {
        this.weight = weight;
    }

    public Integer getRanking() {
        return ranking;
    }

    public void setRanking(Integer ranking) {
        this.ranking = ranking;
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

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public ObjectId getDealerId() {
        return dealerId;
    }

    public void setDealerId(ObjectId dealerId) {
        this.dealerId = dealerId;
    }

    public String getDealerName() {
        return dealerName;
    }

    public void setDealerName(String dealerName) {
        this.dealerName = dealerName;
    }

    public ObjectId getModuleId() {
        return moduleId;
    }

    public void setModuleId(ObjectId moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleNum() {
        return moduleNum;
    }

    public void setModuleNum(String moduleNum) {
        this.moduleNum = moduleNum;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getUserName1() {
        return userName1;
    }

    public void setUserName1(String userName1) {
        this.userName1 = userName1;
    }

    public String getUserName2() {
        return userName2;
    }

    public void setUserName2(String userName2) {
        this.userName2 = userName2;
    }

    public String getImageId() {
        return imageId;
    }

    public void setImageId(String imageId) {
        this.imageId = imageId;
    }
}
