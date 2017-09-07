/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.initialize.dao;

import cn.com.inhand.common.smart.model.Ap;
import java.util.List;

/**
 *
 * @author lenovo
 */
public interface ApDAO {
    
    public void createApInfo(Ap ap);
    public Ap findApByKey(String key);
    public void updateAp(Ap ap);
    public List<Ap> getApList();
    
}
