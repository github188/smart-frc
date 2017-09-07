define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updatespecialoffer.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var DeviceListInfo = require("../config/deviceList");
    var columns = [{
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "25%"
    }];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.specialData = {};
            this.basedata = {};
            this.deviceLists = [];
            this.specialId = options.specialId;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "special_offer_config"}),
                top: "center",
                left: "center",
                height: 650,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                        $("a").css("margin-top","-3px");
                        $("a").css("margin-right","0px");
                        $("a").css("margin-bottom","0px");
                        $("a").css("margin-left","6px");
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this.renderSelect();
            this.renderData();
            this._renderBtn();
            
            //this.renderDeviceTable();
            
        },
        renderSelect:function(){

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
        renderData:function(){
        	var self = this;

        	Service.getSpecialOfferById(self.specialId,function(data){
        		self.specialData = data.result;
        		$("#specialname").val(data.result.name);
        		$("#specialtype").val(data.result.type);
        		if(data.result.type == 3){//立减
        			$("#special_amount").val(data.result.config.amount);
        			$("#specialofferPayStyle").show();
        			//$("#special_threshold").val(data.result.config.threshold);
        			$("#amount").show();
        			$("#getProduct").hide();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        		}else if(data.result.type == 4){//折扣
        			$("#special_scale").val(data.result.config.rate);
        			$("#specialofferPayStyle").show();
        			//$("#special_threshold").val(data.result.config.threshold);
        			$("#scale").show();
        			//$("#consume").show();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#getProduct").hide();
        		}else if(data.result.type == 1){//送水
        			$("#wechat_appid").val(data.result.config.appId);
        			$("#wechat_appsecret").val(data.result.config.appSecret);
        			$("#appid").show();
        			$("#appsecret").show();
        			$("#notice").show();
        			$("#notice1").show();
        			$("#notice2").show();
        			$("#noticeDiv").show();
        			$("#getProduct").show();
        			$("#pickupMethod option[value='"+data.result.pickupMethod+"']").attr("selected","selected");
        		}else if(data.result.type == 2){
        			$("#specialofferPayStyle").show();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#getProduct").hide();
        		}
        		
				$("#startTime").val(cloud.util.dateFormat(new Date(data.result.startTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                        
                        
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                       // b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));        				
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date(data.result.endTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                       // b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});  
				
				var payStyles = data.result.payStyles;
				if(payStyles != null && payStyles.length>0){
					
					for (var i = 0; i < payStyles.length; i++) {
						
                        $('.ui-multiselect-checkboxes input').each(function() {
                        	
                            if ($(this).attr("name") == "multiselect_payStyle" && payStyles[i] == this.value) {
                            	
                            	$(this).click();
                            }
                        });
                    }
					
				}
        		
        	},self);
        	
        },
        _renderBtn: function() {
        	var self = this;
        	var url = "http://"+window.location.hostname + "/app/wechat_handshake";
        	$("#noticeUrl").text(url);
        	$("#noticeToken").text("C2B8A36D2E15F66JC1E63D36H8FAD1SC");
            $("#specialtype").bind("change",function(){
            	if($(this).val() == 3){//立减
        			$("#amount").show();
        			$("#specialofferPayStyle").show();
        			
        			$("#scale").hide();
        			$("#appid").hide();
        			$("#appsecret").hide();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#noticeDiv").hide();
        			$("#getProduct").hide();
        			
        		}else if($(this).val() == 4){//折扣
        			$("#scale").show();
        			$("#specialofferPayStyle").show();
        			
        			$("#amount").hide();
        			$("#appid").hide();
        			$("#appsecret").hide();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#noticeDiv").hide();
        			$("#getProduct").hide();
        		}else if($(this).val() == 1){
        			$("#appid").show();
        			$("#appsecret").show();
        			$("#notice").show();
        			$("#notice1").show();
        			$("#notice2").show();
        			$("#noticeDiv").show();
        			
        			$("#amount").hide();
        			$("#getProduct").show();
        			$("#scale").hide();
        		}else{
        			$("#amount").hide();
        			$("#specialofferPayStyle").show();
        			$("#scale").hide();
        			$("#appid").hide();
        			$("#appsecret").hide();
        			$("#notice").hide();
        			$("#notice1").hide();
        			$("#notice2").hide();
        			$("#noticeDiv").hide();
        			$("#getProduct").hide();
        		}
        		
        		
        	});
        	
        	$("#nextBase").bind("click", function() {
 //       		self.deviceLists = [];
        		var specialname = $("#specialname").val();
        		var specialtype = $("#specialtype").val();
        		var amount = $("#special_amount").val();
        		var scale = $("#special_scale").val();
        		//var consume = $("#special_threshold").val();
        		
        		var appid = $("#wechat_appid").val();
        		var appsecret = $("#wechat_appsecret").val();
        		
        		var startTime = (new Date($("#startTime").val() + " 00:00:00")).getTime() / 1000;
        		var endTime = (new Date($("#endTime").val() + " 23:59:59")).getTime() / 1000;
        		
        		 var pickupMethod = $("#pickupMethod").find("option:selected").val();
                
        		var payStyle = $("#payStyle").multiselect("getChecked").map(function() {//支付方式
                    return this.value;
                }).get();
        		
        		if(specialname==null||specialname.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_special_name"});
           			return;
           		}

        		//var amount = $("#specialamount").val();
        		if(specialtype == 3 && (amount == null || amount.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_special_amount"});
           			return;
        		}
        		if(specialtype == 4 && (scale == null || scale.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_special_rate"});
           			return;
        		}
        		
/*        		if((specialtype == 3 || specialtype == 4) && (consume == null || consume.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_special_consume"});
           			return;
        		}*/
        		if((specialtype == 1) && (appid == null || appid.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_appid"});
           			return;
        		}
        		if((specialtype == 1) && (appsecret == null || appsecret.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_appSecret"});
           			return;
        		}
           		var bool=/^[0-9]{0}([0-9]|[.])+$/;
        		if(specialtype==3&&(!bool.test(amount))){
        			dialog.render({lang:"amount_must_be_number"});
        			return;
        		}
        		var bool1=/^([1-9](.[0-9])?||10)$/;
        		if(specialtype==4&&(!bool1.test(scale))){
        			dialog.render({lang:"scale_must_be_number"});
        			return;
        		}
        		amount=parseFloat(amount);
        		//consume=parseFloat(consume);
/*        		if(specialtype==3&&!(amount==0&&consume==0)&&(amount>=consume)){
        			dialog.render({lang:"amount_not_gt_consume"});
        			return;
        		}*/
        		if (startTime>endTime) {
        			dialog.render({lang:"starttime_gt_endtime"});
           			return;
				}
        		var config = {};
        		if(specialtype == 3){//立减
        			config.amount = amount;
        			//config.threshold = consume;
        		}else if(specialtype == 4){//折扣
        			config.rate = scale;
        			//config.threshold = consume;
        		}else if(specialtype == 1){//送水
        			config.appId = appid;
        			config.appSecret = appsecret;
        		}
        		
                self.basedata={
                		name:specialname,
                		type:parseInt(specialtype),
                		startTime:startTime,
                		endTime:endTime,
                		config:config,
                		payStyles:payStyle,
                		pickupMethod:pickupMethod//取货方式
                };
            					
				$("#devicelist").css("display", "block");
                $("#selfConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                this.Devicelist = new DeviceListInfo({
                    selector: "#devicelistInfo",
                    automatWindow: self.adWindow,
                    basedata:self.basedata,
                    specialData:self.specialData,
                    events: {
                        "rendTableData": function() {
                            self.fire("getSpecialList");
                        }
                    }
                });

        	});
        },

        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});