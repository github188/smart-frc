$(function () {
	var paramObj = GetRequest();
	
	var params = paramObj.params;
	
	$("#loginBtn").click(function(e){
		var phone = $("#phone").val();
		if(!phone){
			$('label.error').text('请输入正确手机号');
			return;
		}else{
			$('label.error').text('');
		}
		var password = $("#password").val();
		if(!password){
			$('label.error').text('请输密码');
			return;
		}else{
			$('label.error').text('');
		}
		
		var formData = {
			phone:phone,
			password:password
		};
		
		$.ajax({
            type: 'POST',
            url: '/wbapi/wechat/login',
			"contentType": "application/json", 
			data:JSON.stringify(data),
            success: function(data){
                if(data.result && data.result == "SUCCESS"){
					var openid = data.openid;
					if(params == "myInfo"){
						window.location.href = '../home.html?openid='+openid;
					}
                } else{
                    $('label.error').text(data.errorMsg);
                }
            }
        });
	});
  
});

var GetRequest = function() {
   var url = location.search; //获取url中"?"符后的字串
   var theRequest = new Object();
   if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for(var i = 0; i < strs.length; i ++) {
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
      }
   }
   return theRequest;
}

var countDown = function ($elem, count) {
  if (count <= 0) {
    $elem.prop('disabled', false).val('点击发送验证码');
  } else {
    $elem.prop('disabled', true).val(`${count}s`);
    setTimeout(function () {
      countDown($elem, count - 1);
    }, 1000);
  }
};
