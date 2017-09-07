package cn.com.inhand.common.model.wifi;

import cn.com.inhand.common.service.Collections;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

/**
 *
 * Created by Jerolin on 6/23/2014.
 */
@Document
@CompoundIndex(collection = Collections.WIFI_PVUV_CLICK, def = "{'rId': 1, 'tId': 1, 'mac': 1}", unique = true)
public class PVUVClick {
	private String rId;
	private String tId;
	private Date date;

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String gettId() {
		return tId;
	}

	public void settId(String tId) {
		this.tId = tId;
	}

	private String mac;

	public String getrId() {
		return rId;
	}

	public void setrId(String rId) {
		this.rId = rId;
	}

	public String getMac() {
		return mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}
}

