/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.model.Organization;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface OrganizationsDAO {
    
    public Organization getOrganizationByName(String name);
    
    public Organization getOrganizationById(ObjectId id);
    
}
