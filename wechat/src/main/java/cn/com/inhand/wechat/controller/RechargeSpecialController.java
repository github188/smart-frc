/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.smart.formulacar.model.SpecialConfig;
import cn.com.inhand.wechat.dao.SpecialDao;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("wbapi/recharge")
public class RechargeSpecialController {

    @Value("#{config.project.oid}")
    private String oid;

    @Autowired
    private SpecialDao specialDao;
    
    @RequestMapping(value = "/special", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "siteNum", required = true) String siteNum,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Special special = specialDao.findSpecialByTime(new ObjectId(oid), DateUtils.getUTC());
        Map<String,Object> result = new HashMap<String,Object>();
        result.put("result", "SUCCESS");
        if(special != null){
            List<SpecialConfig> scList = special.getSpecialConfig();
            if(scList != null && scList.size()>0 && special.getSiteNum().contains(siteNum)){
                result.put("result", "SUCCESS");
                result.put("config", scList);
                result.put("type", special.getType());
            }
        }
        return result;
    }
}
