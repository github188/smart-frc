/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class VendingCoinFault {
    private Integer connF;  //硬币器连接故障   90031
    private Integer voltsLow;   //硬币器工作电压低  90032
    private Integer sensorF;    //硬币器传感器故障  90033
    private Integer romChkF;    //硬币器ROM校验错误  90034
    private Integer inBlock;    //硬 币器接收堵塞  90035
    private Integer outBlock;   //硬币器支出堵塞  90036
    private Integer fiveLack;   //5角缺币  90037
    private Integer oneLack;    //1元缺币  90038
    private Integer excepRemoved;  //硬币器异常移除  90039
    private Integer outage;   //硬币器停用  900311

    public Integer getConnF() {
        return connF;
    }

    public void setConnF(Integer connF) {
        this.connF = connF;
    }

    public Integer getVoltsLow() {
        return voltsLow;
    }

    public void setVoltsLow(Integer voltsLow) {
        this.voltsLow = voltsLow;
    }

    public Integer getSensorF() {
        return sensorF;
    }

    public void setSensorF(Integer sensorF) {
        this.sensorF = sensorF;
    }

    public Integer getRomChkF() {
        return romChkF;
    }

    public void setRomChkF(Integer romChkF) {
        this.romChkF = romChkF;
    }

    public Integer getInBlock() {
        return inBlock;
    }

    public void setInBlock(Integer inBlock) {
        this.inBlock = inBlock;
    }

    public Integer getOutBlock() {
        return outBlock;
    }

    public void setOutBlock(Integer outBlock) {
        this.outBlock = outBlock;
    }

    public Integer getFiveLack() {
        return fiveLack;
    }

    public void setFiveLack(Integer fiveLack) {
        this.fiveLack = fiveLack;
    }

    public Integer getOneLack() {
        return oneLack;
    }

    public void setOneLack(Integer oneLack) {
        this.oneLack = oneLack;
    }

    public Integer getExcepRemoved() {
        return excepRemoved;
    }

    public void setExcepRemoved(Integer excepRemoved) {
        this.excepRemoved = excepRemoved;
    }

    public Integer getOutage() {
        return outage;
    }

    public void setOutage(Integer outage) {
        this.outage = outage;
    }
    
}
