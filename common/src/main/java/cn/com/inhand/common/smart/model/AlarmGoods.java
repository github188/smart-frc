/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class AlarmGoods {
    private String goodsName;
    private String goodsId;
    private int shortageQuantity;//缺货数量
    private String shelf;//对应货道
    private int totalcapacity;//货道容量
    private int surplusQuantity;//剩余数量
    
    public AlarmGoods() {
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(String goodsId) {
        this.goodsId = goodsId;
    }

    public int getShortageQuantity() {
        return shortageQuantity;
    }

    public void setShortageQuantity(int shortageQuantity) {
        this.shortageQuantity = shortageQuantity;
    }

    public String getShelf() {
        return shelf;
    }

    public void setShelf(String shelf) {
        this.shelf = shelf;
    }

    public int getTotalcapacity() {
        return totalcapacity;
    }

    public void setTotalcapacity(int totalcapacity) {
        this.totalcapacity = totalcapacity;
    }

    public int getSurplusQuantity() {
        return surplusQuantity;
    }

    public void setSurplusQuantity(int surplusQuantity) {
        this.surplusQuantity = surplusQuantity;
    }
}
