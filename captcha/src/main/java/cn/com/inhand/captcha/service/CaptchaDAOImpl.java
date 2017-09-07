package cn.com.inhand.captcha.service;

import cn.com.inhand.captcha.dao.CaptchaDAO;
import cn.com.inhand.captcha.model.Captcha;
import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

/**
 * User: Jerolin
 * Date: 13-10-11
 */
@Service
public class CaptchaDAOImpl extends MongoService implements CaptchaDAO {
    private String collectionName = Collections.CAPTCHA;

    @Override
    public void insertCaptcha(Captcha captcha) {
        factory.getMongoTemplateByDBName(DBNames.CAPTCHA).insert(captcha, collectionName);
    }

    @Override
    public Captcha getCaptchaById(ObjectId id) {
        return factory.getMongoTemplateByDBName(DBNames.CAPTCHA).findById(id, Captcha.class, collectionName);
    }

    @Override
    public Captcha getCaptchaByPictureId(String pictureId) {
        Query query = Query.query(Criteria.where("pictureId").is(pictureId));
        return factory.getMongoTemplateByDBName(DBNames.CAPTCHA).findOne(query, Captcha.class, collectionName);
    }

    @Override
    public void removeCaptchaById(ObjectId id) {
        Query query = Query.query(Criteria.where("_id").is(id));
        factory.getMongoTemplateByDBName(DBNames.CAPTCHA).remove(query, collectionName);
    }

    @Override
    public void removeCaptchasByStartTime(long startTime) {
        Query query = Query.query(Criteria.where("createTime").lte(startTime));
        factory.getMongoTemplateByDBName(DBNames.CAPTCHA).remove(query, collectionName);
    }
}
