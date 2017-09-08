/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.module.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.ModuleBean;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.module.dao.ModuleDao;
import cn.com.inhand.smart.formulacar.model.Module;
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
public class ModuleController {
    
    @Autowired
    private ModuleDao moduleDao;

    @RequestMapping(value = "/module/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
             @RequestParam(value = "name", required = false) String moduleNum) {
        ModuleBean bean = new ModuleBean();
        if(moduleNum!=null&&!moduleNum.equals("")){
           bean.setModuleNum(moduleNum);
        }
        long total = moduleDao.getCount(xOId, bean);
        List<Module> areaList = moduleDao.findModuleByParam(xOId, bean, cursor, limit);
        return new BasicResultDTO(total, cursor, limit, areaList);
    }
    
    @RequestMapping(value = "/module", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody ModuleBean moduleBean) {
        if(moduleDao.isModuleNameExists(xOId, moduleBean.getModuleNum())){
           throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, moduleBean.getModuleNum());
        }
        Module module = new Module();
        module.setCreateTime(DateUtils.getUTC());
        module.setDeviceType(moduleBean.getDeviceType());
        module.setModuleNum(moduleBean.getModuleNum());
        module.setOid(xOId);
        module.setRunwayCount(moduleBean.getRunwayCount());
        module.setRunwayStartNum(moduleBean.getRunwayStartNum());
        module.setUpdateTime(DateUtils.getUTC());
        module.setVender(moduleBean.getVender());
        moduleDao.createModule(xOId, module);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/module", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody ModuleBean moduleBean) {
        Module module = moduleDao.findModuleById(xOId, id);
        if (module != null) {
            if(moduleDao.isModuleNameExists(xOId, moduleBean.getModuleNum())){
                throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, moduleBean.getModuleNum());
            }
            module.setDeviceType(moduleBean.getDeviceType());
            module.setModuleNum(moduleBean.getModuleNum());
            module.setRunwayCount(moduleBean.getRunwayCount());
            module.setRunwayStartNum(moduleBean.getRunwayStartNum());
            module.setVender(moduleBean.getVender());
            module.setUpdateTime(DateUtils.getUTC());
            moduleDao.updateModule(xOId, module);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "{id}/module", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Module module = moduleDao.findModuleById(id, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(module);
        return result;
    }
    
    @RequestMapping(value = "/module/moduleDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        String[] idsArr_ = ids.split(",");
        moduleDao.deleteModule(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
}
