package cn.com.inhand.common.model;

import java.util.ArrayList;

public class Info {
    /**
     * 延迟时间
     */
    private Integer delay;

    /**
     * 最大数据包大小
     */
    private Integer mru;

    /**
     * 协议版本
     */
    private String protoVersion;
    /**
     * 平台保存的配置版本
     */
    private String platformConfig;
    /**
     * 设备的配置版本
     */
    private String deviceConfig;
    /**
     * 设备的boot版本
     */
    private String bootVersion;
    /**
     * 设备的硬件版本
     */
    private String hwVersion;
    /**
     * 设备的软件版本
     */
    private String swVersion;
    /**
     * 设备的ovdp版本
     */
    private String ovdpcVersion;
    /**
     * 设备的imsi信息
     */
    private String imsi;
    /**
     * 设备的gps信息
     */
    private ArrayList<Float> gps;

    private Integer cid;
    private Integer lac;
    private Integer mnc;
    private Integer mcc;
    /**
     * 设备信号值
     */
    private Integer rssi;
    private String ovdpVersion;
    /**
     * 设备网管序列号
     */
    private String sn;

    public Integer getDelay() {
        return delay;
    }

    public void setDelay(Integer delay) {
        this.delay = delay;
    }

    public Integer getMru() {
        return mru;
    }

    public void setMru(Integer mru) {
        this.mru = mru;
    }

    public String getProtoVersion() {
        return protoVersion;
    }

    public void setProtoVersion(String protoVersion) {
        this.protoVersion = protoVersion;
    }

    public String getPlatformConfig() {
        return platformConfig;
    }

    public void setPlatformConfig(String platformConfig) {
        this.platformConfig = platformConfig;
    }

    public String getDeviceConfig() {
        return deviceConfig;
    }

    public void setDeviceConfig(String deviceConfig) {
        this.deviceConfig = deviceConfig;
    }

    public String getBootVersion() {
        return bootVersion;
    }

    public void setBootVersion(String bootVersion) {
        this.bootVersion = bootVersion;
    }

    public String getHwVersion() {
        return hwVersion;
    }

    public void setHwVersion(String hwVersion) {
        this.hwVersion = hwVersion;
    }

    public String getSwVersion() {
        return swVersion;
    }

    public void setSwVersion(String swVersion) {
        this.swVersion = swVersion;
    }

    public String getOvdpcVersion() {
        return ovdpcVersion;
    }

    public void setOvdpcVersion(String ovdpcVersion) {
        this.ovdpcVersion = ovdpcVersion;
    }

    public String getImsi() {
        return imsi;
    }

    public void setImsi(String imsi) {
        this.imsi = imsi;
    }

    public ArrayList<Float> getGps() {
        return gps;
    }

    public void setGps(ArrayList<Float> gps) {
        this.gps = gps;
    }

    public Integer getCid() {
        return cid;
    }

    public void setCid(Integer cid) {
        this.cid = cid;
    }

    public Integer getLac() {
        return lac;
    }

    public void setLac(Integer lac) {
        this.lac = lac;
    }

    public Integer getMnc() {
        return mnc;
    }

    public void setMnc(Integer mnc) {
        this.mnc = mnc;
    }

    public Integer getMcc() {
        return mcc;
    }

    public void setMcc(Integer mcc) {
        this.mcc = mcc;
    }

    public Integer getRssi() {
        return rssi;
    }

    public void setRssi(Integer rssi) {
        this.rssi = rssi;
    }

    public String getOvdpVersion() {
        return ovdpVersion;
    }

    public void setOvdpVersion(String ovdpVersion) {
        this.ovdpVersion = ovdpVersion;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

}
