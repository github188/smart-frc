$(function () {
	
	
	var paramObj = GetRequest();
	var token = paramObj.token;
	var openid = paramObj.openid;
	var params = paramObj.params;
	
	$('#smsBtn').click(function (e) {
		e.preventDefault();
		$this = $(this);

		var type = 'register';
		var phone = $('#phone').val().trim();
		$.get('/smscode', { phone, type, random: Date.now() }).then(function (ret) {
			if (ret && ret.message === 'user existed') {
				$('label.error').text('手机号已存在');
			} else {
				countDown($this, 60);
			}
		});
	});
  
	$("#registerBtn").click(function(e){
		
		alert("=============1==================");
		
		var phone = $("#phone").val();
		if(!phone){
			$('label.error').text('请输入正确手机号');
			return;
		}else{
			$('label.error').text('');
		}
		
		alert("=============2==================");
		
		var smscode = $("#smscode").val();
		if(!smscode){
			$('label.error').text('请输入正确验证码');
			return;
		}else{
			$('label.error').text('');
		}
		
		alert("=============3==================");
		
		var password = $("#password").val();
		if(!password){
			$('label.error').text('请输密码');
			return;
		}else{
			$('label.error').text('');
		}
		
		alert("=============4==================");
		
		var formData = {
			phone:phone,
			smscode:smscode,
			password:password,
			token:token,
			params:params,
			openid:openid
		};
		
		alert("=============5==================");
		
		$.ajax({
            type: 'POST',
            url: '/wbapi/wechat/register',
			"contentType": "application/json", 
			data:JSON.stringify(formData),
            success: function(data){
                if(data.result && data.result == "SUCCESS"){
					if(params == "myInfo"){
						window.location.href = '/FomulaG/home.html?params=myInfo';
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
