/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class VendingState {
    private Integer doorState;  //门的状态  1 开门  0 关门
    private Integer isSale;     // 是否可售卖  1是可售卖，0是不可售卖
    private Integer coin5Count;   //5角硬币个数
    private Integer coin10Count;  //1元硬币个数
    private Integer vmcOnline;
    private List<Integer> faultCode;  //故障码列表
    private List<ShelvesState> shelvesState;  //售货机货道状态
    private List<TemperState> temperState; //售货机温度状态
//    private VendingFault vendingFault;   //售货机故障状态
    private List<VendingFaultCode> vendingFault;
    private List<Versions> versions; //售货机各柜的VMC版本信息
    private List<ShelvesSumState> shelvesSumState;  //售货机货柜个数 货道数及售空数

    public List<ShelvesSumState> getShelvesSumState() {
        return shelvesSumState;
    }

    public void setShelvesSumState(List<ShelvesSumState> shelvesSumState) {
        this.shelvesSumState = shelvesSumState;
    }
    

    public List<TemperState> getTemperState() {
        return temperState;
    }

    public void setTemperState(List<TemperState> temperState) {
        this.temperState = temperState;
    }

    public List<Versions> getVersions() {
        return versions;
    }

    public void setVersions(List<Versions> versions) {
        this.versions = versions;
    }

    public Integer getDoorState() {
        return doorState;
    }

    public void setDoorState(Integer doorState) {
        this.doorState = doorState;
    }

    public Integer getIsSale() {
        return isSale;
    }

    public void setIsSale(Integer isSale) {
        this.isSale = isSale;
    }

    public Integer getCoin5Count() {
        return coin5Count;
    }

    public void setCoin5Count(Integer coin5Count) {
        this.coin5Count = coin5Count;
    }

    public Integer getCoin10Count() {
        return coin10Count;
    }

    public void setCoin10Count(Integer coin10Count) {
        this.coin10Count = coin10Count;
    }

    public List<Integer> getFaultCode() {
        return faultCode;
    }

    public void setFaultCode(List<Integer> faultCode) {
        this.faultCode = faultCode;
    }

    public List<VendingFaultCode> getVendingFault() {
        return vendingFault;
    }

    public void setVendingFault(List<VendingFaultCode> vendingFault) {
        this.vendingFault = vendingFault;
    }

    public List<ShelvesState> getShelvesState() {
        return shelvesState;
    }

    public void setShelvesState(List<ShelvesState> shelvesState) {
        this.shelvesState = shelvesState;
    }

    public Integer getVmcOnline() {
        return vmcOnline;
    }

    public void setVmcOnline(Integer vmcOnline) {
        this.vmcOnline = vmcOnline;
    }
    

}
