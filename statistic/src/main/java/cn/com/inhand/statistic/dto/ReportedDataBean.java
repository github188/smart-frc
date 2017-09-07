package cn.com.inhand.statistic.dto;

import java.util.List;

import javax.validation.constraints.NotNull;

public class ReportedDataBean {

	@NotNull
	private List<RealTimeVariable> vars;

	public List<RealTimeVariable> getVars() {
		return vars;
	}

	public void setVars(List<RealTimeVariable> vars) {
		this.vars = vars;
	}

}
