package cn.com.inhand.common.model;

import java.util.Date;

/**
 * this object was come from dn3
 */

public class SmsserverOut {

    // Fields

    private Integer id;
    private String recipient;
    private String text;
    private Date createDate;
    private String originator;
    private String encoding;
    private Integer statusReport;
    private Integer flashSms;
    private Integer srcPort;
    private Integer dstPort;
    private Date sentDate;
    private String refNo;
    private Integer priority;
    private String status;
    private Integer errors;
    private String gatewayId;
    private Integer smsType = 0;

    /**
     * @return the id
     */
    public Integer getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(Integer id) {
        this.id = id;
    }

    /**
     * @return the recipient
     */
    public String getRecipient() {
        return recipient;
    }

    /**
     * @param recipient the recipient to set
     */
    public void setRecipient(String recipient) {
        this.recipient = recipient;
    }

    /**
     * @return the text
     */
    public String getText() {
        return text;
    }

    /**
     * @param text the text to set
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * @return the createDate
     */
    public Date getCreateDate() {
        return createDate;
    }

    /**
     * @param createDate the createDate to set
     */
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    /**
     * @return the originator
     */
    public String getOriginator() {
        return originator;
    }

    /**
     * @param originator the originator to set
     */
    public void setOriginator(String originator) {
        this.originator = originator;
    }

    /**
     * @return the encoding
     */
    public String getEncoding() {
        return encoding;
    }

    /**
     * @param encoding the encoding to set
     */
    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    /**
     * @return the statusReport
     */
    public Integer getStatusReport() {
        return statusReport;
    }

    /**
     * @param statusReport the statusReport to set
     */
    public void setStatusReport(Integer statusReport) {
        this.statusReport = statusReport;
    }

    /**
     * @return the flashSms
     */
    public Integer getFlashSms() {
        return flashSms;
    }

    /**
     * @param flashSms the flashSms to set
     */
    public void setFlashSms(Integer flashSms) {
        this.flashSms = flashSms;
    }

    /**
     * @return the srcPort
     */
    public Integer getSrcPort() {
        return srcPort;
    }

    /**
     * @param srcPort the srcPort to set
     */
    public void setSrcPort(Integer srcPort) {
        this.srcPort = srcPort;
    }

    /**
     * @return the dstPort
     */
    public Integer getDstPort() {
        return dstPort;
    }

    /**
     * @param dstPort the dstPort to set
     */
    public void setDstPort(Integer dstPort) {
        this.dstPort = dstPort;
    }

    /**
     * @return the sentDate
     */
    public Date getSentDate() {
        return sentDate;
    }

    /**
     * @param sentDate the sentDate to set
     */
    public void setSentDate(Date sentDate) {
        this.sentDate = sentDate;
    }

    /**
     * @return the refNo
     */
    public String getRefNo() {
        return refNo;
    }

    /**
     * @param refNo the refNo to set
     */
    public void setRefNo(String refNo) {
        this.refNo = refNo;
    }

    /**
     * @return the priority
     */
    public Integer getPriority() {
        return priority;
    }

    /**
     * @param priority the priority to set
     */
    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    /**
     * @return the status
     */
    public String getStatus() {
        return status;
    }

    /**
     * @param status the status to set
     */
    public void setStatus(String status) {
        this.status = status;
    }

    /**
     * @return the errors
     */
    public Integer getErrors() {
        return errors;
    }

    /**
     * @param errors the errors to set
     */
    public void setErrors(Integer errors) {
        this.errors = errors;
    }

    /**
     * @return the gatewayId
     */
    public String getGatewayId() {
        return gatewayId;
    }

    /**
     * @param gatewayId the gatewayId to set
     */
    public void setGatewayId(String gatewayId) {
        this.gatewayId = gatewayId;
    }

    public Integer getSmsType() {
        return smsType;
    }

    public void setSmsType(Integer smsType) {
        this.smsType = smsType;
    }
}