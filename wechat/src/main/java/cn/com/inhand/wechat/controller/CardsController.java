/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.controller;

import cn.com.inhand.common.dto.BasicResultDTO;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.smart.formulacar.model.Cards;
import cn.com.inhand.smart.formulacar.model.Member;
import cn.com.inhand.smart.formulacar.model.Rfid;
import cn.com.inhand.wechat.dao.CardsDao;
import cn.com.inhand.wechat.dao.RfidDao;
import cn.com.inhand.wechat.dto.CardsBean;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author liqiang
 */
@Controller
@RequestMapping("wbapi/wechat")
public class CardsController {
    @Value("#{config.project.oid}")
    private String oid;
    @Autowired
    private CardsDao cardsDao;
    @Autowired
    ObjectMapper mapper;
    @Autowired
    private RfidDao rfidDao;
    @RequestMapping(value = "/car", method = RequestMethod.POST)
    public @ResponseBody
    Object createCards(
            @Valid @RequestBody CardsBean bean){
        
        Cards car = mapper.convertValue(bean, Cards.class);
        car.setOid(new ObjectId(oid));
        car.setCreateTime(DateUtils.getUTC());
        car.setUpdateTime(DateUtils.getUTC());
        cardsDao.createCard(new ObjectId(oid), car);
        Map<String,String> result = new HashMap<String,String>();
        result.put("result", "success");
        return result;
    }
    @RequestMapping(value = "/car/delete", method = RequestMethod.GET)
    public @ResponseBody
    Object createCards(
            @RequestParam(value = "id", required = true) String id){
        
        Cards car = cardsDao.getCarById(new ObjectId(oid), new ObjectId(id));
        if(car != null){
            String rfid = car.getRfid();
            rfidDao.deleteRfid(new ObjectId(oid), rfid);
            cardsDao.deleteCar(new ObjectId(oid), new ObjectId(id));
        }
        
        Map<String,String> result = new HashMap<String,String>();
        result.put("result", "success");
        result.put("id", id);
        return result;
    }
    @RequestMapping(value = "/car/list", method = RequestMethod.GET)
    public @ResponseBody
    Object registerWechatOper(@RequestParam(value = "memberId", required = true) String memberId,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        List<Cards> cars = cardsDao.getCarListByMember(new ObjectId(oid), new ObjectId(memberId));
        
        int count = 0;
        if(cars != null){
            count = cars.size();
            for(int i=0;i<count;i++){
                Cards car = cars.get(i);
                String rfid = car.getRfid();
                Rfid rfidObj = rfidDao.findRfidByRfid(new ObjectId(oid), rfid);
                if(rfidObj != null){
                    car.setCount(rfidObj.getCount());
                }
            }
        }
        return new BasicResultDTO(count, 0, -1, cars);
    }
}
