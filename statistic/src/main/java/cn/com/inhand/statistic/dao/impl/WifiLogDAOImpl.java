package cn.com.inhand.statistic.dao.impl;

import cn.com.inhand.common.service.DBNames;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.WifiLogDAO;
import com.mongodb.gridfs.GridFSDBFile;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

import static org.springframework.data.mongodb.core.query.Criteria.where;
import static org.springframework.data.mongodb.core.query.Query.query;

/**
 * Created by Jerolin on 6/12/2014.
 */
@Service
public class WifiLogDAOImpl extends MongoService implements WifiLogDAO {
	@Override
	public GridFSDBFile getWifiLog(ObjectId oId, ObjectId deviceId, Date startTime, Date endTime, int skip) {
		GridFsTemplate template = factory.getGridFsTemplateByDBName(DBNames.WIFI_LOG);
		Query query = query(where("metadata.oId").is(oId)
						.and("metadata.deviceId").is(deviceId)
						.orOperator(where("metadata.startTime").gte(startTime).lte(endTime),
								where("metadata.endTime").gte(startTime).lte(endTime),
								where("metadata.startTime").lte(startTime).and("metadata.endTime").gte(endTime))
		);
		query.with(new Sort(new Sort.Order(Sort.Direction.ASC, "metadata.startTime")));
		List<GridFSDBFile> files = template.find(query);
		if (files.size() > 0 && skip < files.size()) {
			return files.get(skip);
		}
		return null;
	}

	@Override
	public long getWifiLogCount(ObjectId oId, ObjectId deviceId, Date startTime, Date endTime) {
		MongoTemplate template = factory.getMongoTemplateByDBName(DBNames.WIFI_LOG);
		Query query = query(where("metadata.oId").is(oId)
						.and("metadata.deviceId").is(deviceId)
						.orOperator(where("metadata.startTime").gte(startTime).lte(endTime),
								where("metadata.endTime").gte(startTime).lte(endTime),
								where("metadata.startTime").lte(startTime).and("metadata.endTime").gte(endTime))
		);
		return template.count(query, "fs.files");
	}
}
