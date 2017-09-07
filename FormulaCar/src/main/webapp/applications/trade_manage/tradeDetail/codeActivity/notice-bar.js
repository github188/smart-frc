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
              "<label style='margin:auto 10px auto 10px;margin-right: 2px;font-size: 12px;'>"+locale.get({lang:"trade_claim_number"})+" </label>" +
              "<input style='width:200px' type='text'  id='codeNo' />&nbsp;&nbsp;"  +
              "<select id='status'  name='status' style='width:130px;  height: 28px; '>"+
	               "<option value='-1'>所有取货码状态</option>"+
	               "<option value='0'>可用</option>"+
	               "<option value='1'>不可用</option>"+
	               "<option value='2'>未启用</option>"+
	          "</select>&nbsp;&nbsp;"+
	          "<select id='type'  name='type' style='width:130px;  height: 28px; '>"+
              "<option value='-1'>所有取货码类型</option>"+
              "<option value='1'>商城</option>"+
              "<option value='2'>关注有奖</option>"+
              "<option value='3'>调查问卷</option>"+
              "</select>&nbsp;&nbsp;"+
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
            
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
