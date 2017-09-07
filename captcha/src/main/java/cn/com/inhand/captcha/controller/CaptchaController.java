package cn.com.inhand.captcha.controller;

import cn.com.inhand.captcha.dao.CaptchaDAO;
import cn.com.inhand.captcha.dto.ValidateCaptchaRequestBody;
import cn.com.inhand.captcha.model.Captcha;
import cn.com.inhand.common.dto.Error;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.dn4.utils.CaptchaPicture;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("api/captchas")
public class CaptchaController extends HandleExceptionController {
    private static final Logger logger = LoggerFactory.getLogger(CaptchaController.class);
    private static final int fontSize = 18;
    private static final int width = 90;
    private static final int height = 30;

    @Autowired
    CaptchaDAO captchaDAO;

    @RequestMapping(value = "", method = RequestMethod.GET)
    public
    @ResponseBody
    Object get() {
        Captcha captcha = Captcha.next();
        captchaDAO.insertCaptcha(captcha);
        Map<String, Object> result = new HashMap<String, Object>();
        result.put("_id", captcha.getId());
        result.put("pictureId", captcha.getPictureId());
        return result;
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public void getCaptcha(HttpServletRequest request, @PathVariable ObjectId id, HttpServletResponse response) {
        response.setContentType("image/jpeg;charset=UTF-8");
        OutputStream os = null;
        try {
            os = response.getOutputStream();
            Captcha captcha = captchaDAO.getCaptchaById(id);
            if (captcha == null) {
                throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, id);
            }
            CaptchaPicture c = new CaptchaPicture();
            c.getCaptcha(os, captcha.getCode(), fontSize, width, height);
            os.flush();
            os.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (os != null) {
                try {
                    os.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }

    @RequestMapping(value = "", method = RequestMethod.POST)
    public
    @ResponseBody
    Object validate(@RequestBody @Valid ValidateCaptchaRequestBody requestBody, HttpServletResponse response) {
        Captcha captcha = captchaDAO.getCaptchaByPictureId(requestBody.getPictureId());
        if (captcha == null) {
            return new Error("api/captchas", ErrorCode.CAPTCHA_CODE_ERROR);
        }
        captchaDAO.removeCaptchaById(captcha.getId());
        if (captcha.getCode().equalsIgnoreCase(requestBody.getCode())) {
            return new OnlyResultDTO("ok");
        } else {
            return new Error("api/captchas", ErrorCode.CAPTCHA_CODE_ERROR);
        }
    }
}
