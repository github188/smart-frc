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
public class Policy {
    private String adIndex;   //广告位下标 0 1_0 2_0
    private String type;//0是默认策略，1是特定策略
    private String startTime;//播放开始时间
    private String endTime;//播放结束时间
    private List<Media> mediaList;

    /**
     * @return the adIndex
     */
    public String getAdIndex() {
        return adIndex;
    }

    /**
     * @param adIndex the adIndex to set
     */
    public void setAdIndex(String adIndex) {
        this.adIndex = adIndex;
    }

    /**
     * @return the type
     */
    public String getType() {
        return type;
    }

    /**
     * @param type the type to set
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * @return the startTime
     */
    public String getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public String getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    /**
     * @return the mediaList
     */
    public List<Media> getMediaList() {
        return mediaList;
    }

    /**
     * @param mediaList the mediaList to set
     */
    public void setMediaList(List<Media> mediaList) {
        this.mediaList = mediaList;
    }
    
    
}
