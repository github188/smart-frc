define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./micsite.html");
	var service = require("./service");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var MicsiteFirmware = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.render();
		},
		render:function(){
			this.renderHtml();//布局
			this.getCurrentUserMessage();//获取当前用户的信息

		},
		renderHtml:function(){
			var self=this;
			this.element.html(html);
			this.layout = this.element.layout({
				defaults: {
					paneClass: "pane",
					spacing_open: 10,
					spacing_closed: 0,
					togglerLength_open: 0,
					togglerLength_closed: 0,
					resizable: false,
					slidable: false
				},
				center: {
					paneSelector: "#micsite-config-container-body"
				}
			});
		},
		getCurrentUserMessage:function(){
			var self=this;
			 service.getUserMessage(function(data) {
				 if(data.result){
					 var username = data.result.name;
					 var email = data.result.email;
					 var roleId = data.result.roleId;
					 var roleName = data.result.roleName;
					 var oid = data.result.oid;//机构ID
					 var token = cloud.Ajax.getAccessToken();
					 var refreshToken = cloud.Ajax._getRefreshToken();
					 var userId = data.result._id;//用户ID
					 var frame = document.getElementById("micsite-config-container-body");
					 var languge= localStorage.getItem("language");
					 var url = "http://m.360yutu.cn:80/index.php?d=login&languge="+languge+"&username="+username +"&token="+token+"&oid="+oid+"&userId="+userId+"&roleName="+roleName+"&refreshToken="+refreshToken;
					 var urlSrc = require.toUrl(url);
					 frame.src=urlSrc;
					 self.containerFrame=frame;
					 self.frameContentWindow = frame.contentWindow;
						
					 $(frame).load(function(){
					 });
				 }
			 });
		}
		
	});
	
	return MicsiteFirmware;
});