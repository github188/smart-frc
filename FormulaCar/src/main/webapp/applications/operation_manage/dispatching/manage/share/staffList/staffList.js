/**
 * Copyright (c) 2007-2014, InHand Networks All Rights Reserved.
 * @author jerolin
 */
define(function(require) {
    require("cloud/base/cloud");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.layout");
    var staffListHtml = require("text!./staffList.html");
    var Content = require("./content/content.js");
    //Create class TagOverview
    var columns = [ {
		"title":locale.get({lang:"automat_list_member"}),
		"dataIndex" : "staffName",
		"cls" : null,
		"sortable":false,
		"width" : "100%"
	}];
    var staffList = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(staffListHtml);
            this.elements = {
            	nav:{
            		"id":"manage_share_staff_nav"
            	},
            	content:{
            		"id":"manage_share_staff_content"
            	}
            };
            this.moduleName = "manage_share_staff";
            this._render();
        },
        _render:function(){
        	this._renderLayout();
        	this._renderNav();
            this._renderContent();
        },
        _renderLayout: function(){
        	$("#manage_share_staff_info").css({"position":"relative"});
			$("#manage_share_staff_info").css({"height":($("#dispatching_share").height()*0.99)+"px"});
            this.layout = $("#manage_share_staff_info").layout({
                defaults: {
                    paneClass: "pane",
                    "togglerLength_open": 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    "spacing_open": 1,
                    "spacing_closed": 1,
                    "togglerLength_closed": 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                north: {
                    paneSelector: "#" + this.elements.nav.id,
                    size: 29
                },
                center: {
                    paneSelector: "#" + this.elements.content.id
                }
            });
        },
        _renderNav:function(){
        	 var self = this;
        	 var html = "<div style='width:50%;float:left;'><label style='text-align:left;'>"+locale.get("group")+"</label></div>"+
        	 			"<div style='width:50%;float:right;text-align:right;'><label style='width:50%' id='staff_add'></label></div>";
        	 $("#"+this.elements.nav.id).append(html);
             this.addBtn = new Button({
            	 container:"#staff_add",
                 imgCls: "cloud-icon-add-tag",
                 id: this.moduleName + "-add-button",
                 lang:"{title:delete_tag}",
                 events: {
                     scope: self
                 }
             });
        },
        _renderContent:function(){
        	var self = this;
        	this.content = new Content({
        		container:"#"+self.elements.content.id,
        		columns:columns
        	});
        },
        destroy:function(){
        	if(this.layout){
        		this.layout.destroy();
        	}
        	if(this.content){
        		this.content.destroy();
        	}
        	if(this.addBtn){
        		this.addBtn.destroy();
        	}
        }
    });

    return staffList;
});