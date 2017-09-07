/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *各个货道商品的销售量
 * @author shixj
 */
public class ShelfSum {
    private String goodsId;      //商品ID
    private String goodsName;    //商品名称
    private String shelfId;      //货道ID
    private Integer count;           //销售总数
    private Integer price;           //售价
    private Integer capacity;      //货道容量
    private Integer status;        //货道状态  1：补满  2：未补满
    private Integer number;        //补货数量，如果状态补满时为满仓数量，如果状态为未补满时为补货数量
    private Integer total;         //售货机机存量
    private Integer wechatCount =0;     //线上微信总数
    private Integer alipayCount =0;     //线上支付宝总数
    private Integer baifuBaoCount =0;     //线上支付宝总数
    private Integer outlineCount =0;    //现金总数
    private Integer swingCardCount =0;   //刷卡
    private Integer otherWayCount =0;  //其它方式 目前为 取货码
    private Integer gameCount =0;    //游戏
    private Integer soundWaveCount =0; //支付宝声波
    private Integer oneCardCount =0;   //一卡通
    private Integer posCount =0;   //pos机
    private Integer abcCount =0;   //农行掌银支付
    private Integer vipPayCount =0; //会员支付总数
    private Integer bestPayCount =0; //翼支付总数
    private Integer jdpayCount =0; //京东支付总数

    public Integer getJdpayCount() {
        return jdpayCount;
    }

    public void setJdpayCount(Integer jdpayCount) {
        this.jdpayCount = jdpayCount;
    }

    

    
    public Integer getBestPayCount() {
        return bestPayCount;
    }

    public void setBestPayCount(Integer bestPayCount) {
        this.bestPayCount = bestPayCount;
    }

    
    public Integer getVipPayCount() {
        return vipPayCount;
    }

    public void setVipPayCount(Integer vipPayCount) {
        this.vipPayCount = vipPayCount;
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

    public String getShelfId() {
        return shelfId;
    }

    public void setShelfId(String shelfId) {
        this.shelfId = shelfId;
    }

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public Integer getWechatCount() {
        return wechatCount;
    }

    public void setWechatCount(Integer wechatCount) {
        this.wechatCount = wechatCount;
    }

    public Integer getAlipayCount() {
        return alipayCount;
    }

    public void setAlipayCount(Integer alipayCount) {
        this.alipayCount = alipayCount;
    }

    public Integer getBaifuBaoCount() {
        return baifuBaoCount;
    }

    public void setBaifuBaoCount(Integer baifuBaoCount) {
        this.baifuBaoCount = baifuBaoCount;
    }

    public Integer getOutlineCount() {
        return outlineCount;
    }

    public void setOutlineCount(Integer outlineCount) {
        this.outlineCount = outlineCount;
    }

    public Integer getSwingCardCount() {
        return swingCardCount;
    }

    public void setSwingCardCount(Integer swingCardCount) {
        this.swingCardCount = swingCardCount;
    }

    public Integer getOtherWayCount() {
        return otherWayCount;
    }

    public void setOtherWayCount(Integer otherWayCount) {
        this.otherWayCount = otherWayCount;
    }

    public Integer getGameCount() {
        return gameCount;
    }

    public void setGameCount(Integer gameCount) {
        this.gameCount = gameCount;
    }

    public Integer getSoundWaveCount() {
        return soundWaveCount;
    }

    public void setSoundWaveCount(Integer soundWaveCount) {
        this.soundWaveCount = soundWaveCount;
    }

    public Integer getOneCardCount() {
        return oneCardCount;
    }

    public void setOneCardCount(Integer oneCardCount) {
        this.oneCardCount = oneCardCount;
    }

    public Integer getPosCount() {
        return posCount;
    }

    public void setPosCount(Integer posCount) {
        this.posCount = posCount;
    }

    public Integer getAbcCount() {
        return abcCount;
    }

    public void setAbcCount(Integer abcCount) {
        this.abcCount = abcCount;
    }
    
}
