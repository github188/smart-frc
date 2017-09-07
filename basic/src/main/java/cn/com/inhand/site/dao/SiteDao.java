/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.site.dao;

import cn.com.inhand.smart.formulacar.model.Site;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface SiteDao {
    public void createSite(ObjectId oid,Site site);
    
    public void updateSite(ObjectId oid,Site site);
    
    public List<Site> findSiteByParam(ObjectId oid,Map<String,Object> params,int skip, int limit);
    
    public void deleteSite(ObjectId oid,String[] idsArr);
}
