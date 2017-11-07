/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.special.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.SiteBean;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.site.dao.SiteDao;
import cn.com.inhand.smart.formulacar.model.Site;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.special.dao.SpecialDao;
import cn.com.inhand.special.dto.SpecialBean;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
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
 * @author liqiang
 */
@Controller
@RequestMapping("api/basic")
public class SpecialController {
    
    @Autowired
    private SpecialDao specialDao;
    @Autowired
    private SiteDao siteDao;
    @Autowired
    ObjectMapper mapper;

    @RequestMapping(value = "/special/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllSpecial(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "types", required = false) List<Integer> types,
            @RequestParam(value = "name", required = false) String name) {
        SpecialBean bean = new SpecialBean();
        if (name != null && !name.equals("")) {
            bean.setName(name);
        }
        if (types != null && types.size() > 0) {
            bean.setTypes(types);
        }
        long total = specialDao.getCount(xOId, bean);
        List<Special> specialList = specialDao.findSpecialByParam(xOId, bean, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, specialList);
    }

    @RequestMapping(value = "/special", method = RequestMethod.POST)
    public @ResponseBody
    Object saveSpecial(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody SpecialBean specialBean) {
        if (specialDao.isSpecialNameExists(xOId, specialBean.getName())) {
            throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, specialBean.getName());
        }
        Special special = mapper.convertValue(specialBean, Special.class);
        special.setCreateTime(DateUtils.getUTC());
        special.setOid(xOId);
        special.setUpdateTime(DateUtils.getUTC());
        specialDao.createSpecial(xOId, special);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }

    @RequestMapping(value = "/{id}/special", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateSpecial(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody SpecialBean specialBean) {
        Special special = mapper.convertValue(specialBean, Special.class);
        Special specialold = specialDao.findSpecialById(xOId, id);
        if (specialold != null) {
            if (!special.getName().equals(specialold.getName())) {
                if (specialDao.isSpecialNameExists(xOId, special.getName())) {
                    throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, special.getName());
                }
            }
            special.setId(id);
            special.setOid(xOId);
            special.setUpdateTime(DateUtils.getUTC());
            specialDao.updateSpecial(xOId, special);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/special", method = RequestMethod.GET)
    public @ResponseBody
    Object findSpecial(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Special special = specialDao.findSpecialById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(special);
        return result;
    }
    
    @RequestMapping(value = "/special/specialDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteSpecial(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        
        String[] idsArr_ = ids.split(",");
        specialDao.deleteSpecial(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/sitelist", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllEnableDeviceList(
            @RequestParam(value = "access_token", required = true) String access_token,
            @RequestParam(required = false, defaultValue = "10") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "startTime", required = false) Long startTime,
            @RequestParam(value = "endTime", required = false) Long endTime,
            @RequestParam(value = "id", required = false) String id,
            @RequestParam(value = "number", required = false) String number,
            @RequestParam(value = "name", required = false) String name) {

        SpecialBean bean = new SpecialBean();

        if (startTime != null) {
            bean.setStartTime(startTime);
        }
        if (endTime != null) {
            bean.setEndTime(endTime);
        }
        List<String> siteNums = new ArrayList<String>();
        List<Special> specials = specialDao.getEnableListSpecial(xOId, bean, id);
        if (specials != null && specials.size() > 0) {
            for (Special special : specials) {
                List<String> siteNum = special.getSiteNum();
                if(siteNum != null){
                    siteNums.addAll(siteNum);
                }

            }

        }
        SiteBean queryBean = new SiteBean();
        if (name != null && !name.equals("")) {
            queryBean.setName(name);
        }
        if (number != null && !number.equals("")) {
           
            queryBean.setSiteNum(number);
        }
        List<Site> sites = siteDao.getListSite(xOId,queryBean, cursor, limit, siteNums);
        long total = siteDao.getCount(xOId, queryBean, siteNums);
        return new BasicResultDTO(total, cursor, limit, sites);
    }
    
}
