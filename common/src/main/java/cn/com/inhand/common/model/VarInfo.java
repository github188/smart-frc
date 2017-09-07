package cn.com.inhand.common.model;

import java.util.List;

public class VarInfo {
    /**
     * 变量组名
     */
    private String name;
    private String nativeName;
    /**
     * 变量组标识
     */
    private int _id;
    /**
     * 变量对象
     */
    private List<Var> vars;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int get_id() {
        return _id;
    }

    public void set_id(int id) {
        _id = id;
    }

    public List<Var> getVars() {
        return vars;
    }

    public void setVars(List<Var> vars) {
        this.vars = vars;
    }

    public String getNativeName() {
        return nativeName;
    }

    public void setNativeName(String nativeName) {
        this.nativeName = nativeName;
    }

}
