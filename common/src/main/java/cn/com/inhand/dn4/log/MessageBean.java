package cn.com.inhand.dn4.log;

public class MessageBean {
    /**
     * 用户id
     */
    private String uid = "";

    /**
     * 英文日志
     */
    private String content = "";

    /**
     * 本地日志
     */
    private String description = "";

    /**
     * 日志代码
     */
    private Integer code = 0;

    /**
     * 日志内容的参数
     */
    private String[] params = {};

    /**
     * 日志等级
     */
    private Integer level = 0;

    /**
     * 用户名称
     */
    private String username = "";

    /**
     * ip
     */
    private String ip = "";

    /**
     * 日志时间戳
     */
    private long timestamp;

    public MessageBean() {

    }

    public MessageBean(String uid, Integer code, Integer level, String username, String content, String description, String[] params, String ip, long timestamp) {
        this.uid = uid;
        this.code = code;
        this.level = level;
        this.username = username;
        this.content = content;
        this.description = description;
        this.params = params;
        this.ip = ip;
        this.timestamp = timestamp;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getCode() {
        return code;
    }

    public void setCode(Integer code) {
        this.code = code;
    }

    public String[] getParams() {
        return params;
    }

    public void setParams(String[] params) {
        this.params = params;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}
