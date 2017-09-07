define(function(require) {
	require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    var Button = require("cloud/components/button");
    var configHtml=require("text!./configHtml.html");
    var Service=require("../../service");
	var configuration = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.activityId = "";
			this.render();
		},
		render:function(){
			var self=this;
			this.renderHtml();
            locale.render({element:self.element});
            this.getConfig();
            this.bindBtnEvents();
            this.renderTimeSelect();
            this.getData();
		},
		renderHtml:function(){
			this.element.html(configHtml);
			$("#delivery_code_desc").html(
					  "<label style='font-weight:600;'>"+locale.get({lang:"notices"})+":&nbsp;&nbsp;</label>" +
					  "<label>&nbsp;"+locale.get({lang:"can_use"})+"</label>" +
					  "<label >&nbsp;$code&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"delivery_code"})+";" +
					  "&nbsp;$starttime&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"effective_start_time"})+";</label>"+
					  "<label>&nbsp;$endtime&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"effective_end_time"})+"</label>"
					  );
			$("#fb_shipment_desc").html(
					  "<label style='font-weight:600;'>"+locale.get({lang:"notices"})+":&nbsp;&nbsp;</label>" +
					  "<label>&nbsp;"+locale.get({lang:"can_use"})+"</label>" +
					  "<label >&nbsp;$date&nbsp;"+locale.get({lang:"indicate_"})+"&nbsp;"+locale.get({lang:"facebook_code_exchange_time"})+";</label>"
					  );
		},
		renderTimeSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				})
			});
		},
		getConfig:function(){
			var self = this;
            var startTime = $("#startTime").val();
            var endTime = $("#endTime").val();
            var appId = $("#appId").val();
            var href = $("#href").val();
            var desc = $("#deliveryCodeNotice").val();
            startTime = (new Date(startTime)).getTime()/1000; 
            endTime = (new Date(endTime)).getTime()/1000; 
            var cost = $("#cost").val();
            var now = new Date();
            var shipmentNotice = $("#FBShipmentNotice").val();
			if(this.activityId == ""){
				 var month = (now.getMonth()+1);
				 if(10>month>0){
					 month = "0"+month;
				 }
				 var date = now.getDate();
				 if(10>date>0){
					 date = "0"+date;
				 }
				 var hour = now.getHours();
				 if(10>hour>0){
					 hour = "0"+hour;
				 }
				 var minutes = now.getMinutes();
				 if(10>minutes>0){
					 minutes = "0"+minutes;
				 }
				 var seconds = now.getSeconds();
				 if(10>seconds>0){
					 seconds = "0"+seconds;
				 }
				 this.activityId = "FB"+now.getFullYear()+month+date+hour+minutes+seconds;
			 }
             var config = {
            		startTime:startTime,
            		endTime:endTime,
            		appId:appId,
            		href:href,
            		activityId:self.activityId,
            		value:cost,
            		shipmentNotice:shipmentNotice,
            		desc:desc
            };
            return config;
        },
        setConfig:function(config){
        	var self = this;
        	$("#startTime").val(cloud.util.dateFormat(new Date(config.startTime),"yyyy/MM/dd hh:mm"));
            $("#endTime").val(cloud.util.dateFormat(new Date(config.endTime),"yyyy/MM/dd hh:mm"));
            $("#appId").val(config.appId);
            $("#href").val(config.href);
            $("#deliveryCodeNotice").val(config.desc);
            $("#cost").val(config.value);
            $("#FBShipmentNotice").val(config.shipmentNotice);
            this.activityId = config.activityId;
            if(!this.activityId){
            	this.activityId = "";
            }
            if(config.appId!=null&&config.appId!=""){
            	 self.createCode();
            }
           
        },
        createCode:function(){
        	 var self = this;
			 var startTime = $("#startTime").val();
			 var endTime = $("#endTime").val();
			 var appId = $("#appId").val();
			 var href = $("#href").val();
			 var accountInfo = cloud.storage.sessionStorage("accountInfo");
			 var oid = accountInfo.split(",")[0].split(":")[1];
			 var desc = $("#deliveryCodeNotice").val();
			 var cost = $("#cost").val();
			 var now = new Date();
			 if(this.activityId == ""){
				 var month = (now.getMonth()+1);
				 if(10>month>0){
					 month = "0"+month;
				 }
				 var date = now.getDate();
				 if(10>date>0){
					 date = "0"+date;
				 }
				 var hour = now.getHours();
				 if(10>hour>0){
					 hour = "0"+hour;
				 }
				 var minutes = now.getMinutes();
				 if(10>minutes>0){
					 minutes = "0"+minutes;
				 }
				 var seconds = now.getSeconds();
				 if(10>seconds>0){
					 seconds = "0"+seconds;
				 }
				 this.activityId = "FB"+now.getFullYear()+month+date+hour+minutes+seconds;
			 }
			 if(startTime == null|| startTime == ""){
				 dialog.render({lang:"start_time_is_null"});
				 return;
			 }
			 if(endTime == null|| endTime == ""){
				 dialog.render({lang:"end_time_is_null"});
				 return;
			 }
			 if(appId == null|| appId == ""){
				 dialog.render({lang:"appId_is_null"});
				 return;
			 }
			 if(href == null|| href == ""){
				 dialog.render({lang:"href_is_null"});
				 return;
			 }
			 var reg1=new RegExp("\\d+");
			 var reg2=new RegExp("\\d+\\.\\d+");
			 if(cost == null|| cost == ""||((!reg1.test(cost))&&(!reg2.test(cost)))){
				 dialog.render({lang:"cost_is_null"});
				 return;
			 }
			 if(desc.indexOf("$starttime")!=-1){
				 desc = desc.replace("$starttime",startTime);
			 }
			 if(desc.indexOf("$endtime")!=-1){
				 desc = desc.replace("$endtime",endTime);
			 }
			 startTime = (new Date(startTime)).getTime()/1000; 
             endTime = (new Date(endTime)).getTime()/1000; 
        	 var like_code = "<html>"+
								"<head>"+
									"<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>"+
									"<style type='text/css'>"+
										"#create_goods_code {"+
											"background:white;"+
											"color:black;"+
										    "border:1px solid #B3B3B3;"+
										    "font-size:14px;"+
										    "border-radius:5px;"+
										    "-moz-border-radius:5px; /* 老的 Firefox */"+
										    "position:absolute;"+
										    "opacity:.7;"+
										    "width:200px;"+
										    "height:100px;"+
										    "filter:alpha(opacity=70);"+
										    "padding:10px;"+
									    "}"+
									"</style>"+
								"</head>"+
								"<body>"+
									"<fb:like href='"+href+"' send='false' action='like'  id='like_button' layout='button_count' width='138' show_faces='false'  style='border:none; overflow:hidden;'></fb:like>" +
									"<div id='fb-root'></div>"+
									"<script type='text/javascript'>"+
										"function openCode() {" +
											"var host = 'mall.inhand.com.cn';" +
											"var url = '/api/redeemcode/getCode?startTime="+startTime+"&endTime="+endTime+"&activityId="+self.activityId+"&value="+cost+"';"+
										    "var x = $('#like_button').offset().top;"+
										    "var y = $('#like_button').offset().left;"+
										    "$.ajax({"+
												"type : 'post',"+  
												"async:false,"+ 
												"url : url,"+
												"dataType : 'jsonp',"+
												"jsonp: 'jsonpCallback',"+
												"success : function(data){" +
													"if(data.result!=-1){" +
														"$('#create_goods_code').show();" +
														"var desc = '"+desc+"';"+
														"if(desc.indexOf('$code')){" +
															"desc = desc.replace('$code',data.result);" +
														"}"+
														"$('#create_goods_code').text(desc);"+
														"$('#create_goods_code').css('top', y+10);$('#create_goods_code').css('left', x+10);"+
													"}"+
												"},"+
												"error:function(){ "+ 
													"alert('fail'); "+ 
												"}"+
											"});"+
										"}"+
										"window.fbAsyncInit = function () {"+
									        "FB.init({"+
									          "  appId: '"+appId+"',"+
									          "  status: true,"+
									          "  cookie: true,"+
									           " xfbml: true,"+
									           " oauth: true"+
									      "  });" +
									      "FB.Event.subscribe('edge.create', function(data){"+
												"openCode();" +
											"});"+
											"FB.Event.subscribe('edge.remove', function(data){"+
												"$('#create_goods_code').hide();" +
											"});"+
									   " };"+
									   "$(document).ready(function() {"+
											"initfb(document, 'script', 'facebook-jssdk');"+
										"});"+
										"function initfb(d, s, id)"+
										"{"+
											"var js, fjs = d.getElementsByTagName(s)[0];"+
											"if (d.getElementById(id))"+ 
												"return;"+
											"js = d.createElement(s); js.id = id;"+
											"js.src = '//connect.facebook.net/en_US/all.js#xfbml=1&appId="+appId+"';"+
											"fjs.parentNode.insertBefore(js, fjs);"+
										"}"+
									"</script>"+
									"<div id='create_goods_code' style='display:none;'> "+
								"</body>"+
							"</html>";
        	var share_code = "<html>"+
								"<head>"+
									"<script type='text/javascript' src='https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js'></script>"+
									"<style type='text/css'>"+
										"#create_goods_code {"+
											"background:white;"+
											"color:black;"+
										    "border:1px solid #B3B3B3;"+
										    "font-size:14px;"+
										    "border-radius:5px;"+
										    "-moz-border-radius:5px; /* 老的 Firefox */"+
										    "position:absolute;"+
										    "opacity:.7;"+
										    "width:200px;"+
										    "height:100px;"+
										    "filter:alpha(opacity=70);"+
										    "padding:10px;"+
										"}"+
									"</style>"+
								"</head>"+
								"<body>"+
									"<div onclick='share()' id='share_button'>share</div>"+
									"<div id='fb-root'></div>"+
									"<script type='text/javascript'>"+
										"function openCode() {" +
											"var host = 'mall.inhand.com.cn';" +
											"var url = '/api/redeemcode/getCode?startTime="+startTime+"&endTime="+endTime+"&activityId="+self.activityId+"&value="+cost+"';"+
										    "var x = $('#share_button').offset().top;"+
										    "var y = $('#share_button').offset().left;"+
										    "$.ajax({"+
												"type : 'post',"+  
												"async:false,"+ 
												"url : url,"+
												"dataType : 'jsonp',"+
												"jsonp: 'jsonpCallback',"+
												"success : function(data){"+
													"if(data.result!=-1){" +
														"$('#create_goods_code').show();" +
														"var desc = '"+desc+"';"+
														"if(desc.indexOf('$code')){" +
															"desc = desc.replace('$code',data.result);" +
														"}"+
														"$('#create_goods_code').text(desc);"+
														"$('#create_goods_code').css('top', y+10);$('#create_goods_code').css('left', x+10);"+
													"}"+
												"},"+
												"error:function(){"+
													"alert('fail');"+  
												"}"+ 
											"});"+
										"}"+
										"window.fbAsyncInit = function () {"+
									        "FB.init({"+
									          "  appId: '"+appId+"',"+
									          "  status: true,"+
									          "  cookie: true,"+
									           " xfbml: true,"+
									           " oauth: true"+
									      "  });"+
									   " };"+
									   "$(document).ready(function() {"+
											"initfb(document, 'script', 'facebook-jssdk');"+
										"});"+
										"function initfb(d, s, id)"+
										"{"+
											"var js, fjs = d.getElementsByTagName(s)[0];"+
											"if (d.getElementById(id))"+ 
												"return;"+
											"js = d.createElement(s); js.id = id;"+
											"js.src = '//connect.facebook.net/en_US/all.js#xfbml=1&appId="+appId+"';"+
											"fjs.parentNode.insertBefore(js, fjs);"+
										"}"+
									    "function share(){"+
									    	"FB.ui("+
									        "{"+
									        	"method: 'feed'," +
									        	"name: 'SmartVending'," +
									        	"picture: 'http://121.42.28.70/2.jpg',/*至少300*300*/" +
									        	"description: 'Thank you share.'," +
									        	"caption:'smartvending.inhandnetworks.com',"+
									        	"link: '"+href+"'"+
									        "},"+
								            "function (response) {" +
								            	"if (response && response.post_id) {" +
									            	"$('#create_goods_code').show();" +
									            	"openCode();"+
								            	"}else{" +
								            	"}" +
								           " }"+
									       ");"+
									    "}"+
									"</script>"+
									"<div id='create_goods_code' style='display:none;'> "+
								"</body>"+
							"</html>";
        	$("#like_code").val(like_code);
        	$("#share_code").val(share_code);
        },
        bindBtnEvents:function(){
        	var self=this;
        	$("#sms-config-save").click(function(){
                var config = self.getConfig();
                cloud.util.mask(self.element);
                Service.getFacebookConfig(function(data){
                	if(data){//修改
                		var id= data._id;
                		Service.updateFacebook(id,config,function(data){
                            self.setConfig(data);
                        });
                	}else{//添加
                		Service.addFacebook(config,function(data){
                            self.setConfig(data.result.config);
                        });
                	}
                	cloud.util.unmask(self.element);
                });
                    
            });
        	$("#sms-config-code").click(function(){
        		self.createCode();
        	});
        },
        getData:function(){
        	var self = this;
            cloud.util.mask(this.element);
            Service.getFacebookConfig(function(data){
                if(data){
                	self.setConfig(data);
                }
                cloud.util.unmask(self.element);
            });
        }
	});
	return configuration;
});