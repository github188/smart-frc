package cn.com.inhand.common.amqp.model;

public class DeviceSyncVersion {
	private String deviceId;
	private String versionStr;
	private String oId;
	
	/**
	 * @return the deviceId
	 */
	public String getDeviceId() {
		return deviceId;
	}
	/**
	 * @param deviceId the deviceId to set
	 */
	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}
	/**
	 * @return the versionStr
	 */
	public String getVersionStr() {
		return versionStr;
	}
	/**
	 * @param versionStr the versionStr to set
	 */
	public void setVersionStr(String versionStr) {
		this.versionStr = versionStr;
	}
	/**
	 * @return the oId
	 */
	public String getoId() {
		return oId;
	}
	/**
	 * @param oId the oId to set
	 */
	public void setoId(String oId) {
		this.oId = oId;
	}

	
}
