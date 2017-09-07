/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.controller;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.centra.device.dao.DeviceDAO;
import cn.com.inhand.centra.device.dao.DeviceStatOnlineDAO;
import cn.com.inhand.centra.device.dto.DeviceStatusBeanV2;
import cn.com.inhand.centra.device.dto.DeviceStatusV2;
import cn.com.inhand.centra.device.handle.DeviceStatusHandler;
import cn.com.inhand.centra.device.handle.LoginConifgHandler;
import cn.com.inhand.centra.device.handle.OauthConfigHandler;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.smart.formulacar.model.Device;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.annotation.Resource;
import javax.validation.Valid;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author lenovo 设备登录接口
 */
@Controller
@RequestMapping("fmapi/device_login_ext")
public class DeviceLoginController {

    private static final Logger logger = LoggerFactory.getLogger(DeviceLoginController.class);
    @Resource
    private DeviceDAO deviceService;
    @Autowired
    private DeviceStatusHandler statusHandler;
    @Autowired
    private DeviceStatOnlineDAO deviceOnlineDAO;
    @Autowired
    private OauthConfigHandler oauthHandler;
    @Autowired
    private LoginConifgHandler loginHandler;

    @RequestMapping(value = "", method = RequestMethod.POST)
    public synchronized @ResponseBody
    Object syncAssetStatus(@RequestParam(value = "access_token", required = true) String access_token,
            @Valid @RequestBody DeviceStatusV2 deviceStatus) {

        String authInfo = oauthHandler.decode3DES(deviceStatus.getKey());
        String automatIds = loginHandler.getLoginMessageInfo(authInfo).get("automatIds");
        String gwId = loginHandler.getLoginMessageInfo(authInfo).get("gwId");
        if (gwId == null) {
            throw new ErrorCodeException(ErrorCode.SMART_DEVICE_GWID_NOT_NULL, gwId);
        }
//        logger.debug("Automat Login Parameter access_token is [" + access_token + "] ");
        logger.info("Automat Login Parameter automatIds is " + automatIds + " gwId is " + gwId);
        logger.info("Automat Login Parameter automat host is [" + deviceStatus.getHost() + "] and port [" + deviceStatus.getPort() + "]");
        ObjectId xOId = loginHandler.getOrganizationId(access_token, deviceStatus.getAction(), new ObjectId(gwId));
        /*
         * 需要登录的售货机IDS
         */
        List<String> automatIdList = new ArrayList<String>();
        if (automatIds != null) {
            if (automatIds.indexOf(",") == -1) {
                automatIdList.add(automatIds);
            }
            if (automatIds.indexOf(",") != -1) {
                String[] ids = automatIds.split(",");
                automatIdList.addAll(Arrays.asList(ids));
            }
        }

        /*
         * 根据参数automatIds 查找当前售货机 判断当前售货机是否可以登录
         */
        DeviceStatusBeanV2 status = new DeviceStatusBeanV2();
        List<String> registered = new ArrayList<String>();
        List<String> unregistered = new ArrayList<String>();
        status.setGwId(gwId);
        for (int au = 0; au < automatIdList.size(); au++) {
            ObjectId id = new ObjectId(automatIdList.get(au));
            Device device = deviceService.getDeviceById(xOId, id);
            if (device == null) {
                logger.debug("Automat Login registered fail automat is not exeist " + id);
                logger.debug("Automat Login not device by id {}", id);
                unregistered.add(automatIdList.get(au));
                //throw new ErrorCodeException(ErrorCode.DEVICE_NOT_EXISIT, id);
            } else {
                Device entity = statusHandler.getAutomatNewStatus(device.getId(), xOId, deviceStatus.getAction());
                entity.setGwId(new ObjectId(gwId));
                entity.setAssetId(device.getAssetId());
                entity.setSessionId(deviceStatus.getSid());
                entity.setHost(deviceStatus.getHost() + ":" + deviceStatus.getPort());
                
                logger.info("Automat Login status by assetId {} by {} action {}", device.getAssetId(), deviceStatus.getAction() == 1 ? "device[Login]" : deviceStatus.getAction() == 2 ? "device[Heartbeat]" : "device[Logout]", deviceStatus.getAction());
                logger.info("Automat Login online by assetId {} by {}", device.getAssetId(), entity.getOnline());
                logger.info("Automat Login online by assetId {} by sessionId is {}", device.getAssetId(), entity.getSessionId());

                registered.add(automatIdList.get(au));

                if (entity.getOnline() == 0 && deviceStatus.getAction() != Constant.DEVICE_STATUS_ACTION_HEARTBEAT) {
                    statusHandler.updateDevice(entity, "Login status 0");
                    statusHandler.updateInboxInfo(entity, deviceStatus.getApps());
                    loginHandler.setDeviceInfoToReis(entity);
                    loginHandler.setDeviceSessionId(entity.getId().toString(), entity.getSessionId());
                    deviceOnlineDAO.addDeviceStatOnline(device.getOid(), device.getId(), deviceStatus.getHost(), deviceStatus.getPort(), deviceStatus.getAction(), deviceStatus.getSid());

//                    if (alarmDAO.eventIsExist(automat.getOid(), automat.getAssetId(), automat.getAssetId(), Constant.AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK, null)) {
//                        Events events = alarmDAO.findEventsByParames(automat.getOid(), automat.getAssetId(), automat.getAssetId(), Constant.AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK, null);
//                        events.setAction(Constant.AUTOMAT_EVENTS_ACTION_CANCEL_AUTO);
//                        events.setEndTime(DateUtils.getUTC());
//                        events.setSold_out_alarm_key("");
//                        alarmDAO.updateEvents(automat.getOid(), events);
//                    }

                } else if (entity.getOnline() == 1 && device.getOnline() != entity.getOnline()) {
                    logger.info("Automat Login status by assetId {} redis sessionId is {}",device.getAssetId(),loginHandler.getDeviceSessionId(device.getId().toString()));
                    String dbSessionId = loginHandler.getDeviceSessionId(device.getId().toString()) != null ? loginHandler.getDeviceSessionId(device.getId().toString()) : device.getSessionId();
                    logger.info("Automat Login status by assetId {} by {} action {} dbsessionId {} request sessionId {}", device.getAssetId(), deviceStatus.getAction() == 1 ? "device[Login]" : deviceStatus.getAction() == 2 ? "device[Heartbeat]" : "device[Logout]", deviceStatus.getAction(),dbSessionId,deviceStatus.getSid());
                    if (dbSessionId != null && dbSessionId.equals(deviceStatus.getSid())) {
                        statusHandler.updateDevice(entity, "Login status 1");
                        statusHandler.updateInboxInfo(entity, deviceStatus.getApps());
                        loginHandler.setDeviceInfoToReis(entity);
                        deviceOnlineDAO.addDeviceStatOffline(device.getOid(), device.getId(), deviceStatus.getAction(), deviceStatus.getSid());
//                        Map<String, String> key = new HashMap<String, String>();
//                        key.put("alarm_key", Constant.AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK);
//                        eventHandler.createEvents(automat, automat.getAssetId(), Constant.AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK, Constant.AUTOMAT_EVENTS_TYPE_ALARM, Integer.parseInt(Constant.AUTOMAT_VENDING_FAULT_CODE_APPLICATION_NETWORK), Constant.AUTOMAT_EVENTS_LEVEL_GENERAL, null, key);
                    }
                }
            }
        }
        status.setRegistered(registered);
        status.setUnregistered(unregistered);
        OnlyResultDTO result = new OnlyResultDTO();
        result.setResult(status);
        return result;
    }
}
