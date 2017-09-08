/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.area.controller;

import cn.com.inhand.area.dao.AreaDao;
import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.smart.model.Goods;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Area;
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
public class AreaController {

    @Autowired
    private AreaDao areaDao;

    @RequestMapping(value = "/area/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls) {

        long total = areaDao.getCount(xOId, null);
        List<Area> areaList = areaDao.findAreaByParam(xOId, null, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }

    @RequestMapping(value = "/area", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody AreaBean areaBean) {
        Area area = new Area();
        area.setAreaNum(areaBean.getAreaNum());
        area.setCreateTime(DateUtils.getUTC());
        area.setDesc(areaBean.getDesc());
        area.setName(areaBean.getName());
        area.setPhone(areaBean.getPhone());
        area.setUpdateTime(DateUtils.getUTC());
        area.setOid(xOId);
        areaDao.createArea(xOId, area);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }

    @RequestMapping(value = "/area/{id}", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody AreaBean areaBean) {
        Area area = areaDao.findAreaById(xOId, id);
        if (area != null) {
            area.setAreaNum(areaBean.getAreaNum());
            area.setDesc(areaBean.getDesc());
            area.setName(areaBean.getName());
            area.setPhone(areaBean.getPhone());
            area.setUpdateTime(DateUtils.getUTC());
            areaDao.updateArea(xOId, area);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }

    @RequestMapping(value = "/area/{id}", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Area area = areaDao.findAreaById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(area);
        return result;
    }

    @RequestMapping(value = "/areaDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        
        String[] idsArr_ = ids.split(",");
        areaDao.deleteByIds(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
}
