package cn.com.inhand.common.model.wifi;

import java.util.Date;

/**
 * Created by Jerolin on 6/23/2014.
 */
public class PVUVStatistic {
	private long pv;
	private long uv;
	private Date date;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public long getPv() {
		return pv;
	}

	public void setPv(long pv) {
		this.pv = pv;
	}

	public long getUv() {
		return uv;
	}

	public void setUv(long uv) {
		this.uv = uv;
	}
}
