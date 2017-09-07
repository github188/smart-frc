package cn.com.inhand.captcha.model;

import cn.com.inhand.dn4.utils.DateUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.apache.commons.lang.RandomStringUtils;
import org.bson.types.ObjectId;

/**
 * User: Jerolin
 * Date: 13-10-11
 */
public class Captcha {
    @JsonProperty("_id")
    private ObjectId id;
    // random 7 charectors.
    private String code;
    // Picture Id random 5 charectors.
    private String pictureId;

    public long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(long createTime) {
        this.createTime = createTime;
    }

    private long createTime;

    @JsonIgnore
    private static final String CANDIDATE_CHARS = "3456789ABCDEFGHJKMNPQRSTUVWXY";

    public static Captcha next() {
        Captcha captcha = new Captcha();
        captcha.setCode(RandomStringUtils.random(5, CANDIDATE_CHARS));
        captcha.setPictureId(ObjectId.get().toString());
        captcha.setCreateTime(DateUtils.getUTC());
        return captcha;
    }

    @Override
    public String toString() {
        return "Captcha{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", pictureId='" + pictureId + '\'' +
                '}';
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getPictureId() {
        return pictureId;
    }

    public void setPictureId(String pictureId) {
        this.pictureId = pictureId;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }
}
