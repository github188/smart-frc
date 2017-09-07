/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author liqiang
 */
public class DeliverInventory {
    
    private Integer deliverTotal=0;   //出库总数
    private Integer cancelTotal=0;   //退库总数
    private Integer planTotal=0;   //计划总数
    
    private List<GoodsInventory> goodsInventory;  //商品出库清单

    public Integer getPlanTotal() {
        return planTotal;
    }

    public void setPlanTotal(Integer planTotal) {
        this.planTotal = planTotal;
    }

    
    
    public Integer getDeliverTotal() {
        return deliverTotal;
    }

    public void setDeliverTotal(Integer deliverTotal) {
        this.deliverTotal = deliverTotal;
    }

    public Integer getCancelTotal() {
        return cancelTotal;
    }

    public void setCancelTotal(Integer cancelTotal) {
        this.cancelTotal = cancelTotal;
    }

    public List<GoodsInventory> getGoodsInventory() {
        return goodsInventory;
    }

    public void setGoodsInventory(List<GoodsInventory> goodsInventory) {
        this.goodsInventory = goodsInventory;
    }
    
    
    
}
