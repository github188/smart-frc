/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author 晓洁
 */
public class UseConfig {
   private int user_couponc_count;//每个用户使用次数
   private int coupon_count;//可用总次数
   private int coupon_amount;//优惠金额总上限
   private String payStyle;//支付方式
   private int isFollow;//是否关注公从号参与优惠 1 必须关注才能参加 

    public int getIsFollow() {
        return isFollow;
    }

    public void setIsFollow(int isFollow) {
        this.isFollow = isFollow;
    }

    public int getUser_couponc_count() {
        return user_couponc_count;
    }

    public void setUser_couponc_count(int user_couponc_count) {
        this.user_couponc_count = user_couponc_count;
    }

    public int getCoupon_count() {
        return coupon_count;
    }

    public void setCoupon_count(int coupon_count) {
        this.coupon_count = coupon_count;
    }

    public int getCoupon_amount() {
        return coupon_amount;
    }

    public void setCoupon_amount(int coupon_amount) {
        this.coupon_amount = coupon_amount;
    }

    public String getPayStyle() {
        return payStyle;
    }

    public void setPayStyle(String payStyle) {
        this.payStyle = payStyle;
    }
   
}
