package cn.com.inhand.statistic.dto;

import java.util.Date;

/**
 * Created by Jerolin on 6/12/2014.
 */
public class CountStatistic {
	private Date date;
	private long count;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}
}
