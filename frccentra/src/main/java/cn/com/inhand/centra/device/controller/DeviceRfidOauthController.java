/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.MemberDao;
import cn.com.inhand.centra.device.dao.RfidDao;
import cn.com.inhand.centra.device.dao.SiteDAO;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.service.RedisFactory;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Device;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.Rfid;
import cn.com.inhand.smart.formulacar.model.Site;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("fmapi/device")
public class DeviceRfidOauthController {

    private static final Logger logger = LoggerFactory.getLogger(DeviceRfidOauthController.class);
    @Autowired
    private OauthConfigHandler oauthHandler;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private SiteDAO siteDao;
    @Autowired
    private RfidDao rfidDao;
    @Autowired
    private RedisFactory redisFactory;
    @Value("#{config.project.webUrl}")
    private String host;
    @RequestMapping(value = "/rfid/oauth", method = RequestMethod.GET)
    public synchronized @ResponseBody
    Object syncAssetStatus(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestParam(value = "rfid", required = true) String rfid,
            @RequestParam(value = "assetId", required = true) String assetId) throws ParseException {
        logger.info("Device Rfid oauth rfid is {} assetId is {}", rfid, assetId);

        DeviceKey key = oauthHandler.verifyDeviceKey(access_token);//deviceKeyDAO.getDeviceKeyByKey(access_token);
        if (key == null) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
        }
        Map<String, String> content = new HashMap<String, String>();

        String rfidStr = redisFactory.get(rfid + ":RFIDINFO");
        
        if (rfidStr == null) {
            Device device = siteDao.getDeviceByAssetId(key.getOid(), assetId);
            if (device != null) {
                Rfid rfiddb = rfidDao.findRfidByRfid(key.getOid(), rfid);
                if (rfiddb != null) {
                    if (rfiddb.getOpenid() != null) {  //如果这个rfid绑定了微信账号，校验账号时在微信账号中校验
                        Member member = memberDao.findMemberByOpenId(key.getOid(), rfiddb.getOpenid());
                        if (member.getMoney() > 0) {     //当总金额大于等于店面里面设备的价格是可以进行游戏  = site.getPrice()
                            content.put("result", "OK");
                            content.put("rfid", rfid);
                            content.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
                            content.put("name", rfiddb.getName() != null ? rfiddb.getName() : "");

                            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                            String dateStr = format.format(System.currentTimeMillis()) + " 23:59:59";
                            SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            Long time1 = format1.parse(dateStr).getTime() / 1000;
                            int timeout = Integer.parseInt((time1 - DateUtils.getUTC()) + "");
                            redisFactory.setex(rfid + ":RFIDINFO", timeout, rfid);
                        } else {
                            content.put("result", "FAIL");
                            content.put("msg", "次数已用完");
                            content.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
                            content.put("name", rfiddb.getName() != null ? rfiddb.getName() : "");
                            content.put("rfid", rfid);
                        }
                    } else if (rfiddb.getOpenid() == null) {   //这个rfid没有绑定微信账号  = site.getPrice()
                        if (rfiddb.getCount() > 0) {
                            content.put("result", "OK");
                            content.put("rfid", rfid);
                            content.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
                            content.put("name", rfiddb.getName() != null ? rfiddb.getName() : "");

                            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                            String dateStr = format.format(System.currentTimeMillis()) + " 23:59:59";
                            SimpleDateFormat format1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                            Long time1 = format1.parse(dateStr).getTime() / 1000;
                            int timeout = Integer.parseInt((time1 - DateUtils.getUTC()) + "");
                            redisFactory.setex(rfid + ":RFIDINFO", timeout, rfid);
                        } else {
                            content.put("result", "FAIL");
                            content.put("msg", "次数已用完");
                            content.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
                            content.put("name", rfiddb.getName() != null ? rfiddb.getName() : "");
                            content.put("rfid", rfid);
                        }
                    }
                } else {
                    //rfid不存在
                    content.put("result", "FAIL");
                    content.put("msg", "芯片不存在");
                    content.put("rfid", rfid);
                }
            }
        } else {
            content.put("result", "OK");
            content.put("rfid", rfid);
            Rfid rfiddb = rfidDao.findRfidByRfid(key.getOid(), rfid);
            content.put("nickName", rfiddb.getNickName() != null ? rfiddb.getNickName() : "");
            content.put("name", rfiddb.getName() != null ? rfiddb.getName() : "");
        }
        return content;
    }
    
    @RequestMapping(value = "/rfid/code", method = RequestMethod.GET)
    public synchronized @ResponseBody
    Object getRfidCode(@RequestParam(value = "access_token", required = false) String access_token,
            @RequestParam(value = "rfid", required = true) String rfid) {
        
        String code = "http://"+host+"/wbapi/oper/bind/"+rfid;
        return code;
    }
}
