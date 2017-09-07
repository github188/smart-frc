package cn.com.inhand.common.bean;

import java.text.SimpleDateFormat;

public class ServerInfoBean {
    private String name;
    private String date;

    public ServerInfoBean(String name, String date) {
        super();
        this.name = name;
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
    public static void main(String args[]){
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        System.out.println(format.format(System.currentTimeMillis()));
        System.out.println(format.format(1429151698*1000l));
        System.out.println(System.currentTimeMillis());
        System.out.println(1429151698*1000l);
        System.out.println(format.format(System.currentTimeMillis()));
    }
}
