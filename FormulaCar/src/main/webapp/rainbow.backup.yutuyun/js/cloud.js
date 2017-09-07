/**
 * Created by zhouyunkui on 14-7-2.
 */
var cloud=new Object();
var html="<div class='rainbow-content-wrapper'>"+
    "<ul>" +
    "<li>" +
    "<a id='return_back'></a>" +
    "<button id='one_click'></button>" +
    "<button id='one_click_bak' style='display: none'></button>" +
    "</li>"+
    "<li>"+
    "<h2 id='access_wifi'>Wifi登入</h2>"+
    "</li>"+
    "<li>"+
    "<input type='text' id='rainbow_user_phone_number' autocomplete='false' class='rainbow-user-info rainbow-phone-input' placeholder='请输入手机号' lang='{placeholder:enter_mobile_number}' />"+
    "</li>"+
    "<li style='height: 20px'>"+
    "<span id='rainbow_phone_number_error' class='rainbow_error_tips'></span>"+
    "</li>"+
    "<li>"+
    "<input type='password' id='rainbow_user_password' autocomplete='false' class='rainbow-user-info rainbow-code-input' placeholder='请输入随机码' lang='{placeholder:enter_password}'>"+
    "<button id='rainbow_get_user_password' lang='text:get_code'>获取随机码</button>"+
    "</li>"+
    "<li style='height: 20px'>"+
    "<span id='rainbow_password_error' class='rainbow_error_tips'></span>"+
    "</li>"+
    "<li>"+
    "<button id='rainbow_loginBtn'></button>"+
    "<button id='rainbow_loginBtn_bak' style='display:none'></button>"+
    "</li>"+
    "<li style='height: 20px'>"+
    "<span id='rainbow_login_error' class='rainbow_error_tips'></span>"+
    "</li>"+
    "<li class='rainbow_line-for-sns-count'>"+
    "<p id='other_login_way' style='font-weight: bold'>其他登录方式</p>"+
    "<p>"+
    "<img src='resoureces/images/qq_login.png' lang='{title:qq}' id='rainbow_qqLoginBtn'/>"+
    "<img src='resoureces/images/sina_login.png' lang='{title:sina}' id='rainbow_sinaLoginBtn'/>" +
    "<p>" +
    "<label lang='{text:qr_code}' id='qr_text'>扫描微信二维码,添加关注,不仅能上网,还能获取更多资讯!</label>"+
    "<img src='resoureces/images/qr_code.jpeg'/>" +
    "</p>" +
    "</p>"+
    "</li>"+
    "<li>"+
    "<input type='checkbox' class='rainbow-remember-me' id='rainbow-remember-me'/><label id='remember_me' for='rainbow-remember-me'>记住我，自动登录</label>"+
    "</li>"+
    "<li>"+
    "<input type='checkbox' class='rainbow-service' id='rainbow_agree_conditions_terms' /><span id='agree'>同意</span>&nbsp;<a id='conditions_terms' href='' class='rainbow_conditions_terms'>服务条款</a>"+
    "</li>"+
    "</ul>"+
    "<iframe id='rainbow_forCrossOrigin' src='foriframe.html' style='display: none'>"+
    "</iframe>"+
    "</div>";
cloud.html=$(html);
//iframe对象
var iframeEle=$(cloud.html).find("#rainbow_forCrossOrigin");
iframeEle.load(function(){
    cloud.iframeWindow=iframeEle[0].contentWindow;
    cloud.iframeDocument=cloud.iframeWindow.document;
    //页面加载便会执行自动登录检测
    cloud.autoLogin();
});
//设置获取手机码的间隔
cloud.number=90;
////检测smsCodeId是否存在，存在就和对应的手机号一起提取
//    var tempIdStr=sessionStorage.getItem("smsCodeId");
//    if(tempIdStr){
//        var tempArr=tempIdStr.split("&");
//        cloud.smsCodeId=tempArr[0];
//        cloud.tempPhone=tempArr[1];
//    };
cloud.wait=true;
cloud.oneClickBak=cloud.html.find("#one_click_bak");
cloud.oneClick=cloud.html.find("#one_click");
cloud.qrLabel=cloud.html.find("#qr_text");
cloud.returnBack=cloud.html.find("#return_back");
cloud.conditionTerm=cloud.html.find("#conditions_terms");
cloud.agree=cloud.html.find("#agree");
cloud.rememberMe=cloud.html.find("#remember_me");
cloud.otherLoginWay=cloud.html.find("#other_login_way");
cloud.wifiAccess=cloud.html.find("#access_wifi");
cloud.phoneInput=cloud.html.find("#rainbow_user_phone_number");
cloud.passwordInput=cloud.html.find("#rainbow_user_password");
cloud.getSMSBtn=cloud.html.find("#rainbow_get_user_password");
cloud.qqBtn=cloud.html.find("#rainbow_qqLoginBtn");
cloud.sinaBtn=cloud.html.find("#rainbow_sinaLoginBtn");
cloud.remberElement=cloud.html.find("#rainbow-remember-me");
cloud.agreeElement=cloud.html.find("#rainbow_agree_conditions_terms");
cloud.loginBtn=cloud.html.find("#rainbow_loginBtn");
cloud.loginBtnBak=cloud.html.find("#rainbow_loginBtn_bak");
cloud.regexUserName=new RegExp("^(1)[0-9]{10,10}$");
cloud.regexRequired=new RegExp("^(\s)*$");
cloud.phoneError=cloud.html.find("#rainbow_phone_number_error");
cloud.passwordError=cloud.html.find("#rainbow_password_error");
//cloud.loginError=document.getElementById("login_error");
cloud.loginErrorTipEle=cloud.html.find("#rainbow_login_error");
//设置页面文字
cloud.renderCharacter=function(){
    cloud.oneClickBak.text(Rainbow.locale.get("one_click"));
    cloud.oneClick.text(Rainbow.locale.get("one_click"));
    cloud.conditionTerm.text(Rainbow.locale.get("conditions_terms"));
    cloud.agree.text(Rainbow.locale.get("agree"));
    cloud.rememberMe.text(Rainbow.locale.get("remember_me"));
    cloud.otherLoginWay.text(Rainbow.locale.get("other_login_way"));
    cloud.wifiAccess.text(Rainbow.locale.get("access_wifi"));
    cloud.phoneInput.attr({
        "placeholder":Rainbow.locale.get("enter_mobile_number")
    });
    cloud.passwordInput.attr({
        "placeholder":Rainbow.locale.get("enter_password")
    });
    cloud.getSMSBtn.text(Rainbow.locale.get("get_code"));
    cloud.loginBtn.text(Rainbow.locale.get("login"));
    cloud.loginBtnBak.text(Rainbow.locale.get("login"));
    cloud.returnBack.text(Rainbow.locale.get("return_back")).attr({
        "href":Rainbow.cloud.url
    });
    cloud.qrLabel.text(Rainbow.locale.get("qr_code"));
};
//手机输入框错误提示
cloud.checkPhoneInput=function(){
    var userNameFlag=cloud.regexUserName.test(cloud.phoneInput.val());
    if(!userNameFlag){
        cloud.phoneError.text(Rainbow.locale.get("phone_number_format_error"));
        return false;
    }else{
        cloud.phoneError.text("");
        return true;
    };

};
//密码输入框错误提示
cloud.checkPassWordInput=function(){
    var passWordFlag=cloud.regexRequired.test(cloud.passwordInput.val());
    if(passWordFlag){
        cloud.passwordError.text(Rainbow.locale.get("password_invalid"));
        return false;
    }else{
        cloud.passwordError.text("");
        return true;
    }
};
//检测所有输入
cloud.checkAllInput=function(){
    var flag1=cloud.checkPhoneInput();
    var flag2=cloud.checkPassWordInput();
    if(flag1&&flag2){
        return true;
    }else{
        return false;
    }
};
//同意服务协议和自动登录
cloud.remberElement.attr({"checked":"true"});
cloud.agreeElement.attr({"checked":"true"});
//设置cookie
cloud.setCookie=function(username,password){
    var date=new Date();
    date.setDate(date.getDate()+3650);
    document.cookie="username_m="+username+";"+"expires="+date.toGMTString();
    document.cookie="password_m="+password+";"+"expires="+date.toGMTString();
    document.cookie="checkboxvalue_m="+cloud.remberElement.attr("checked")+";"+"expires="+date.toGMTString();
};
//获取cookie
cloud.getCookie=function(){
    var cookie=document.cookie;
    var countArr=cookie.split(";");
    var nameCodeObj={};
    for(var i=0;i<countArr.length;i++){
        var tempArr=countArr[i].split("=");
        var index=tempArr[0];
        index=index.trim();
        var value=tempArr[1];
        if(index=="username_m"){
            nameCodeObj.username=value;
        }else if(index=="password_m"){
            nameCodeObj.password=value;
        }else if(index=="checkboxvalue_m"){
            nameCodeObj.checkboxvalue=value;
        }
    };
    return nameCodeObj;
};
//自动填充，并判断是否自动登录
cloud.autoLogin=function(){
    if(cloud.remberElement.attr("checked")=="checked"){
        var obj=cloud.getCookie();
//            cloud.phoneInput=cloud.html.find("#user_phone_number");
        if(obj.username){
            cloud.phoneInput.val(obj.username);
        }
//            cloud.passwordInput=cloud.html.find("#user_password");
        if(obj.password){
            cloud.passwordInput.val(obj.password);
        }
        if(obj.checkboxvalue){
            var uri=Rainbow.cloud.platformApiHost+Rainbow.cloud.phoneLoginCodeApiUri;
            var jsonObj={
                "username":obj.username,
                "password":Rainbow.cloud.md5(Rainbow.cloud.preStr+Rainbow.cloud.md5(obj.password)),
                "client_id":Rainbow.cloud.clientId,
                "client_secret":Rainbow.cloud.clientSecret,
                "oid":Rainbow.cloud.organId,
                "grant_type":"authorization_code"
            };
            cloud.username=obj.username;
            var url=formatData(uri,jsonObj,"callback_wifi_user");
            var id="forCodeScript";
            addScript(url,id);
            cloud.loginBtnBak.css({
                "display":"inline"
            });
            cloud.loginBtn.css({
                "display":"none"
            });
        }
    }
};
//在iframe中添加script标签
function addScript(url,id){
    var scriptEle=$("<script>");
    scriptEle.attr({
        "id":id,
        "type":"text/javascript",
        "src":url
    });
    var headEle=$(cloud.iframeDocument).find("#bodyPart");
    headEle.append(scriptEle);
    setTimeout(function(){
        if(!scriptEle.html()){
//            cloud.loginErrorTipEle.text(Rainbow.locale.get("rquest_timeout"));
            cloud.loginBtnBak.css({
                "display":"none"
            });
            cloud.loginBtn.css({
                "display":"inline"
            });
            cloud.oneClick.show();
            cloud.oneClickBak.hide();
        }
    },10000)
};
//序列化查询参数
function formatData(uri,jsonObj,callbackName){
    var urlParams="";
    for(i in jsonObj){
        urlParams=urlParams+i+"="+encodeURIComponent(jsonObj[i])+"&";
    }
    urlParams=urlParams+"call_back="+callbackName;
    return uri+"?"+urlParams;
};
//申请手机smscode的回调函数
window.callback_sms=function(data){
    cloud.wait=true;
    if(data.error){
        cloud.loginErrorTipEle.text(Rainbow.locale.get(data.error_code));
    }else{
        if(data.result){
//                if(data.result.smsCodeId){
            //将smsCodeId存入sessionStorage,与对应的手机号绑定
//                    cloud.smsCodeId=data.result.smsCodeId;
            cloud.tempPhone=data.result.phone;
//                    sessionStorage.setItem("smsCodeId",cloud.smsCodeId+"&"+data.result.phone);
//                }
        }
    }
}
//手机账号登录的回调函数
window.callback_wifi_user=function(data){
    if(data.error){
        //在此设置错误提示
        cloud.loginBtnBak.css({
            "display":"none"
        });
        cloud.loginBtn.css({
            "display":"inline"
        });
        cloud.loginErrorTipEle.text(Rainbow.locale.get(data.error_code));
    }else{
//        console.log(data);
        if(data.code){
            var code=data.code;
            var uri=Rainbow.cloud.inPortalApiHost+Rainbow.cloud.phoneLoginTokenApiUri;
            var jsonObj={
                "client_id":Rainbow.cloud.clientId,
                "client_secret":Rainbow.cloud.clientSecret,
                "grant_type":"authorization_code",
                "username":cloud.username,
                "code":code
            };
            var url=formatData(uri,jsonObj,"callback_access_token");
            var id="forTokenScript";
            addScript(url,id);
        }
    }
}
//手机登录后的回调函数
window.callback_access_token=function(data){
    cloud.loginBtnBak.css({
        "display":"none"
    });
    cloud.loginBtn.css({
        "display":"inline"
    });
    if(data.error){
        cloud.loginErrorTipEle.text(Rainbow.locale.get(data.error_code));
    }else{
        cloud.setCookie(cloud.phoneInput.val(),cloud.passwordInput.val());
        window.location.href=Rainbow.cloud.afterLoginSucessPage;
    }
}
//一键登录的回调函数
window.callback_one_key=function(data){
    cloud.oneClick.show();
    cloud.oneClickBak.hide();
    if(data.error){
        cloud.loginErrorTipEle.text(Rainbow.locale.get(data.error_code));
    }else{
        window.location.href=Rainbow.cloud.afterLoginSucessPage;
    }
}
//监听事件
window.addEventListener("click",function(evt){
    cloud.loginErrorTipEle.text("");
    //获取手机码事件
    if(evt.target.id=="rainbow_get_user_password" && cloud.checkPhoneInput()){
        if(cloud.wait){
            cloud.wait=false;
            evt.target.className="rainbow_get_user_password";
            function textLoop(){
                if(cloud.number>0){
                    cloud.number--;
                    cloud.getSMSBtn.text(cloud.number+" "+Rainbow.locale.get("seconds"));
                }
                else{
                    clearInterval(cloud.textCycle);
                    cloud.number=90;
                    cloud.getSMSBtn.removeClass("rainbow_get_user_password");
                    cloud.getSMSBtn.text(Rainbow.locale.get("get_code"));
                    cloud.wait=true;
                }
            };
            cloud.textCycle=setInterval(textLoop,"1000");
            var uri=Rainbow.cloud.inPortalApiHost+Rainbow.cloud.getSmsCodeApiUri;
            var jsonObj={
                "phone":cloud.phoneInput.val()
            };
            var url=formatData(uri,jsonObj,"callback_sms");
            var id="forSmsScript";
            addScript(url,id);
        }
    }
    //手机号登录
    else if(evt.target.id=="rainbow_loginBtn"){
        cloud.username=cloud.phoneInput.val();
        cloud.password=cloud.passwordInput.val();
        var test=cloud.checkAllInput();
        if(test){
            cloud.loginBtnBak.css({
                "display":"inline"
            });
            cloud.loginBtn.css({
                "display":"none"
            });
            var uri=Rainbow.cloud.platformApiHost+Rainbow.cloud.phoneLoginCodeApiUri;
            var jsonObj={
                "username":cloud.username,
                "password":Rainbow.cloud.md5(Rainbow.cloud.preStr+Rainbow.cloud.md5(cloud.password)),
                "oid":Rainbow.cloud.organId,
                "client_id":Rainbow.cloud.clientId,
                "client_secret":Rainbow.cloud.clientSecret,
                "grant_type":"authorization_code"
            };
//                if(cloud.smsCodeId){
//                    if(cloud.tempPhone==cloud.username){
//                        jsonObj.smsCodeId=cloud.smsCodeId;
//                    }
//                }
            var url=formatData(uri,jsonObj,"callback_wifi_user");
            var id="forCodeScript";
            addScript(url,id);
        }
    }
    //判断是否是一键登录
    else if(evt.target.id=="one_click"){
        var uri=Rainbow.cloud.inPortalApiHost+Rainbow.cloud.oneKeyLoginApiUri;
        var jsonObj={
            "client_id":Rainbow.cloud.clientId,
            "client_secret":Rainbow.cloud.clientSecret,
            "as_type":6
        };
        var url=formatData(uri,jsonObj,"callback_one_key");
        var id="oneKeyScript";
        addScript(url,id);
        cloud.oneClick.hide();
        cloud.oneClickBak.show();
    }
    //判断是否禁用登录按钮
    else if(evt.target.id=="rainbow_agree_conditions_terms"){
        if(evt.target.checked!=true){
            cloud.loginBtnBak.css({
                "display":"inline"
            });
            cloud.loginBtn.css({
                "display":"none"
            });
        }else{
            cloud.loginBtnBak.css({
                "display":"none"
            });
            cloud.loginBtn.css({
                "display":"inline"
            });
        }
    }else if(evt.target.id=="rainbow_qqLoginBtn"){
//        location.href="https://graph.qq.com/oauth2.0/authorize?response_type=token&client_id=101118104&redirect_uri=http://www.qqtest.com/QQ/servercallbackpage.html&scope=get_user_info";
        location.href="https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101118104&redirect_uri=http://c2.inhandnetworks.com/login_page/QQ/servercallbackpage.html&scope=get_user_info";
    }else if(evt.target.id=="rainbow_sinaLoginBtn"){
        location.href="https://api.weibo.com/oauth2/authorize?client_id=2074674258&response_type=code&redirect_uri=http://c2.inhandnetworks.com/login_page/sina/servercallbackpage.html";
    }
},false);
cloud.passwordInput.blur(function(){
    cloud.checkPassWordInput()
});
cloud.phoneInput.blur(function(){
    cloud.checkPhoneInput();
});
cloud.insertLoginBox=function(option){
    $(option.selector).append(cloud.html);
};
