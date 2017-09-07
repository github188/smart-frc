/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import cn.com.inhand.dn4.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang.RandomStringUtils;
import org.bson.types.ObjectId;

/**
 *
 * @author xupeijiao
 */
public class LoginCode {
        @JsonProperty("_id")
    private ObjectId id;
    // random 7 charectors.
    private String code;
    
     private long createTime;

    @JsonIgnore
    private static final String CANDIDATE_CHARS = "3456789ABCDEFGHJKMNPQRSTUVWXY";
    public static LoginCode next() {
        LoginCode captcha = new LoginCode();
        captcha.setCode(RandomStringUtils.random(5, CANDIDATE_CHARS));
        captcha.setCreateTime(DateUtils.getUTC());
        return captcha;
    }
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
     * @return the code
     */
    public String getCode() {
        return code;
    }

    /**
     * @param code the code to set
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * @return the createTime
     */
    public long getCreateTime() {
        return createTime;
    }

    /**
     * @param createTime the createTime to set
     */
    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }
    
}
