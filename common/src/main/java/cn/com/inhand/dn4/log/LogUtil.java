package cn.com.inhand.dn4.log;

import cn.com.inhand.dn4.utils.DateUtils;
import com.rabbitmq.client.Connection;

public class LogUtil {
    //	LogUtil.publishLogInfo(1004001, "Create site %s ok.", CfgUtil.log_routingkey + "." + oid + "."
//	+ LogType.BIZLOG, uid, LogLevel.INFO, username, ip, InitUtil.connection,
//	CfgUtil.log_exchangekey, logParams);
    public static void publishLogInfo(int code, String content, String routingkey, String uid, int level,
                                      String username, String ip, Connection conn, String exchangekey, String[] params) throws Exception {
        HandleLog log = HandleLog.getInstance();
        MessageBean messageBean = new MessageBean();
        messageBean.setUid(uid);
        messageBean.setContent(content);
        messageBean.setCode(code);
        messageBean.setLevel(level);
        messageBean.setUsername(username);
        messageBean.setIp(ip);
        messageBean.setTimestamp(DateUtils.getUTC());
        messageBean.setParams(params);
        log.biz(routingkey, messageBean, conn, exchangekey);
    }
}
