/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.schedule;

import cn.com.inhand.common.smart.model.Ap;
import cn.com.inhand.common.util.DateUtils;
import cn.com.inhand.initialize.dao.ApDAO;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class ApStatusSchedule {
    private static final Logger LOG = LoggerFactory.getLogger(ApStatusSchedule.class);
    @Autowired
    private ApDAO apDAO;

    @Scheduled(cron = "0/10 * * * * ?")
    public void cleanApStatus() {
//        LOG.debug("clean Ap status schedule start ....");
        List<Ap> apList = apDAO.getApList();
        if (apList != null && apList.size() > 0) {
//            LOG.debug("clean Ap status schedule ap size is ["+apList.size()+"]");
            for (Ap ap : apList) {
                if(DateUtils.getUTC() - ap.getLastAliveTime() > 30){
                    ap.setAlive(1);
                    apDAO.updateAp(ap);
                }
            }
        }
    }
}
