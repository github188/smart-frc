package cn.com.inhand.common.config;

import java.util.Map;

public class CommonConfigBean {
    private String id;
    private String name;
    private Map<String, Object> config;

    public String getId() {
        return id;
    }

    @Override
    public String toString() {
        return "ConfigBean [id=" + id + ", name=" + name + ", config=" + config
                + "]";
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Map<String, Object> getConfig() {
        return config;
    }

    public void setConfig(Map<String, Object> config) {
        this.config = config;
    }
}
