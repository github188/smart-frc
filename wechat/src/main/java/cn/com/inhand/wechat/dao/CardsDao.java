/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.dao;

import cn.com.inhand.smart.formulacar.model.Cards;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface CardsDao {
    
    public Cards findCardByRfid(ObjectId oid,String rfid);
    public void createCard(ObjectId oid,Cards card);
    public List<Cards> getCarListByMember(ObjectId oid,ObjectId memberId);
    public void deleteCar(ObjectId oid,ObjectId id);
    public Cards getCarById(ObjectId oid,ObjectId id);
}
