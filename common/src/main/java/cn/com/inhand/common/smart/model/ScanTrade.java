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
 * @author liqiang
 */
public class ScanTrade {
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private ObjectId gwId;
    private String orderNo;
    private ObjectId deviceId;
    private ObjectId siteId;
    private String siteNumber;
    private String lineId;         //线路ID
    private String lineName;        //线路名称
    private String assetId;
    private String locationId;
    private String machineType;     //售货机类型
    private String cid;              //货柜ID
    private String goodsId;          //商品id
    private String goodsName;        //商品名称
    private String type;              //商品分类ID
    private String typeName;            //商品分类名称
    private Integer canelState;   //订单撤销状态  0:未撤销   ;   1:已撤销
    private Integer payStatus;           //支付状态 0 待支付；1 支付成功；2支付失败
    private Integer deliverStatus;       //吐货状态 0:已出货，-1：待出货  1：没有存货，无法出货;2：无此货物，无法出货
    private Long createTime;
    private Long canelTime;
    private String payStyle;
    private Integer price;            //交易价格
    private Integer price_1;          //交易商品原价
    private Long recv_ts;             //收到订单时的时间戳
    private Integer count;               //购买的数量目前为1
    private Integer cost;             //总价格
    private Integer fee = 0;                 //商户收取的费用一分为单位
    private Integer currency = 0;            //币种目前为1：人民币

    public String getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(String siteNumber) {
        this.siteNumber = siteNumber;
    }
    
    
    
    public Integer getCanelState() {
        return canelState;
    }

    public void setCanelState(Integer canelState) {
        this.canelState = canelState;
    }

    public Long getCanelTime() {
        return canelTime;
    }

    public void setCanelTime(Long canelTime) {
        this.canelTime = canelTime;
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

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }


    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public String getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(String payStyle) {
        this.payStyle = payStyle;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
    }

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public ObjectId getSiteId() {
        return siteId;
    }

    public void setSiteId(ObjectId siteId) {
        this.siteId = siteId;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public String getMachineType() {
        return machineType;
    }

    public void setMachineType(String machineType) {
        this.machineType = machineType;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public Integer getPayStatus() {
        return payStatus;
    }

    public void setPayStatus(Integer payStatus) {
        this.payStatus = payStatus;
    }

    public Integer getDeliverStatus() {
        return deliverStatus;
    }

    public void setDeliverStatus(Integer deliverStatus) {
        this.deliverStatus = deliverStatus;
    }

    public Integer getPrice_1() {
        return price_1;
    }

    public void setPrice_1(Integer price_1) {
        this.price_1 = price_1;
    }

    public Long getRecv_ts() {
        return recv_ts;
    }

    public void setRecv_ts(Long recv_ts) {
        this.recv_ts = recv_ts;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public Integer getFee() {
        return fee;
    }

    public void setFee(Integer fee) {
        this.fee = fee;
    }

    public Integer getCurrency() {
        return currency;
    }

    public void setCurrency(Integer currency) {
        this.currency = currency;
    }
    
}
