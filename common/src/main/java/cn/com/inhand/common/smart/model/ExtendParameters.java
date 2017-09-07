/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ExtendParameters {
    
    private Integer tempmode; //0、表示常温， 1、表示冰，2表示热。
    private Integer sugar;//0、表示不加糖，1、表示加糖
    private Integer measurement;//1、表示小杯，2、表示大杯，其他的待扩充。
    private Integer milk;//0、表示不加奶，1、表示加奶。

    public Integer getTempmode() {
        return tempmode;
    }

    public void setTempmode(Integer tempmode) {
        this.tempmode = tempmode;
    }

    public Integer getSugar() {
        return sugar;
    }

    public void setSugar(Integer sugar) {
        this.sugar = sugar;
    }

    

    public Integer getMeasurement() {
        return measurement;
    }

    public void setMeasurement(Integer measurement) {
        this.measurement = measurement;
    }

    public Integer getMilk() {
        return milk;
    }

    public void setMilk(Integer milk) {
        this.milk = milk;
    }
    
    
}
