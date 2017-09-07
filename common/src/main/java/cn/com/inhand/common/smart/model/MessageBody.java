/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import cn.com.inhand.common.constant.Constant;
import cn.com.inhand.common.util.DateUtils;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.slf4j.LoggerFactory;

/**
 *
 * @author lenovo
 */
public class MessageBody {

    
    private final static org.slf4j.Logger logger = LoggerFactory.getLogger(MessageBody.class);
    
    public static JSONObject getMessageBody(String name, String txid, Map<String, String> params) {
        logger.info("params is "+params.toString());
        JSONObject body = new JSONObject();
        body.put("name", name);
        body.put("txid", txid);
        body.put("type", "request");
        body.put("sign", params.get("sign"));
        JSONArray array = new JSONArray();
        Iterator iterator = params.keySet().iterator();
        while (iterator.hasNext()) {
            String key = iterator.next().toString();
            if (!key.equals("sign")) {
                Parameter parames = new Parameter(key, params.get(key).toString());
                array.add(parames);
            }
        }
        body.put("params", array);
        return body;
    }

    public static Map<String, Object> getAdSyncBodyMethod(String configId, String gwId) {
        Map<String, String> signParamMap = new HashMap<String, String>();
        Map<String, Object> requestMap = new HashMap<String, Object>();
        List<Map<String, String>> parameterList = new ArrayList<Map<String, String>>();
        requestMap.put("name", "ad_sync");
        requestMap.put("type", "request");
        String txid = System.currentTimeMillis() + "";
        requestMap.put("txid", txid);
        signParamMap.put("txid", txid);
        Map parameterMap = new HashMap();
        parameterMap.put("name", "config");
        parameterMap.put("value", configId);
        signParamMap.put("config", configId);
        parameterList.add(parameterMap);
        Map parameterMap1 = new HashMap();
        parameterMap1.put("name", "gwId");
        parameterMap1.put("value", gwId);
        signParamMap.put("gwId", gwId);
        parameterList.add(parameterMap1);
        requestMap.put("params", parameterList);
        return requestMap;
    }

    public static Map<String, Object> getUpgradeSyncBodyMethod(String configId, String gwId, Integer upgradeType) {
        Map<String, Object> requestMap = new HashMap<String, Object>();
        List<Map<String, String>> parameterList = new ArrayList<Map<String, String>>();
        requestMap.put("name", "deviceManager");
        requestMap.put("type", "request");
        requestMap.put("txid", DateUtils.getUTC() + "");
        Map parameterMap = new HashMap();
        parameterMap.put("name", "config");
        parameterMap.put("value", configId);
        parameterList.add(parameterMap);
        Map parameterMap1 = new HashMap();
        parameterMap1.put("name", "gwId");
        parameterMap1.put("value", gwId);
        parameterList.add(parameterMap1);
        Map parameterMap2 = new HashMap();
        if (upgradeType == Constant.DEVICE_UPGRADE_TYPE_APP) {
            parameterMap2.put("name", "action");
            parameterMap2.put("value", "update_app");
        } else if (upgradeType == Constant.DEVICE_UPDATE_TYPE_FIRMWARE) {
            parameterMap2.put("name", "action");
            parameterMap2.put("value", "update_fw");
        }else if (upgradeType == Constant.DEVICE_UPDATE_TYPE_VMC) {
            parameterMap2.put("name", "action");
            parameterMap2.put("value", "update_vmc");
        }
        parameterList.add(parameterMap2);
        requestMap.put("params", parameterList);
        return requestMap;
    }

    public static Map<String, Object> getLotterySyncBodyMethod(String configId, String gwId) {
        Map<String, Object> requestMap = new HashMap<String, Object>();
        List<Map<String, String>> parameterList = new ArrayList<Map<String, String>>();
        requestMap.put("name", "lottery_sync");
        requestMap.put("type", "request");
        requestMap.put("txid", DateUtils.getUTC() + "");
        Map parameterMap = new HashMap();
        parameterMap.put("name", "config");
        parameterMap.put("value", configId);
        parameterList.add(parameterMap);
        Map parameterMap1 = new HashMap();
        parameterMap1.put("name", "gwId");
        parameterMap1.put("value", gwId);
        parameterList.add(parameterMap1);
        requestMap.put("params", parameterList);
        return requestMap;
    }
}
