package cn.com.inhand.common.model;

public class Config {
    private Integer sync;

    private Integer timeout;

    private Integer ackTimeout;

    private Integer ackRetries;

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
        Config other = (Config) obj;
        if (ackRetries == null) {
            if (other.ackRetries != null) {
                return false;
            }
        } else if (!ackRetries.equals(other.ackRetries)) {
            return false;
        }
        if (ackTimeout == null) {
            if (other.ackTimeout != null) {
                return false;
            }
        } else if (!ackTimeout.equals(other.ackTimeout)) {
            return false;
        }
        if (sync == null) {
            if (other.sync != null) {
                return false;
            }
        } else if (!sync.equals(other.sync)) {
            return false;
        }
        if (timeout == null) {
            if (other.timeout != null) {
                return false;
            }
        } else if (!timeout.equals(other.timeout)) {
            return false;
        }
        return true;
    }

    public Integer getAckRetries() {
        return ackRetries;
    }

    public Integer getAckTimeout() {
        return ackTimeout;
    }

    public Integer getSync() {
        return sync;
    }

    public Integer getTimeout() {
        return timeout;
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
        result = prime * result + ((ackRetries == null) ? 0 : ackRetries.hashCode());
        result = prime * result + ((ackTimeout == null) ? 0 : ackTimeout.hashCode());
        result = prime * result + ((sync == null) ? 0 : sync.hashCode());
        result = prime * result + ((timeout == null) ? 0 : timeout.hashCode());
        return result;
    }

    public void setAckRetries(Integer ackRetries) {
        this.ackRetries = ackRetries;
    }

    public void setAckTimeout(Integer ackTimeout) {
        this.ackTimeout = ackTimeout;
    }

    public void setSync(Integer sync) {
        this.sync = sync;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }

}
