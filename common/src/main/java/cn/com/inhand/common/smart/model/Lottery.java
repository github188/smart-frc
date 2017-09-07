/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author cttc
 */
public class Lottery {
    
    private List<Counter> participate;
    
    private List<Counter> conversion;

    private String probalility;

    public String getProbalility() {
        return probalility;
    }

    public void setProbalility(String probalility) {
        this.probalility = probalility;
    }
    
    
    public List<Counter> getParticipate() {
        return participate;
    }

    public void setParticipate(List<Counter> participate) {
        this.participate = participate;
    }

    public List<Counter> getConversion() {
        return conversion;
    }

    public void setConversion(List<Counter> conversion) {
        this.conversion = conversion;
    }
    
    
    
}
