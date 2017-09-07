package cn.com.inhand.common.model;

import java.util.ArrayList;

public class PortInfo {
    private String name;//como
    private String id;
    private String type;//rs485
    private ArrayList<String> proto;//generic,ovdp

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public ArrayList<String> getProto() {
        return proto;
    }

    public void setProto(ArrayList<String> proto) {
        this.proto = proto;
    }

}
