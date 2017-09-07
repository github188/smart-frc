package cn.com.inhand.statistic.model;

import cn.com.inhand.statistic.dto.DeviceOnlineState;
import org.bson.types.ObjectId;

import java.util.ArrayList;

public class DeviceStatusBean {

    private ObjectId deviceId;
    private ArrayList<DeviceOnlineState> devicestats;

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public ArrayList<DeviceOnlineState> getDevicestats() {
        return devicestats;
    }

    public void setDevicestats(ArrayList<DeviceOnlineState> devicestats) {
        this.devicestats = devicestats;
    }

}
