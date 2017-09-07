/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class ShelvesSumState {
    private String cid;//货柜编号
    private Long shelfSum;//货道数
    private Long shelfSoldSum;//货道售空数
    private int type;//货柜类型

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
    
    

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }

    public Long getShelfSum() {
        return shelfSum;
    }

    public void setShelfSum(Long shelfSum) {
        this.shelfSum = shelfSum;
    }

    public Long getShelfSoldSum() {
        return shelfSoldSum;
    }

    public void setShelfSoldSum(Long shelfSoldSum) {
        this.shelfSoldSum = shelfSoldSum;
    }
    
}
