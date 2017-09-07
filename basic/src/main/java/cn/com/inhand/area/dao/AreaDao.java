/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.area.dao;

import cn.com.inhand.smart.formulacar.model.Area;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface AreaDao {
    
    public void createArea(ObjectId oid,Area area);
    
    public void updateArea(ObjectId oid,Area area);
    
    public List<Area> findAreaByParam(ObjectId oid,Map<String,Object> params,int skip, int limit);
    
    public void deleteArea(ObjectId oid,String[] idsArr);
}
