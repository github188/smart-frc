package cn.com.inhand.common.smart.model;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Automat {

    @Id
    @JsonProperty("_id")
    private ObjectId id;	   //唯一标识
    private ObjectId oid;	   //机构ID
    private String name;
    private String assetId;    //售货机编号
    private Integer online;		   //1为掉线  0为在线
    private Integer deviceStatus;    //设备状态 
    private Long activationTime;   //激活时间
    private String siteId;	   //点位标识
    private String siteName; //点位名称
    private String siteNumber;//点位编号
    private String description;//描述
    private String serialNumber;   //设备 Inbox SN 标识
    private ObjectId gwId;    //设备 Inbox uuid 标识
    
   // private List<ContainerMod> containerMods;   //辅柜机型信息
    private MasterModelConfig modelConfigsNew;   //主柜机型信息
    
    private String cargoRoadId;	 //货道id
    private String cargoRoadName; //货道名称
    private Location location;    //售货机位置信息
    private int userDefine;//1为用户自定义货道信息   0为来源于模板
    
    private Integer masterType; //主柜的售货机类型
    private List<Integer> masterArr; //货道排列
    private List<GoodsConfig> goodsConfigs; //货道配置信息
    private List<ContainerDto> containers;  //售货机的货柜信息
    private List<GoodsConfig> goodsConfigsNew;  //最新的货道配置
    private List<ContainerDto> containersNew;   //最新的货柜信息
    private String area;           //区域信息
    private List<NoticeConfigInfo> noticeConfigList;
    private AutomatStatus status;
    private InboxConfig inboxConfig;  //inbox基本信息，包括固件信息及版本，APP信息及版本，售货机业务信息及版本
    private VendingState vendingState; //售货机相应的状态信息和故障信息
    private AutomatConfig config;  //售货机构基本参数
    private AutomatPlugins plugins; //售货机外接设备参数
    private List coin_capacity;   //售货机钱币满值
    private String lineId;//线路ID
    private String lineName;//线路
    private ObjectId groupId;//所属分组ID
    private List<PayConfig> payConfig;
    private String sessionId;   //AP SessionId
    private Integer sync;   //1 货道配置待同步 0 货道配置已同步
    private Integer onlineType;  //在线类型  1 未认证状态  0  已认证状态
    private Long createTime;   //创建时间
    private Long updateTime;   //更新时间
    private Long lastAlive;    //最后更新的时间
    private String host;
    private Integer regionStatus;   //0 位置偏移具理比较远报警  1 回到了正常范围内的距离 暂时定 跑离为5KM  
    
    private int shelfcount;
    private int containerNum;
    
    private RelLocation rellocation;
    private String alipay_store_id;//支付宝店铺的门店ID
    private Object adFileList;
    private String adFiles;
    private String deleteState;//1 删除状态,实际未从数据库中删除,只是修改了状态 当该售货机产生交易仍需要删除时,将该售货机在列表中隐藏
    private Integer disabled;// 1停用状态   停用状态和删除状态的售货机不参与计费   去掉改字段

    public String getSiteNumber() {
        return siteNumber;
    }

    public void setSiteNumber(String siteNumber) {
        this.siteNumber = siteNumber;
    }

    
    public List<Integer> getMasterArr() {
        return masterArr;
    }

    public void setMasterArr(List<Integer> masterArr) {
        this.masterArr = masterArr;
    }

    
    
    public Integer getDisabled() {
        return disabled;
    }

    public void setDisabled(Integer disabled) {
        this.disabled = disabled;
    }

    
    
    
    public String getDeleteState() {
        return deleteState;
    }

    public void setDeleteState(String deleteState) {
        this.deleteState = deleteState;
    }

    
    
    public String getAlipay_store_id() {
        return alipay_store_id;
    }

    public void setAlipay_store_id(String alipay_store_id) {
        this.alipay_store_id = alipay_store_id;
    }

    public RelLocation getRellocation() {
        return rellocation;
    }

    public void setRellocation(RelLocation rellocation) {
        this.rellocation = rellocation;
    }
    
    
    public MasterModelConfig getModelConfigsNew() {
        return modelConfigsNew;
    }

    public void setModelConfigsNew(MasterModelConfig modelConfigsNew) {
        this.modelConfigsNew = modelConfigsNew;
    }
    
    
    public int getShelfcount() {
        return shelfcount;
    }

    public void setShelfcount(int shelfcount) {
        this.shelfcount = shelfcount;
    }

    public int getContainerNum() {
        return containerNum;
    }

    public void setContainerNum(int containerNum) {
        this.containerNum = containerNum;
    }
    
    
    public ObjectId getGroupId() {
        return groupId;
    }

    public void setGroupId(ObjectId groupId) {
        this.groupId = groupId;
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

    public ObjectId getId() {
        return id;
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

    public Long getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(Long activationTime) {
        this.activationTime = activationTime;
    }

    public String getSiteId() {
        return siteId;
    }

    public void setSiteId(String siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public ObjectId getGwId() {
        return gwId;
    }

    public void setGwId(ObjectId gwId) {
        this.gwId = gwId;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }


    public String getCargoRoadId() {
        return cargoRoadId;
    }

    public void setCargoRoadId(String cargoRoadId) {
        this.cargoRoadId = cargoRoadId;
    }

    public String getCargoRoadName() {
        return cargoRoadName;
    }

    public void setCargoRoadName(String cargoRoadName) {
        this.cargoRoadName = cargoRoadName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<GoodsConfig> getGoodsConfigs() {
        return goodsConfigs;
    }

    public void setGoodsConfigs(List<GoodsConfig> goodsConfigs) {
        this.goodsConfigs = goodsConfigs;
    }

    public int getUserDefine() {
        return userDefine;
    }

    public void setUserDefine(int userDefine) {
        this.userDefine = userDefine;
    }

    public String getAssetId() {
        return assetId;
    }

    public void setAssetId(String assetId) {
        this.assetId = assetId;
    }

    public Long getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Long updateTime) {
        this.updateTime = updateTime;
    }

    public Long getLastAlive() {
        return lastAlive;
    }

    public void setLastAlive(Long lastAlive) {
        this.lastAlive = lastAlive;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public AutomatConfig getConfig() {
        return config;
    }

    public void setConfig(AutomatConfig config) {
        this.config = config;
    }

    public AutomatPlugins getPlugins() {
        return plugins;
    }

    public void setPlugins(AutomatPlugins plugins) {
        this.plugins = plugins;
    }

    public List getCoin_capacity() {
        return coin_capacity;
    }

    public void setCoin_capacity(List coin_capacity) {
        this.coin_capacity = coin_capacity;
    }

    public List<ContainerDto> getContainers() {
        return containers;
    }

    public void setContainers(List<ContainerDto> containers) {
        this.containers = containers;
    }

    public List<PayConfig> getPayConfig() {
        return payConfig;
    }

    public void setPayConfig(List<PayConfig> payConfig) {
        this.payConfig = payConfig;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<GoodsConfig> getGoodsConfigsNew() {
        return goodsConfigsNew;
    }

    public void setGoodsConfigsNew(List<GoodsConfig> goodsConfigsNew) {
        this.goodsConfigsNew = goodsConfigsNew;
    }

    public List<ContainerDto> getContainersNew() {
        return containersNew;
    }

    public void setContainersNew(List<ContainerDto> containersNew) {
        this.containersNew = containersNew;
    }

    public Integer getSync() {
        return sync;
    }

    public void setSync(Integer sync) {
        this.sync = sync;
    }

    public Integer getOnlineType() {
        return onlineType;
    }

    public void setOnlineType(Integer onlineType) {
        this.onlineType = onlineType;
    }

    public List<NoticeConfigInfo> getNoticeConfigList() {
        return noticeConfigList;
    }

    public void setNoticeConfigList(List<NoticeConfigInfo> noticeConfigList) {
        this.noticeConfigList = noticeConfigList;
    }

    public AutomatStatus getStatus() {
        return status;
    }

    public void setStatus(AutomatStatus status) {
        this.status = status;
    }

    public InboxConfig getInboxConfig() {
        return inboxConfig;
    }

    public void setInboxConfig(InboxConfig inboxConfig) {
        this.inboxConfig = inboxConfig;
    }

    public VendingState getVendingState() {
        return vendingState;
    }

    public void setVendingState(VendingState vendingState) {
        this.vendingState = vendingState;
    }

    public Integer getMasterType() {
        return masterType;
    }

    public void setMasterType(Integer masterType) {
        this.masterType = masterType;
    }

    public Integer getOnline() {
        return online;
    }

    public void setOnline(Integer online) {
        this.online = online;
    }

    public Integer getDeviceStatus() {
        return deviceStatus;
    }

    public void setDeviceStatus(Integer deviceStatus) {
        this.deviceStatus = deviceStatus;
    }

    public String getHost() {
        return host;
    }

    public void setHost(String host) {
        this.host = host;
    }

    public Object getAdFileList() {
        return adFileList;
    }

    public void setAdFileList(Object adFileList) {
        this.adFileList = adFileList;
    }

    public String getAdFiles() {
        return adFiles;
    }

    public void setAdFiles(String adFiles) {
        this.adFiles = adFiles;
    }

    public Integer getRegionStatus() {
        return regionStatus;
    }

    public void setRegionStatus(Integer regionStatus) {
        this.regionStatus = regionStatus;
    }
    
    
}
