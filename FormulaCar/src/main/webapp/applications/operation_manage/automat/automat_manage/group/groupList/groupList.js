/**
 * Copyright (c) 2007-2014, InHand Networks All Rights Reserved.
 * @author jerolin
 */
define(function(require) {
    require("cloud/base/cloud");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.layout");
    var groupListHtml = require("text!./groupList.html");
    var Content = require("./content/content.js");
    var Service = require("./service.js");
    require("cloud/lib/plugin/jquery.qtip");
    var Tag = require("./tag-group.js");
    var columns = [ {
		"title":locale.get({lang:"automat_group_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"sortable":false,
		"width" : "100%"
	},{
		"title" : "id",
		"dataIndex" : "_id",
		"cls" : "_id" + " " + "hide"
	}];
    var groupList = Class.create(cloud.Component, {
        moduleName: "automat_group_group",
        initialize: function($super, options) {
            $super(options);
            this.element.html(groupListHtml);
            this.elements = {
            	nav:{
            		"id":"automat_group_group_nav"
            	},
            	content:{
            		"id":"automat_group_group_content"
            	}
            };
            this.service = Service;
            this._render();
        },
        _render:function(){
        	this._renderLayout();
        	this._renderGroupNav();
            this._renderContent();
        },
        _renderLayout: function(){
        	$("#automat_group_group_info").css({"position":"relative"});
			$("#automat_group_group_info").css({"height":($("#automat_group").height()*0.99)});
            this.element.layout({
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
                    size: 35
                },
                center: {
                    paneSelector: "#" + this.elements.content.id
                }
            });
        },
        _renderGroupNav:function(){
        	 var self = this;
        	 var html = "<div style='width:100%;height:29px;' id='group_nav'></div>";
        	 $("#"+this.elements.nav.id).append(html);
        	 self.group =  new Tag({
        		 container:"#group_nav",
        		 service:self.service,
        		 selectRowId:null,
        		 events: {
        			 addGroup: function(data){
        				 self.groupContent.add(data);
                     },
                     deleteGroup:function(){
                    	 self.groupContent.del();
                     },
                     updateGroup:function(_id,name){
                    	 self.groupContent.update(_id,name);
                     },
                     scope: self
                 }
        	 });
        },
        _renderContent:function(){
        	var self = this;
        	this.groupContent = new Content({
        		container:"#automat_group_group_content",
        		columns:columns,
        		service:self.service,
        		events:{
        			"click":function(data){
        				self.group.selectRowId = data;
        			},
        			"clearSelectRowId":function(){
        				self.group.selectRowId = null;
        			},
        			scope:self
        		}
        	});
        }
    });

    return groupList;
});