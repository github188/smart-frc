/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.wechat.dao;

import cn.com.inhand.smart.formulacar.model.Special;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface SpecialDao {
    
    public Special findSpecialByTime(ObjectId oid,Long nowTime);
    
}
