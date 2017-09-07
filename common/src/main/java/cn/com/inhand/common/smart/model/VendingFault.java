/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author lenovo
 */
public class VendingFault {
    private VendingSysFault sysFault;  //系统故障信息
    private VendingPaperFault paperFault; //纸币器故障信息
    private VendingCoinFault coinFault;  //硬币器故障信息
    private VendingCommFault commFault;  //通讯故障信息

    public VendingSysFault getSysFault() {
        return sysFault;
    }

    public void setSysFault(VendingSysFault sysFault) {
        this.sysFault = sysFault;
    }

    public VendingPaperFault getPaperFault() {
        return paperFault;
    }

    public void setPaperFault(VendingPaperFault paperFault) {
        this.paperFault = paperFault;
    }

    public VendingCoinFault getCoinFault() {
        return coinFault;
    }

    public void setCoinFault(VendingCoinFault coinFault) {
        this.coinFault = coinFault;
    }

    public VendingCommFault getCommFault() {
        return commFault;
    }

    public void setCommFault(VendingCommFault commFault) {
        this.commFault = commFault;
    }
    
}
