/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class ShelvesMessage {

    private String shelvesId;
    private Integer unionpay;
    private Integer wechat;
    private Integer alipay;
    private Integer baidu;
    private Integer outline;
    private String payStyle;
    private Integer swingCard = 0;   //刷卡
    private Integer otherWay = 0;  //其它方式 目前为 取货码
    private Integer game = 0;    //游戏
    private Integer soundWave = 0; //支付宝声波
    private Integer oneCard = 0;   //一卡通
    private Integer pos = 0;   //pos机
    private Integer abc = 0;   //农行掌银支付
    private Integer vipPay = 0;  //会员支付
    private Integer bestPay = 0;  //翼支付
    private Integer jdpay = 0;//京东支付
    private Integer alipayBarcode = 0; //支付宝反扫
    private Integer wehcatBarcode = 0; //微信反扫
    private Integer integral = 0; //积分对换
    
    private Integer price;
    private String cid;
    private String machineType;

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Integer getUnionpay() {
        return unionpay;
    }

    public void setUnionpay(Integer unionpay) {
        this.unionpay = unionpay;
    }

    public String getMachineType() {
        return machineType;
    }

    public void setMachineType(String machineType) {
        this.machineType = machineType;
    }
    
    

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
    
    

    public Integer getJdpay() {
        return jdpay;
    }

    public void setJdpay(Integer jdpay) {
        this.jdpay = jdpay;
    }

    
    public Integer getBestPay() {
        return bestPay;
    }

    public void setBestPay(Integer bestPay) {
        this.bestPay = bestPay;
    }

    
    public Integer getVipPay() {
        return vipPay;
    }

    public void setVipPay(Integer vipPay) {
        this.vipPay = vipPay;
    }

    
    public String getShelvesId() {
        return shelvesId;
    }

    public void setShelvesId(String shelvesId) {
        this.shelvesId = shelvesId;
    }

    public Integer getWechat() {
        return wechat;
    }

    public void setWechat(Integer wechat) {
        this.wechat = wechat;
    }

    public Integer getAlipay() {
        return alipay;
    }

    public void setAlipay(Integer alipay) {
        this.alipay = alipay;
    }

    public Integer getBaidu() {
        return baidu;
    }

    public void setBaidu(Integer baidu) {
        this.baidu = baidu;
    }

    public Integer getOutline() {
        return outline;
    }

    public void setOutline(Integer outline) {
        this.outline = outline;
    }

    public String getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(String payStyle) {
        this.payStyle = payStyle;
    }

    public Integer getSwingCard() {
        return swingCard;
    }

    public void setSwingCard(Integer swingCard) {
        this.swingCard = swingCard;
    }

    public Integer getOtherWay() {
        return otherWay;
    }

    public void setOtherWay(Integer otherWay) {
        this.otherWay = otherWay;
    }

    public Integer getGame() {
        return game;
    }

    public void setGame(Integer game) {
        this.game = game;
    }

    public Integer getSoundWave() {
        return soundWave;
    }

    public void setSoundWave(Integer soundWave) {
        this.soundWave = soundWave;
    }

    public Integer getOneCard() {
        return oneCard;
    }

    public void setOneCard(Integer oneCard) {
        this.oneCard = oneCard;
    }

    public Integer getPos() {
        return pos;
    }

    public void setPos(Integer pos) {
        this.pos = pos;
    }

    public Integer getAbc() {
        return abc;
    }

    public void setAbc(Integer abc) {
        this.abc = abc;
    }

    public Integer getAlipayBarcode() {
        return alipayBarcode;
    }

    public void setAlipayBarcode(Integer alipayBarcode) {
        this.alipayBarcode = alipayBarcode;
    }

    public Integer getWehcatBarcode() {
        return wehcatBarcode;
    }

    public void setWehcatBarcode(Integer wehcatBarcode) {
        this.wehcatBarcode = wehcatBarcode;
    }

    public Integer getIntegral() {
        return integral;
    }

    public void setIntegral(Integer integral) {
        this.integral = integral;
    }
    
}
