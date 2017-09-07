/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.service.RedisFactory;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.wechat.dao.MemberDao;
import cn.com.inhand.wechat.dto.LoginBean;
import cn.com.inhand.wechat.dto.RegisterBean;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import net.sf.json.JSONObject;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;

/**
 *
 * @author lenovo
 */
@Controller
@RequestMapping("wbapi/wechat")
public class WechatRegisterController {

    @Autowired
    private RedisFactory redisFactory;
    @Value("#{config.project.oid}")
    private ObjectId oid;
    @Autowired
    RestTemplate template;
    @Autowired
    private MemberDao memberDao;

    @RequestMapping(value = "/register", method = RequestMethod.POST)
    public @ResponseBody
    Object registerWechatOper(@Valid @RequestBody RegisterBean registerBean,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        String code = redisFactory.get(registerBean.getSmscode() + ":SMSCODE");
        Map<String, String> result = new HashMap<String, String>();
        if (code != null) {
            if (code.equals(registerBean.getSmscode())) {
                Member isExist = memberDao.findMemberByPhone(oid, registerBean.getPhone());
                if (isExist == null) {
                    String userInfoUrl = "https://api.weixin.qq.com/sns/userinfo?access_token=" + registerBean.getToken() + "&openid=" + registerBean.getOpenid() + "&lang=zh_CN";
                    String userInfo = template.getForObject(userInfoUrl, String.class);
                    userInfo = new String(userInfo.getBytes("ISO-8859-1"), "UTF-8");
                    JSONObject userObj = JSONObject.fromObject(userInfo);
                    String nickname = userObj.getString("nickname");
                    String headimgurl = userObj.getString("headimgurl");
                    Member member = new Member();
                    member.setPhone(registerBean.getPhone());
                    member.setImg(headimgurl);
                    member.setNickname(nickname);
                    member.setOid(oid);
                    member.setOpenId(registerBean.getOpenid());
                    member.setPassword(registerBean.getPassword());
                    member.setCreateTime(DateUtils.getUTC());
                    member.setMoney(0l);
                    member.setUpdateTime(DateUtils.getUTC());
                    member.setStatus(0);
                    memberDao.createNewMember(oid, member);
                    result.put("result", "SUCCESS");
                } else {
                    result.put("result", "FAIL");
                    result.put("errorMsg", "手机号已经存在");
                }
            } else {
                result.put("result", "FAIL");
                result.put("errorMsg", "输入验证不正确");
            }
        } else {
            result.put("result", "FAIL");
            result.put("errorMsg", "验证码已过期");
        }
        return result;
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public @ResponseBody
    Object loginWechatOper(@Valid @RequestBody LoginBean loginBean,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String,String> result = new HashMap<String,String>();
        Member member = memberDao.findMemberByPhone(oid, loginBean.getPhone());
        if(member != null && member.getPassword().equals(loginBean.getPassword())){
            member.setStatus(0);
            member.setUpdateTime(DateUtils.getUTC());
            memberDao.updateMember(oid, member);
            result.put("result", "SUCCESS");
        }else{
            result.put("result", "FAIL");
            result.put("errorMsg", "用户名密码错误");
        }
        return result;
    }
}
