/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author liqiang
 */
public class DeviceStatus {
    
    
    private String sign;
    private String nonce_str;
    private String clientId;
    
    private String assetId;
    //private String cid;
    private String siteName;
    private String lineName;
    private Integer online;
    private Integer doorState;  //门的状态  1 开门  0 关门
    private Integer isSale;     // 是否可售卖  1是可售卖，0是不可售卖
    private Integer coin5Count;   //5角硬币个数
    private Integer coin10Count;  //1元硬币个数
    private Integer vmcOnline;   //vmc连接情况
    private List<Integer> faultCode;  //故障码列表
    private List<ShelvesState> shelvesState;  //售货机货道状态
    private List<TemperState> temperState; //售货机温度状态

    private List<VendingFaultCode> vendingFault; //售货机故障状态
    private List<Versions> versions; //售货机各柜的VMC版本信息

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public String getNonce_str() {
        return nonce_str;
    }

    public void setNonce_str(String nonce_str) {
        this.nonce_str = nonce_str;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    
    
    
    public Integer getOnline() {
        return online;
    }

    public void setOnline(Integer online) {
        this.online = online;
    }

    
    
    
    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
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

    public Integer getVmcOnline() {
        return vmcOnline;
    }

    public void setVmcOnline(Integer vmcOnline) {
        this.vmcOnline = vmcOnline;
    }

    public List<Integer> getFaultCode() {
        return faultCode;
    }

    public void setFaultCode(List<Integer> faultCode) {
        this.faultCode = faultCode;
    }

    public List<ShelvesState> getShelvesState() {
        return shelvesState;
    }

    public void setShelvesState(List<ShelvesState> shelvesState) {
        this.shelvesState = shelvesState;
    }

    public List<TemperState> getTemperState() {
        return temperState;
    }

    public void setTemperState(List<TemperState> temperState) {
        this.temperState = temperState;
    }

    public List<VendingFaultCode> getVendingFault() {
        return vendingFault;
    }

    public void setVendingFault(List<VendingFaultCode> vendingFault) {
        this.vendingFault = vendingFault;
    }

    public List<Versions> getVersions() {
        return versions;
    }

    public void setVersions(List<Versions> versions) {
        this.versions = versions;
    }

    
    
    
}
