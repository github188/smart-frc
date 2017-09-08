/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.smart.formulacar.model;

import org.bson.types.ObjectId;

/**
 *
 * @author lenovo
 */
public class SiteModules {
    private ObjectId moduleId;
    private String moduleName;

    public ObjectId getModuleId() {
        return moduleId;
    }

    public void setModuleId(ObjectId moduleId) {
        this.moduleId = moduleId;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }
}
