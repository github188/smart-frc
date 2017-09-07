package cn.com.inhand.common.smart.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

/**
 *
 * @author inhand
 */
public class GoodsStatistic {
    @Id
    @JsonProperty("_id")
    private ObjectId id;	              //唯一标识
    private ObjectId oid;	              //机构ID 
    private ObjectId goodsId;
    private String lineId;
    private String lineName;
    private String goodsName;
    private Long amount;                  //总金额
    private Long sum;                     //总笔数 
    private Long statisticTime;
    private Long createTime;
    private Long updateTime;
    private int type;           //1 表示日  2 表示月  3 表示年
    public ObjectId getId() {
        return id;
    }

    public String getLineId() {
        return lineId;
    }

    public void setLineId(String lineId) {
        this.lineId = lineId;
    }

    public String getLineName() {
        return lineName;
    }

    public void setLineName(String lineName) {
        this.lineName = lineName;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getOid() {
        return oid;
    }

    public void setOid(ObjectId oid) {
        this.oid = oid;
    }

    public ObjectId getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(ObjectId goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Long getAmount() {
        return amount;
    }

    public void setAmount(Long amount) {
        this.amount = amount;
    }

    public Long getSum() {
        return sum;
    }

    public void setSum(Long sum) {
        this.sum = sum;
    }

    public Long getStatisticTime() {
        return statisticTime;
    }

    public void setStatisticTime(Long statisticTime) {
        this.statisticTime = statisticTime;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}
