package cn.com.inhand.common.model;

public class Var {
    /**
     * 变量名称
     */
    private String name;
    private String nativeName;
    private String nativeDesc;
    private String desc;
    private String nativeUnit;

    /**
     * 变量标识
     */
    private String _id;
    /**
     * 变量类型
     */
    private Integer type = 3;
    /**
     * plc存储类型
     */
    private Integer storeType = 1;
    /**
     * 变量值类型
     */
    private Integer vType = 3;
    /**
     * 附加参数名称
     */
    private String paramName;
    private String nativeParamName;
    /**
     * 附加参数值
     */
    private String paramValue;
    /**
     * 精度
     */
    private Integer precision = 2;

    private Integer level = 0;
    private String version = "3.0";


    /**
     * 变量值单位
     */
    private String unit;

    /**
     * 变量的默认值
     */
    private Integer defaultValue = 0;

    /**
     * 采集时间精度
     */
    private Integer timeLevel = 3;

    /**
     * 采样时间间隔
     */
    private Integer sample = Integer.MAX_VALUE;
    /**
     * 变量统计属性
     */
    private Integer statType = -1;


    /**
     * 计算公式
     */
    private String formula;
    /**
     * 存储时间
     */
    private Integer storage = Integer.MAX_VALUE;

    /**
     * 优先级
     */
    private Integer prio = -1;

    /**
     * 告警阈值
     */
    private Limit limit;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNativeName() {
        return nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

    public String getNativeDesc() {
        return nativeDesc;
    }

    public void setNativeDesc(String nativeDesc) {
        this.nativeDesc = nativeDesc;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getNativeUnit() {
        return nativeUnit;
    }

    public void setNativeUnit(String nativeUnit) {
        this.nativeUnit = nativeUnit;
    }

    public String get_id() {
        return _id;
    }

    public void set_id(String _id) {
        this._id = _id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStoreType() {
        return storeType;
    }

    public void setStoreType(Integer storeType) {
        this.storeType = storeType;
    }

    public Integer getvType() {
        return vType;
    }

    public void setvType(Integer vType) {
        this.vType = vType;
    }

    public String getParamName() {
        return paramName;
    }

    public void setParamName(String paramName) {
        this.paramName = paramName;
    }

    public String getNativeParamName() {
        return nativeParamName;
    }

    public void setNativeParamName(String nativeParamName) {
        this.nativeParamName = nativeParamName;
    }

    public String getParamValue() {
        return paramValue;
    }

    public void setParamValue(String paramValue) {
        this.paramValue = paramValue;
    }

    public Integer getPrecision() {
        return precision;
    }

    public void setPrecision(Integer precision) {
        this.precision = precision;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Integer getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(Integer defaultValue) {
        this.defaultValue = defaultValue;
    }

    public Integer getTimeLevel() {
        return timeLevel;
    }

    public void setTimeLevel(Integer timeLevel) {
        this.timeLevel = timeLevel;
    }

    public Integer getSample() {
        return sample;
    }

    public void setSample(Integer sample) {
        this.sample = sample;
    }

    public Integer getStatType() {
        return statType;
    }

    public void setStatType(Integer statType) {
        this.statType = statType;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }

    public Integer getStorage() {
        return storage;
    }

    public void setStorage(Integer storage) {
        this.storage = storage;
    }

    public Integer getPrio() {
        return prio;
    }

    public void setPrio(Integer prio) {
        this.prio = prio;
    }

    public Limit getLimit() {
        return limit;
    }

    public void setLimit(Limit limit) {
        this.limit = limit;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((_id == null) ? 0 : _id.hashCode());
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Var other = (Var) obj;
        if (_id == null) {
            if (other._id != null)
                return false;
        } else if (!_id.equals(other._id))
            return false;
        return true;
    }


}
