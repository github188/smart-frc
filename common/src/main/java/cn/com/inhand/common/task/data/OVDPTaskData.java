package cn.com.inhand.common.task.data;

import cn.com.inhand.common.task.TaskData;

public class OVDPTaskData extends TaskData {
    private String platformDesc;
    private int platformType;
    private String platformContent;
    private String deviceDesc;
    private int deviceType;
    private String deviceContent;

    public String getPlatformDesc() {
        return platformDesc;
    }

    public void setPlatformDesc(String platformDesc) {
        this.platformDesc = platformDesc;
    }

    public int getPlatformType() {
        return platformType;
    }

    public void setPlatformType(int platformType) {
        this.platformType = platformType;
    }

    public String getPlatformContent() {
        return platformContent;
    }

    public void setPlatformContent(String platformContent) {
        this.platformContent = platformContent;
    }

    public String getDeviceDesc() {
        return deviceDesc;
    }

    public void setDeviceDesc(String deviceDesc) {
        this.deviceDesc = deviceDesc;
    }

    public int getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(int deviceType) {
        this.deviceType = deviceType;
    }

    public String getDeviceContent() {
        return deviceContent;
    }

    public void setDeviceContent(String deviceContent) {
        this.deviceContent = deviceContent;
    }
}
