/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dto;

import org.bson.types.ObjectId;

/**
 *
 * @author cttc
 */
public class DeviceOnlineRecord {

    private ObjectId id;
    private ObjectId deviceId;
    private Long login;
    private Long logout;
    private int loginType;
    private int exception;
    private Long onlineInterval;
    private Long offlineInterval;
    private int current;
    private String ip;
    private String port;
    private String sid;

    public int getLoginType() {
        return loginType;
    }

    public void setLoginType(int loginType) {
        this.loginType = loginType;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getPort() {
        return port;
    }

    public void setPort(String port) {
        this.port = port;
    }
    
    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(ObjectId deviceId) {
        this.deviceId = deviceId;
    }

    public Long getLogin() {
        return login;
    }

    public void setLogin(Long login) {
        this.login = login;
    }

    public Long getLogout() {
        return logout;
    }

    public void setLogout(Long logout) {
        this.logout = logout;
    }

    public int getException() {
        return exception;
    }

    public void setException(int exception) {
        this.exception = exception;
    }

    public Long getOnlineInterval() {
        return onlineInterval;
    }

    public void setOnlineInterval(Long onlineInterval) {
        this.onlineInterval = onlineInterval;
    }

    public Long getOfflineInterval() {
        return offlineInterval;
    }

    public void setOfflineInterval(Long offlineInterval) {
        this.offlineInterval = offlineInterval;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }
    
}
