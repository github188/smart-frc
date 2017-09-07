/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.dto;

/**
 *
 * @author shixj
 */
public class BasicResultNoLimitDTO {
     private long total;
     private Object result;
     public BasicResultNoLimitDTO(long total, Object result) {
        this.total = total;
        this.result = result;
     }

    public long getTotal() {
        return total;
    }

    public void setTotal(long total) {
        this.total = total;
    }

    public Object getResult() {
        return result;
    }

    public void setResult(Object result) {
        this.result = result;
    }
     
}
