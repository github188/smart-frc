/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.smart.formulacar.model.PayTrade;
import cn.com.inhand.wechat.dao.PayTradeDao;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
@RequestMapping("wbapi/trade")
public class PayTradeController {
    
    private static final Logger logger = LoggerFactory.getLogger(PayTradeController.class);
    @Value("#{config.project.oid}")
    private String oid;
    @Autowired
    private PayTradeDao tradeDao;
    
    @RequestMapping(value = "/orderInfo", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "orderNo", required = true) String orderNo,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String,String> result = new HashMap<String,String>();
        PayTrade trade = tradeDao.getTradeByOrderNo(new ObjectId(oid), orderNo);
        if(trade != null){
            result.put("result", "SUCCESS");
            result.put("orderNo", trade.getOrderNo());
            result.put("payStatus", trade.getPayStatus()+"");
        }else{
            result.put("result", "FAIL");
            result.put("orderNo", trade.getOrderNo());
        }
        return result;
    }
    
}
