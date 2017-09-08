/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.dealers.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.dto.DealerBean;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.dealers.dao.DealerDao;
import cn.com.inhand.smart.formulacar.model.Dealer;
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
public class DealerController {
    @Autowired
    private DealerDao dealerDao;

    @RequestMapping(value = "/dealer/list", method = RequestMethod.GET)
    public @ResponseBody
    Object getAllArea(@RequestParam("access_token") String accessToken,
            @RequestParam(required = false, defaultValue = "30") int limit,
            @RequestParam(required = false, defaultValue = "0") int cursor,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(required = false,value="name") String name) {
        DealerBean queryBean = new DealerBean();
        if(name != null && !name.equals("")){
            queryBean.setName(name);
        }
        
        long total = dealerDao.getCount(xOId, queryBean);
        List<Dealer> areaList = dealerDao.findDealerByParam(xOId, queryBean, cursor, limit);
        for(Dealer dealer:areaList){
            dealer.setSiteCount(0l);
        }
        return new BasicResultDTO(total, cursor, limit, areaList);
    }
    
    @RequestMapping(value = "/dealer", method = RequestMethod.POST)
    public @ResponseBody
    Object saveAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @Valid @RequestBody DealerBean dealerBean) {
        if(!dealerDao.dealerExist(xOId, dealerBean.getName())){
            Dealer dealer = new Dealer();
            dealer.setAreaId(dealerBean.getAreaId());
            dealer.setAreaName(dealerBean.getAreaName());
            dealer.setCreateTime(DateUtils.getUTC());
            dealer.setDesc(dealerBean.getDesc());
            dealer.setName(dealerBean.getName());
            dealer.setUpdateTime(DateUtils.getUTC());
            dealerDao.createDealer(xOId, dealer);
        }else{
            throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, dealerBean.getName());
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/dealer", method = RequestMethod.PUT)
    public @ResponseBody
    Object updateAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id,
            @Valid @RequestBody DealerBean dealerBean) {
        Dealer dealer = dealerDao.findAreaById(xOId, id);
        if (dealer != null) {
            if(!dealer.getName().equals(dealerBean.getName())){
               if(dealerDao.dealerExist(xOId, dealerBean.getName())){
                   throw new ErrorCodeException(ErrorCode.SMART_ASSERT_ALREADY_EXISTS, dealerBean.getName());
               }
            }
            dealer.setAreaId(dealerBean.getAreaId());
            dealer.setAreaName(dealerBean.getAreaName());
            dealer.setDesc(dealerBean.getDesc());
            dealer.setName(dealerBean.getName());
            dealer.setUpdateTime(DateUtils.getUTC());
            dealerDao.updateDealer(xOId, dealer);
        }
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
    @RequestMapping(value = "/{id}/dealer", method = RequestMethod.GET)
    public @ResponseBody
    Object findArea(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @PathVariable ObjectId id) {
        Dealer dealer = dealerDao.findAreaById(xOId, id);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(dealer);
        return result;
    }
    @RequestMapping(value = "/dealer/dealerDelBatch", method = RequestMethod.POST)
    public @ResponseBody
    Object deleteAutomat(@RequestParam(value = "access_token", required = true) String access_token,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestParam(value = "ids", required = true) String ids) {
        
        String[] idsArr_ = ids.split(",");
        dealerDao.deleteDealer(xOId, idsArr_);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult("OK");
        return result;
    }
    
}
