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
        	this._renderSelect();
        	this._renderBtn();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>"+locale.get({lang:"time"})+" </label>" +
              "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />"+
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>~</label>" +
              "<input style='width:120px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;&nbsp;&nbsp;"+
            /*  "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>"+locale.get({lang:"ssid_name"})+" </label>" +
              "<input style='width:200px;' type='text'  id='siteName' />&nbsp;&nbsp;&nbsp;&nbsp;"  +*/
              "<select  id='payStyle' multiple='multiple' name='payStyle' style='width:180px;height: 28px;border-radius: 4px;'>" + //支付方式
              "<option value='1'>" + locale.get({lang: "trade_baifubao"}) + "</option>" +
              "<option value='2'>" + locale.get({lang: "trade_wx_pay"}) + "</option>" +
              "<option value='3'>" + locale.get({lang: "trade_alipay"}) + "</option>" +
              "<option value='4'>" + locale.get({lang: "trade_cash_payment"}) + "</option>" +
              "<option value='5'>" + locale.get({lang: "trade_swing_card"}) + "</option>" +
              "<option value='8'>" + locale.get({lang: "trade_game"}) + "</option>" +
              "<option value='9'>" + locale.get({lang: "trade_soundwave_pay"}) + "</option>" +
              "<option value='10'>" + locale.get({lang: "trade_pos_mach"}) + "</option>" +
              "<option value='11'>" + locale.get({lang: "one_card_solution"}) + "</option>" +
              "<option value='12'>" + locale.get({lang: "trade_abc_palm_bank"}) + "</option>" +
              "<option value='13'>" + locale.get({lang: "wechat_reversescan_pay"}) + "</option>" +
              "<option value='14'>" + locale.get({lang: "trade_vip"}) + "</option>" +
              "<option value='15'>" + locale.get({lang: "trade_best_pay"}) + "</option>" +
              "<option value='16'>" + locale.get({lang: "trade_jd_pay"}) + "</option>" +
              "<option value='19'>" + locale.get({lang: "trade_reversescan_pay"}) + "</option>" +
              "<option value='21'>" + locale.get({lang: "UnionPay_payment"}) + "</option>" +
              "</select>&nbsp;&nbsp;" +
              "<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>"+locale.get({lang:"user_automat"})+" </label>" +
              "<input style='width:200px;' type='text'  id='assetIds' placeholder="+locale.get({lang:"the_vending_machine_number_is_separated_by_a_comma"})+">"  +
              "</div>");
              this.element.append($htmls);
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
                  $("#payStyle").multiselect({
                      header: true,
                      checkAllText: locale.get({lang: "check_all"}),
                      uncheckAllText: locale.get({lang: "uncheck_all"}),
                      noneSelectedText: locale.get({lang: "all_payment_types"}),
                      selectedText: "# " + locale.get({lang: "is_selected"}),
                      minWidth: 180,
                      height: 120
                  });
              });
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: false,
                    onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date($("#startTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                });
				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000),"yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch",
                    timepicker: false,
                    onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                    onClose: function(a, b) {
                    	var date = new Date(new Date($("#endTime").val()).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    },
                });
				$("#startTime").change(function(){ 
					var startTime = $("#startTime").val();
	 				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date(startTime)).getTime()+1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd"));
				});
				$("#endTime").change(function(){ 
					var endTime = $("#endTime").val();
	 				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date(endTime)).getTime()-1000 * 60 * 60 * 24 * 6)/1000),"yyyy/MM/dd"));
				});
			});
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
            
            var exportBtn = new Button({
                text: locale.get({lang: "export"}),
                container: $("#search-bar"),
                events: {
                    click: function() {
                        self.fire("exReport");
                    }
                }
            });
            $("#"+exportBtn.id).addClass("readClass");
           
            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
           
        }
        
    });
    
    return NoticeBar;
    
});
