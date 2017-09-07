/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author xupeijiao
 */
public class Bounds {
    private LatLng northeast;
    private LatLng southwest;



    /**
     * @return the southwest
     */
    public LatLng getSouthwest() {
        return southwest;
    }

    /**
     * @param southwest the southwest to set
     */
    public void setSouthwest(LatLng southwest) {
        this.southwest = southwest;
    }

    /**
     * @return the northeast
     */
    public LatLng getNortheast() {
        return northeast;
    }

    /**
     * @param northeast the northeast to set
     */
    public void setNortheast(LatLng northeast) {
        this.northeast = northeast;
    }

}
