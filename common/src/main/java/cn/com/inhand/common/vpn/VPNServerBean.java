package cn.com.inhand.common.vpn;

public class VPNServerBean {
	private String serverName;
    private String ip;
    private Integer port;

    public VPNServerBean(String ip, Integer port) {
		super();
		this.ip = ip;
		this.port = port;
	}

	public VPNServerBean(String serverName, String ip, Integer port) {
		super();
		this.serverName = serverName;
		this.ip = ip;
		this.port = port;
	}

	public String getServerName() {
		return serverName;
	}

	public void setServerName(String serverName) {
		this.serverName = serverName;
	}

	/**
     * @return the ip
     */
    public String getIp() {
        return ip;
    }

    /**
     * @param ip the ip to set
     */
    public void setIp(String ip) {
        this.ip = ip;
    }

    /**
     * @return the port
     */
    public Integer getPort() {
        return port;
    }

    /**
     * @param port the port to set
     */
    public void setPort(Integer port) {
        this.port = port;
    }

}
