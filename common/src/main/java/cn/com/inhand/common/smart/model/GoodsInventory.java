/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class GoodsInventory {
    
    
    private String goodsName;   //商品名称
    
    private String goodsId;    //商品ID
    private Integer planSum;    //计划总数
    private Integer deliverSum;   //出库总数
    private Integer cancelSum;   //退库总数

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

    public Integer getPlanSum() {
        return planSum;
    }

    public void setPlanSum(Integer planSum) {
        this.planSum = planSum;
    }

    public Integer getDeliverSum() {
        return deliverSum;
    }

    public void setDeliverSum(Integer deliverSum) {
        this.deliverSum = deliverSum;
    }

    public Integer getCancelSum() {
        return cancelSum;
    }

    public void setCancelSum(Integer cancelSum) {
        this.cancelSum = cancelSum;
    }
    
    
}
