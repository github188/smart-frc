/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.CardsDao;
import cn.com.inhand.centra.device.dao.MemberDao;
import cn.com.inhand.centra.device.dao.RfidDao;
import cn.com.inhand.centra.device.dao.SiteDAO;
import cn.com.inhand.centra.device.dao.TradeRecordDao;
import cn.com.inhand.centra.device.dto.DeviceGameRecord;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Cards;
import cn.com.inhand.smart.formulacar.model.Device;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.Rfid;
import cn.com.inhand.smart.formulacar.model.Site;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
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
 * @author lenovo
 */
@Controller
@RequestMapping("fmapi/device")
public class DeviceTraddRecodeController {

    private static final Logger logger = LoggerFactory.getLogger(DeviceTraddRecodeController.class);
    @Autowired
    private OauthConfigHandler oauthHandler;
    @Autowired
    private ObjectMapper mapper;
    @Autowired
    private TradeRecordDao tradeRecordDao;
    @Autowired
    private MemberDao memberDao;
    @Autowired
    private CardsDao cardsDao;
    @Autowired
    private SiteDAO siteDao;
    @Autowired
    private RfidDao rfidDao;

    @RequestMapping(value = "/game/record", method = RequestMethod.POST)
    public @ResponseBody
    Object syncAssetStatus(@RequestParam(value = "access_token", required = true) String access_token,
            @Valid @RequestBody List<DeviceGameRecord> recordList) throws JsonProcessingException {

        DeviceKey key = oauthHandler.verifyDeviceKey(access_token);//deviceKeyDAO.getDeviceKeyByKey(access_token);
        if (key == null) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
        }
        String recordStr = mapper.writeValueAsString(recordList);
        logger.info(recordStr);
        Map<String, String> rfidMap = new HashMap<String, String>();
        String assetId = "";
        if (recordList.size() > 0) {
            for (DeviceGameRecord record : recordList) {
                assetId = record.getAssetId();
                Cards cards = cardsDao.findCardByRfid(key.getOid(), record.getCardId());
                rfidMap.put(record.getCardId(), cards.getMemberNickName());
            }
        }

        Device device = siteDao.getDeviceByAssetId(key.getOid(), assetId);
        Site site = siteDao.getSiteById(key.getOid(), device.getSiteId());
        for (DeviceGameRecord record : recordList) {
            TradeRecord tr = new TradeRecord();
            tr.setAssetId(record.getAssetId());
            tr.setDealerId(device.getDealerId());
            tr.setDealerName(device.getDealerName());
            tr.setModuleId(device.getModuleId());
            tr.setModuleNum(device.getModuleName());
            tr.setPrice(site.getPrice());
            tr.setSiteId(site.getId());
            tr.setSiteName(site.getName());
            tr.setCardId(record.getCardId());
            tr.setCreateTime(DateUtils.getUTC());
            tr.setOid(key.getOid());
            tr.setRanking(record.getRanking());
            tr.setRecordFlag(record.getRecordFlag());
            tr.setTid(record.getTid());
            tr.setTime(record.getTime());
            tr.setWeight(record.getWeight());
            tr.setUserName(rfidMap.get(tr.getCardId()));
            tr.setUserName1("");
            tr.setUserName2("");
            tradeRecordDao.createTradeRecord(key.getOid(), tr);

            Rfid rfid = rfidDao.findRfidByRfid(key.getOid(), tr.getCardId());
            if (rfid != null && rfid.getCount() != null && rfid.getCount() >= site.getPrice()) {
                rfid.setCount(rfid.getCount() - site.getPrice());
                rfidDao.updateRfidCount(key.getOid(), rfid);
            }
            if (rfid != null && rfid.getOpenid() != null) {
                Member member = memberDao.findMemberByOpenId(key.getOid(), rfid.getOpenid());
                if (member != null && member.getMoney() != null && member.getMoney() >= site.getPrice()) {
                    member.setMoney(member.getMoney() - site.getPrice());
                    memberDao.updateMember(key.getOid(), member);
                }
            }
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
}
