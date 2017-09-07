package cn.com.inhand.common.model.wifi;

public class GroupRule{
	/**
	 * desc:
	 * 1,high level
	 * 2,middle level
	 * 3,low level
	 */
	private Integer priority;
	
	/**
	 * unit:KB/month
	 */
	private Integer flowLimit;
	
	/**
	 * unit:hour/month
	 */
	private Integer timeLimit;
	
	/**
	 * unit:KB/s
	 */
	private Integer bandwidthTX;
	
	/**
	 * unit:KB/s
	 */
	private Integer bandwidthRX;

	/**
	 * @return the priority
	 */
	public Integer getPriority() {
		return priority;
	}

	/**
	 * @param priority the priority to set
	 */
	public void setPriority(Integer priority) {
		this.priority = priority;
	}

	/**
	 * @return the flowLimit
	 */
	public Integer getFlowLimit() {
		return flowLimit;
	}

	/**
	 * @param flowLimit the flowLimit to set
	 */
	public void setFlowLimit(Integer flowLimit) {
		this.flowLimit = flowLimit;
	}

	/**
	 * @return the timeLimit
	 */
	public Integer getTimeLimit() {
		return timeLimit;
	}

	/**
	 * @param timeLimit the timeLimit to set
	 */
	public void setTimeLimit(Integer timeLimit) {
		this.timeLimit = timeLimit;
	}

	/**
	 * @return the bandwidthTX
	 */
	public Integer getBandwidthTX() {
		return bandwidthTX;
	}

	/**
	 * @param bandwidthTX the bandwidthTX to set
	 */
	public void setBandwidthTX(Integer bandwidthTX) {
		this.bandwidthTX = bandwidthTX;
	}

	/**
	 * @return the bandwidthRX
	 */
	public Integer getBandwidthRX() {
		return bandwidthRX;
	}

	/**
	 * @param bandwidthRX the bandwidthRX to set
	 */
	public void setBandwidthRX(Integer bandwidthRX) {
		this.bandwidthRX = bandwidthRX;
	}
	
	
	
	
}
