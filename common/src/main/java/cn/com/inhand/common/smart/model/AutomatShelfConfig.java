/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author shixj
 */
public class AutomatShelfConfig {
    private String shelfId;//货柜编号
    private String shelfSum;//货道数
    private String type;//类型 1:饮料机 2：弹簧机 3：格子柜

    public String getShelfId() {
        return shelfId;
    }

    public void setShelfId(String shelfId) {
        this.shelfId = shelfId;
    }

    public String getShelfSum() {
        return shelfSum;
    }

    public void setShelfSum(String shelfSum) {
        this.shelfSum = shelfSum;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
    
}
