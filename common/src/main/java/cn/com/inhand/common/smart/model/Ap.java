/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author lenovo
 */
public class Ap {
    @Id
    @JsonProperty("_id")
    private ObjectId id;
    private String url;
    private String key;
    private String port;
    private Integer conns;
    private Integer alive;  //0在线  1离线
    private Long lastAliveTime;

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }

    public Integer getConns() {
        return conns;
    }

    public void setConns(Integer conns) {
        this.conns = conns;
    }

    public Integer getAlive() {
        return alive;
    }

    public void setAlive(Integer alive) {
        this.alive = alive;
    }

    public Long getLastAliveTime() {
        return lastAliveTime;
    }

    public void setLastAliveTime(Long lastAliveTime) {
        this.lastAliveTime = lastAliveTime;
    }
    
}
