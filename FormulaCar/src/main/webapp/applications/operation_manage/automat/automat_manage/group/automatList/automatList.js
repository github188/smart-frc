define(function(require) {
    require("cloud/base/cloud");
    var Toolbar = require("cloud/components/toolbar");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.layout");
    var automatListHtml = require("text!./automatList.html");
    var Content = require("./content/content.js");
    var Tag = require("./tag-automat.js");
    //Create class TagOverview
    var columns = [ {
		"title":locale.get({lang:"automat_index"}),
		"dataIndex" : "automatIndex",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "automatCreateTime",
		"cls" : null,
		"width" : "15%"
	}, {
		"title":locale.get({lang:"automat_no1"}),
		"dataIndex" : "automatSiteNo",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"automat_site_name"}),
		"dataIndex" : "automatSiteName",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"automat_site_group"}),
		"dataIndex" : "automatSiteGroup",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"automat_site_status"}),
		"dataIndex" : "automatSiteStatus",
		"cls" : null,
		"width" : "25%"
	}, {
		"title":locale.get({lang:"automat_site_address"}),
		"dataIndex" : "automatSiteAddress",
		"cls" : null,
		"width" : "25%"
	}];
    var groupList = Class.create(cloud.Component, {
        moduleName: "automat_group_automat",
        initialize: function($super, options) {
            $super(options);
            this.element.html(automatListHtml);
            this.elements = {
            	nav:{
            		"id":"automat_group_automat_nav"
            	},
            	content:{
            		"id":"automat_group_automat_content"
            	}
            };
            this._render();
        },
        _render:function(){
        	this._renderLayout();
        	this._renderAutomatNav();
           this._renderContent();
        },
        _renderLayout: function(){
        	$("#automat_group_automat_info").css({"position":"relative"});
			$("#automat_group_automat_info").css({"height":($("#automat_group").height()*0.99)+"px"});
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
        _renderAutomatNav:function(){
        	var self = this;
	       	 var html = "<div style='width:100%;height:29px;' id='automat_nav'></div>";
	       	 $("#"+this.elements.nav.id).append(html);
	       	 var test =  new Tag({
	       		 container:"#automat_nav"
	       	 });
        },
        _renderContent:function(){
        	this.automatContent = new Content({
        		container:"#automat_group_automat_content",
        		columns:columns
        	});
        }
    });

    return groupList;
});