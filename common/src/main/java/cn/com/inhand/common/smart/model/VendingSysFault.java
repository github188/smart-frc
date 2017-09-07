/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class VendingSysFault {
    private Integer driverF;   //驱动板故障   90011
    private Integer clockF;    // 系统时钟故障  90012
    private Integer lSensorF;  // 左室传感器故障  90013
    private Integer rSensorF;  // 右室传感器故障  90014
    private Integer infraredF; //红外模块枚障  90015
    private Integer cardReaderF;  //读卡器故障 90016

    public Integer getCardReaderF() {
        return cardReaderF;
    }

    public void setCardReaderF(Integer cardReaderF) {
        this.cardReaderF = cardReaderF;
    }
    
    public Integer getDriverF() {
        return driverF;
    }

    public void setDriverF(Integer driverF) {
        this.driverF = driverF;
    }

    public Integer getClockF() {
        return clockF;
    }

    public void setClockF(Integer clockF) {
        this.clockF = clockF;
    }

    public Integer getlSensorF() {
        return lSensorF;
    }

    public void setlSensorF(Integer lSensorF) {
        this.lSensorF = lSensorF;
    }

    public Integer getrSensorF() {
        return rSensorF;
    }

    public void setrSensorF(Integer rSensorF) {
        this.rSensorF = rSensorF;
    }

    public Integer getInfraredF() {
        return infraredF;
    }

    public void setInfraredF(Integer infraredF) {
        this.infraredF = infraredF;
    }
    
}
