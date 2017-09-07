/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dao;

import cn.com.inhand.common.smart.model.Model;
import org.bson.types.ObjectId;

/**
 *
 * @author shixj
 */
public interface ModelDAO {

    public void addModel(ObjectId oid, Model model);
    
}
