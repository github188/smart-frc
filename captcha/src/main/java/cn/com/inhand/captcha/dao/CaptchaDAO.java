package cn.com.inhand.captcha.dao;

import cn.com.inhand.captcha.model.Captcha;
import org.bson.types.ObjectId;

/**
 * User: Jerolin
 * Date: 13-10-11
 * Time: 下午12:31
 */
public interface CaptchaDAO {
    public void insertCaptcha(Captcha captcha);

    public Captcha getCaptchaById(ObjectId id);

    public Captcha getCaptchaByPictureId(String pictureId);

    public void removeCaptchaById(ObjectId id);

    public void removeCaptchasByStartTime(long startTime);
}
