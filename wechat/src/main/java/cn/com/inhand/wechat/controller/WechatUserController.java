/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.service.RedisFactory;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.wechat.dao.MemberDao;
import java.util.HashMap;
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
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("wbapi/wechat")
public class WechatUserController {
    @Autowired
    private RedisFactory redisFactory;
    @Value("#{config.project.oid}")
    private String oid;
    @Autowired
    RestTemplate template;
    @Autowired
    private MemberDao memberDao;
    
    @RequestMapping(value = "/getUserInfo", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "openid", required = false) String openid,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Member member = memberDao.findMemberByOpenId(new ObjectId(oid), openid);
        Map<String,String> result = new HashMap<String,String>();
        if(member != null){
            result.put("name", member.getNickname());
            result.put("phone", member.getPhone());
            result.put("sex", "男");
            result.put("age", "10");
        }
        return result;
    }
    
}
