package cn.com.inhand.common.model;

public class MachineConfig {
    private Float alarmTrapInterval;
    private Float alarmTrapTimeout;
    private Integer cmdMode;
    private Integer mbAddress;
    private Integer mbBaud;
    private String mbDataBit;
    private String mbIp;
    private String mbParity;
    private Integer mbPort;
    private String mbStopBit;
    private Float queryInterval;
    private Float sensorRWTimeout;
    private Float statusTrapInterval;
    private Float statusTrapTimeout;
    private Integer usingStatus;
    private Integer workMode;
    private Integer ioId;
    private Float eventInterval;
    private String functionTestInterval;

    private String TNS;
    private String cycleTime;
    private String connectionId;
    private String abPath;
    private String connSerialNum;
    private String requPacketInterval;

    public Float getAlarmTrapInterval() {
        return alarmTrapInterval;
    }

    public void setAlarmTrapInterval(Float alarmTrapInterval) {
        this.alarmTrapInterval = alarmTrapInterval;
    }

    public Float getAlarmTrapTimeout() {
        return alarmTrapTimeout;
    }

    public void setAlarmTrapTimeout(Float alarmTrapTimeout) {
        this.alarmTrapTimeout = alarmTrapTimeout;
    }

    public Integer getCmdMode() {
        return cmdMode;
    }

    public void setCmdMode(Integer cmdMode) {
        this.cmdMode = cmdMode;
    }

    public Integer getMbAddress() {
        return mbAddress;
    }

    public void setMbAddress(Integer mbAddress) {
        this.mbAddress = mbAddress;
    }

    public Integer getMbBaud() {
        return mbBaud;
    }

    public void setMbBaud(Integer mbBaud) {
        this.mbBaud = mbBaud;
    }

    public String getMbDataBit() {
        return mbDataBit;
    }

    public void setMbDataBit(String mbDataBit) {
        this.mbDataBit = mbDataBit;
    }

    public String getMbIp() {
        return mbIp;
    }

    public void setMbIp(String mbIp) {
        this.mbIp = mbIp;
    }

    public String getMbParity() {
        return mbParity;
    }

    public void setMbParity(String mbParity) {
        this.mbParity = mbParity;
    }

    public Integer getMbPort() {
        return mbPort;
    }

    public void setMbPort(Integer mbPort) {
        this.mbPort = mbPort;
    }

    public String getMbStopBit() {
        return mbStopBit;
    }

    public void setMbStopBit(String mbStopBit) {
        this.mbStopBit = mbStopBit;
    }

    public Float getQueryInterval() {
        return queryInterval;
    }

    public void setQueryInterval(Float queryInterval) {
        this.queryInterval = queryInterval;
    }

    public Float getSensorRWTimeout() {
        return sensorRWTimeout;
    }

    public void setSensorRWTimeout(Float sensorRWTimeout) {
        this.sensorRWTimeout = sensorRWTimeout;
    }

    public Float getStatusTrapInterval() {
        return statusTrapInterval;
    }

    public void setStatusTrapInterval(Float statusTrapInterval) {
        this.statusTrapInterval = statusTrapInterval;
    }

    public Float getStatusTrapTimeout() {
        return statusTrapTimeout;
    }

    public void setStatusTrapTimeout(Float statusTrapTimeout) {
        this.statusTrapTimeout = statusTrapTimeout;
    }

    public Integer getUsingStatus() {
        return usingStatus;
    }

    public void setUsingStatus(Integer usingStatus) {
        this.usingStatus = usingStatus;
    }

    public Integer getWorkMode() {
        return workMode;
    }

    public void setWorkMode(Integer workMode) {
        this.workMode = workMode;
    }

    public Integer getIoId() {
        return ioId;
    }

    public void setIoId(Integer ioId) {
        this.ioId = ioId;
    }

    public Float getEventInterval() {
        return eventInterval;
    }

    public void setEventInterval(Float eventInterval) {
        this.eventInterval = eventInterval;
    }

    public String getFunctionTestInterval() {
        return functionTestInterval;
    }

    public void setFunctionTestInterval(String functionTestInterval) {
        this.functionTestInterval = functionTestInterval;
    }

    public String getTNS() {
        return TNS;
    }

    public void setTNS(String TNS) {
        this.TNS = TNS;
    }

    public String getCycleTime() {
        return cycleTime;
    }

    public void setCycleTime(String cycleTime) {
        this.cycleTime = cycleTime;
    }

    public String getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(String connectionId) {
        this.connectionId = connectionId;
    }

    public String getAbPath() {
        return abPath;
    }

    public void setAbPath(String abPath) {
        this.abPath = abPath;
    }

    public String getConnSerialNum() {
        return connSerialNum;
    }

    public void setConnSerialNum(String connSerialNum) {
        this.connSerialNum = connSerialNum;
    }

    public String getRequPacketInterval() {
        return requPacketInterval;
    }

    public void setRequPacketInterval(String requPacketInterval) {
        this.requPacketInterval = requPacketInterval;
    }

    @Override
    public String toString() {
        return "MachineConfig{" +
                "alarmTrapInterval=" + alarmTrapInterval +
                ", alarmTrapTimeout=" + alarmTrapTimeout +
                ", cmdMode=" + cmdMode +
                ", mbAddress=" + mbAddress +
                ", mbBaud=" + mbBaud +
                ", mbDataBit='" + mbDataBit + '\'' +
                ", mbIp='" + mbIp + '\'' +
                ", mbParity='" + mbParity + '\'' +
                ", mbPort=" + mbPort +
                ", mbStopBit='" + mbStopBit + '\'' +
                ", queryInterval=" + queryInterval +
                ", sensorRWTimeout=" + sensorRWTimeout +
                ", statusTrapInterval=" + statusTrapInterval +
                ", statusTrapTimeout=" + statusTrapTimeout +
                ", usingStatus=" + usingStatus +
                ", workMode=" + workMode +
                ", ioId=" + ioId +
                ", eventInterval=" + eventInterval +
                ", functionTestInterval='" + functionTestInterval + '\'' +
                ", TNS='" + TNS + '\'' +
                ", cycleTime='" + cycleTime + '\'' +
                ", connectionId='" + connectionId + '\'' +
                ", abPath='" + abPath + '\'' +
                ", connSerialNum='" + connSerialNum + '\'' +
                ", requPacketInterval='" + requPacketInterval + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MachineConfig that = (MachineConfig) o;

        if (TNS != null ? !TNS.equals(that.TNS) : that.TNS != null) return false;
        if (abPath != null ? !abPath.equals(that.abPath) : that.abPath != null) return false;
        if (alarmTrapInterval != null ? !alarmTrapInterval.equals(that.alarmTrapInterval) : that.alarmTrapInterval != null)
            return false;
        if (alarmTrapTimeout != null ? !alarmTrapTimeout.equals(that.alarmTrapTimeout) : that.alarmTrapTimeout != null)
            return false;
        if (cmdMode != null ? !cmdMode.equals(that.cmdMode) : that.cmdMode != null) return false;
        if (connSerialNum != null ? !connSerialNum.equals(that.connSerialNum) : that.connSerialNum != null)
            return false;
        if (connectionId != null ? !connectionId.equals(that.connectionId) : that.connectionId != null) return false;
        if (cycleTime != null ? !cycleTime.equals(that.cycleTime) : that.cycleTime != null) return false;
        if (eventInterval != null ? !eventInterval.equals(that.eventInterval) : that.eventInterval != null)
            return false;
        if (functionTestInterval != null ? !functionTestInterval.equals(that.functionTestInterval) : that.functionTestInterval != null)
            return false;
        if (ioId != null ? !ioId.equals(that.ioId) : that.ioId != null) return false;
        if (mbAddress != null ? !mbAddress.equals(that.mbAddress) : that.mbAddress != null) return false;
        if (mbBaud != null ? !mbBaud.equals(that.mbBaud) : that.mbBaud != null) return false;
        if (mbDataBit != null ? !mbDataBit.equals(that.mbDataBit) : that.mbDataBit != null) return false;
        if (mbIp != null ? !mbIp.equals(that.mbIp) : that.mbIp != null) return false;
        if (mbParity != null ? !mbParity.equals(that.mbParity) : that.mbParity != null) return false;
        if (mbPort != null ? !mbPort.equals(that.mbPort) : that.mbPort != null) return false;
        if (mbStopBit != null ? !mbStopBit.equals(that.mbStopBit) : that.mbStopBit != null) return false;
        if (queryInterval != null ? !queryInterval.equals(that.queryInterval) : that.queryInterval != null)
            return false;
        if (requPacketInterval != null ? !requPacketInterval.equals(that.requPacketInterval) : that.requPacketInterval != null)
            return false;
        if (sensorRWTimeout != null ? !sensorRWTimeout.equals(that.sensorRWTimeout) : that.sensorRWTimeout != null)
            return false;
        if (statusTrapInterval != null ? !statusTrapInterval.equals(that.statusTrapInterval) : that.statusTrapInterval != null)
            return false;
        if (statusTrapTimeout != null ? !statusTrapTimeout.equals(that.statusTrapTimeout) : that.statusTrapTimeout != null)
            return false;
        if (usingStatus != null ? !usingStatus.equals(that.usingStatus) : that.usingStatus != null) return false;
        if (workMode != null ? !workMode.equals(that.workMode) : that.workMode != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = alarmTrapInterval != null ? alarmTrapInterval.hashCode() : 0;
        result = 31 * result + (alarmTrapTimeout != null ? alarmTrapTimeout.hashCode() : 0);
        result = 31 * result + (cmdMode != null ? cmdMode.hashCode() : 0);
        result = 31 * result + (mbAddress != null ? mbAddress.hashCode() : 0);
        result = 31 * result + (mbBaud != null ? mbBaud.hashCode() : 0);
        result = 31 * result + (mbDataBit != null ? mbDataBit.hashCode() : 0);
        result = 31 * result + (mbIp != null ? mbIp.hashCode() : 0);
        result = 31 * result + (mbParity != null ? mbParity.hashCode() : 0);
        result = 31 * result + (mbPort != null ? mbPort.hashCode() : 0);
        result = 31 * result + (mbStopBit != null ? mbStopBit.hashCode() : 0);
        result = 31 * result + (queryInterval != null ? queryInterval.hashCode() : 0);
        result = 31 * result + (sensorRWTimeout != null ? sensorRWTimeout.hashCode() : 0);
        result = 31 * result + (statusTrapInterval != null ? statusTrapInterval.hashCode() : 0);
        result = 31 * result + (statusTrapTimeout != null ? statusTrapTimeout.hashCode() : 0);
        result = 31 * result + (usingStatus != null ? usingStatus.hashCode() : 0);
        result = 31 * result + (workMode != null ? workMode.hashCode() : 0);
        result = 31 * result + (ioId != null ? ioId.hashCode() : 0);
        result = 31 * result + (eventInterval != null ? eventInterval.hashCode() : 0);
        result = 31 * result + (functionTestInterval != null ? functionTestInterval.hashCode() : 0);
        result = 31 * result + (TNS != null ? TNS.hashCode() : 0);
        result = 31 * result + (cycleTime != null ? cycleTime.hashCode() : 0);
        result = 31 * result + (connectionId != null ? connectionId.hashCode() : 0);
        result = 31 * result + (abPath != null ? abPath.hashCode() : 0);
        result = 31 * result + (connSerialNum != null ? connSerialNum.hashCode() : 0);
        result = 31 * result + (requPacketInterval != null ? requPacketInterval.hashCode() : 0);
        return result;
    }
}
