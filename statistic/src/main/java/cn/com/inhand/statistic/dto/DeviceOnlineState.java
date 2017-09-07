package cn.com.inhand.statistic.dto;

public class DeviceOnlineState {
    private String _id;
    private String deviceId;
    private Long login;
    private Long logout;
    private Long onlineInterval;
    private Long offlineInterval;
    private int exception;

    public void addOnlineInterval(Long interval) {
        this.onlineInterval += interval;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String id) {
        _id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Long getLogin() {
        return login;
    }

    public void setLogin(Long login) {
        this.login = login;
    }

    public Long getLogout() {
        return logout;
    }

    public void setLogout(Long logout) {
        this.logout = logout;
    }

    public Long getOnlineInterval() {
        return onlineInterval;
    }

    public void setOnlineInterval(Long onlineInterval) {
        this.onlineInterval = onlineInterval;
    }

    public Long getOfflineInterval() {
        return offlineInterval;
    }

    public void setOfflineInterval(Long offlineInterval) {
        this.offlineInterval = offlineInterval;
    }

    public int getException() {
        return exception;
    }

    public void setException(int exception) {
        this.exception = exception;
    }

}
