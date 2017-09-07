package cn.com.inhand.captcha.dto;

import javax.validation.constraints.NotNull;

/**
 * Created with IntelliJ IDEA.
 * User: Jerolin
 * Date: 13-10-11
 * To change this template use File | Settings | File Templates.
 */
public class ValidateCaptchaRequestBody {
    @NotNull
    private String pictureId;
    @NotNull
    private String code;

    public String getPictureId() {
        return pictureId;
    }

    public void setPictureId(String pictureId) {
        this.pictureId = pictureId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}
