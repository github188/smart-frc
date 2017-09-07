/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.centra.device.dao.ApDAO;
import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.dao.OrganizationsDAO;
import cn.com.inhand.centra.device.dto.AssetIdsList;
import cn.com.inhand.centra.device.factory.DeviceConfigFactory;
import cn.com.inhand.centra.device.factory.OauthConfigFactory;
import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.Organization;
import cn.com.inhand.common.smart.model.Ap;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.OvdpInbox;
import cn.com.inhand.common.smart.model.PayConfig;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.common.util.Generate3DES;
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
public class OauthConfigHandler {

    private static final Logger logger = LoggerFactory.getLogger(OauthConfigHandler.class);
    @Autowired
    OrganizationsDAO organizationDAO;
    @Autowired
    DeviceDAO deviceDAO;
    @Autowired
    DeviceKeyDAO deviceKeyDAO;
    @Autowired
    OauthConfigFactory oauthFactory;
    @Autowired
    DeviceConfigFactory configFactory;
    @Autowired
    private DeviceInfoRedisHandler redisDeviceHandler;
    @Autowired
    private ApDAO apDAO;

    public String decode3DES(String auth) {

        byte[] base = Generate3DES.hexStringToBytes(auth);
        String decodeId = "";
        try {
            decodeId = new String(Generate3DES.decryptMode(Generate3DES.keyBytes, base));
        } catch (Exception e) {
            throw new ErrorCodeException(ErrorCode.OAUTH_3DES_ERROR, auth);
        }
        return decodeId;
    }

    public DeviceKey verifyDeviceKey(String access_token) {
        DeviceKey key = null;
        Map<String, String> tokenMap = redisDeviceHandler.hgetDeviceInfo(access_token + ":" + Constant.REDIS_DEVICE_TOKEN_KEY);
        if (tokenMap != null && tokenMap.isEmpty()) {
            logger.info("Device Oauth Config verify device key check db ....");
            key = deviceKeyDAO.getDeviceKeyByKey(access_token);
            if (key != null) {
                Map<String, String> redisMap = new HashMap<String, String>();
                redisMap.put("oid", key.getOid().toString());
                redisMap.put("gwId", key.getDeviceId().toString());
                redisDeviceHandler.hmsetDeviceInfo(key.getKey() + ":" + Constant.REDIS_DEVICE_TOKEN_KEY, redisMap);
            }
        } else if (tokenMap != null) {
            logger.debug("Device Oauth Config verify device key check redis...");
            key = new DeviceKey();
            key.setKey(access_token);
            key.setDeviceId(new ObjectId(tokenMap.get("gwId")));
            key.setOid(new ObjectId(tokenMap.get("oid")));
        }
        return key;
    }

    public Organization getOrganizationInfo(String orgName) {
        Organization organization = null;
        if (orgName != null) {
            organization = organizationDAO.getOrganizationByName(orgName);
        } else {
            throw new ErrorCodeException(ErrorCode.SMART_ORGANIZATION_EXISIT, orgName);
        }
        return organization;
    }

    public Map<String, String> getOauth3DESInfo(String decodeInfo) {
        String[] param = null;
        String sn = null;   //Inbox SN
        String vid = null;  //售货机id
        String orgName = null;  //机构简称
        String nonceStr = null; //随机数
        Map<String, String> decodeInfoMap = new HashMap<String, String>();
        if (decodeInfo.indexOf(";") != -1 && decodeInfo.split(";").length >= 4) {
            param = decodeInfo.split(";");
            decodeInfoMap.put("vid", param[0]);
            decodeInfoMap.put("orgName", param[1]);
            decodeInfoMap.put("sn", param[2]);
            decodeInfoMap.put("nonceStr", param[3]);
        } else {
            throw new ErrorCodeException(ErrorCode.OAUTH_3DES_FORMAT_ERROR, decodeInfo);
        }
        return decodeInfoMap;
    }

    public List<AssetIdsList> initAmountInfo(Organization organization, String assetId, String sn) {
        List assets = new ArrayList();
//        List assetList = oauth.getAssets();
//
//        Map requestModel = new HashMap();
//        if ((assetList != null) && (assetList.size() > 0)) {
//            for (int m = 0; m < assetList.size(); m++) {
//                AssetRequestModel model = (AssetRequestModel) assetList.get(m);
//                requestModel.put(model.getAssetId(), model);
//            }
//        }

        OvdpDevice devicedb = this.deviceKeyDAO.getDeviceByVidAndOid(assetId, organization.getId());
        if (devicedb == null) {
            Device device = this.oauthFactory.createNewDevice(assetId, organization,sn);
            AssetIdsList asset = this.configFactory.getAssetIdsList(device);
            assets.add(asset);
        } else {
            AssetIdsList asset = new AssetIdsList();
            asset.setAssetId(assetId);
            asset.setId(devicedb.getDeviceId().toString());
            assets.add(asset);
        }
        return assets;
    }

    public SmartInbox initSmartInbox(String sn, Organization organization) {
        SmartInbox inbox = deviceDAO.getSmartInboxBySn(organization.getId(), sn);
        if (inbox == null) {
            inbox = oauthFactory.initSmartInbox(sn, organization);
        }
        return inbox;
    }

    public OvdpInbox initOvdpInboxInfo(String sn, Organization organization, SmartInbox sinbox) {
        OvdpInbox inbox = deviceKeyDAO.getInboxBySnAndOid(sn, organization.getId());//getInboxBySn(sn);
        if (inbox == null) {
            inbox = oauthFactory.createNewInbox(sn, organization, sinbox);
        }
        return inbox;
    }

    public void updateAutomat(Organization organization, List<AssetIdsList> assets, String sn, ObjectId gwId) {
        for (int as = 0; as < assets.size(); as++) {
            AssetIdsList asset = assets.get(as);
            if (!asset.getId().equals("")) {
                Device device = new Device();
                device.setOid(organization.getId());
                device.setGwId(gwId);
                device.setId(new ObjectId(asset.getId()));
                device.setSn(sn);
                device.setUpdateTime(DateUtils.getUTC());
                deviceDAO.updateDevice(organization.getId(), device, "Sign in Automat message");

                OvdpDevice ovdp = new OvdpDevice();
                ovdp.setAssertId(asset.getAssetId());
                ovdp.setGwId(gwId);
                ovdp.setoId(organization.getId());
                deviceDAO.updateOvdpDevice(ovdp);
            }
        }
    }

    public String getIeisureApUrl() {
        Ap ap = apDAO.getApInfoByIeisure();
        String url = ap != null ? ap.getUrl() : null;
        return url;
    }

    public Map<String, String> getPayStyleInfo(List<PayConfig> payList) {
        Map<String, String> configMap = new HashMap<String, String>();
        if (payList != null) {
            for (PayConfig config : payList) {
                if (config.getPayName().equals(Constant.PAY_STYLE_NAME_WECHAT)) {
                    configMap.put(Constant.PAY_STYLE_NAME_WECHAT, Constant.PAY_STYLE_NAME_WECHAT);
                } else if (config.getPayName().equals(Constant.PAY_STYLE_NAME_BAIDU)) {
                    configMap.put(Constant.PAY_STYLE_NAME_BAIDU, Constant.PAY_STYLE_NAME_BAIDU);
                } else if (config.getPayName().equals(Constant.PAY_STYLE_NAME_ALIPAY)) {
                    configMap.put(Constant.PAY_STYLE_NAME_ALIPAY, Constant.PAY_STYLE_NAME_ALIPAY);
                }
            }
        }
        return configMap;
    }
}
