package cn.com.inhand.statistic.model;

import org.bson.types.ObjectId;

import java.util.ArrayList;

public class DeviceSignalBean {
    private ObjectId deviceId;

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    private ArrayList<ArrayList<Integer>> signal;

    public ArrayList<ArrayList<Integer>> getSignal() {
        return signal;
    }

    public void setSignal(ArrayList<ArrayList<Integer>> signal) {
        this.signal = signal;
    }

}
