define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var infoHtml = require("text!./info.html");
	var validator = require("cloud/components/validator");
	require("./css/table.css");
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(infoHtml);
			locale.render({element:this.element});
			$("#trade-info").css("display","block");
			$("#trade-info").css("z-index","9999");
			
			var height = document.body.scrollHeight -115;
			$("#add_view").css("height",height);
			
			this._render();
		},
		_render:function(){
			this._renderBtn();
		},
		_renderBtn:function(){
			var self = this;
			
			$("#automat-site-cancel").bind("click",function(){
		    	self.fire("hide");
		    });
			$("#automat_site_add").bind("click",function(){
		    	self.fire("refund");
		    });
		},
		
	});	
	return InfoModel;
    
});