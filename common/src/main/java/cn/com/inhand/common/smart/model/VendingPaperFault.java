/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class VendingPaperFault {
    private Integer connF;  //连接故障    90021
    private Integer motorF;  //纸币器驱动马达故障    90022
    private Integer cashBoxRemoved;  //纸币器钱箱被移除  90023
    private Integer cashBoxFull;  //纸币器钱箱已满   90024
    private Integer romChkF; //纸币器rom校验错误  90025
    private Integer sensorF; //纸币器传感器故障  90026
    private Integer inBlock; //纸币器堵塞   90027
    private Integer outage;  // 90028

    public Integer getConnF() {
        return connF;
    }

    public void setConnF(Integer connF) {
        this.connF = connF;
    }

    public Integer getMotorF() {
        return motorF;
    }

    public void setMotorF(Integer motorF) {
        this.motorF = motorF;
    }

    public Integer getCashBoxRemoved() {
        return cashBoxRemoved;
    }

    public void setCashBoxRemoved(Integer cashBoxRemoved) {
        this.cashBoxRemoved = cashBoxRemoved;
    }

    public Integer getCashBoxFull() {
        return cashBoxFull;
    }

    public void setCashBoxFull(Integer cashBoxFull) {
        this.cashBoxFull = cashBoxFull;
    }

    public Integer getRomChkF() {
        return romChkF;
    }

    public void setRomChkF(Integer romChkF) {
        this.romChkF = romChkF;
    }

    public Integer getOutage() {
        return outage;
    }

    public void setOutage(Integer outage) {
        this.outage = outage;
    }

    public Integer getSensorF() {
        return sensorF;
    }

    public void setSensorF(Integer sensorF) {
        this.sensorF = sensorF;
    }

    public Integer getInBlock() {
        return inBlock;
    }

    public void setInBlock(Integer inBlock) {
        this.inBlock = inBlock;
    }
    
}
