package cn.com.inhand.common.log;

import cn.com.inhand.dn4.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;

public class BusinessLogBean {
    @JsonProperty("uid")
    private ObjectId userId;
    private String content;
    private int code;
    private String[] params;
    private int level;
    private String username;
    private String ip;
    private long timestamp;

    public BusinessLogBean(LogCode code, ObjectId userId, String[] params, String username, String ip) {
        this.code = code.getCode();
        this.content = code.getContent();
        this.userId = userId;
        this.params = params;
        this.username = username;
        this.ip = ip;
        this.timestamp = DateUtils.getUTC();
    }

    public BusinessLogBean(LogCode code, ObjectId userId, String[] params, String username, String ip,
                           long timestamp) {
        this.code = code.getCode();
        this.content = code.getContent();
        this.userId = userId;
        this.params = params;
        this.username = username;
        this.ip = ip;
        this.timestamp = timestamp;
    }

    public ObjectId getUserId() {
        return userId;
    }

    public void setUserId(ObjectId userId) {
        this.userId = userId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

}
