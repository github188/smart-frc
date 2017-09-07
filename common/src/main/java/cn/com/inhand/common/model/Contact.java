package cn.com.inhand.common.model;

import java.io.Serializable;

/**
 * @author Majw
 *         联系人信息
 */
public class Contact implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = -6399366557256373416L;

    /**
     * 联系人
     */
    private String name;

    /**
     * 联系电话
     */
    private String phone;

    /**
     * 联系email
     */
    private String email;


    /**
     * @return the name
     */
    public String getName() {
        return name;
    }


    /**
     * @param name the name to set
     */
    public void setName(String name) {
        this.name = name;
    }


    /**
     * @return the phone
     */
    public String getPhone() {
        return phone;
    }


    /**
     * @param phone the phone to set
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }


    /**
     * @return the email
     */
    public String getEmail() {
        return email;
    }


    /**
     * @param email the email to set
     */
    public void setEmail(String email) {
        this.email = email;
    }

}
