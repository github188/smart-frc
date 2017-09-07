/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.smart.model.SmartInbox;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface SmartInboxDAO {
    public SmartInbox getSmartInboxInfo(ObjectId oid,ObjectId id);
}
