/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.rfid.dao;

import cn.com.inhand.rfid.dto.RfidBean;
import cn.com.inhand.smart.formulacar.model.Rfid;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author shixj
 */
public interface RfidDao {

    public long getCount(ObjectId xOId, RfidBean bean);

    public List<Rfid> findRfidByParam(ObjectId xOId, RfidBean bean, int cursor, int limit);

    public boolean isRfidExists(ObjectId xOId, String rfid);

    public void createRfid(ObjectId xOId, Rfid area);

    public Rfid findRfidById(ObjectId xOId, ObjectId id);

    public void updateRfid(ObjectId xOId, Rfid area);

    public void deleteByIds(ObjectId xOId, String[] idsArr_);

    public Rfid findRfidInfoByRfid(ObjectId oId, String rfid);

    
}
