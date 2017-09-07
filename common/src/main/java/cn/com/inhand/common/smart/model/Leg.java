/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author xupeijiao
 */
public class Leg {

    private Distance distance;
    private Duration duration;
    private LatLng startLocation;
    private LatLng endLocation;
    private String startAddress;
    private String endAddress;

    /**
     * @return the distance
     */
    public Distance getDistance() {
        return distance;
    }

    /**
     * @param distance the distance to set
     */
    public void setDistance(Distance distance) {
        this.distance = distance;
    }

    /**
     * @return the duration
     */
    public Duration getDuration() {
        return duration;
    }

    /**
     * @param duration the duration to set
     */
    public void setDuration(Duration duration) {
        this.duration = duration;
    }

    /**
     * @return the startLocation
     */
    public LatLng getStartLocation() {
        return startLocation;
    }

    /**
     * @param startLocation the startLocation to set
     */
    public void setStartLocation(LatLng startLocation) {
        this.startLocation = startLocation;
    }

    /**
     * @return the endLocation
     */
    public LatLng getEndLocation() {
        return endLocation;
    }

    /**
     * @param endLocation the endLocation to set
     */
    public void setEndLocation(LatLng endLocation) {
        this.endLocation = endLocation;
    }

    /**
     * @return the startAddress
     */
    public String getStartAddress() {
        return startAddress;
    }

    /**
     * @param startAddress the startAddress to set
     */
    public void setStartAddress(String startAddress) {
        this.startAddress = startAddress;
    }

    /**
     * @return the endAddress
     */
    public String getEndAddress() {
        return endAddress;
    }

    /**
     * @param endAddress the endAddress to set
     */
    public void setEndAddress(String endAddress) {
        this.endAddress = endAddress;
    }
    
}
