package cn.com.inhand.statistic.service;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.DataDAO;
import org.apache.commons.collections.IteratorUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class DataService extends MongoService implements DataDAO {

    @Override
    @SuppressWarnings("rawtypes")
    public OnlyResultDTO getDeviceHistoryData(ObjectId oId, ObjectId deviceId, ArrayList<String> varIds, int startTime, int endTime) {
        OnlyResultDTO dto = new OnlyResultDTO();
        Criteria criteria = Criteria.where("deviceId").is(deviceId)
		        .and("timestamp").gt(new Date(startTime * 1000))
		        .and("endTime").lte(new Date(endTime * 1000));
       //TODO by dj
        if(varIds!=null&&!varIds.isEmpty()) {
        	criteria.and("id").in(varIds);
        }
        String reduceFunction = "function(doc, prev){prev.values.push([doc.timestamp, doc.endTime, doc.value]);}";
        GroupBy groupBy = GroupBy.key("id").initialDocument("{values: []}").reduceFunction(reduceFunction);
        GroupByResults<Map> group = factory.getMongoTemplateByOId(oId).group(criteria, "data", groupBy, Map.class);
        List list = IteratorUtils.toList(group.iterator());
        dto.setResult(list);
        return dto;
    }

}
