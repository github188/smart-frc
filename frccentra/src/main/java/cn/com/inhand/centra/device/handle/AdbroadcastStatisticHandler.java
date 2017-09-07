package cn.com.inhand.centra.device.handle;

import java.util.Iterator;
import java.util.List;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cn.com.inhand.centra.device.amqp.SendAdBroadcastMessageSender;
import cn.com.inhand.common.smart.model.AdBroadcastMessageBean;
import cn.com.inhand.common.smart.model.AdRecord;

/**
 * 广告播放统计记录处理
 * @author puys
 *
 */
@Component
public class AdbroadcastStatisticHandler {

	private final static Logger LOGGER = LoggerFactory.getLogger(AdbroadcastStatisticHandler.class);
	
	@Autowired
	private SendAdBroadcastMessageSender sender;
	
	/**
	 * 
	 * @param oid 机构id
	 * @param adRecords 播放记录
	 */
	public void sendStatstic(ObjectId oid, List<AdRecord> adRecords){
		LOGGER.info("ad broadcast statistic, the oid is {}" + oid);
		//处理播放记录，只需要结束标志的记录
		Iterator<AdRecord> it = adRecords.iterator();
		while(it.hasNext()){
			AdRecord record = it.next();
			//开始标志
			if (record.getAction() == 1) {
				it.remove();
			}
		}
		LOGGER.info("the records with end flag size is " + adRecords.size());
		if (!adRecords.isEmpty()) {
			AdBroadcastMessageBean bean = new AdBroadcastMessageBean();
			bean.setAdRecords(adRecords);
			bean.setOid(oid);
			bean.setAssetId(adRecords.get(0).getAssetId());
			sender.publishMessageSender(bean);
		}
	}
	
}
