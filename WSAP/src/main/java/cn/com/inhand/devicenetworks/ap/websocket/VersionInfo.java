/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

package cn.com.inhand.devicenetworks.ap.websocket;

/**
 *
 * @author han
 */
public class VersionInfo {
    /**
     * 
Commit: b8e60d550db85a7556ebd893c00e18921d5ed8d7 [b8e60d5]
Parents: 25747622e1
Author: jenkin.han <shock1974@gmail.com>
Date: 2015年7月27日 GMT+8下午5:33:42
Labels: HEAD master

1.控制台json输出的bug修复。
2.更新版本标识
     */  
    public final static String version="bb0108748bbe09db626c43bda5799eb545fbef45 [0f6b2ac04e]";
    public final static String author = "han@inhand.com.cn";
    public final static String last_commit = "2015年10月13日 GMT+8上午11:22:42";
    public final static String comment = "1.修改了老连接检测释放机制";
    public final static String app_name = " Websocket AP v1.1.1";
    
    public static String getDesc(){
        StringBuffer sb =new StringBuffer();
        sb.append("Application name : ").append(version).append("<br>");
        sb.append("Author :").append(author).append("<br>");
        sb.append("Version : ").append(version).append("<br>");
        sb.append("Last commit : ").append(version).append("<br>");
        //sb.append("Message :").append(comment).append("<br>");
        return sb.toString();
    }
}
