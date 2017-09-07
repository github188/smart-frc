package cn.com.inhand.common.model;

public class DeviceConfig {
    private int heartbeatTimeout;
    private int resendLogin;
    private int maxHeartbeatLost;
    private int heartbeatInterval;
    private float alarmTrapInterval;
    private float alarmTrapTimeout;
    private float statusTrapInterval;
    private float statusTrapTimeout;
    private float eventInterval;

    private String TNS;
    private String cycleTime;
    private String connectionId;
    private String abPath;
    private String connSerialNum;
    private String requPacketInterval;

    private int workMode;
    private int cmdMode;
    private float queryInterval;
    private float sensorRWTimeout;
    private int usingStatus;
    private String mbParity;
    private String mbStopBit;
    private String mbDataBit;
    private int mbBaud;
    private int mbAddress;
    private int mbPort;
    private String mbIp;
    private int ioId;
    private String functionTestInterval;

    public String getFunctionTestInterval() {
        return functionTestInterval;
    }

    public void setFunctionTestInterval(String functionTestInterval) {
        this.functionTestInterval = functionTestInterval;
    }

    public int getIoId() {
        return ioId;
    }

    public void setIoId(int ioId) {
        this.ioId = ioId;
    }

    public int getHeartbeatTimeout() {
        return heartbeatTimeout;
    }

    public void setHeartbeatTimeout(int heartbeatTimeout) {
        this.heartbeatTimeout = heartbeatTimeout;
    }

    public int getResendLogin() {
        return resendLogin;
    }

    public void setResendLogin(int resendLogin) {
        this.resendLogin = resendLogin;
    }

    public int getMaxHeartbeatLost() {
        return maxHeartbeatLost;
    }

    public void setMaxHeartbeatLost(int maxHeartbeatLost) {
        this.maxHeartbeatLost = maxHeartbeatLost;
    }

    public int getHeartbeatInterval() {
        return heartbeatInterval;
    }

    public void setHeartbeatInterval(int heartbeatInterval) {
        this.heartbeatInterval = heartbeatInterval;
    }

    public float getAlarmTrapInterval() {
        return alarmTrapInterval;
    }

    public void setAlarmTrapInterval(float alarmTrapInterval) {
        this.alarmTrapInterval = alarmTrapInterval;
    }

    public float getAlarmTrapTimeout() {
        return alarmTrapTimeout;
    }

    public void setAlarmTrapTimeout(float alarmTrapTimeout) {
        this.alarmTrapTimeout = alarmTrapTimeout;
    }

    public float getStatusTrapInterval() {
        return statusTrapInterval;
    }

    public void setStatusTrapInterval(float statusTrapInterval) {
        this.statusTrapInterval = statusTrapInterval;
    }

    public float getStatusTrapTimeout() {
        return statusTrapTimeout;
    }

    public void setStatusTrapTimeout(float statusTrapTimeout) {
        this.statusTrapTimeout = statusTrapTimeout;
    }

    public float getEventInterval() {
        return eventInterval;
    }

    public void setEventInterval(float eventInterval) {
        this.eventInterval = eventInterval;
    }

    public String getTNS() {
        return TNS;
    }

    public void setTNS(String tNS) {
        TNS = tNS;
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

    public int getWorkMode() {
        return workMode;
    }

    public void setWorkMode(int workMode) {
        this.workMode = workMode;
    }

    public int getCmdMode() {
        return cmdMode;
    }

    public void setCmdMode(int cmdMode) {
        this.cmdMode = cmdMode;
    }

    public float getQueryInterval() {
        return queryInterval;
    }

    public void setQueryInterval(float queryInterval) {
        this.queryInterval = queryInterval;
    }

    public float getSensorRWTimeout() {
        return sensorRWTimeout;
    }

    public void setSensorRWTimeout(float sensorRWTimeout) {
        this.sensorRWTimeout = sensorRWTimeout;
    }

    public int getUsingStatus() {
        return usingStatus;
    }

    public void setUsingStatus(int usingStatus) {
        this.usingStatus = usingStatus;
    }

    public String getMbParity() {
        return mbParity;
    }

    public void setMbParity(String mbParity) {
        this.mbParity = mbParity;
    }

    public String getMbStopBit() {
        return mbStopBit;
    }

    public void setMbStopBit(String mbStopBit) {
        this.mbStopBit = mbStopBit;
    }

    public String getMbDataBit() {
        return mbDataBit;
    }

    public void setMbDataBit(String mbDataBit) {
        this.mbDataBit = mbDataBit;
    }

    public int getMbBaud() {
        return mbBaud;
    }

    public void setMbBaud(int mbBaud) {
        this.mbBaud = mbBaud;
    }

    public int getMbAddress() {
        return mbAddress;
    }

    public void setMbAddress(int mbAddress) {
        this.mbAddress = mbAddress;
    }

    public int getMbPort() {
        return mbPort;
    }

    public void setMbPort(int mbPort) {
        this.mbPort = mbPort;
    }

    public String getMbIp() {
        return mbIp;
    }

    public void setMbIp(String mbIp) {
        this.mbIp = mbIp;
    }

    /*
     * (non-Javadoc)
     *
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((TNS == null) ? 0 : TNS.hashCode());
        result = prime * result + ((abPath == null) ? 0 : abPath.hashCode());
        result = prime * result + Float.floatToIntBits(alarmTrapInterval);
        result = prime * result + Float.floatToIntBits(alarmTrapTimeout);
        result = prime * result + cmdMode;
        result = prime * result + ((connSerialNum == null) ? 0 : connSerialNum.hashCode());
        result = prime * result + ((connectionId == null) ? 0 : connectionId.hashCode());
        result = prime * result + ((cycleTime == null) ? 0 : cycleTime.hashCode());
        result = prime * result + Float.floatToIntBits(eventInterval);
        result = prime * result + ((functionTestInterval == null) ? 0 : functionTestInterval.hashCode());
        result = prime * result + heartbeatInterval;
        result = prime * result + heartbeatTimeout;
        result = prime * result + ioId;
        result = prime * result + maxHeartbeatLost;
        result = prime * result + mbAddress;
        result = prime * result + mbBaud;
        result = prime * result + ((mbDataBit == null) ? 0 : mbDataBit.hashCode());
        result = prime * result + ((mbIp == null) ? 0 : mbIp.hashCode());
        result = prime * result + ((mbParity == null) ? 0 : mbParity.hashCode());
        result = prime * result + mbPort;
        result = prime * result + ((mbStopBit == null) ? 0 : mbStopBit.hashCode());
        result = prime * result + Float.floatToIntBits(queryInterval);
        result = prime * result + ((requPacketInterval == null) ? 0 : requPacketInterval.hashCode());
        result = prime * result + resendLogin;
        result = prime * result + Float.floatToIntBits(sensorRWTimeout);
        result = prime * result + Float.floatToIntBits(statusTrapInterval);
        result = prime * result + Float.floatToIntBits(statusTrapTimeout);
        result = prime * result + usingStatus;
        result = prime * result + workMode;
        return result;
    }

    /*
     * (non-Javadoc)
     *
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        DeviceConfig other = (DeviceConfig) obj;
        if (TNS == null) {
            if (other.TNS != null) {
                return false;
            }
        } else if (!TNS.equals(other.TNS)) {
            return false;
        }
        if (abPath == null) {
            if (other.abPath != null) {
                return false;
            }
        } else if (!abPath.equals(other.abPath)) {
            return false;
        }
        if (Float.floatToIntBits(alarmTrapInterval) != Float.floatToIntBits(other.alarmTrapInterval)) {
            return false;
        }
        if (Float.floatToIntBits(alarmTrapTimeout) != Float.floatToIntBits(other.alarmTrapTimeout)) {
            return false;
        }
        if (cmdMode != other.cmdMode) {
            return false;
        }
        if (connSerialNum == null) {
            if (other.connSerialNum != null) {
                return false;
            }
        } else if (!connSerialNum.equals(other.connSerialNum)) {
            return false;
        }
        if (connectionId == null) {
            if (other.connectionId != null) {
                return false;
            }
        } else if (!connectionId.equals(other.connectionId)) {
            return false;
        }
        if (cycleTime == null) {
            if (other.cycleTime != null) {
                return false;
            }
        } else if (!cycleTime.equals(other.cycleTime)) {
            return false;
        }
        if (Float.floatToIntBits(eventInterval) != Float.floatToIntBits(other.eventInterval)) {
            return false;
        }
        if (functionTestInterval == null) {
            if (other.functionTestInterval != null) {
                return false;
            }
        } else if (!functionTestInterval.equals(other.functionTestInterval)) {
            return false;
        }
        if (heartbeatInterval != other.heartbeatInterval) {
            return false;
        }
        if (heartbeatTimeout != other.heartbeatTimeout) {
            return false;
        }
        if (ioId != other.ioId) {
            return false;
        }
        if (maxHeartbeatLost != other.maxHeartbeatLost) {
            return false;
        }
        if (mbAddress != other.mbAddress) {
            return false;
        }
        if (mbBaud != other.mbBaud) {
            return false;
        }
        if (mbDataBit == null) {
            if (other.mbDataBit != null) {
                return false;
            }
        } else if (!mbDataBit.equals(other.mbDataBit)) {
            return false;
        }
        if (mbIp == null) {
            if (other.mbIp != null) {
                return false;
            }
        } else if (!mbIp.equals(other.mbIp)) {
            return false;
        }
        if (mbParity == null) {
            if (other.mbParity != null) {
                return false;
            }
        } else if (!mbParity.equals(other.mbParity)) {
            return false;
        }
        if (mbPort != other.mbPort) {
            return false;
        }
        if (mbStopBit == null) {
            if (other.mbStopBit != null) {
                return false;
            }
        } else if (!mbStopBit.equals(other.mbStopBit)) {
            return false;
        }
        if (Float.floatToIntBits(queryInterval) != Float.floatToIntBits(other.queryInterval)) {
            return false;
        }
        if (requPacketInterval == null) {
            if (other.requPacketInterval != null) {
                return false;
            }
        } else if (!requPacketInterval.equals(other.requPacketInterval)) {
            return false;
        }
        if (resendLogin != other.resendLogin) {
            return false;
        }
        if (Float.floatToIntBits(sensorRWTimeout) != Float.floatToIntBits(other.sensorRWTimeout)) {
            return false;
        }
        if (Float.floatToIntBits(statusTrapInterval) != Float.floatToIntBits(other.statusTrapInterval)) {
            return false;
        }
        if (Float.floatToIntBits(statusTrapTimeout) != Float.floatToIntBits(other.statusTrapTimeout)) {
            return false;
        }
        if (usingStatus != other.usingStatus) {
            return false;
        }
        if (workMode != other.workMode) {
            return false;
        }
        return true;
    }

}
