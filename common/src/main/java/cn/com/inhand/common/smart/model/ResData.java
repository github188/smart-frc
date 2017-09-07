/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author liqiang
 */
public class ResData {
    
    
    private String taskType;  //command：普通命令 ，getconfig：获取配置，setconfig：配置下发 reboot：系统重启 apprestart：应用重启
    
    private String cmd;   //命令或文件id
    
    private String result;  //执行结果，返回结果或文件id

    public String getTaskType() {
        return taskType;
    }

    public void setTaskType(String taskType) {
        this.taskType = taskType;
    }

    

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }
    
    
}
