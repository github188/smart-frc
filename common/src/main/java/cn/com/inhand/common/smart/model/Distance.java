/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.common.smart.model;

/**
 *
 * @author xupeijiao
 */
public class Distance {
      private String text;
    private long value;

    public Distance(String text, long value) {
        this.text = text;
        this.value = value;
    }
  public Distance(){
  }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public long getValue() {
        return value;
    }

    public void setValue(long value) {
        this.value = value;
    }
}
