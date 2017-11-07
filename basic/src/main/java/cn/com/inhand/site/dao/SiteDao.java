/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.site.dao;

import cn.com.inhand.common.dto.SiteBean;
import cn.com.inhand.smart.formulacar.model.Site;
import java.util.List;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface SiteDao {
    public void createSite(ObjectId oid,Site site);
    
    public void updateSite(ObjectId oid,Site site);
    
    public List<Site> findSiteByParam(ObjectId oid,SiteBean queryBean,int skip, int limit);
     
    public Site findSiteById(ObjectId oid,ObjectId id);
     
    public void deleteSite(ObjectId oid,String[] idsArr);
    
    public Long getCount(ObjectId oid,SiteBean queryBean);
    
    public boolean isSiteNameExists(ObjectId xOId, String name);
    
    public boolean isSiteNumberExists(ObjectId xOId,String siteNum);
    
    public List<Site> getListSite(ObjectId oId,SiteBean queryBean, int skip, int limit,List<String> siteNums);

    public long getCount(ObjectId oId, SiteBean queryBean,List<String> siteNums);
    
}
