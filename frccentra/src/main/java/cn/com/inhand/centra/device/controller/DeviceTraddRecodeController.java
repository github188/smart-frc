/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.CardsDao;
import cn.com.inhand.centra.device.dao.MemberDao;
import cn.com.inhand.centra.device.dao.TradeRecordDao;
import cn.com.inhand.centra.device.dto.DeviceGameRecord;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Cards;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
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
    
    @RequestMapping(value = "/game/record", method = RequestMethod.POST)
    public synchronized @ResponseBody
    Object syncAssetStatus(@RequestParam(value = "access_token", required = true) String access_token,
            @Valid @RequestBody List<DeviceGameRecord> recordList) throws JsonProcessingException {
        
        DeviceKey key = oauthHandler.verifyDeviceKey(access_token);//deviceKeyDAO.getDeviceKeyByKey(access_token);
        if (key == null) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
        }
        String recordStr = mapper.writeValueAsString(recordList);
        logger.info(recordStr);
       
        for(DeviceGameRecord record : recordList){
            TradeRecord tr = new TradeRecord();
            tr.setAssetId(record.getAssetId());
            tr.setCardId(record.getCardId());
            tr.setCreateTime(DateUtils.getUTC());
            tr.setOid(key.getOid());
            tr.setRanking(record.getRanking());
            tr.setRecordFlag(record.getRecordFlag());
            tr.setTid(record.getTid());
            tr.setTime(record.getTime());
            tr.setWeight(record.getWeight());
            tradeRecordDao.createTradeRecord(key.getOid(), tr);
            
            Cards cards = cardsDao.findCardByRfid(key.getOid(), tr.getCardId());
            if(cards != null){
                Member member = memberDao.findMemberByMemberId(key.getOid(), cards.getMemberId());
                member.setMoney(member.getMoney()-1);
                memberDao.updateMember(key.getOid(), member);
            }
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    
}
