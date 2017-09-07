/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class ShelvesSaleData {
    private String locationId;  //货道ID
    
    private String goodsId;     //商品ID   此商品ID用来和上一次补货中的goodsId对比，如果goodsId不相同说，本次补货这个货道商品发生变化，
                                //并且本次补货goodsId存为新的商品ID，商品名称存为上一次补货的商品名称。如果goodsId相同，商品名称、与商品goodsId都使用本次商品信息
    
                                //如果这个货道在上一次补货中有，本次补货中没有，需要将上一次补货中的商品信息拿过来显示，并计算本期销售数量
    
    private String goodsName;     //商品名称
    private String price;          //价格
    private Integer valve;          //阈值
    private Integer capacity=0;   //货道容量
    private Integer stock;      //库存
    
    private Integer lastStock;   //上次库存
    
    private Integer saleNum=0;    //货道销量累计数
    private Integer saleM=0;     //货道销量累计金额
    
    private Integer platSaleNum=0;  //平台累计销量
    private Integer platSaleM=0;   //平台累计金额
    
    private Integer lastSaleNum=0;   //上次货道累计数
    private Integer lastSaleM=0;    //上次货道累计金额
    
    private Integer platformSaleNum=0;  //平台本期累计销量
    
    private Integer tempPlatNum=0;
    private Integer tempPlatM=0;
    
    private Integer wechatNum=0;       //微信
    private Integer alipayNum=0;       //支付宝累计销量
    private Integer cashNum=0;         //现金
    private Integer baifubaoNum=0;
    private Integer alipaySoundWaveNum=0;
    private Integer swingCardNum=0;
    private Integer posNum=0;
    private Integer oneCardsolutionNum=0;
    private Integer agriculturalBankNum=0;
    private Integer gameNum=0;
    private Integer vipPayNum=0;
    private Integer bestPayNum=0;
    private Integer jdpayNum=0;
    private Integer wechatBarcodeNum=0;
    private Integer alipayBarcodeNum=0;
    private Integer otherNum=0;
    private Integer unionPayNum=0;
    private Integer qrcodepayNum=0;
    private Integer icbcpayNum=0;
    private Integer dragonNum=0;
    private Integer onePurseNum=0;
    private Integer unionReversePayNum=0;
    
    private Integer unionReversePayM=0;
    private Integer platformSaleM=0;  //平台本期累计销售额
    private Integer wechatM=0;       //微信累计销售额
    private Integer alipayM=0;       //支付宝累计累计销售额
    private Integer cashM=0;         //现金累计销售额
    private Integer baifubaoM=0;
    private Integer alipaySoundWaveM=0;
    private Integer swingCardM=0;
    private Integer posM=0;
    private Integer oneCardsolutionM=0;
    private Integer agriculturalBankM=0;
    private Integer gameM=0;
    private Integer vipPayM=0;
    private Integer bestPaM=0;
    private Integer jdpayM=0;
    private Integer wechatBarcodeM=0;
    private Integer alipayBarcodeM=0;
    private Integer otherM=0;
    private Integer unionPayM=0;
    private Integer qrcodepayM=0;
    private Integer icbcpayM=0;
    private Integer dragonM=0;
    private Integer onePurseM=0;

    public Integer getUnionReversePayNum() {
        return unionReversePayNum;
    }

    public void setUnionReversePayNum(Integer unionReversePayNum) {
        this.unionReversePayNum = unionReversePayNum;
    }

    public Integer getUnionReversePayM() {
        return unionReversePayM;
    }

    public void setUnionReversePayM(Integer unionReversePayM) {
        this.unionReversePayM = unionReversePayM;
    }
    
    

    public Integer getOnePurseNum() {
        return onePurseNum;
    }

    public void setOnePurseNum(Integer onePurseNum) {
        this.onePurseNum = onePurseNum;
    }

    public Integer getOnePurseM() {
        return onePurseM;
    }

    public void setOnePurseM(Integer onePurseM) {
        this.onePurseM = onePurseM;
    }

    
    
    public Integer getDragonNum() {
        return dragonNum;
    }

    public void setDragonNum(Integer dragonNum) {
        this.dragonNum = dragonNum;
    }

    public Integer getDragonM() {
        return dragonM;
    }

    public void setDragonM(Integer dragonM) {
        this.dragonM = dragonM;
    }

    
    public Integer getIcbcpayNum() {
        return icbcpayNum;
    }

    public void setIcbcpayNum(Integer icbcpayNum) {
        this.icbcpayNum = icbcpayNum;
    }

    public Integer getIcbcpayM() {
        return icbcpayM;
    }

    public void setIcbcpayM(Integer icbcpayM) {
        this.icbcpayM = icbcpayM;
    }

    
    public Integer getQrcodepayNum() {
        return qrcodepayNum;
    }

    public void setQrcodepayNum(Integer qrcodepayNum) {
        this.qrcodepayNum = qrcodepayNum;
    }

    public Integer getQrcodepayM() {
        return qrcodepayM;
    }

    public void setQrcodepayM(Integer qrcodepayM) {
        this.qrcodepayM = qrcodepayM;
    }
    
    

    public Integer getUnionPayNum() {
        return unionPayNum;
    }

    public void setUnionPayNum(Integer unionPayNum) {
        this.unionPayNum = unionPayNum;
    }

    public Integer getUnionPayM() {
        return unionPayM;
    }

    public void setUnionPayM(Integer unionPayM) {
        this.unionPayM = unionPayM;
    }

    
    
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
    
    
    

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
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

    public Integer getValve() {
        return valve;
    }

    public void setValve(Integer valve) {
        this.valve = valve;
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


    
    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public Integer getPlatformSaleNum() {
        return platformSaleNum;
    }

    public void setPlatformSaleNum(Integer platformSaleNum) {
        this.platformSaleNum = platformSaleNum;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }
    
}
