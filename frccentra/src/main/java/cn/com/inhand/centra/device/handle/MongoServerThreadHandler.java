/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.centra.device.handle;

import cn.com.inhand.common.service.Collections;
import cn.com.inhand.common.smart.model.Automat;
import cn.com.inhand.common.smart.model.SmartInbox;
import cn.com.inhand.common.util.UpdateUtils;
import com.mongodb.WriteResult;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bson.types.ObjectId;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class MongoServerThreadHandler {
    
    private final static org.slf4j.Logger logger = LoggerFactory.getLogger(MongoServerThreadHandler.class);
    
    public void executorAutomatMongoServerThread(final MongoTemplate mongoTemplate, ObjectId oid, final Automat automat) {
        ThreadPoolExecutor exec = new ThreadPoolExecutor(2, 10, 3, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(10), new ThreadPoolExecutor.CallerRunsPolicy());
        exec.execute(new Runnable() {
            @Override
            public void run() {
                int count = 0;
                Query query = new Query();
                query.addCriteria(Criteria.where("_id").is(automat.getId()));
                WriteResult result = mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(automat, "_id"), Collections.SMART_AUTOMAT);
                logger.debug("Mongo Server Thread update automat result is "+result.getN());
                while(result.getN() == 0 && count < 100){
                    result = mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(automat, "_id"), Collections.SMART_AUTOMAT);
                    logger.debug("Mongo Server Thread update automat result is "+result);
                    count ++;
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MongoServerThreadHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    if(result.getN() == 0){
                        logger.debug("Mongo Server Thread update "+automat.getAssetId() +" automat result is "+result.getN());
                    }
                }
            }
        });
    }
    
    
    public void executorInboxMongoServerThread(final MongoTemplate mongoTemplate, ObjectId oid, final SmartInbox inbox) {
        ThreadPoolExecutor exec = new ThreadPoolExecutor(2, 10, 3, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(10), new ThreadPoolExecutor.CallerRunsPolicy());
        exec.execute(new Runnable() {
            @Override
            public void run() {
                int count = 0;
                Query query = new Query();
                query.addCriteria(Criteria.where("_id").is(inbox.getId()));
                WriteResult result = mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(inbox, "_id"), Collections.SMART_INBOX);
                logger.debug("Mongo Server Thread update Inbox result is "+result.getN());
                while(result.getN() == 0 && count < 100){
                    result = mongoTemplate.updateFirst(query, UpdateUtils.convertBeanToUpdate(inbox, "_id"), Collections.SMART_INBOX);
                    logger.debug("Mongo Server Thread update automat Inbox is "+result);
                    count ++;
                    try {
                        Thread.sleep(300);
                    } catch (InterruptedException ex) {
                        Logger.getLogger(MongoServerThreadHandler.class.getName()).log(Level.SEVERE, null, ex);
                    }
                    if(result.getN() == 0){
                        logger.debug("Mongo Server Thread update "+inbox.getName() +" automat result is "+result.getN());
                    }
                }
            }
        });
    }
}
