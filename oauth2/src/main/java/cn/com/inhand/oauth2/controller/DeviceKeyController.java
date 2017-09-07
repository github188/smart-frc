package cn.com.inhand.oauth2.controller;

import cn.com.inhand.common.amqp.model.DeviceSyncSecret;
import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.exception.ErrorCode;
import cn.com.inhand.common.exception.ErrorCodeException;
import cn.com.inhand.common.exception.HandleExceptionController;
import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.OvdpDevice;
import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.oauth2.ReliableType;
import cn.com.inhand.oauth2.amqp.AmqpMessageSender;
import cn.com.inhand.oauth2.amqp.DeviceSyncSecretMessageSender;
import cn.com.inhand.oauth2.dao.ClientDAO;
import cn.com.inhand.oauth2.dao.DeviceKeyDAO;
import cn.com.inhand.oauth2.dao.TokenDAO;
import cn.com.inhand.oauth2.factory.ClientFactory;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.codec.binary.Base64;
import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Created by Jerolin on 4/15/2014.
 */
@Controller
@RequestMapping("api/devices")
public class DeviceKeyController extends HandleExceptionController {

    @Autowired
    DeviceKeyDAO deviceKeyDAO;
    @Autowired
    ClientDAO clientDAO;
    @Autowired
    TokenDAO tokenDAO;
    @Autowired
    ObjectMapper mapper;
    @Autowired
    ClientFactory clientFactory;
    @Autowired
    DeviceSyncSecretMessageSender deviceSyncSecretMessageSender;
    @Autowired
    AmqpMessageSender sender;
    private static final Logger logger = LoggerFactory.getLogger(DeviceKeyController.class);
    private static final String KEY_TYPE = "data";

    @RequestMapping(value = "/key", method = RequestMethod.GET)
    public @ResponseBody
    Object createDeviceKey(@RequestParam(value = "id", required = true) String id) {
        String decodeId = new String(Base64.decodeBase64(id));
        String[] requestParam = decodeId.split("-");
        String sn = null;
        if (requestParam.length <= 0) {
            throw new ErrorCodeException(ErrorCode.PARAMETER_VALUE_INVALID, id);
        } else {
            sn = requestParam[0];
        }
        logger.info("sn : " + sn);
        OvdpDevice ovdpDevice = deviceKeyDAO.getDeviceBySN(sn);
        if (ovdpDevice == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, sn);
        }
        ObjectId oId = ovdpDevice.getOid();
        ObjectId deviceId = ovdpDevice.getDeviceId();
        boolean keyExists = deviceKeyDAO.isDeviceKeyExists(deviceId);
        if (keyExists) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_ALREADY_EXISTS);
        }

        Client client = clientDAO.getClientByClass(oId, KEY_TYPE);
        if (client != null) {
            if (!client.getReliable().equals(ReliableType.PRIVATE.getName())) {
                throw new ErrorCodeException(ErrorCode.PERMISSTON_DENIED);
            }
        } else {
            client = clientFactory.getDataGatheringClient(oId);
            clientDAO.createClient(client);
        }

        String key = tokenDAO.getTokenCode(client.getId(), client.getAppkey());
        DeviceKey dkb = new DeviceKey();
        dkb.setDeviceId(deviceId);
        dkb.setKey(key);
        dkb.setOid(oId);
        deviceKeyDAO.addDeviceKey(dkb);

        //发送设备key消息
        DeviceSyncSecret dss = new DeviceSyncSecret();
        dss.setDeviceId(String.valueOf(deviceId));
        dss.setDeviceKey(key);
        dss.setoId(String.valueOf(oId));
        dss.setSerialNumber(sn);
        deviceSyncSecretMessageSender.publishDeviceKeyInfo(oId, dss);

        try {
            logger.debug(mapper.writeValueAsString(dkb));
        } catch (JsonProcessingException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return new OnlyResultDTO(dkb);
    }

    @RequestMapping(value = "/{id}/key", method = RequestMethod.GET)
    public @ResponseBody
    Object getDeviceKey(@PathVariable ObjectId id,
            @RequestParam("access_token") String accessToken,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = false) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        DeviceKey dkb = deviceKeyDAO.getDeviceKey(id);
        if (!deviceKeyDAO.isDeviceKeyExists(id)) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_DOES_NOT_EXIST);
        }
        dkb.setKey(null);
        return new OnlyResultDTO(dkb);
    }

    @RequestMapping(value = "/{id}/key", method = RequestMethod.DELETE)
    public @ResponseBody
    Object deleteDeviceKey(@PathVariable ObjectId id,
            @RequestParam("access_token") String accessToken,
            @RequestHeader(value = "X-API-OID", required = false) ObjectId xOId,
            @RequestHeader(value = "X-API-USERNAME", required = false) String xUsername,
            @RequestHeader(value = "X-API-IP", required = false) String xIp,
            @RequestHeader(value = "X-API-UID", required = false) ObjectId xUId,
            @RequestHeader(value = "X-API-ACLS", required = false) List<ObjectId> xAcls,
            @RequestHeader(value = "X-API-ROLE-TYPE", required = false) Integer roleType,
            @RequestParam(value = "oid", required = true) ObjectId oId) {
        DeviceKey dkb = deviceKeyDAO.getDeviceKey(id);
        if (!deviceKeyDAO.isDeviceKeyExists(id)) {
            throw new ErrorCodeException(ErrorCode.DEVICE_KEY_DOES_NOT_EXIST);
        }

        Token token = tokenDAO.getTokenByToken(oId, dkb.getKey());
        if (token == null) {
            throw new ErrorCodeException(ErrorCode.RESOURCE_DOES_NOT_EXIST, dkb.getKey());
        }
        sender.publishDeleteToken(token);
        tokenDAO.deleteTokenById(token.getId());
        deviceKeyDAO.deleteDeviceKey(id);
        return new OnlyResultDTO(dkb);
    }
}
