/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class CashInfo {
    
    
    private Integer type;      //现金类型  1.硬币;2.纸币
    private Integer denom;    //面额  以角为单位
    private Integer opertype;   //操作类型 1.支出;2.收入
    private Integer amount;   //数量

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getDenom() {
        return denom;
    }

    public void setDenom(Integer denom) {
        this.denom = denom;
    }

    public Integer getOpertype() {
        return opertype;
    }

    public void setOpertype(Integer opertype) {
        this.opertype = opertype;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }
    
    
    
    
}
