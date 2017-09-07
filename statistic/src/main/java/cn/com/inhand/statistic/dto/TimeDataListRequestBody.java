package cn.com.inhand.statistic.dto;

import java.util.ArrayList;
import java.util.List;

import javax.validation.constraints.NotNull;

public class TimeDataListRequestBody {

	@NotNull
	private List<TimeDataParametsBean> devices = new ArrayList<TimeDataParametsBean>();

	public List<TimeDataParametsBean> getDevices() {
		return devices;
	}

	public void setDevices(List<TimeDataParametsBean> devices) {
		this.devices = devices;
	}

}
