package cn.com.inhand.centra.device.controller;

import cn.com.inhand.centra.device.dao.ClientDAO;
import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dao.DeviceKeyDAO;
import cn.com.inhand.centra.device.dao.TokenDAO;
import cn.com.inhand.centra.device.dto.AssetIdsList;
import cn.com.inhand.centra.device.dto.DeviceAccessToken;
import cn.com.inhand.centra.device.dto.DeviceAccessTokenV2;
import cn.com.inhand.centra.device.factory.ClientFactory;
import cn.com.inhand.centra.device.handle.DeviceInfoRedisHandler;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.centra.device.model.OauthRequest;
import cn.com.inhand.centra.util.MD5;
import cn.com.inhand.common.constant.Constant;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.Organization;
import cn.com.inhand.common.oauth2.ReliableType;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.OvdpDevice;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.Generate3DES;
import cn.com.inhand.common.util.GenerateMD5;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.client.RestTemplate;

@Controller
@RequestMapping("fmapi/device")
public class AutomatOauthController {

    private static final Logger logger = LoggerFactory.getLogger(AutomatOauthController.class);
    private static final String KEY_TYPE = "data";
    @Autowired
    DeviceDAO deviceDAO;
    @Autowired
    ClientFactory clientFactory;
    @Autowired
    TokenDAO tokenDAO;
    @Autowired
    DeviceKeyDAO deviceKeyDAO;
    @Autowired
    ClientDAO clientDAO;
    @Autowired
    RestTemplate restTemplate;
    @Autowired
    private DeviceInfoRedisHandler redisDeviceHandler;
    @Autowired
    OauthConfigHandler oauthHandler;
    @Value("#{config.project.websocketserver}")
    private String server;

    @RequestMapping(value = "/key/v2", method = RequestMethod.POST)
    public @ResponseBody
    Object createNetDeviceKeyV2(@Valid @RequestBody OauthRequest oauth) {
        //id is 3DES(asset_id-sn-timestamp-加密字)
        /*
         * 解析添密字得到Inbox SN
         */
//        logger.info("Automat Oauth Info  [" + JSONObject.fromObject(oauth).toString() + "]");
        String auth = oauth.getAuth();
//        logger.debug("Automat Oauth Net setp Read 3DES message ...");
        String decodeId = oauthHandler.decode3DES(auth);
//        logger.debug("Automat Oauth Info decodeInfo is ["+decodeId+"]");
        Map<String, String> decodeInfoMap = oauthHandler.getOauth3DESInfo(decodeId);

        String sn = decodeInfoMap.get("sn");   //Inbox SN
        String vid = decodeInfoMap.get("vid");   //售货机id
        String orgName = decodeInfoMap.get("orgName").trim();   //机构简称
        String nonceStr = decodeInfoMap.get("nonceStr");

        logger.info("Automat Oauth Info sn [" + sn + "]  vid  [" + vid + "]  orgName  [" + orgName + "]");

        /*
         * 根据机构简称查找机构信息
         */

        Organization organization = oauthHandler.getOrganizationInfo(orgName);
        if (organization == null) {
            throw new ErrorCodeException(ErrorCode.SMART_ORGANIZATION_EXISIT, orgName);
        }
        logger.info("Automat Oauth info organization id is " + organization.getId());

        /*
         * 根据SN查询工控列表
         */
        Map<String, Device> automatMap = new HashMap<String, Device>();

        List<Device> devices = deviceDAO.findDeviceListBySn(organization.getId(), sn);
        if (devices != null && devices.size() > 0) {
            for (int a = 0; a < devices.size(); a++) {
                Device device = devices.get(a);
                //如果assetId 在请求的队列中将其放到map中
                if (vid.equals(device.getAssetId())) {
                    automatMap.put(device.getId().toString(), device);
                    devices.remove(device);
                    a--;
                }
            }
        }

        //将Inbox传过来的所有assetId，根据这些assetId和Inbox目前的关联对比

        List<AssetIdsList> assets = oauthHandler.initAmountInfo(organization, vid, sn);

//        logger.debug("Automat Oauth Net setp create new Inbox message ");
        /*
         * 根据SN信息获取售货机信息,如果不存在创建inbox,获得deviceId
         */

        SmartInbox inbox = oauthHandler.initSmartInbox(sn, organization);
        oauthHandler.initOvdpInboxInfo(sn, organization, inbox);
        ObjectId gwId = inbox.getId();   //此为InBox的唯一标识

        /*
         * 判断当前设备ID有没有token，并生成新的token
         */
        boolean isDeviceKey = deviceKeyDAO.isDeviceKeyExists(gwId, organization.getId());
        logger.debug("Automat Oauth is Device key exists " + isDeviceKey);
        if (isDeviceKey) {
            DeviceKey deleteKey = deviceKeyDAO.getDeviceKeyByDeviceId(gwId);
            redisDeviceHandler.deleteDeviceInfo(deleteKey.getKey()+":"+Constant.REDIS_DEVICE_TOKEN_KEY);
            deviceKeyDAO.deleteOauthTokenByDeviceId(gwId);
            //deleteKeySender.publishDeviceKeyDeleteMessageSender(deleteKey.getKey());
            deviceKeyDAO.deleteDeviceKeyByDeviceId(gwId);
        }
        Client client = clientDAO.getClientByOid(organization.getId(), KEY_TYPE);
        if (client != null) {
            if (!client.getReliable().equals(ReliableType.PRIVATE.getName())) {
                throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
            }
        } else {
            client = clientFactory.getDataGatheringClient(organization.getId());
            clientDAO.createClients(client);
        }

        String key = tokenDAO.getTokenKey(client.getId(), client.getAppkey());
        DeviceKey deviceKey = new DeviceKey();
        deviceKey.setDeviceId(gwId);
        deviceKey.setKey(key);
        deviceKey.setOid(organization.getId());
        
        Map<String, String> redisMap = new HashMap<String, String>();
        redisMap.put("token", key);
        Iterator iterator = automatMap.keySet().iterator();
        while (iterator.hasNext()) {
            String hkey = iterator.next().toString();
            redisMap.put("deviceId", hkey);
//            redisMap.put("oid", organization.getId().toString());
//            redisMap.put("gwId", gwId.toString());
//            redisMap.put("sn", sn);
            redisDeviceHandler.hmsetDeviceInfo(hkey+":"+Constant.REDIS_DEVICE_INFO_KEY, redisMap);
            redisMap.clear();
        }
        redisMap.put("oid", organization.getId().toString());
        redisMap.put("gwId", gwId.toString());
        redisMap.put("sn", sn);
        redisDeviceHandler.hmsetDeviceInfo(key+":"+Constant.REDIS_DEVICE_TOKEN_KEY, redisMap);
        redisMap.clear();
        
        deviceKeyDAO.addDevuceKey(deviceKey);
        
        DeviceAccessTokenV2 deviceToken = new DeviceAccessTokenV2();
        deviceToken.setGwId(deviceKey.getDeviceId() + "");
        deviceToken.setOid(deviceKey.getOid() + "");
        deviceToken.setToken(deviceKey.getKey());
        deviceToken.setServer(oauthHandler.getIeisureApUrl() != null ? oauthHandler.getIeisureApUrl() : server);
        deviceToken.setSign(MD5.sign(auth,GenerateMD5.md5Key,"UTF-8"));
        deviceToken.setAssets(assets);
        logger.info("Automat Oauth websocket server is "+deviceToken.getServer());
        //更新售货机的邦定关系 如Inbox序列号,gwid==
        oauthHandler.updateAutomat(organization, assets, sn, gwId);

        //如果assetId 没有在请求队列中，将这个售货机和Inbox解除关系
//        if (automats != null && automats.size() > 0) {
//            for (int au = 0; au < automats.size(); au++) {
//                Automat automat = new Automat();
//                automat.setId(automats.get(au).getId());
//                automat.setOid(organization.getId());
////                automat.setGwId(new ObjectId("000000000000000000000001"));
//                automat.setSerialNumber("0000");
//                automat.setOnline(Constant.DEVICE_ONLINE_STATUS_LOGOUT);
//                deviceDAO.updateAutomat(organization.getId(), automat,"Serial Number");
//                redisMap.clear();
//                redisMap.put("sn", automat.getSerialNumber());
//                redisMap.put("online", Constant.DEVICE_ONLINE_STATUS_LOGOUT+"");
//                redisDeviceHandler.hmsetDeviceInfo(automat.getId()+":"+Constant.REDIS_DEVICE_INFO_KEY, redisMap);
//                redisMap.clear();
//            }
//        }

        return new OnlyResultDTO(deviceToken);
    }
    
    
    @RequestMapping(value = "/key", method = RequestMethod.GET)
    public @ResponseBody
    Object createNetDeviceKey(@RequestParam(value = "auth", required = true) String auth) {
        //id is 3DES(asset_id-sn-timestamp-加密字)
        byte[] base = Generate3DES.hexStringToBytes(auth);
        String decodeId = "";
        try {
            decodeId = new String(Generate3DES.decryptMode(Generate3DES.keyBytes, base));
        } catch (Exception e) {
            throw new ErrorCodeException(ErrorCode.OAUTH_3DES_ERROR, auth);
        }
        String[] param = null;
        String sn = null;
        String vid = null;
        if (decodeId.indexOf(";") != -1 && decodeId.split(";").length >= 2) {
            param = decodeId.split(";");
            vid = param[0];
            sn = param[1];
        } else {
            throw new ErrorCodeException(ErrorCode.OAUTH_3DES_FORMAT_ERROR, decodeId);
        }
        logger.debug("sn is " + sn + "  asset_id  is " + vid);
        OvdpDevice device = deviceKeyDAO.getDeviceByVid(vid);
        if (device == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, vid);
        }
        ObjectId deviceId = device.getDeviceId();
        ObjectId oid = device.getoId();
        boolean isDeviceKey = deviceKeyDAO.isDeviceKeyExists(deviceId, oid);

        logger.debug("is Device key exists " + isDeviceKey);
        if (isDeviceKey) {
            deviceKeyDAO.deleteDeviceKeyByDeviceId(deviceId);
            //throw new ErrorCodeException(ErrorCode.DEVICE_KEY_ALREADY_EXISTS);
        }
        Client client = clientDAO.getClientByOid(oid, KEY_TYPE);
        if (client != null) {
            if (!client.getReliable().equals(ReliableType.PRIVATE.getName())) {
                throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
            }
        } else {
            client = clientFactory.getDataGatheringClient(oid);
            clientDAO.createClients(client);
        }

        String key = tokenDAO.getTokenKey(client.getId(), client.getAppkey());
        DeviceKey deviceKey = new DeviceKey();
        deviceKey.setDeviceId(deviceId);
        deviceKey.setKey(key);
        deviceKey.setOid(oid);
        deviceKeyDAO.addDevuceKey(deviceKey);
        DeviceAccessToken deviceToken = new DeviceAccessToken();
        deviceToken.setId(deviceKey.getDeviceId() + "");
        deviceToken.setOid(deviceKey.getOid() + "");
        deviceToken.setToken(deviceKey.getKey());
        deviceToken.setServer(server);

        Automat automat = new Automat();
        automat.setOid(oid);
        automat.setId(deviceId);
        automat.setSerialNumber(sn);
        deviceDAO.updateAutomat(oid, automat,"Serial Number");
        return new OnlyResultDTO(deviceToken);
    }
}
