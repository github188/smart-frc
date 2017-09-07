package cn.com.inhand.statistic.dto;

import cn.com.inhand.common.jackson.LinuxTimeDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;

import java.util.Date;

/**
 *
 * Created by Jerolin on 7/1/2014.
 */
public class WifiLog {
	private String mac;
	@JsonDeserialize(using = LinuxTimeDeserializer.class)
	private Date timestamp;
	private String sIp;
	private int sPort;
	private String dIp;
	private int dPort;
	private String proto;
	private String natSourceIp;
	private int natSourcePort;

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	public String getProto() {
		return proto;
	}

	public void setProto(String proto) {
		this.proto = proto;
	}

	public String getNatSourceIp() {
		return natSourceIp;
	}

	public void setNatSourceIp(String natSourceIp) {
		this.natSourceIp = natSourceIp;
	}

	public int getNatSourcePort() {
		return natSourcePort;
	}

	public void setNatSourcePort(int natSourcePort) {
		this.natSourcePort = natSourcePort;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getsIp() {
		return sIp;
	}

	public void setsIp(String sIp) {
		this.sIp = sIp;
	}

	public int getsPort() {
		return sPort;
	}

	public void setsPort(int sPort) {
		this.sPort = sPort;
	}

	public String getdIp() {
		return dIp;
	}

	public void setdIp(String dIp) {
		this.dIp = dIp;
	}

	public int getdPort() {
		return dPort;
	}

	public void setdPort(int dPort) {
		this.dPort = dPort;
	}
}
