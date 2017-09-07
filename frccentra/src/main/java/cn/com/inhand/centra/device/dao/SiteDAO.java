/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.smart.model.Site;
import org.bson.types.ObjectId;

/**
 *
 * @author fenghl
 */
public interface SiteDAO {
    
    public void updateSite(ObjectId oId, Site site);
    
    public Site getSiteById(ObjectId oId,String siteId);
    
}
