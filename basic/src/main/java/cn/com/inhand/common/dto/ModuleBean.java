/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.dto;

/**
 *
 * @author lenovo
 */
public class ModuleBean {

    private String vender;
    private String moduleNum;
    private String deviceType;            //赛道类型
    private String runwayStartNum;        //赛道起始编号
    private String runwayCount;       //赛道个数

    public String getVender() {
        return vender;
    }

    public void setVender(String vender) {
        this.vender = vender;
    }

    public String getModuleNum() {
        return moduleNum;
    }

    public void setModuleNum(String moduleNum) {
        this.moduleNum = moduleNum;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getRunwayStartNum() {
        return runwayStartNum;
    }

    public void setRunwayStartNum(String runwayStartNum) {
        this.runwayStartNum = runwayStartNum;
    }

    public String getRunwayCount() {
        return runwayCount;
    }

    public void setRunwayCount(String runwayCount) {
        this.runwayCount = runwayCount;
    }
}
