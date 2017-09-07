/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dao;

import cn.com.inhand.common.smart.model.Site;
import org.bson.types.ObjectId;

/**
 *
 * @author liqiang
 */
public interface SiteDAO {
    
    public void addSite(ObjectId oid,Site site);
}
