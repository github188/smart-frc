define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./replenish.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	require("../css/default.css");
	var contentMsg=require("./content");
	
	var replenish = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.siteId = options.siteId;
			this.display = 30;
			this.pageDisplay = 30;
			
			this.elements = {
					content_el:"replenish-content"
			};
			this._render();
		},
		_render:function(){
			this._renderHtml();
			this._renderContent();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderContent:function(){
			this.content=new contentMsg({
                "container":"#replenish-content"
			});
		}
		
	});	
	return replenish;
    
});