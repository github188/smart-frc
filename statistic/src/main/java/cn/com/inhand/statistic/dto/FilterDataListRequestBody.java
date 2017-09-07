package cn.com.inhand.statistic.dto;

import java.util.List;

import javax.validation.constraints.Size;
import org.hibernate.validator.constraints.NotEmpty;

public class FilterDataListRequestBody {

	@NotEmpty
	@Size(min=1, max=30)
	private List<String> varIds;

	@NotEmpty
	@Size(min=1, max=100)
	private List<Long> timestamps;
	
	private long range;

	public List<String> getVarIds() {
		return varIds;
	}

	public void setVarIds(List<String> varIds) {
		this.varIds = varIds;
	}

	public List<Long> getTimestamps() {
		return timestamps;
	}

	public void setTimestamps(List<Long> timestamps) {
		this.timestamps = timestamps;
	}

	public long getRange() {
		return range;
	}

	public void setRange(long range) {
		this.range = range;
	}
	
}
