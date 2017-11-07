/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.site.controller;

import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.dto.SiteBean;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.site.dao.SiteDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Dealer;
import cn.com.inhand.smart.formulacar.model.Site;
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
 * @author lenovo
 */
@Controller
@RequestMapping("api/basic")
public class SiteController {

    @Autowired
    private SiteDao siteDao;

    @RequestMapping(value = "/site/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "siteNums", required = false) List<String> siteNums) {
        SiteBean bean = new SiteBean();
        if (name != null && !name.equals("")) {
            bean.setName(name);
        }
        if(siteNums != null && siteNums.size()>0){
            bean.setSiteNums(siteNums);
        }
        long total = siteDao.getCount(xOId, bean);
        List<Site> areaList = siteDao.findSiteByParam(xOId, bean, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }

    @RequestMapping(value = "/site", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody SiteBean siteBean) {
        if (siteDao.isSiteNameExists(xOId, siteBean.getName())) {
            throw new ErrorCodeException(ErrorCode.SMART_NAME_ALREADY_EXISTS, siteBean.getName());
        }
        if(siteDao.isSiteNumberExists(xOId, siteBean.getSiteNum())){
            throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, siteBean.getSiteNum());
        }
        Site site = new Site();
        site.setCreateTime(DateUtils.getUTC());
        site.setDealerId(siteBean.getDealerId());
        site.setDealerName(siteBean.getDealerName());
        site.setDesc(siteBean.getDesc());
        site.setLocation(siteBean.getLocation());
        site.setModules(siteBean.getModules());
        site.setName(siteBean.getName());
        site.setOid(xOId);
        site.setPrice(siteBean.getPrice());
        site.setSiteNum(siteBean.getSiteNum());
        site.setSiteType(siteBean.getSiteType());
        site.setStartTime(siteBean.getStartTime());
        site.setUpdateTime(DateUtils.getUTC());
        siteDao.createSite(xOId, site);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }

    @RequestMapping(value = "/{id}/site", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody SiteBean siteBean) {
        Site site = siteDao.findSiteById(xOId, id);
        if (site != null) {
            if (!site.getName().equals(siteBean.getName())) {
                if (siteDao.isSiteNameExists(xOId, siteBean.getName())) {
                    throw new ErrorCodeException(ErrorCode.SMART_NAME_ALREADY_EXISTS, siteBean.getName());
                }
            }
            if (!site.getSiteNum().equals(siteBean.getSiteNum())) {
                if (siteDao.isSiteNumberExists(xOId, siteBean.getSiteNum())) {
                    throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, siteBean.getSiteNum());
                }
            }
            site.setDealerId(siteBean.getDealerId());
            site.setDealerName(siteBean.getDealerName());
            site.setDesc(siteBean.getDesc());
            site.setLocation(siteBean.getLocation());
            site.setModules(siteBean.getModules());
            site.setName(siteBean.getName());
            site.setOid(xOId);
            site.setPrice(siteBean.getPrice());
            site.setSiteNum(siteBean.getSiteNum());
            site.setSiteType(siteBean.getSiteType());
            site.setStartTime(siteBean.getStartTime());
            site.setUpdateTime(DateUtils.getUTC());
            siteDao.updateSite(xOId, site);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/site", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Site site = siteDao.findSiteById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(site);
        return result;
    }
    
    @RequestMapping(value = "/site/siteDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        
        String[] idsArr_ = ids.split(",");
        siteDao.deleteSite(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
}
