/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.devicenetworks.ap.timer;
import cn.com.inhand.common.smart.model.ApStatus;
import cn.com.inhand.devicenetworks.ap.mq.rabbitmq.ApStatusMessageProducer;
import cn.com.inhand.devicenetworks.ap.websocket.Config;
import cn.com.inhand.devicenetworks.ap.websocket.WSDNSession;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.scheduling.annotation.Scheduled;
/**
 *
 * @author inhand
 */
//@Component
public class MonitorTask {
    
    private ApStatusMessageProducer apStatusProducer;
    private ObjectMapper mapper;

    public ApStatusMessageProducer getApStatusProducer() {
        return apStatusProducer;
    }

    public void setApStatusProducer(ApStatusMessageProducer apStatusProducer) {
        this.apStatusProducer = apStatusProducer;
    }

    public ObjectMapper getMapper() {
        return mapper;
    }

    public void setMapper(ObjectMapper mapper) {
        this.mapper = mapper;
    }
    
    
    private final static Logger logger = Logger.getLogger("WSDANAccessPoint[v1.1.0]");
    @Scheduled(cron="0 */5 * * * *")
    public void pollSession(){
        
        Iterator<String> it = Config.info.getWsdnsn_map().keySet().iterator();
        //System.out.println("Current total session: "+Config.info.getWsdnsn_map().size()+" and total websocket: "+Config.info.getWssn_map().size());
        //logger.info("Current total session: "+Config.info.getWsdnsn_map().size()+" and total websocket: "+Config.info.getWssn_map().size());
        while(it.hasNext()){
            String key=it.next();
            WSDNSession session = Config.info.getWsdnsn(key);
            if (session.getSession()==null 
                    || !session.getSession().isOpen()
                    || !session.getSession().toString().equalsIgnoreCase(key)){
                Config.info.getWsdnsn_map().remove(key);
                logger.info("Current total session["+session.getGwId()+"] is not active, try to release it!");
                if (!session.getSession().toString().equalsIgnoreCase(key)){
                    try{
                        
                    }catch(Exception e){

                    }
                }
            }
            
        }
    }
    
    @Scheduled(cron="*/3 * * * * *")
    public void postConnStatus(){
        try {
            ApStatus status = new ApStatus();
            status.setAction("conns");
            status.setKey(Config.key);
            status.setConns(Config.info.getWssn_map().size());
            this.apStatusProducer.sendMessage(mapper.writeValueAsString(status));
        } catch (JsonProcessingException ex) {
            Logger.getLogger(MonitorTask.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
    
}
