package cn.com.inhand.statistic.dto;

public class DeviceStatusDTO {

    private String deviceId;
    private long maxOnline;
    private long maxOffline;
    private long totalOnline;
    private long totalOffline;
    private long login;
    private int exception;
    private double onlineRate;
    private long firstLogin;

    public long getFirstlogin() {
		return firstLogin;
	}

	public void setFirstlogin(long firstLogin) {
		this.firstLogin = firstLogin;
	}

	public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public long getMaxOnline() {
        return maxOnline;
    }

    public void setMaxOnline(long maxOnline) {
        this.maxOnline = maxOnline;
    }

    public long getMaxOffline() {
        return maxOffline;
    }

    public void setMaxOffline(long maxOffline) {
        this.maxOffline = maxOffline;
    }

    public long getTotalOnline() {
        return totalOnline;
    }

    public void setTotalOnline(long totalOnline) {
        this.totalOnline = totalOnline;
    }

    public long getTotalOffline() {
        return totalOffline;
    }

    public void setTotalOffline(long totalOffline) {
        this.totalOffline = totalOffline;
    }

    public long getLogin() {
        return login;
    }

    public void setLogin(long login) {
        this.login = login;
    }

    public int getException() {
        return exception;
    }

    public void setException(int exception) {
        this.exception = exception;
    }

    public double getOnlineRate() {
        return onlineRate;
    }

    public void setOnlineRate(double onlineRate) {
        this.onlineRate = onlineRate;
    }

}
