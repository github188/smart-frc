package cn.com.inhand.common.smart.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * 交易
 *
 * @author shixj
 *
 */
public class Trade implements Cloneable{

    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    private ObjectId oid;	         //机构ID
    private ObjectId gwId;            //Inbox Id

    private String payTag;         //各种支付方的账号标识
    private String orderNo;          //订单号 唯一 最多20位
    private String tradeNo;          //交易号 --售货机中的交易号
    private String activityId;       //参与活动的标识
    private ObjectId deviceId;         //设备ID 
    private ObjectId siteId;          //点位ID
    private String siteNumber;  //点位编号
    private String lineId;         //线路ID
    private String lineName;        //线路名称
    private String locationId;      //货道ID
    private String assetId;          //Inbox(售货机）id
    private String machineType;     //售货机类型
    private String cid;              //货柜ID
    private String goodsId;          //商品id
    private String goodsName;        //商品名称
    private String type;              //商品分类ID
    private String typeName;            //商品分类名称
    private Integer deliverStatus;       //吐货状态 0:已出货，-1：待出货  1：没有存货，无法出货;2：无此货物，无法出货
    private Integer deliverStyle = 1;     //出货方式  1：自动出货  2：取货码出货
    private Long notice_ts;          //通知吐货的时间
    private Long recv_ts;             //收到订单时的时间戳
    private Long exec_ts;             //出货执行完毕的时间戳
    private Integer price;            //交易价格
    private Integer price_1;          //交易商品原价
    
    private Integer specialType;    //优惠类型
    private Integer price_2;     //优惠价格
    private Integer payStatus;           //支付状态 0 待支付；1 支付成功；2支付失败
    private String payFailReason;      //支付失败原因
    private Integer count;               //购买的数量目前为1
    private Integer cost;             //总价格
    private Long payTime;             //支付时间
    private Long createTime;          //创建时间
    private Long traCreateTime;      //交易创建时间
    private Long refundTime;         //申請退款时间
    private String refundOrderNo;       //退款商户编号  唯一
    private Integer refundFee = 0;             //退款金额
    private Integer refundStatus = 0;           //退款狀態  1：正在退款  2：退款成功 3：支付失败
    private String refundFailReason;    //退款失败原因
    private String refundTradeNo;   //退款交易号
    private String payStyle;            //支付方式 1;百付宝  2：微信  3：支付宝 4：现金支付
    private String transaction_id;    //线上交易的订单号
    private String posCardNum;      
    private String posTerminalNum;
    private String posTransSN;
    private String posTransTime;
    private String posSysSN;
    private String posMerchantNum;
    
    private String coupon_id;     //代金券和立减编号
    private Integer coupon_fee = 0;       //使用代金券和立减金额
    private Integer coupon_count = 0;    //使用代金券立减个数
    
    private Integer integral = 0;    //使用积分
    private List<Coupon> coupons;   //使用优惠券情况
    private Integer coupon_amount;   //优惠金额
    
    private String openId;      //微信支付用户的标识
    private String back_type;   // 微信支付银行
    private String payUser;          //退款时的退款方唯一标识
    private String payType;             //支付方式1:余额支付..,在百付宝中为1
    private String phone;                   //交易订单中的手机号   为农行支付添加
    private Integer fee = 0;                 //商户收取的费用一分为单位
    private Integer currency = 0;            //币种目前为1：人民币
    

    private String siteName;   //点位名称

    private String secondPayAmount;//第二次支付金额
    private String secondPayStyle;//第二次支付方式
    private Long timer =0l;  //倒计时秒数
    
    private Integer statisticFlag;//是否被统计  1:统计 
    
    
    private String serialNumber;  //补货流水号
    
    private String source;   //取货码交易的来源字段

    public String getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(String siteNumber) {
        this.siteNumber = siteNumber;
    }

    
    
    public Integer getStatisticFlag() {
        return statisticFlag;
    }

    public void setStatisticFlag(Integer statisticFlag) {
        this.statisticFlag = statisticFlag;
    }
    

    public String getRefundFailReason() {
        return refundFailReason;
    }

    public void setRefundFailReason(String refundFailReason) {
        this.refundFailReason = refundFailReason;
    }

    
    
    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }
    
    
    
    public Integer getSpecialType() {
        return specialType;
    }

    public void setSpecialType(Integer specialType) {
        this.specialType = specialType;
    }

    
    
    public Integer getPrice_2() {
        return price_2;
    }

    public void setPrice_2(Integer price_2) {
        this.price_2 = price_2;
    }

    
    
    public List<Coupon> getCoupons() {
        return coupons;
    }

    public void setCoupons(List<Coupon> coupons) {
        this.coupons = coupons;
    }

    public Integer getCoupon_amount() {
        return coupon_amount;
    }

    public void setCoupon_amount(Integer coupon_amount) {
        this.coupon_amount = coupon_amount;
    }

    
    
    public Integer getIntegral() {
        return integral;
    }

    public void setIntegral(Integer integral) {
        this.integral = integral;
    }

    
    
    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
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

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
    }

    public String getOrderNo() {
        return orderNo;
    }

    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public String getTradeNo() {
        return tradeNo;
    }

    public void setTradeNo(String tradeNo) {
        this.tradeNo = tradeNo;
    }

    public String getActivityId() {
        return activityId;
    }

    public void setActivityId(String activityId) {
        this.activityId = activityId;
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

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
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

    public Integer getDeliverStatus() {
        return deliverStatus;
    }

    public void setDeliverStatus(Integer deliverStatus) {
        this.deliverStatus = deliverStatus;
    }

    public Long getNotice_ts() {
        return notice_ts;
    }

    public void setNotice_ts(Long notice_ts) {
        this.notice_ts = notice_ts;
    }

    public Long getRecv_ts() {
        return recv_ts;
    }

    public void setRecv_ts(Long recv_ts) {
        this.recv_ts = recv_ts;
    }

    public Long getExec_ts() {
        return exec_ts;
    }

    public void setExec_ts(Long exec_ts) {
        this.exec_ts = exec_ts;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getPayUser() {
        return payUser;
    }

    public void setPayUser(String payUser) {
        this.payUser = payUser;
    }

    public Integer getPayStatus() {
        return payStatus;
    }

    public void setPayStatus(Integer payStatus) {
        this.payStatus = payStatus;
    }

    public String getPayType() {
        return payType;
    }

    public void setPayType(String payType) {
        this.payType = payType;
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

    public Long getPayTime() {
        return payTime;
    }

    public void setPayTime(Long payTime) {
        this.payTime = payTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getTraCreateTime() {
        return traCreateTime;
    }

    public void setTraCreateTime(Long traCreateTime) {
        this.traCreateTime = traCreateTime;
    }

    public Long getRefundTime() {
        return refundTime;
    }

    public void setRefundTime(Long refundTime) {
        this.refundTime = refundTime;
    }

    public String getRefundOrderNo() {
        return refundOrderNo;
    }

    public void setRefundOrderNo(String refundOrderNo) {
        this.refundOrderNo = refundOrderNo;
    }

    public Integer getRefundFee() {
        return refundFee;
    }

    public void setRefundFee(Integer refundFee) {
        this.refundFee = refundFee;
    }

    public Integer getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(Integer refundStatus) {
        this.refundStatus = refundStatus;
    }

    public String getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(String payStyle) {
        this.payStyle = payStyle;
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

    public String getCoupon_id() {
        return coupon_id;
    }

    public void setCoupon_id(String coupon_id) {
        this.coupon_id = coupon_id;
    }

    public Integer getCoupon_fee() {
        return coupon_fee;
    }

    public void setCoupon_fee(Integer coupon_fee) {
        this.coupon_fee = coupon_fee;
    }

    public Integer getCoupon_count() {
        return coupon_count;
    }

    public void setCoupon_count(Integer coupon_count) {
        this.coupon_count = coupon_count;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getBack_type() {
        return back_type;
    }

    public void setBack_type(String back_type) {
        this.back_type = back_type;
    }

    public String getRefundTradeNo() {
        return refundTradeNo;
    }

    public void setRefundTradeNo(String refundTradeNo) {
        this.refundTradeNo = refundTradeNo;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Integer getPrice_1() {
        return price_1;
    }

    public void setPrice_1(Integer price_1) {
        this.price_1 = price_1;
    }

    public String getTransaction_id() {
        return transaction_id;
    }

    public void setTransaction_id(String transaction_id) {
        this.transaction_id = transaction_id;
    }

    public String getPosCardNum() {
        return posCardNum;
    }

    public void setPosCardNum(String posCardNum) {
        this.posCardNum = posCardNum;
    }

    public String getPosTerminalNum() {
        return posTerminalNum;
    }

    public void setPosTerminalNum(String posTerminalNum) {
        this.posTerminalNum = posTerminalNum;
    }

    public String getPosTransSN() {
        return posTransSN;
    }

    public void setPosTransSN(String posTransSN) {
        this.posTransSN = posTransSN;
    }

    public String getPosTransTime() {
        return posTransTime;
    }

    public void setPosTransTime(String posTransTime) {
        this.posTransTime = posTransTime;
    }

    public String getPosSysSN() {
        return posSysSN;
    }

    public void setPosSysSN(String posSysSN) {
        this.posSysSN = posSysSN;
    }

    public String getPosMerchantNum() {
        return posMerchantNum;
    }

    public void setPosMerchantNum(String posMerchantNum) {
        this.posMerchantNum = posMerchantNum;
    }

    public Integer getDeliverStyle() {
        return deliverStyle;
    }

    public void setDeliverStyle(Integer deliverStyle) {
        this.deliverStyle = deliverStyle;
    }

    /**
     * @return the secondPayAmount
     */
    public String getSecondPayAmount() {
        return secondPayAmount;
    }

    /**
     * @param secondPayAmount the secondPayAmount to set
     */
    public void setSecondPayAmount(String secondPayAmount) {
        this.secondPayAmount = secondPayAmount;
    }

    /**
     * @return the secondPayStyle
     */
    public String getSecondPayStyle() {
        return secondPayStyle;
    }

    /**
     * @param secondPayStyle the secondPayStyle to set
     */
    public void setSecondPayStyle(String secondPayStyle) {
        this.secondPayStyle = secondPayStyle;
    }

    public Long getTimer() {
        return timer;
    }

    public void setTimer(Long timer) {
        this.timer = timer;
    }

    public String getPayFailReason() {
        return payFailReason;
    }

    public void setPayFailReason(String payFailReason) {
        this.payFailReason = payFailReason;
    }

    public String getPayTag() {
        return payTag;
    }

    public void setPayTag(String payTag) {
        this.payTag = payTag;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }
    
    
    @Override  
    public Object clone() throws CloneNotSupportedException  
    {  
        return super.clone();  
    }
    
}
