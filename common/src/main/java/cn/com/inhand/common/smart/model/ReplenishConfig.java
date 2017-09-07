/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ReplenishConfig {
    
    private Integer dataStyle;  //1 使用设备报上来的数据; 2 使用平台计算的数据

    public Integer getDataStyle() {
        return dataStyle;
    }

    public void setDataStyle(Integer dataStyle) {
        this.dataStyle = dataStyle;
    }
    
    
}
