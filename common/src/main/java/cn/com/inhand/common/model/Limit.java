package cn.com.inhand.common.model;

public class Limit {
    /**
     * 告警值
     */
    private Integer value;

    /**
     * 告警上限
     */
    private Boolean maxAlert;
    private Boolean minAlert;
    private Float maxValue;
    private Float minValue;
    private Boolean maxEqual;
    private Boolean minEqual;

    private String alarmDesc;
    private String nativeAlarmDesc;

    private Integer alarmType;//5
    private Integer alarmLvl;//0

    public Integer getValue() {
        return value;
    }

    public void setValue(Integer value) {
        this.value = value;
    }

    public Boolean getMaxAlert() {
        return maxAlert;
    }

    public void setMaxAlert(Boolean maxAlert) {
        this.maxAlert = maxAlert;
    }

    public Boolean getMinAlert() {
        return minAlert;
    }

    public void setMinAlert(Boolean minAlert) {
        this.minAlert = minAlert;
    }

    public Float getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(Float maxValue) {
        this.maxValue = maxValue;
    }

    public Float getMinValue() {
        return minValue;
    }

    public void setMinValue(Float minValue) {
        this.minValue = minValue;
    }

    public Boolean getMaxEqual() {
        return maxEqual;
    }

    public void setMaxEqual(Boolean maxEqual) {
        this.maxEqual = maxEqual;
    }

    public Boolean getMinEqual() {
        return minEqual;
    }

    public void setMinEqual(Boolean minEqual) {
        this.minEqual = minEqual;
    }

    public String getAlarmDesc() {
        return alarmDesc;
    }

    public void setAlarmDesc(String alarmDesc) {
        this.alarmDesc = alarmDesc;
    }

    public String getNativeAlarmDesc() {
        return nativeAlarmDesc;
    }

    public void setNativeAlarmDesc(String nativeAlarmDesc) {
        this.nativeAlarmDesc = nativeAlarmDesc;
    }

    public Integer getAlarmType() {
        return alarmType;
    }

    public void setAlarmType(Integer alarmType) {
        this.alarmType = alarmType;
    }

    public Integer getAlarmLvl() {
        return alarmLvl;
    }

    public void setAlarmLvl(Integer alarmLvl) {
        this.alarmLvl = alarmLvl;
    }

    @Override
    public String toString() {
        return "Limit{" +
                "value=" + value +
                ", maxAlert=" + maxAlert +
                ", minAlert=" + minAlert +
                ", maxValue=" + maxValue +
                ", minValue=" + minValue +
                ", maxEqual=" + maxEqual +
                ", minEqual=" + minEqual +
                ", alarmDesc='" + alarmDesc + '\'' +
                ", nativeAlarmDesc='" + nativeAlarmDesc + '\'' +
                ", alarmType=" + alarmType +
                ", alarmLvl=" + alarmLvl +
                '}';
    }
}
