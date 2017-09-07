package cn.com.inhand.centra.device.factory;

import org.bson.types.ObjectId;
import org.springframework.stereotype.Component;

import cn.com.inhand.common.model.Client;
import cn.com.inhand.common.oauth2.ClientType;
import cn.com.inhand.common.oauth2.ReliableType;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.common.util.PrivilegesUtils;
import cn.com.inhand.dn4.utils.CryptUtils;

@Component
public class ClientFactory {

    private static final long AGEING = 1000 * 60 * 60 * 24 * 365 * 100; //100年

    public Client getDataGatheringClient(ObjectId oId) {
        Client client = new Client();
        client.setAgeing(AGEING);
        long time = DateUtils.getUTC();
        client.setAppKey(CryptUtils.MD5(String.valueOf(time)));
        client.setApprovedTime(time);
        client.setAuthor("system");
        client.setDescription("This client can be used to report data");
        client.setType(ClientType.DATA.getName());
        client.setName("endpoint");
        client.setOid(oId);
        client.setReliable(ReliableType.PRIVATE.getName());
        client.setState(1);
        client.setPrivileges(PrivilegesUtils.getDataGatheringPrivilege());
        return client;
    }
}
