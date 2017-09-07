package cn.com.inhand.statistic.dao;

import cn.com.inhand.statistic.dto.WifiStatDTO;
import cn.com.inhand.statistic.model.WifiStat;
import org.bson.types.ObjectId;

import java.util.Date;
import java.util.List;

/**
 * Created by Jerolin on 7/13/2014.
 */
public interface WifiStatDAO {
	void incCounter(ObjectId oId, ObjectId objectId, int type, Date date, long value);

	void updateValue(ObjectId oId, ObjectId objectId, int type, Date date, long value);

	List<WifiStat> getValue(ObjectId oId, Date start, Date end, ObjectId objectId, Integer... types);

	List<WifiStatDTO> getValueAsArray(ObjectId oId, Date start, Date end, ObjectId objectId, Integer... types);

	void incCounter(ObjectId oId, int type, Date date, long value);

	void updateValue(ObjectId oId, int type, Date date, long value);

	List<WifiStat> getValue(ObjectId oId, Date start, Date end, Integer... types);

	List<WifiStatDTO> getValueAsArray(ObjectId oId, Date start, Date end, Integer... types);
}
