package cn.com.inhand.captcha.schedule;

import cn.com.inhand.captcha.dao.CaptchaDAO;
import cn.com.inhand.dn4.utils.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * User: Jerolin
 * Date: 13-10-12
 */
@Component
public class CaptchaCleaner {

    @Autowired
    private CaptchaDAO captchaDAO;

    private final long interval = 60;

    @Scheduled(fixedRate = 5000, initialDelay = 30000)
    public void cleanCaptcha() {
        long now = DateUtils.getUTC();
        captchaDAO.removeCaptchasByStartTime(now - interval);
    }

}
