package cn.com.inhand.common.amqp.model;

public class DeviceSyncSecret {
	private String serialNumber;
	private String deviceId;
	private String deviceKey;
	private String oId;
	/**
	 * @return the serialNumber
	 */
	public String getSerialNumber() {
		return serialNumber;
	}
	/**
	 * @param serialNumber the serialNumber to set
	 */
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
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
	 * @return the deviceKey
	 */
	public String getDeviceKey() {
		return deviceKey;
	}
	/**
	 * @param deviceKey the deviceKey to set
	 */
	public void setDeviceKey(String deviceKey) {
		this.deviceKey = deviceKey;
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
