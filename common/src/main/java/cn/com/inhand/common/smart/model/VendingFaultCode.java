/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class VendingFaultCode {
    private String cid;
    private String pcode; //主故障类型名称  9001 系统故障   9002 纸币器故障  9003 硬币器故障 9004 通讯故障
    private String ccode; //子故障类型名称  

    public String getPcode() {
        return pcode;
    }

    public void setPcode(String pcode) {
        this.pcode = pcode;
    }

    public String getCcode() {
        return ccode;
    }

    public void setCcode(String ccode) {
        this.ccode = ccode;
    }

    public String getCid() {
        return cid;
    }

    public void setCid(String cid) {
        this.cid = cid;
    }
    
}
