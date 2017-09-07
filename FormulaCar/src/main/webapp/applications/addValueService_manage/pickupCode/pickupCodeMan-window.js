define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./pickupCodeMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var Service=require("./service");
    var IntroducedProduct = require("./chooseGood/chooseproduct-window"); 
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "pickup_code_management"}),
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
            this.adWindow.show();
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#choose").val(locale.get({lang: "product_choose"}));
            this.render();
           
    		
        },
        render:function(){
        	this.bindEvent();
        	this.renderTime();
        },
        bindEvent:function(){
        	var self = this;
        	 $("#choose").bind('click', function() {
        		 if (this.introPro) {
                     this.introPro.destroy();
                 }
                 this.introPro = new IntroducedProduct({
                     selector: "body",
                     events: {
                         "getGood": function(id,name) {
                        	 $("#goods").val(name);
                        	 $("#goodsId").val(id);
                         }
                     }
                 });
        	 });
        	 $("#style").bind('change', function() {
        		 var style = $("#style").find("option:selected").val();
        		 if(style == '1'){
        			 $("#baseGoods").css("display","none");
        			 $("#basePrice").css("display","block");
        		 }else if(style == '2'){
        			 $("#baseGoods").css("display","block");
        			 $("#basePrice").css("display","none");
        		 }
        	 });
        	 $("#saveBase").bind('click', function() {
        		 var strP=/^\d+(\.\d+)?$/; 
        		 var count = $("#count").val();//取货码数量
        		 var style = $("#style").find("option:selected").val();//类型
        		 
        		 if(count == null || count == 0){
      			    dialog.render({lang: "please_enter_pickup_code_count"});
                     return;
      		     }
        		
       	         if(!strP.test(count)){
       	    	    dialog.render({lang:"pickup_code_count_isNubmer"});
       	    	    return; 
       	        }
        		 if(style == 0){
       			    dialog.render({lang: "please_select_pickup_code_type"});
                    return;
       		     }
        		 
        		 var startTime =$("#startTime").val();//有效期  开始时间
        		 var endTime = $("#endTime").val();//有效期 结束时间
        		 if(startTime){
             		startTime = (new Date(startTime)).getTime()/1000;
         		 }
             	 if(endTime){
             	 	endTime = (new Date(endTime)).getTime()/1000;
         		 }
        		 var condition="";
        		 var goodsName="";
        		 if(style == 1){//基于价格
        			 condition = $("#price").val()* 100;
        			 if(condition == null || condition == 0){
           			    dialog.render({lang: "please_enter_pickup_code_price"});
                        return;
           		     }
        			 if(!strP.test(condition)){
            	    	    dialog.render({lang:"pickup_code_price_isNubmer"});
            	    	    return; 
            	      }
        		 }else if(style == 2){//基于商品
        			 condition = $("#goodsId").val();
        			 goodsName = $("#goods").val();
        			 if(condition == null || condition == 0){
            			 dialog.render({lang: "please_enter_pickup_code_good"});
                         return;
            		 }
        		 }
        		 var config={
        				 startTime:startTime,
        				 endTime:endTime,
        				 type:style,
        				 condition:condition,
        				 goodsName:goodsName
        		 };
        		 var data={
        				 count:count,
        				 config:config
        		 };
        		 Service.addCode(data,function(data){
        			 console.log(data);
        			 self.adWindow.destroy();  
        			 self.fire("getcodeList");
        		 });
        	 });
        	 
        },
        renderTime:function(){
        	var self = this;
        	$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")+ " 00:00").datetimepicker({
					format:'Y-m-d H:i',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: true,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd hh:mm"));
                        
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                       // b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()+1000 * 60 * 60 * 24 * 15)/1000),"yyyy-MM-dd")+ " 23:59").datetimepicker({
					format:'Y-m-d H:i',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: true,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd hh:mm"));
                    },
                    onClose: function(a, b) {
                    	var startTime = $("#startTime").val();
                        if(startTime){
                    		startTime = (new Date(startTime)).getTime()/1000;
                    		var payment_cycle = 3;
            				var d = new Date()
            				d.setTime(startTime * 1000);
            				var year = d.getFullYear();
            				var month=d.getMonth() ;
            				var month_ = d.getMonth()+1;
            				var date = d.getDate();
            				
            				var dates = new Date(year,month,date);
            				dates.setMonth(dates.getMonth()+parseInt(payment_cycle));
            				dates = (new Date(dates)).getTime() / 1000;//结束时间的最大值
            				
            				var date = (new Date(a)).getTime() / 1000;
            				
            				if(date > dates){
            					$("#endTime").val("");
            					dialog.render({lang: "pick_up_the_code_valid_for_not_more_than_3_months"});
            				}else if(date < startTime ){
            					$("#endTime").val("");
            					dialog.render({lang: "start_time_is_not_greater_than_the_end_time"});
            				}
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