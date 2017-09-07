package cn.com.inhand.statistic.service;

import cn.com.inhand.common.dto.OnlyResultDTO;
import cn.com.inhand.common.service.MongoService;
import cn.com.inhand.statistic.dao.SignalDAO;
import cn.com.inhand.statistic.model.DeviceSignalBean;
import org.apache.commons.collections.IteratorUtils;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapreduce.GroupBy;
import org.springframework.data.mongodb.core.mapreduce.GroupByResults;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SignalService extends MongoService implements SignalDAO {

    @SuppressWarnings("unchecked")
    @Override
    public OnlyResultDTO getDevicesSignalStatistic(ObjectId oId, List<ObjectId> deviceIds, int startTime, int endTime) {
        List<DeviceSignalBean> list;
        String reduceFunction = "function(doc, prev){" + "	prev.signal.push([doc.timestamp, doc.value]);" + "}";
        String inputCollectionName = "signal";
        Criteria criteria = Criteria.where("timestamp").gte(startTime).lte(endTime).and("deviceId").in(deviceIds);
        GroupBy groupBy = GroupBy.key("deviceId").initialDocument("{signal: []}").reduceFunction(reduceFunction);
        GroupByResults<DeviceSignalBean> group = factory.getMongoTemplateByOId(oId).group(criteria, inputCollectionName, groupBy, DeviceSignalBean.class);
        list = IteratorUtils.toList(group.iterator());
        OnlyResultDTO dto = new OnlyResultDTO();
        dto.setResult(list);
        return dto;
    }
}
