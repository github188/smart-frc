/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dao;

import cn.com.inhand.common.smart.model.Line;
import org.bson.types.ObjectId;

/**
 *
 * @author liqiang
 */
public interface LineDAO {
    
    public void addLine(ObjectId oid, Line line);
}
