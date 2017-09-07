/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.dto.AssetAppConfig;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.DeviceAppInfo;
import cn.com.inhand.common.smart.model.NoticeConfigInfo;
import cn.com.inhand.common.smart.model.VendingData;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class LoginConifgHandler {

    private static final Logger logger = LoggerFactory.getLogger(LoginConifgHandler.class);
    @Autowired
    private DeviceKeyDAO deviceKeyDAO;
    @Autowired
    private DeviceInfoRedisHandler redisDeviceHandler;

    public Map<String, String> getLoginMessageInfo(String authInfo) {
        Map<String, String> info = new HashMap<String, String>();
        String[] authdetails = authInfo.indexOf(";") != -1 ? authInfo.split(";") : null;
//        logger.debug("Automat Login Oauth info {oauthInfo:{}}", authInfo);
        String automatIds = null, gwId = null;
        if (authdetails == null) {
            throw new ErrorCodeException(ErrorCode.OAUTH_3DES_FORMAT_ERROR, authInfo);
        } else {
            automatIds = authdetails[0];
            gwId = authdetails[1];
        }
        info.put("automatIds", automatIds);
        info.put("gwId", gwId);
        return info;
    }

    public ObjectId getOrganizationId(String access_token, Integer action, ObjectId gwId) {

        Map<String, String> token = redisDeviceHandler.hgetDeviceInfo(access_token + ":" + Constant.REDIS_DEVICE_TOKEN_KEY);
        //如果Redis为空的话，查询数据库信息
        if (token != null && token.isEmpty()) {
            DeviceKey deviceKey = deviceKeyDAO.getDeviceKeyByKey(access_token);
            if (deviceKey == null) {
                if (action == Constant.DEVICE_STATUS_ACTION_LOGIN || action == Constant.DEVICE_STATUS_ACTION_HEARTBEAT) {
                    logger.info("Automat Login Device key is NULL");
                    throw new ErrorCodeException(ErrorCode.DEVICE_KEY_NOT_EXISIT, access_token);
                } else {
                    deviceKey = deviceKeyDAO.getDeviceKeyByDeviceId(gwId);
                    logger.info("Automat Login devicekey is not exixt and new device gwId ["+gwId+"] login key is " + deviceKey.getKey());
                }
            }
            token.put("oid", deviceKey.getOid().toString());
        }
        return new ObjectId(token.get("oid"));
    }

    public List<DeviceAppInfo> getDeviceAppsList(List<AssetAppConfig> apps) {
        List<DeviceAppInfo> deviceList = new ArrayList<DeviceAppInfo>();
        if (apps != null) {
            for (AssetAppConfig config : apps) {
                DeviceAppInfo info = new DeviceAppInfo();
                info.setName(config.getName());
                info.setVersion(config.getVersion());
                deviceList.add(info);
//                String version = config.getVersion();
//                if (version.substring(version.lastIndexOf(".") + 1).startsWith("r")) {

//                }
            }
        }
        return deviceList;
    }

    public List<VendingData> getVendingDataList(List<AssetAppConfig> apps) {
        List<VendingData> vendingDataList = new ArrayList<VendingData>();
        if (apps != null) {
            for (AssetAppConfig config : apps) {
                VendingData vending = new VendingData();
                vending.setName(config.getName());
                vending.setType(config.getType() + "");
                vending.setVersion(config.getVersion());
                vendingDataList.add(vending);
            }
        }
        return vendingDataList;
    }

    public void compareVendingData(Automat deviceAutomat, Automat smartVMConfig) {
        if (smartVMConfig.getInboxConfig() != null) {
            String firmware = smartVMConfig.getInboxConfig().getFireware();
            List<DeviceAppInfo> deviceAppInfoList = smartVMConfig.getInboxConfig().getApps();
            List<VendingData> vendingDataList = smartVMConfig.getInboxConfig().getVendingData();

            if (firmware != null && deviceAutomat.getInboxConfig().getFireware() != null && !firmware.equals(deviceAutomat.getInboxConfig().getFireware())) {
                //发送固件版本升级通知，判断，如果下面报上来的版本信息比较平台上的老，才会下发升级通知
            }

            if (deviceAppInfoList != null && deviceAutomat.getInboxConfig().getApps() != null) {
                //下发APP升级通知，
                //判断，如果设备报上来的APP比平台中的APP多，如果平台中的APP版比报上来的老，不下发通知。
                //如果设备报上来的APP比较平台少，立即下发升级通知
                //如果报上来的APP个数和平台相同，并且平台中版本比报上来的版本新，立即下发通知
            }

            if (vendingDataList != null && deviceAutomat.getInboxConfig().getVendingData() != null && smartVMConfig.getNoticeConfigList() != null) {
                //下发广告同步通知
                //判断，如果设备报上来的广告版本信息比平台中的版本信息老，立即下发通知
                this.compareVendingAdVersion(vendingDataList, deviceAutomat.getInboxConfig().getVendingData(), smartVMConfig.getNoticeConfigList());
            }
        }
    }

    public void compareVendingAdVersion(List<VendingData> smartVMVendingDataList, List<VendingData> deviceVendingDataList, List<NoticeConfigInfo> noticeConfigList) {
        String smartVMAdVersion = null;
        String deviceAdVersion = null;
        String configId = null;
        for (VendingData data : smartVMVendingDataList) {
            if (data.getType().equals(Constant.AUTOMAT_VENDING_DATA_AD)) {
                smartVMAdVersion = data.getVersion().substring(data.getVersion().lastIndexOf("."));
            }
        }
        for (VendingData data : deviceVendingDataList) {
            if (data.getType().equals(Constant.AUTOMAT_VENDING_DATA_AD)) {
                deviceAdVersion = data.getVersion().substring(data.getVersion().lastIndexOf("."));
            }
        }
        for (NoticeConfigInfo notice : noticeConfigList) {
            if (notice.getType().equals(Constant.AUTOMAT_VENDING_DATA_AD)) {
                configId = notice.getConfigId();
            }
        }
        if (configId != null) {
        }
        if (smartVMAdVersion != null && deviceAdVersion != null) {
            if (smartVMAdVersion.equals(deviceAdVersion)) {
            } else if (deviceAdVersion.equals("unknow")) {
                logger.debug("Automat Login Ad Version is not equals , send Sync message....");

            } else if (Integer.parseInt(smartVMAdVersion) > Integer.parseInt(deviceAdVersion)) {
                logger.debug("Automat Login Ad Version is not equals , send Sync message....");

            }
        }
    }

    public String getDeviceSessionId(String deviceId){
        Map<String, String> deviceInfoMap = redisDeviceHandler.hgetDeviceInfo(deviceId+":"+Constant.REDIS_DEVICE_INFO_KEY);
        return deviceInfoMap.get("sessionId");
    }
    
    public void setDeviceSessionId(String deviceId,String sessionId){
        Map<String, String> deviceInfoMap = new HashMap<String, String>();
        deviceInfoMap.put("sessionId", sessionId);
        redisDeviceHandler.hmsetDeviceInfo(deviceId+":"+Constant.REDIS_DEVICE_INFO_KEY, deviceInfoMap);
    }
    
    public void setDeviceInfoToReis(Device device) {
        Map<String, String> deviceInfoMap = new HashMap<String, String>();
        deviceInfoMap.put("online", device.getOnline() + "");
        deviceInfoMap.put("assetId", device.getAssetId());
        deviceInfoMap.put("lastAlive", device.getLastAlveTime()+ "");
        redisDeviceHandler.hmsetDeviceInfo(device.getId().toString() + ":" + Constant.REDIS_DEVICE_INFO_KEY, deviceInfoMap);
    }

    public void hsetDeviceLogOutSessionId(String deviceId, String sessionId) {
        redisDeviceHandler.hsetDeviceLogOutSessionId(deviceId, sessionId);
    }

    public String hgetDeviceLogOutSessionId(String deviceId) {
        return redisDeviceHandler.hgetDeviceLogOutSessionId(deviceId);
    }
}
