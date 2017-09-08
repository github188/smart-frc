/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.device.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.DeviceBean;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.device.dao.DeviceDao;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.List;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
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
        if(vflag == 1){ //店面名称
            db.setSiteName(searchName);
        }else if(vflag == 2){   //赛台名称
            db.setName(searchName);
        }
        if(dealerIds != null){
            db.setDealerIds(dealerIds);
        }
        if(areaIds != null){
            db.setAreaIds(areaIds);
        }
        if(online != null){
            db.setOnline(online);
        }
        if(deviceType != null){
            db.setDeviceType(deviceType);
        }
        
        long total = deviceDao.getCount(xOId, db);
        List<Device> areaList = deviceDao.findSiteByParam(xOId, db, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }
    
    @RequestMapping(value = "/{id}/area", method = RequestMethod.GET)
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
    
}
