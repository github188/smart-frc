define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../../service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	
    	eurl = "gapi";
    	
    }else{
    	
    	eurl = "api";
    }
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-type-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<label style='margin:auto 10px auto 10px;margin-right: 5px;'>"+locale.get({lang:"product_type_name"})+" </label>" +
              "<input style='width:120px' type='text'  id='typename' />&nbsp;&nbsp;"  +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            this.addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            this.editBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("modify");
                    }
                }
            });
            this.deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-type-bar"),
                events: {
                    click: function(){
                    	self.fire("drop");
                    }
                }
            });
            $("#search-type-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
