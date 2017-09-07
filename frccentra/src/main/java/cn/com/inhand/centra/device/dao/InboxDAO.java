/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.dao;

import cn.com.inhand.common.smart.model.InboxHistoryData;
import cn.com.inhand.common.smart.model.SmartInbox;
import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public interface InboxDAO {
    public SmartInbox getInboxBySn(ObjectId oid,String sn);
    
    public void updateInbox(SmartInbox inbox);
    
    public void saveInboxHistoryData(InboxHistoryData historyData);

    public SmartInbox getInboxByAssetId(ObjectId oid, String assetId);

}
