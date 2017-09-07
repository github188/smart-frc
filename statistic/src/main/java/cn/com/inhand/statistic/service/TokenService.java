package cn.com.inhand.statistic.service;

import cn.com.inhand.common.model.DeviceKey;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import cn.com.inhand.common.model.Token;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.TokenDAO;

@Service
public class TokenService extends MongoService implements TokenDAO{

	@Override
	public Token getTokenByTokenCode(String accessToken) {
		Query query = Query.query(Criteria.where("token").is(accessToken));
        return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(query, Token.class, Collections.TOKEN);
	}

	@Override
	public DeviceKey getDeviceKeyByToken(String accessToken) {
		Query query = Query.query(Criteria.where("key").is(accessToken));
		return factory.getMongoTemplateByDBName(DBNames.SYSTEM).findOne(query, DeviceKey.class, Collections.DEVICE_KEY);
	}

}
