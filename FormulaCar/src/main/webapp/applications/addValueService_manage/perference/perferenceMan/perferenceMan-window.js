define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./perferenceMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery.datetimepicker");
    var Service = require("../../discount/service");
    var DeviceList = require("./deviceList/list");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.discountId = options.discountId;
            this._renderWindow();
            this.basedata=null;
            this.deviceLists = [];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "discount_preferences"}),
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
                    },
                    scope: this
                }
            });
            $("#dataTo").append("<label>"+locale.get('to')+"</label>");
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#lastBase").val(locale.get({lang: "price_step"}));
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#nowBase").val(locale.get({lang: "discount_activate"}));
            this._renderSelect();
            this._renderBtn();
            if(this.discountId){
            	this.getData();
            }
        },
        getData:function(){
        	var self = this;
        	Service.getDiscountById(self.discountId,function(data){
        		$("#discountName").val(data.result.name==null?"":data.result.name);
        		$("#coupon").val(data.result.basicConfig.coupon==null?"":data.result.basicConfig.coupon/100);
        		$("#threshold").val(data.result.basicConfig.threshold==null?"":data.result.basicConfig.threshold/100);
        		var startTime= cloud.util.dateFormat(new Date(data.result.basicConfig.startTime), "yyyy-MM-dd");
        		var endTime= cloud.util.dateFormat(new Date(data.result.basicConfig.endTime), "yyyy-MM-dd");
				$("#startTime").val(startTime);
				$("#endTime").val(endTime);
        		$("#user_couponc_count").val(data.result.useConfig.user_couponc_count==null?"":data.result.useConfig.user_couponc_count);
        		$("#coupon_amount").val(data.result.useConfig.coupon_amount==null?"":data.result.useConfig.coupon_amount/100);
        		if(data.result.useConfig.isFollow == 1){
        			$("#isFollow").attr("checked",true);
        		}
        		self.deviceLists = data.result.deviceIds;
        	});
        },
        _renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
				
				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() + 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d',
					step:1,
					startDate:'-1970/01/08',
					timepicker: false,
					lang:locale.current() === 1 ? "en" : "ch"
				})
			});
		},
        _renderBtn: function() {
        	var self = this;
        	$("#nextBase").bind("click", function() {
        		var discountName = $("#discountName").val();
        		var coupon = $("#coupon").val();
        		var threshold = $("#threshold").val();
        		var startTime = $("#startTime").val();
        		var endTime = $("#endTime").val();
        		var start = new Date(startTime).getTime()/1000;
        		var end = new Date(endTime).getTime()/1000;
        		
        		var myDate = new Date();
                var full = myDate.getFullYear();
                var month = myDate.getMonth() + 1;
                var day = myDate.getDate();
                var date = full + "/" + month + "/" + day;
                var currentTime = (new Date(date + " 00:00:00")).getTime() / 1000;
        		
        		var user_couponc_count = $("#user_couponc_count").val();
        		var coupon_amount = $("#coupon_amount").val();
        		
                if(discountName==null||discountName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"automat_activity_error"});
           			return;
           		}
                if(coupon==null||coupon.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_discount_percentages"});
           			return;
           		}else if(coupon > 1 || coupon == 1){
           			dialog.render({lang:"discount_ratio_is_not_greater_than_or_equal_to_1"});
           			return;
           		}else if(coupon < 0.01){
           			dialog.render({lang:"discount_percentages_not_less_than_1_yuan"});
           			return;
           		}
                if(threshold==null||threshold.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_discount_threshold_amount"});
           			return;
           		}else if(threshold < 0.01){
           			dialog.render({lang:"discount_threshold_amount_not_less_than_1_yuan"});
           			return;
           		}
                
                if(start){
                	if(start<currentTime){
						dialog.render({lang:"the_start_time_cannot_be_less_than_the_current_time"});
						return;
					}
                }
                if(end){
					if(end<start){
						dialog.render({lang:"endtime_greater_starttime"});
						return;
					}
				}
                var strP=/^[0-9]*[1-9][0-9]*$/;
                if(user_couponc_count==null||user_couponc_count.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_user_couponc_count"});
           			return;
           		}else if(!strP.test(user_couponc_count) ||  user_couponc_count < 1){
           			dialog.render({lang:"user_couponc_count_not_less_than_1_yuan"});
           			return;
           		}
                if(coupon_amount==null||coupon_amount.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_coupon_amount"});
           			return;
           		}else if(coupon_amount < 0.01){
           			dialog.render({lang:"coupon_amount_not_less_than_1_yuan"});
           			return;
           		}
//           		else if(coupon_amount < threshold){
//           			dialog.render({lang:"the_total_discount_limit_must_be_greater_than_a_single_discount_limit"});
//           			return;
//           		}
                var isFollow='';
                if($("#isFollow").attr("checked")){
                	isFollow =1;
                }
                var basicConfig={
                		coupon:coupon*100,
                        threshold:threshold*100,
                        startTime:start,
                        endTime:end
                }
                var useConfig={
                		user_couponc_count:user_couponc_count,
                		coupon_amount:coupon_amount*100,
                		payStyle:2,
                		isFollow:isFollow
                }
                self.basedata={
                		name:discountName,
                		basicConfig:basicConfig,
                		useConfig:useConfig
                };
            						
                $("#devicelist").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                	               
                self.deviceList = new DeviceList({
                    selector: "#devicelistInfo",
                    adWindow: self.adWindow,
                    deviceLists:self.deviceLists,
                    events: {
                        "rendTableData": function() {
                            
                        }
                    }
                });
        	});
        	$("#lastBase").bind("click", function() {
        		$("#devicelist").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
        	});
            $("#saveBase").bind("click", function() {
            	self.deviceLists=[];
            	var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                		self.deviceLists.push(id);
                    }
                }
        		var finalData = self.basedata;
        		finalData.deviceIds = self.deviceLists;
        		finalData.type = 2;
        		finalData.status = 1;
        		if(self.discountId){
        			Service.updateDiscount(finalData,self.discountId,function(data){
            			self.fire("getDiscountList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addDiscount(finalData,function(data){
            			self.fire("getDiscountList");
            			self.adWindow.destroy();
            		});
        		}
        		
        	});
            $("#nowBase").bind("click", function() {
            	self.deviceLists=[];
            	var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                		self.deviceLists.push(id);
                    }
                }
        		var finalData = self.basedata;
        		finalData.deviceIds = self.deviceLists;
        		finalData.type = 2;
        		finalData.status = 2;
        		if(self.discountId){
        			Service.updateDiscount(finalData,self.discountId,function(data){
            			self.fire("getDiscountList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addDiscount(finalData,function(data){
            			self.fire("getDiscountList");
            			self.adWindow.destroy();
            		});
        		}
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