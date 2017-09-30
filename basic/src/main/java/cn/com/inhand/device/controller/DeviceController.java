/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.device.controller;

import cn.com.inhand.area.dao.AreaDao;
import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.DeviceBean;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.dealers.dao.DealerDao;
import cn.com.inhand.device.dao.DeviceDao;
import cn.com.inhand.site.dao.SiteDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Dealer;
import cn.com.inhand.smart.formulacar.model.Device;
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
public class DeviceController {

    @Autowired
    private DeviceDao deviceDao;
    @Autowired
    private SiteDao siteDao;
    @Autowired
    private DealerDao dealerDao;
    @Autowired
    private AreaDao areaDao;

    @RequestMapping(value = "/device/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "vflag", required = false) Integer vflag,
            @RequestParam(value = "searchName", required = false) String searchName,
            @RequestParam(value = "dealerIds", required = false) List<ObjectId> dealerIds,
            @RequestParam(value = "areaIds", required = false) List<ObjectId> areaIds,
            @RequestParam(value = "online", required = false) Integer online,
            @RequestParam(value = "deviceType", required = false) Integer deviceType) {

        DeviceBean db = new DeviceBean();
        if (vflag != null && vflag == 1) { //店面名称
            db.setSiteName(searchName);
        } else if (vflag != null && vflag == 2) {   //赛台名称
            db.setName(searchName);
        }
        if (dealerIds != null) {
            db.setDealerIds(dealerIds);
        }
        if (areaIds != null) {
            db.setAreaIds(areaIds);
        }
        if (online != null) {
            db.setOnline(online);
        }
        if (deviceType != null) {
            db.setDeviceType(deviceType);
        }

        long total = deviceDao.getCount(xOId, db);
        List<Device> areaList = deviceDao.findSiteByParam(xOId, db, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }

    @RequestMapping(value = "/{id}/device", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Device device = deviceDao.findDeviceById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(device);
        return result;
    }

    @RequestMapping(value = "/device", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody DeviceBean deviceBean) {
        if (deviceDao.isAssetIdExists(xOId, deviceBean.getAssetId())) {
            throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, deviceBean.getAssetId());
        }
        Device device = new Device();
        device.setAssetId(deviceBean.getAssetId());
        device.setName(deviceBean.getName());
        device.setOnline(1);
        device.setVender(deviceBean.getVender());
        device.setDeviceType(1);
        device.setSiteId(deviceBean.getSiteId());
        device.setSiteName(deviceBean.getSiteName());
        device.setModuleId(deviceBean.getModuleId());
        device.setModuleName(deviceBean.getModuleName());
        device.setCreateTime(DateUtils.getUTC());
        device.setUpdateTime(DateUtils.getUTC());
        Site site = siteDao.findSiteById(xOId, device.getSiteId());
        device.setLocation(site.getLocation());
        Dealer dealer = dealerDao.findAreaById(xOId, site.getDealerId());
        device.setDealerId(dealer.getId());
        device.setDealerName(dealer.getName());
        Area area = areaDao.findAreaById(xOId, dealer.getAreaId());
        device.setAreaId(area.getId());
        device.setAreaName(area.getName());
        deviceDao.createDevice(xOId, device);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }

    @RequestMapping(value = "/{id}/device", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody DeviceBean deviceBean) {
        Device device = deviceDao.findDeviceById(xOId, id);
        if (device != null) {
            device.setAssetId(deviceBean.getAssetId());
            device.setName(deviceBean.getName());
            device.setVender(deviceBean.getVender());
            device.setSiteId(deviceBean.getSiteId());
            device.setSiteName(deviceBean.getSiteName());
            device.setModuleId(deviceBean.getModuleId());
            device.setModuleName(deviceBean.getModuleName());
            device.setUpdateTime(DateUtils.getUTC());
            Site site = siteDao.findSiteById(xOId, device.getSiteId());
            device.setLocation(site.getLocation());
            Dealer dealer = dealerDao.findAreaById(xOId, site.getDealerId());
            device.setDealerId(dealer.getId());
            device.setDealerName(dealer.getName());
            Area area = areaDao.findAreaById(xOId, dealer.getAreaId());
            device.setAreaId(area.getId());
            device.setAreaName(area.getName());
            deviceDao.updateDevice(xOId, device);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/device/deviceDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        String[] idsArr_ = ids.split(",");
        deviceDao.deleteDevice(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
}
