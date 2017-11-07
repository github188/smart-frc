/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.special.dao;

import cn.com.inhand.common.dto.SiteBean;
import cn.com.inhand.smart.formulacar.model.Site;
import cn.com.inhand.smart.formulacar.model.Special;
import cn.com.inhand.special.dto.SpecialBean;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author liqiang
 */
public interface SpecialDao {
    
    public void createSpecial(ObjectId oid,Special special);
    
    public void updateSpecial(ObjectId oid,Special special);
    
    public List<Special> findSpecialByParam(ObjectId oid,SpecialBean queryBean,int skip, int limit);
     
    public Special findSpecialById(ObjectId oid,ObjectId id);
     
    public void deleteSpecial(ObjectId oid,String[] idsArr);
    
    public Long getCount(ObjectId oid,SpecialBean queryBean);
    
    public boolean isSpecialNameExists(ObjectId xOId, String name);
    
    public List<Special> getEnableListSpecial(ObjectId xOId, SpecialBean sqb,String id);
    
    
}
