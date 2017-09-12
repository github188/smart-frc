/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.CardsDao;
import cn.com.inhand.centra.device.dao.MemberDao;
import cn.com.inhand.centra.device.dao.SiteDAO;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.smart.formulacar.model.Cards;
import cn.com.inhand.smart.formulacar.model.Device;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.Site;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    private CardsDao cardDao;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private SiteDAO siteDao;

    @RequestMapping(value = "/rfid/oauth", method = RequestMethod.GET)
    public synchronized @ResponseBody
    Object syncAssetStatus(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestParam(value = "rfid", required = true) String rfid,
            @RequestParam(value = "assetId", required = true) String assetId) {
        logger.info("Device Rfid oauth rfid is {} assetId is {}", rfid,assetId);

        DeviceKey key = oauthHandler.verifyDeviceKey(access_token);//deviceKeyDAO.getDeviceKeyByKey(access_token);
        if (key == null) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
        }

        Device device = siteDao.getDeviceByAssetId(key.getOid(), assetId);
        if(device != null && device.getSiteId() != null && !device.getSiteId().toString().equals("")){
            Site site = siteDao.getSiteById(key.getOid(), device.getSiteId());
            if(site != null){
            }
        }
        
        Cards card = cardDao.findCardByRfid(key.getOid(), rfid);
        Map<String, String> content = new HashMap<String, String>();
        if (card != null) {
            Member member = memberDao.findMemberByMemberId(card.getOid(), card.getMemberId());
            if (member.getMoney() > 0) {   //存在并发的问题
                content.put("result", "OK");
                content.put("rfid", rfid);
            }
        } else {
            content.put("result", "FAIL");
            content.put("rfid", rfid);
        }
        return content;
    }
}
