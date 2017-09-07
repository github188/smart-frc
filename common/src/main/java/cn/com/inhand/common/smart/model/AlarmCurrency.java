/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class AlarmCurrency {
     private int currency;//币种   1代表 5角硬币      2代表 1元硬币  3代表 纸币
     private int shortageQuantity;//缺币数量
     
     public AlarmCurrency() {
     }

    public int getCurrency() {
        return currency;
    }

    public void setCurrency(int currency) {
        this.currency = currency;
    }

    public int getShortageQuantity() {
        return shortageQuantity;
    }

    public void setShortageQuantity(int shortageQuantity) {
        this.shortageQuantity = shortageQuantity;
    }
     
}
