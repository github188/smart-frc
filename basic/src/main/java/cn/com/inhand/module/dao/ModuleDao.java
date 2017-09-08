/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.module.dao;

import cn.com.inhand.common.dto.AreaBean;
import cn.com.inhand.common.dto.ModuleBean;
import cn.com.inhand.smart.formulacar.model.Area;
import cn.com.inhand.smart.formulacar.model.Module;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface ModuleDao {
    
    public void createModule(ObjectId oid,Module module);
    
    public void updateModule(ObjectId oid,Module module);
    
    public Module findModuleById(ObjectId oid,ObjectId id);
    
    public List<Module> findModuleByParam(ObjectId oid,ModuleBean queryBean,int skip, int limit);
    
    public void deleteModule(ObjectId oid,String[] idsArr);
    
    public Long getCount(ObjectId oid,ModuleBean queryBean);
    
    public boolean isModuleNameExists(ObjectId xOId, String name);
    
}
