package cn.com.inhand.common.model;

import java.util.Date;

public class SmsserverIn {

    // Fields

    private Integer id;
    private Integer process;
    private String originator;
    private String type;
    private String encoding;
    private Date messageDate;
    private Date receiveDate;
    private String text;
    private String originalRefNo;
    private Date originalReceiveDate;
    private String gatewayId;
    private Integer processFlag = 0;

    // Constructors

    public Integer getProcessFlag() {
        return processFlag;
    }

    public void setProcessFlag(Integer processFlag) {
        this.processFlag = processFlag;
    }

    /**
     * default constructor
     */
    public SmsserverIn() {
    }

    /**
     * minimal constructor
     */
    public SmsserverIn(Integer id, Integer process, String originator,
                       String type, String encoding, Date messageDate, Date receiveDate,
                       String text, String gatewayId) {
        this.id = id;
        this.process = process;
        this.originator = originator;
        this.type = type;
        this.encoding = encoding;
        this.messageDate = messageDate;
        this.receiveDate = receiveDate;
        this.text = text;
        this.gatewayId = gatewayId;
    }

    /**
     * full constructor
     */
    public SmsserverIn(Integer id, Integer process, String originator,
                       String type, String encoding, Date messageDate, Date receiveDate,
                       String text, String originalRefNo, Date originalReceiveDate,
                       String gatewayId) {
        this.id = id;
        this.process = process;
        this.originator = originator;
        this.type = type;
        this.encoding = encoding;
        this.messageDate = messageDate;
        this.receiveDate = receiveDate;
        this.text = text;
        this.originalRefNo = originalRefNo;
        this.originalReceiveDate = originalReceiveDate;
        this.gatewayId = gatewayId;
    }


    public Integer getProcess() {
        return this.process;
    }

    public void setProcess(Integer process) {
        this.process = process;
    }

    public String getOriginator() {
        return this.originator;
    }

    public void setOriginator(String originator) {
        this.originator = originator;
    }

    public String getType() {
        return this.type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEncoding() {
        return this.encoding;
    }

    public void setEncoding(String encoding) {
        this.encoding = encoding;
    }

    public Date getMessageDate() {
        return this.messageDate;
    }

    public void setMessageDate(Date messageDate) {
        this.messageDate = messageDate;
    }

    public Date getReceiveDate() {
        return this.receiveDate;
    }

    public void setReceiveDate(Date receiveDate) {
        this.receiveDate = receiveDate;
    }

    public String getText() {
        return this.text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getOriginalRefNo() {
        return this.originalRefNo;
    }

    public void setOriginalRefNo(String originalRefNo) {
        this.originalRefNo = originalRefNo;
    }

    public Date getOriginalReceiveDate() {
        return this.originalReceiveDate;
    }

    public void setOriginalReceiveDate(Date originalReceiveDate) {
        this.originalReceiveDate = originalReceiveDate;
    }

    public String getGatewayId() {
        return this.gatewayId;
    }

    public void setGatewayId(String gatewayId) {
        this.gatewayId = gatewayId;
    }

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

}
