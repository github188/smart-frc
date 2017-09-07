define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("./service");
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
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<label style='margin:auto 10px auto 10px;margin-right: 2px;'>"+locale.get({lang:"trade_claim_number"})+" </label>" +
              "<input style='width:200px' type='text'  id='codeNo' />&nbsp;&nbsp;"  +
              "<label style='margin:auto 10px auto 10px;margin-right: 2px;'>"+locale.get({lang:"automat_no1"})+" </label>" +
              "<input style='width:200px' type='text'  id='assetId' />"  +
              "</div>");
              this.element.append($htmls);
		},
        _renderBtn: function(){
            var self = this;
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            var writeBtn = new Button({
                text: locale.get({lang:"write_off"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                        self.fire("writeoff");
                    }
                }
            });
            
            if(permission.app("transaction_detail").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
