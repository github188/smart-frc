package cn.com.inhand.captcha.controller;

import cn.com.inhand.common.bean.ServerInfoBean;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.DateFormat;
import java.util.Date;
import java.util.Locale;


@Controller
public class HomeController {
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public
    @ResponseBody
    Object home(Locale locale) {
        Date date = new Date();
        DateFormat dateFormat = DateFormat.getDateTimeInstance(DateFormat.LONG, DateFormat.LONG, locale);

        String formattedDate = dateFormat.format(date);
        return new ServerInfoBean("Captcha", formattedDate);
    }

}
