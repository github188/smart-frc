package cn.com.inhand.common.exception;
//Title:        InHandCMPPCenter
//Version:      1.0
//Copyright:    Copyright (c) 1999
//Author:       Forest Luo
//Company:      ����ӳ��ͨ���缼�����޹�˾
//Description:  ����ݰ��쳣��


public class PacketException
    extends Exception {
  /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

public PacketException() {

  }

  public PacketException(String s) {
    super(s);
  }
}