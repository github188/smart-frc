/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.rfid.controller;

import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.rfid.dao.RfidDao;
import cn.com.inhand.rfid.dto.RfidBean;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Rfid;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import javax.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author shixj
 */
@Controller
@RequestMapping("api/basic")
public class RfidController {
    @Autowired
    private RfidDao rfidDao;
    @Autowired
    ObjectMapper mapper;
    
    @RequestMapping(value = "/rfid/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "rfid", required = false) String rfid) {
        RfidBean bean = new RfidBean();
        if(rfid!=null&&!rfid.equals("")){
           bean.setRfid(rfid);
        }
        long total = rfidDao.getCount(xOId, bean);
        List<Rfid> areaList = rfidDao.findRfidByParam(xOId, bean, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }
    
    @RequestMapping(value = "/rfid", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody RfidBean bean) {
        if(rfidDao.isRfidExists(xOId, bean.getRfid())){
           throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, bean.getRfid());
        }
        Rfid area = mapper.convertValue(bean, Rfid.class);
        rfidDao.createRfid(xOId, area);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/rfid", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Rfid area = rfidDao.findRfidById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(area);
        return result;
    }
    
    
}
