define(function(require){
	var cloud = require("cloud/base/cloud");
	//var NoticeBar = require("./notice-bar");
	var html = require("text!./list.html");
	var ContentSouth = require("./box-south");
	var layout = require("cloud/lib/plugin/jquery.layout");
    var service = require("./service");
	var content = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.service = service;
			this.businessType = options.businessType;
			this.elements = {
					contentSouth:{
						id:"box-south",
						"class":null
					}
			};
			this._render();
		},
		
		_render:function(){
			this._renderHtml();
			this._renderLayout();
			this._renderContentSouth();
		},
		
		_renderHtml:function(){
			this.element.html(html);
		},
		
		_renderLayout:function(){
			this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                center: {
                    paneSelector: "#" + this.elements.contentSouth.id
                }
            });
        },
		
		_renderContentSouth:function(){
			this.contentSouth = new ContentSouth({
				selector:"#" + this.elements.contentSouth.id,
				service:this.service
			});
		},
		
		destroy:function(){
			this.contentSouth.destroy();
		}
		
	});
	
	return content;
	
});