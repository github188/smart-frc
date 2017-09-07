package cn.com.inhand.common.model;


/**
 * 位置信息
 */
public class Location {
    /**
     * 所属地区
     */
    private String region;

    /**
     * GPS经度
     */
    private Float longitude;

    /**
     * GPS纬度
     */
    private Float latitude;

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public Float getLongitude() {
        return longitude;
    }

    public void setLongitude(Float longitude) {
        this.longitude = longitude;
    }

    public Float getLatitude() {
        return latitude;
    }

    public void setLatitude(Float latitude) {
        this.latitude = latitude;
    }
}
