package cn.com.inhand.captcha.model;

import org.junit.Test;

/**
 * Created with IntelliJ IDEA.
 * User: Jerolin
 * Date: 13-10-11
 * Time: 下午12:54
 * To change this template use File | Settings | File Templates.
 */
public class CaptchaTest {
    @Test
    public void testNext() throws Exception {
        System.out.println(Captcha.next());
    }
}
