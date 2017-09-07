/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author xupeijiao
 */
public class Routes {
    private String summary;
    private List<Leg> legs;
    private EncodedPolyline overviewPolyline;
    private Bounds bounds;
    private String copyrights;

    /**
     * @return the summary
     */
    public String getSummary() {
        return summary;
    }

    /**
     * @param summary the summary to set
     */
    public void setSummary(String summary) {
        this.summary = summary;
    }



    /**
     * @return the overviewPolyline
     */
    public EncodedPolyline getOverviewPolyline() {
        return overviewPolyline;
    }

    /**
     * @param overviewPolyline the overviewPolyline to set
     */
    public void setOverviewPolyline(EncodedPolyline overviewPolyline) {
        this.overviewPolyline = overviewPolyline;
    }

    /**
     * @return the bounds
     */
    public Bounds getBounds() {
        return bounds;
    }

    /**
     * @param bounds the bounds to set
     */
    public void setBounds(Bounds bounds) {
        this.bounds = bounds;
    }

    /**
     * @return the copyrights
     */
    public String getCopyrights() {
        return copyrights;
    }

    /**
     * @param copyrights the copyrights to set
     */
    public void setCopyrights(String copyrights) {
        this.copyrights = copyrights;
    }

    /**
     * @return the legs
     */
    public List<Leg> getLegs() {
        return legs;
    }

    /**
     * @param legs the legs to set
     */
    public void setLegs(List<Leg> legs) {
        this.legs = legs;
    }
    
}
