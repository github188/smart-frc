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
 * @author liqiang
 */
public class AppMonitor {
    
    @Id
    @JsonProperty("_id")
    private ObjectId id;	         //唯一标识
    
    private String openId;              //微信号标识
    
    private String nickname;
    private String headimgurl;
    //private Integer openNotice=1;//   开启通知 1.默认开启  0.关闭
    private Integer pushMonitor;  //1 推送  0 不推送

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getHeadimgurl() {
        return headimgurl;
    }

    public void setHeadimgurl(String headimgurl) {
        this.headimgurl = headimgurl;
    }

    public Integer getPushMonitor() {
        return pushMonitor;
    }

    public void setPushMonitor(Integer pushMonitor) {
        this.pushMonitor = pushMonitor;
    }
    
    
}
