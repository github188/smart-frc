/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ShelfReplenRecord {
    
    private String locationId;   //货道编号
    private String goodsId;
    private String goodsName;    //商品名称
    private String price;          //价格
    private Integer valve;          //阈值
    private Integer replenCount; //应补货数量
    
    private Integer capacity;   //容量
    private Integer stock;    //库存
    private Integer lastStock;  //上次库存
    
    
    private Integer saleNum=0;    //货道销量累计数
    private Integer saleM=0;     //货道销量累计金额
    
    private Integer platSaleNum=0;  //平台累计销量
    private Integer platSaleM=0;   //平台累计金额
    
    private Integer lastSaleNum=0;   //上次货道累计数
    private Integer lastSaleM=0;    //上次货道累计金额
    
    private Integer platformSaleNum=0;  //平台本期累计销量
    
    private Integer tempPlatNum=0;
    private Integer tempPlatM=0;
    
    
    private Integer wechatNum;       //微信
    private Integer alipayNum;       //支付宝累计销量
    private Integer cashNum=0;         //现金
    private Integer baifubaoNum;
    private Integer alipaySoundWaveNum;
    private Integer swingCardNum;
    private Integer posNum;
    private Integer oneCardsolutionNum;
    private Integer agriculturalBankNum;
    private Integer gameNum;
    private Integer vipPayNum;
    private Integer bestPayNum;
    private Integer jdpayNum;
    private Integer wechatBarcodeNum;
    private Integer alipayBarcodeNum;
    private Integer otherNum;
    
    private Integer platformSaleM=0;  //平台本期累计销售额
    private Integer wechatM;       //微信累计销售额
    private Integer alipayM;       //支付宝累计累计销售额
    private Integer cashM=0;         //现金累计销售额
    private Integer baifubaoM;
    private Integer alipaySoundWaveM;
    private Integer swingCardM;
    private Integer posM;
    private Integer oneCardsolutionM;
    private Integer agriculturalBankM;
    private Integer gameM;
    private Integer vipPayM;
    private Integer bestPaM;
    private Integer jdpayM;
    private Integer wechatBarcodeM;
    private Integer alipayBarcodeM;
    private Integer otherM;

    public Integer getLastStock() {
        return lastStock;
    }

    public void setLastStock(Integer lastStock) {
        this.lastStock = lastStock;
    }
    
    
    public Integer getTempPlatNum() {
        return tempPlatNum;
    }

    public void setTempPlatNum(Integer tempPlatNum) {
        this.tempPlatNum = tempPlatNum;
    }

    public Integer getTempPlatM() {
        return tempPlatM;
    }

    public void setTempPlatM(Integer tempPlatM) {
        this.tempPlatM = tempPlatM;
    }

    
    
    public Integer getPlatSaleNum() {
        return platSaleNum;
    }

    public void setPlatSaleNum(Integer platSaleNum) {
        this.platSaleNum = platSaleNum;
    }

    public Integer getPlatSaleM() {
        return platSaleM;
    }

    public void setPlatSaleM(Integer platSaleM) {
        this.platSaleM = platSaleM;
    }

    
    
    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    public Integer getValve() {
        return valve;
    }

    public void setValve(Integer valve) {
        this.valve = valve;
    }

    public Integer getSaleNum() {
        return saleNum;
    }

    public void setSaleNum(Integer saleNum) {
        this.saleNum = saleNum;
    }

    public Integer getSaleM() {
        return saleM;
    }

    public void setSaleM(Integer saleM) {
        this.saleM = saleM;
    }

    public Integer getLastSaleNum() {
        return lastSaleNum;
    }

    public void setLastSaleNum(Integer lastSaleNum) {
        this.lastSaleNum = lastSaleNum;
    }

    public Integer getLastSaleM() {
        return lastSaleM;
    }

    public void setLastSaleM(Integer lastSaleM) {
        this.lastSaleM = lastSaleM;
    }

    public Integer getPlatformSaleNum() {
        return platformSaleNum;
    }

    public void setPlatformSaleNum(Integer platformSaleNum) {
        this.platformSaleNum = platformSaleNum;
    }

    public Integer getWechatNum() {
        return wechatNum;
    }

    public void setWechatNum(Integer wechatNum) {
        this.wechatNum = wechatNum;
    }

    public Integer getAlipayNum() {
        return alipayNum;
    }

    public void setAlipayNum(Integer alipayNum) {
        this.alipayNum = alipayNum;
    }

    public Integer getCashNum() {
        return cashNum;
    }

    public void setCashNum(Integer cashNum) {
        this.cashNum = cashNum;
    }

    public Integer getBaifubaoNum() {
        return baifubaoNum;
    }

    public void setBaifubaoNum(Integer baifubaoNum) {
        this.baifubaoNum = baifubaoNum;
    }

    public Integer getAlipaySoundWaveNum() {
        return alipaySoundWaveNum;
    }

    public void setAlipaySoundWaveNum(Integer alipaySoundWaveNum) {
        this.alipaySoundWaveNum = alipaySoundWaveNum;
    }

    public Integer getSwingCardNum() {
        return swingCardNum;
    }

    public void setSwingCardNum(Integer swingCardNum) {
        this.swingCardNum = swingCardNum;
    }

    public Integer getPosNum() {
        return posNum;
    }

    public void setPosNum(Integer posNum) {
        this.posNum = posNum;
    }

    public Integer getOneCardsolutionNum() {
        return oneCardsolutionNum;
    }

    public void setOneCardsolutionNum(Integer oneCardsolutionNum) {
        this.oneCardsolutionNum = oneCardsolutionNum;
    }

    public Integer getAgriculturalBankNum() {
        return agriculturalBankNum;
    }

    public void setAgriculturalBankNum(Integer agriculturalBankNum) {
        this.agriculturalBankNum = agriculturalBankNum;
    }

    public Integer getGameNum() {
        return gameNum;
    }

    public void setGameNum(Integer gameNum) {
        this.gameNum = gameNum;
    }

    public Integer getVipPayNum() {
        return vipPayNum;
    }

    public void setVipPayNum(Integer vipPayNum) {
        this.vipPayNum = vipPayNum;
    }

    public Integer getBestPayNum() {
        return bestPayNum;
    }

    public void setBestPayNum(Integer bestPayNum) {
        this.bestPayNum = bestPayNum;
    }

    public Integer getJdpayNum() {
        return jdpayNum;
    }

    public void setJdpayNum(Integer jdpayNum) {
        this.jdpayNum = jdpayNum;
    }

    public Integer getWechatBarcodeNum() {
        return wechatBarcodeNum;
    }

    public void setWechatBarcodeNum(Integer wechatBarcodeNum) {
        this.wechatBarcodeNum = wechatBarcodeNum;
    }

    public Integer getAlipayBarcodeNum() {
        return alipayBarcodeNum;
    }

    public void setAlipayBarcodeNum(Integer alipayBarcodeNum) {
        this.alipayBarcodeNum = alipayBarcodeNum;
    }

    public Integer getOtherNum() {
        return otherNum;
    }

    public void setOtherNum(Integer otherNum) {
        this.otherNum = otherNum;
    }

    public Integer getPlatformSaleM() {
        return platformSaleM;
    }

    public void setPlatformSaleM(Integer platformSaleM) {
        this.platformSaleM = platformSaleM;
    }

    public Integer getWechatM() {
        return wechatM;
    }

    public void setWechatM(Integer wechatM) {
        this.wechatM = wechatM;
    }

    public Integer getAlipayM() {
        return alipayM;
    }

    public void setAlipayM(Integer alipayM) {
        this.alipayM = alipayM;
    }

    public Integer getCashM() {
        return cashM;
    }

    public void setCashM(Integer cashM) {
        this.cashM = cashM;
    }

    public Integer getBaifubaoM() {
        return baifubaoM;
    }

    public void setBaifubaoM(Integer baifubaoM) {
        this.baifubaoM = baifubaoM;
    }

    public Integer getAlipaySoundWaveM() {
        return alipaySoundWaveM;
    }

    public void setAlipaySoundWaveM(Integer alipaySoundWaveM) {
        this.alipaySoundWaveM = alipaySoundWaveM;
    }

    public Integer getSwingCardM() {
        return swingCardM;
    }

    public void setSwingCardM(Integer swingCardM) {
        this.swingCardM = swingCardM;
    }

    public Integer getPosM() {
        return posM;
    }

    public void setPosM(Integer posM) {
        this.posM = posM;
    }

    public Integer getOneCardsolutionM() {
        return oneCardsolutionM;
    }

    public void setOneCardsolutionM(Integer oneCardsolutionM) {
        this.oneCardsolutionM = oneCardsolutionM;
    }

    public Integer getAgriculturalBankM() {
        return agriculturalBankM;
    }

    public void setAgriculturalBankM(Integer agriculturalBankM) {
        this.agriculturalBankM = agriculturalBankM;
    }

    public Integer getGameM() {
        return gameM;
    }

    public void setGameM(Integer gameM) {
        this.gameM = gameM;
    }

    public Integer getVipPayM() {
        return vipPayM;
    }

    public void setVipPayM(Integer vipPayM) {
        this.vipPayM = vipPayM;
    }

    public Integer getBestPaM() {
        return bestPaM;
    }

    public void setBestPaM(Integer bestPaM) {
        this.bestPaM = bestPaM;
    }

    public Integer getJdpayM() {
        return jdpayM;
    }

    public void setJdpayM(Integer jdpayM) {
        this.jdpayM = jdpayM;
    }

    public Integer getWechatBarcodeM() {
        return wechatBarcodeM;
    }

    public void setWechatBarcodeM(Integer wechatBarcodeM) {
        this.wechatBarcodeM = wechatBarcodeM;
    }

    public Integer getAlipayBarcodeM() {
        return alipayBarcodeM;
    }

    public void setAlipayBarcodeM(Integer alipayBarcodeM) {
        this.alipayBarcodeM = alipayBarcodeM;
    }

    public Integer getOtherM() {
        return otherM;
    }

    public void setOtherM(Integer otherM) {
        this.otherM = otherM;
    }
    
    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }
    
    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }


    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Integer getReplenCount() {
        return replenCount;
    }

    public void setReplenCount(Integer replenCount) {
        this.replenCount = replenCount;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
    
    
}
