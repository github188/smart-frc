/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.gametrade.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.GameTradeBean;
import cn.com.inhand.gametrade.dao.GameTradeDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.TradeRecord;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("api/basic")
public class GameTradeController {
    
    @Autowired
    private GameTradeDao gameTradeDao;

    @RequestMapping(value = "/trade/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls) {
        GameTradeBean bean = new GameTradeBean();
        long total = gameTradeDao.getCount(xOId, bean);
        List<TradeRecord> areaList = gameTradeDao.findTradeRecordByParam(xOId, bean, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }
    
}
