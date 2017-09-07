package cn.com.inhand.statistic.dao;

import cn.com.inhand.common.model.DeviceKey;
import cn.com.inhand.common.model.Token;

public interface TokenDAO {
	public Token getTokenByTokenCode(String accessToken);
	public DeviceKey getDeviceKeyByToken(String accessToken);
}
