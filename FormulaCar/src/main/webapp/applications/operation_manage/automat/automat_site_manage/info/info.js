/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var infoHtml = require("text!./info.html");
	var validator = require("cloud/components/validator");
	require("../css/table.css");
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(infoHtml);
			this.type = options.type;
			this.service = options.service;
			this.infoId = options.id;
			locale.render({element:this.element});
            this._render();
		},
		_render:function(){
			this._renderBtn();
			if(this.type  == "info"){
				this.setInfoData();
			}
		},
		_renderBtn:function(){
			var self = this;
			/*添加时时的添加按钮*/
			 $("#automat_site_add").bind("click",function(){
				 self.fire("click");
			 });
			//取消
			    $("#product-config-cancel").bind("click",function(){
			    	self.fire("close");
			    });
			/*this.addButton = new Button({
				container: this.element.find("#automat_site_add"),
                text: locale.get({lang:"submit"}),
				lang:"{text:submit,title:submit}",
                imgCls: "cloud-icon-yes",
                events: {
                    click: function() {
                    	
                    },
                    scope: this
                }
			});*/
		},
		
		setInfoData:function(){
			var self = this;
			var id = self.infoId;
			cloud.util.mask("#add_or_edit_site");
			self.service.getSiteById(id,function(data){
				$("#automat_site_name").val(data.result.name==null?"":data.result.name);
				$("#automat_site_address").val(data.result.address==null?"":data.result.address);
				$("#automat_site_desc").val(data.result.description==null?"":data.result.description);
				cloud.util.unmask("#add_or_edit_site");
			}, self);
		}
		
	});	
	return InfoModel;
    
});