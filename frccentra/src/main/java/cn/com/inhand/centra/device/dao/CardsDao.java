/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.smart.formulacar.model.Cards;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface CardsDao {
    
    public Cards findCardByRfid(ObjectId oid,String rfid);
    public void createCard(ObjectId oid,Cards card);
    
    
    
}
