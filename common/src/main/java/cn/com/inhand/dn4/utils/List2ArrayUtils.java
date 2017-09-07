/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.dn4.utils;
 
import java.util.List;

/**
 *
 * @author lenovo
 */
public class List2ArrayUtils {
    public static String[] list2StrArray(List<String> list ){
        String[] arr = new String[list.size()] ;
        for(int i=0;i<list.size();i++){
            arr[i] = list.get(i).toString();
        }
        return arr;
    }
  
}
