package cn.com.inhand.common.model;

import java.io.Serializable;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class BaseStation implements Serializable {
	private static final long serialVersionUID = 4906143673662141155L;

	@Id
	@JsonProperty("_id")
	private ObjectId id;
	/** Country Code **/
	private Integer mcc;
	private Integer mnc;
	/** Local Area Code **/
	private Integer lac;
	/** Cell ID **/
	private Integer cell;
	private Double longitude;
	private Double latitude;
	private Double oLongitude;
	private Double oLatitude;
	private Integer precision;
	private String address;

	public BaseStation() {

	}

	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public Integer getMcc() {
		return mcc;
	}

	public void setMcc(Integer mcc) {
		this.mcc = mcc;
	}

	public Integer getMnc() {
		return mnc;
	}

	public void setMnc(Integer mnc) {
		this.mnc = mnc;
	}

	public Integer getLac() {
		return lac;
	}

	public void setLac(Integer lac) {
		this.lac = lac;
	}

	public Integer getCell() {
		return cell;
	}

	public void setCell(Integer cell) {
		this.cell = cell;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getoLongitude() {
		return oLongitude;
	}

	public void setoLongitude(Double oLongitude) {
		this.oLongitude = oLongitude;
	}

	public Double getoLatitude() {
		return oLatitude;
	}

	public void setoLatitude(Double oLatitude) {
		this.oLatitude = oLatitude;
	}

	public Integer getPrecision() {
		return precision;
	}

	public void setPrecision(Integer precision) {
		this.precision = precision;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

}
