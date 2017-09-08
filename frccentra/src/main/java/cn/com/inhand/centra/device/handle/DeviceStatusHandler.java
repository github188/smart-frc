/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.dao.InboxDAO;
import cn.com.inhand.centra.device.dao.SiteDAO;
import cn.com.inhand.centra.device.dto.AssetAppConfig;
import cn.com.inhand.centra.device.factory.DeviceStatusFactory;
import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.Site;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.List;
import javax.annotation.Resource;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author cttc
 */
@Component
public class DeviceStatusHandler {

    private static final Logger logger = LoggerFactory.getLogger(DeviceStatusHandler.class);
    @Autowired
    private DeviceStatusFactory statusFactory;
    @Resource
    private DeviceDAO deviceService;
    @Autowired
    private SiteDAO siteDAO;
    @Autowired
    private DeviceKeyDAO keyDAO;
    @Autowired
    private InboxDAO inboxDAO;

    public Device getAutomatNewStatus(ObjectId id, ObjectId oid, int action) {
        Device entity = statusFactory.analyzeDeviceStatusAction(action);
        entity.setId(id);
        entity.setOid(oid);
        return entity;
    }

    public Site getSiteNewStatus(ObjectId id, ObjectId oid, int action) {
        Site site = statusFactory.analyzeSiteStatusAction(action);
        site.setId(id);
        site.setOid(oid);
        return site;
    }

    public void updateInboxInfo(Device entity, List<AssetAppConfig> apps) {
        SmartInbox inbox = new SmartInbox();
        inbox.setoId(entity.getOid());
        inbox.setId(entity.getGwId());
        inbox.setOnline(entity.getOnline());
        inbox.setAssetId(entity.getAssetId());
        inboxDAO.updateInbox(inbox);
    }

    public void updateOvdpDevice(Automat entity) {
        OvdpDevice device = new OvdpDevice();
        device.setAssertId(entity.getAssetId());
        device.setoId(entity.getOid());
        device.setOnline(entity.getOnline());
        keyDAO.updateOvdpDeviceOnline(device);
    }

    public void updateDevice(Device entity,String business) {
        Device device = new Device();
        device.setId(entity.getId());
        device.setSessionId(entity.getSessionId());
        device.setLastAlveTime(entity.getLastAlveTime());
        device.setOnline(entity.getOnline());
        device.setHost(entity.getHost());
        if(entity.getOnline() == Constant.DEVICE_ONLINE_STATUS_LOGIN){
            device.setActivationTime(entity.getActivationTime());
        }
        deviceService.updateDevice(entity.getOid(), entity,business);
        
    }
    
    public void updateDeviceStatus(ObjectId oid,ObjectId deviceId,Integer online){
        deviceService.updateAutomatStatus(oid, deviceId, online);
    }
}
