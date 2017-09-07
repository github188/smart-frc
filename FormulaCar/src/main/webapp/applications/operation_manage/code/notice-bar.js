define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../service");
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
              "<select id='sourceType'  name='sourceType' style='width:194px;height: 28px;margin-right: -10px;'>"+
              "<option value='0'>"+locale.get({lang:"the_style_of_code"})+"</option>"+
              "<option value='1'>"+locale.get({lang:"code_of_baifubao"})+"</option>"+
              "<option value='2'>"+locale.get({lang:"code_of_wechat"})+"</option>"+
              "<option value='3'>"+locale.get({lang:"code_of_alipay"})+"</option>"+
              "<option value='15'>"+locale.get({lang:"code_of_bestpay"})+"</option>"+
              "<option value='16'>"+locale.get({lang:"code_of_jdpay"})+"</option>"+
              "<option value='7'>"+locale.get({lang:"trade_claim_number"})+"</option>"+
              "<option value='21'>"+locale.get({lang:"code_of_UnionPay_payment"})+"</option>"+
              "<option value='23'>扫码支付取货码</option>"+
              "<option value='24'>融e联取货码</option>"+
              "</select>&nbsp;&nbsp;"+
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
