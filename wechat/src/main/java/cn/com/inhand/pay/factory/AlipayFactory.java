/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package cn.com.inhand.pay.factory;

import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import org.springframework.stereotype.Component;

/**
 *
 * @author lenovo
 */
@Component
public class AlipayFactory {
    
    public AlipayClient getAlipayClient(String alipayGateWay, String appId, String privateKey, String charset, String alipayPublicKey) {
        return new DefaultAlipayClient(alipayGateWay, appId, privateKey, "json", charset, alipayPublicKey);
    }
    
}
