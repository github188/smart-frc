package cn.com.inhand.common.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

public class Channel {

    /**
     * ChannelId
     */
    @Id
    @JsonProperty("_id")
    private ObjectId id;

    /**
     * Channel's owner
     */
    private ObjectId userId;

    /**
     * follow the clientType
     */
    private ObjectId clientId;

    /**
     * 1,PC client
     * 2,site
     */
    private Integer clientType;

    /**
     * channel's state
     * means whether is available
     */
    private Boolean active;

    /**
     * channel's state
     */
    private Boolean connected;

    /**
     * client's vitual IP , used in the channel
     */
    private String vip;

    /**
     * client's real IP
     */
    private String rip;

    /**
     * @return the rip
     */
    public String getRip() {
        return rip;
    }

    /**
     * @param rip the rip to set
     */
    public void setRip(String rip) {
        this.rip = rip;
    }

    /**
     * vpn server
     */
    private Object server;

    private Long createTime;
    private Long startTime;
    private Long endTime;


    /**
     * @return the id
     */
    public ObjectId getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(ObjectId id) {
        this.id = id;
    }

    /**
     * @return the userId
     */
    public ObjectId getUserId() {
        return userId;
    }

    /**
     * @param userId the userId to set
     */
    public void setUserId(ObjectId userId) {
        this.userId = userId;
    }

    /**
     * @return the clientId
     */
    public ObjectId getClientId() {
        return clientId;
    }

    /**
     * @param clientId the clientId to set
     */
    public void setClientId(ObjectId clientId) {
        this.clientId = clientId;
    }

    /**
     * @return the clientType
     */
    public Integer getClientType() {
        return clientType;
    }

    /**
     * @param clientType the clientType to set
     */
    public void setClientType(Integer clientType) {
        this.clientType = clientType;
    }

    /**
     * @return the active
     */
    public Boolean getActive() {
        return active;
    }

    /**
     * @param active the active to set
     */
    public void setActive(Boolean active) {
        this.active = active;
    }

    /**
     * @return the connected
     */
    public Boolean getConnected() {
        return connected;
    }

    /**
     * @param connected the connected to set
     */
    public void setConnected(Boolean connected) {
        this.connected = connected;
    }

    /**
     * @return the vip
     */
    public String getVip() {
        return vip;
    }

    /**
     * @param vip the vip to set
     */
    public void setVip(String vip) {
        this.vip = vip;
    }

    /**
     * @return the createTime
     */
    public Long getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime the createTime to set
     */
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    /**
     * @return the startTime
     */
    public Long getStartTime() {
        return startTime;
    }

    /**
     * @param startTime the startTime to set
     */
    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    /**
     * @return the endTime
     */
    public Long getEndTime() {
        return endTime;
    }

    /**
     * @param endTime the endTime to set
     */
    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }


    /**
     * @return the server
     */
    public Object getServer() {
        return server;
    }

    /**
     * @param server the server to set
     */
    public void setServer(Object server) {
        this.server = server;
    }
}
