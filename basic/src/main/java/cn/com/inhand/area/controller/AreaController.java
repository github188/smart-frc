/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.area.controller;

import cn.com.inhand.area.dao.AreaDao;
import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.OnlyResultDTO;
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
    
    @RequestMapping(value = "/area}", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody AreaBean areaBean) {
         
        
         OnlyResultDTO result = new OnlyResultDTO();
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
         
        
         OnlyResultDTO result = new OnlyResultDTO();
         return result;
    }
    
    @RequestMapping(value = "/area", method = RequestMethod.DELETE)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody AreaBean areaBean) {
         
        
         OnlyResultDTO result = new OnlyResultDTO();
         return result;
    }
    
}
