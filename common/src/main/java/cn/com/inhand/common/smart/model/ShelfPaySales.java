/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ShelfPaySales {
    
    private String location_id;  //货道编号
    private String goods_id;   //商品ID
    private String goods_name;   //商品名称
    private Integer price;   //价格
    private Integer salesAmount;   //总销售额
    private Integer salesCount;  //总销量
    private Integer cashAmount;  //现金销售额
    private Integer cashCount;  //现金销量
    private Integer nocashAmount;  //非现金销售额
    private Integer nocashCount;  //非现金销量
    private Integer wechatAmount;  //微信销售额
    private Integer wechatCount;  //微信销量
    private Integer alipayAmount;  //支付宝销售额
    private Integer alipayCount;  //支付宝销量
    private Integer baifubaoAmount;  //百付宝销售额
    private Integer baifubaoCount;  //百付宝销量
    private Integer alipaySoundWaveAmount;  //声波销售额
    private Integer alipaySoundWaveCount;  //声波销量
    private Integer swingCardAmount;  //刷卡销售额
    private Integer swingCardCount;  //刷卡销量
    private Integer posAmount;  //pos机销售额
    private Integer posCount;  //pos机销量
    private Integer oneCardsolutionAmount;  //一卡通销售额
    private Integer oneCardsolutionCount;  //一卡通销量
    private Integer agriculturalBankAmount;  //农行掌银销售额
    private Integer agriculturalBankCount;  //农行掌银销量
    private Integer gameAmount;  //游戏销售额
    private Integer gameCount;  //游戏销量
    private Integer vipPayAmount;  //会员支付销售额
    private Integer vipPayCount;  //会员支付销量
    private Integer bestPayAmount;  //翼支付销售额
    private Integer bestPayCount;  //翼支付销量
    private Integer jdpayAmount;  //京东支付销售额
    private Integer jdpayCount;  //京东支付销量
    private Integer wechatBarcodeAmount;  //微信反扫销售额
    private Integer wechatBarcodeCount;  //微信反扫销量
    private Integer alipayBarcodeAmount;  //支付宝反扫销售额
    private Integer alipayBarcodeCount;  //支付宝反扫销量
    private Integer otherAmount;  //其他销售额
    private Integer otherCount;  //其他销量
    private Integer unionPayAmount;
    private Integer unionPayCount;
    private Integer qrcodepayAmount;
    private Integer qrcodepayCount;
    private Integer icbcpayAmount;
    private Integer icbcpayCount;
    private Integer dragonAmount;
    private Integer dragonCount;
    private Integer onePurseAmount;
    private Integer onePurseCount;
    private Integer unionReversepayAmount;
    private Integer unionReversepayCount;

    public Integer getUnionReversepayAmount() {
        return unionReversepayAmount;
    }

    public void setUnionReversepayAmount(Integer unionReversepayAmount) {
        this.unionReversepayAmount = unionReversepayAmount;
    }

    public Integer getUnionReversepayCount() {
        return unionReversepayCount;
    }

    public void setUnionReversepayCount(Integer unionReversepayCount) {
        this.unionReversepayCount = unionReversepayCount;
    }
    
    

    public Integer getOnePurseAmount() {
        return onePurseAmount;
    }

    public void setOnePurseAmount(Integer onePurseAmount) {
        this.onePurseAmount = onePurseAmount;
    }

    public Integer getOnePurseCount() {
        return onePurseCount;
    }

    public void setOnePurseCount(Integer onePurseCount) {
        this.onePurseCount = onePurseCount;
    }
    
    

    public Integer getDragonAmount() {
        return dragonAmount;
    }

    public void setDragonAmount(Integer dragonAmount) {
        this.dragonAmount = dragonAmount;
    }

    public Integer getDragonCount() {
        return dragonCount;
    }

    public void setDragonCount(Integer dragonCount) {
        this.dragonCount = dragonCount;
    }

    
    
    public Integer getIcbcpayAmount() {
        return icbcpayAmount;
    }

    public void setIcbcpayAmount(Integer icbcpayAmount) {
        this.icbcpayAmount = icbcpayAmount;
    }

    public Integer getIcbcpayCount() {
        return icbcpayCount;
    }

    public void setIcbcpayCount(Integer icbcpayCount) {
        this.icbcpayCount = icbcpayCount;
    }
    
    

    public Integer getQrcodepayAmount() {
        return qrcodepayAmount;
    }

    public void setQrcodepayAmount(Integer qrcodepayAmount) {
        this.qrcodepayAmount = qrcodepayAmount;
    }

    public Integer getQrcodepayCount() {
        return qrcodepayCount;
    }

    public void setQrcodepayCount(Integer qrcodepayCount) {
        this.qrcodepayCount = qrcodepayCount;
    }
    
    

    public Integer getUnionPayAmount() {
        return unionPayAmount;
    }

    public void setUnionPayAmount(Integer unionPayAmount) {
        this.unionPayAmount = unionPayAmount;
    }

    public Integer getUnionPayCount() {
        return unionPayCount;
    }

    public void setUnionPayCount(Integer unionPayCount) {
        this.unionPayCount = unionPayCount;
    }
    
    

    public String getLocation_id() {
        return location_id;
    }

    public void setLocation_id(String location_id) {
        this.location_id = location_id;
    }

    public String getGoods_id() {
        return goods_id;
    }

    public void setGoods_id(String goods_id) {
        this.goods_id = goods_id;
    }

    public String getGoods_name() {
        return goods_name;
    }

    public void setGoods_name(String goods_name) {
        this.goods_name = goods_name;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(Integer salesAmount) {
        this.salesAmount = salesAmount;
    }

    public Integer getSalesCount() {
        return salesCount;
    }

    public void setSalesCount(Integer salesCount) {
        this.salesCount = salesCount;
    }

    public Integer getCashAmount() {
        return cashAmount;
    }

    public void setCashAmount(Integer cashAmount) {
        this.cashAmount = cashAmount;
    }

    public Integer getCashCount() {
        return cashCount;
    }

    public void setCashCount(Integer cashCount) {
        this.cashCount = cashCount;
    }

    public Integer getNocashAmount() {
        return nocashAmount;
    }

    public void setNocashAmount(Integer nocashAmount) {
        this.nocashAmount = nocashAmount;
    }

    public Integer getNocashCount() {
        return nocashCount;
    }

    public void setNocashCount(Integer nocashCount) {
        this.nocashCount = nocashCount;
    }

    public Integer getWechatAmount() {
        return wechatAmount;
    }

    public void setWechatAmount(Integer wechatAmount) {
        this.wechatAmount = wechatAmount;
    }

    public Integer getWechatCount() {
        return wechatCount;
    }

    public void setWechatCount(Integer wechatCount) {
        this.wechatCount = wechatCount;
    }

    public Integer getAlipayAmount() {
        return alipayAmount;
    }

    public void setAlipayAmount(Integer alipayAmount) {
        this.alipayAmount = alipayAmount;
    }

    public Integer getAlipayCount() {
        return alipayCount;
    }

    public void setAlipayCount(Integer alipayCount) {
        this.alipayCount = alipayCount;
    }

    public Integer getBaifubaoAmount() {
        return baifubaoAmount;
    }

    public void setBaifubaoAmount(Integer baifubaoAmount) {
        this.baifubaoAmount = baifubaoAmount;
    }

    public Integer getBaifubaoCount() {
        return baifubaoCount;
    }

    public void setBaifubaoCount(Integer baifubaoCount) {
        this.baifubaoCount = baifubaoCount;
    }

    public Integer getAlipaySoundWaveAmount() {
        return alipaySoundWaveAmount;
    }

    public void setAlipaySoundWaveAmount(Integer alipaySoundWaveAmount) {
        this.alipaySoundWaveAmount = alipaySoundWaveAmount;
    }

    public Integer getAlipaySoundWaveCount() {
        return alipaySoundWaveCount;
    }

    public void setAlipaySoundWaveCount(Integer alipaySoundWaveCount) {
        this.alipaySoundWaveCount = alipaySoundWaveCount;
    }

    public Integer getSwingCardAmount() {
        return swingCardAmount;
    }

    public void setSwingCardAmount(Integer swingCardAmount) {
        this.swingCardAmount = swingCardAmount;
    }

    public Integer getSwingCardCount() {
        return swingCardCount;
    }

    public void setSwingCardCount(Integer swingCardCount) {
        this.swingCardCount = swingCardCount;
    }

    public Integer getPosAmount() {
        return posAmount;
    }

    public void setPosAmount(Integer posAmount) {
        this.posAmount = posAmount;
    }

    public Integer getPosCount() {
        return posCount;
    }

    public void setPosCount(Integer posCount) {
        this.posCount = posCount;
    }

    public Integer getOneCardsolutionAmount() {
        return oneCardsolutionAmount;
    }

    public void setOneCardsolutionAmount(Integer oneCardsolutionAmount) {
        this.oneCardsolutionAmount = oneCardsolutionAmount;
    }

    public Integer getOneCardsolutionCount() {
        return oneCardsolutionCount;
    }

    public void setOneCardsolutionCount(Integer oneCardsolutionCount) {
        this.oneCardsolutionCount = oneCardsolutionCount;
    }

    public Integer getAgriculturalBankAmount() {
        return agriculturalBankAmount;
    }

    public void setAgriculturalBankAmount(Integer agriculturalBankAmount) {
        this.agriculturalBankAmount = agriculturalBankAmount;
    }

    public Integer getAgriculturalBankCount() {
        return agriculturalBankCount;
    }

    public void setAgriculturalBankCount(Integer agriculturalBankCount) {
        this.agriculturalBankCount = agriculturalBankCount;
    }

    public Integer getGameAmount() {
        return gameAmount;
    }

    public void setGameAmount(Integer gameAmount) {
        this.gameAmount = gameAmount;
    }

    public Integer getGameCount() {
        return gameCount;
    }

    public void setGameCount(Integer gameCount) {
        this.gameCount = gameCount;
    }

    public Integer getVipPayAmount() {
        return vipPayAmount;
    }

    public void setVipPayAmount(Integer vipPayAmount) {
        this.vipPayAmount = vipPayAmount;
    }

    public Integer getVipPayCount() {
        return vipPayCount;
    }

    public void setVipPayCount(Integer vipPayCount) {
        this.vipPayCount = vipPayCount;
    }

    public Integer getBestPayAmount() {
        return bestPayAmount;
    }

    public void setBestPayAmount(Integer bestPayAmount) {
        this.bestPayAmount = bestPayAmount;
    }

    public Integer getBestPayCount() {
        return bestPayCount;
    }

    public void setBestPayCount(Integer bestPayCount) {
        this.bestPayCount = bestPayCount;
    }

    public Integer getJdpayAmount() {
        return jdpayAmount;
    }

    public void setJdpayAmount(Integer jdpayAmount) {
        this.jdpayAmount = jdpayAmount;
    }

    public Integer getJdpayCount() {
        return jdpayCount;
    }

    public void setJdpayCount(Integer jdpayCount) {
        this.jdpayCount = jdpayCount;
    }

    public Integer getWechatBarcodeAmount() {
        return wechatBarcodeAmount;
    }

    public void setWechatBarcodeAmount(Integer wechatBarcodeAmount) {
        this.wechatBarcodeAmount = wechatBarcodeAmount;
    }

    public Integer getWechatBarcodeCount() {
        return wechatBarcodeCount;
    }

    public void setWechatBarcodeCount(Integer wechatBarcodeCount) {
        this.wechatBarcodeCount = wechatBarcodeCount;
    }

    public Integer getAlipayBarcodeAmount() {
        return alipayBarcodeAmount;
    }

    public void setAlipayBarcodeAmount(Integer alipayBarcodeAmount) {
        this.alipayBarcodeAmount = alipayBarcodeAmount;
    }

    public Integer getAlipayBarcodeCount() {
        return alipayBarcodeCount;
    }

    public void setAlipayBarcodeCount(Integer alipayBarcodeCount) {
        this.alipayBarcodeCount = alipayBarcodeCount;
    }

    public Integer getOtherAmount() {
        return otherAmount;
    }

    public void setOtherAmount(Integer otherAmount) {
        this.otherAmount = otherAmount;
    }

    public Integer getOtherCount() {
        return otherCount;
    }

    public void setOtherCount(Integer otherCount) {
        this.otherCount = otherCount;
    }
    
    
}
