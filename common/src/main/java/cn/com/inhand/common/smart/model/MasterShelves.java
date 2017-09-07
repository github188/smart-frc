/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

import java.util.List;

/**
 *
 * @author lenovo
 */
public class MasterShelves {
    private String machineType;
    private String vmcCabinet;
    private String idNumber;
    private String vendor;
    private List<List<ShelvesModel>> shelves;

    public String getMachineType() {
        return machineType;
    }

    public void setMachineType(String machineType) {
        this.machineType = machineType;
    }

    public String getVmcCabinet() {
        return vmcCabinet;
    }

    public void setVmcCabinet(String vmcCabinet) {
        this.vmcCabinet = vmcCabinet;
    }

    public String getIdNumber() {
        return idNumber;
    }

    public void setIdNumber(String idNumber) {
        this.idNumber = idNumber;
    }

    public String getVendor() {
        return vendor;
    }

    public void setVendor(String vendor) {
        this.vendor = vendor;
    }

    public List<List<ShelvesModel>> getShelves() {
        return shelves;
    }

    public void setShelves(List<List<ShelvesModel>> shelves) {
        this.shelves = shelves;
    }
    
}
