/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.FileDAO;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import java.io.ByteArrayInputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author xupeijiao
 */
@Controller
@RequestMapping("fmapi")
public class FileController {

    private final static Logger logger = LoggerFactory.getLogger(FileController.class);
    @Autowired
    private OauthConfigHandler oauthHandler;
    @Autowired
    private FileDAO fileDAO;

    @RequestMapping(value = "/file", method = RequestMethod.POST)
    public @ResponseBody
    Object uploadfile(@RequestParam("access_token") String access_token,
            @RequestParam("filename") String filename,
            @RequestParam("recordFlag") String recordFlag,
            @RequestBody byte[] bytes) throws UnsupportedEncodingException {
        DeviceKey key = oauthHandler.verifyDeviceKey(access_token);//deviceKeyDAO.getDeviceKeyByKey(access_token);
        if (key == null) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
        }
        Map<String, Object> map = fileDAO.addFile(key.getOid(), filename, new ByteArrayInputStream(bytes));
        
        logger.info(map.toString());
        
        Map<String,String> resultMap = new HashMap<String,String>();
        resultMap.put("id", map.get("_id").toString());
        resultMap.put("md5", map.get("md5").toString());
        resultMap.put("fileName", filename);
        resultMap.put("result", "OK");
        
        return resultMap;
    }
}
