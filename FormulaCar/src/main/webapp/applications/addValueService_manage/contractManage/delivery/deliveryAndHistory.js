define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./deliveryAndHistory.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("cloud/lib/plugin/jquery.datetimepicker");
	var Service=require("../service");
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"pay_contract"}),
				top: "center",
				left: "center",
				height:150,
				width: 650,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this.renderTime();
			this._renderBtn();
		},
		 renderTime:function(){
	        	$(function(){
					$("#deliveryTimes").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
					$("#deliveryTimes").val("");
				});
	        },
	    formatDate:function (date) {  
	        var y = date.getFullYear();  
	        var m = date.getMonth() + 1;  
	        m = m < 10 ? '0' + m : m;  
	        var d = date.getDate();  
	        d = d < 10 ? ('0' + d) : d;  
	        return y + '-' + m + '-' + d;  
	    },
		_renderBtn:function(){
			var self = this;
			 //取消
		    $("#cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#input-submit").bind("click",function(){
		    	var deliveryTimes = $("#deliveryTimes").val();
		    	deliveryTimes = (new Date(deliveryTimes)).getTime()/1000;
		    	var myDate = new Date();
		    	var year =myDate.getFullYear(); 
		    	var month = myDate.getMonth()+1;
		    	if(month<10){
		    		month="0"+month;
		    	}
		    	var date = myDate.getDate();
		    	var define_startTime = year+"/"+month+"/"+date;
		    	var createTime = (new Date(define_startTime)).getTime() / 1000;
		    	
		    	if(deliveryTimes == null || deliveryTimes == 0){
     			    dialog.render({lang: "please_enter_deliveryTime"});
                    return;
     		    }
		    	Service.getContractById(self.id,function(data){
		    		if(data && data.result){
		    			var historyInfo={
		    					deliveryTime:deliveryTimes,
		    					createTime:createTime
		    			};
		    			if(data.result.historyInfo){
		    				data.result.historyInfo.push(historyInfo);
		    			}else{
		    				var list=[];
		    				list.push(historyInfo);
		    				data.result.historyInfo = list;
		    			}
		    			var deliveryDate = data.result.deliveryDate;//租金交付日
		    			var collectionDay = data.result.collectionDay;//租金催收日
		    			var cycle = data.result.cycle;
		    			
	     				
	     				var d = new Date()
        				d.setTime(deliveryDate * 1000);
        				var year = d.getFullYear();
        				var month=d.getMonth() ;
        				var date = d.getDate();
        				
        				var deliverydates = new Date(year,month,date);
        				deliverydates.setMonth(deliverydates.getMonth()+parseInt(cycle));
        				deliverydates = self.formatDate(deliverydates);
	     				
	     				console.log();
	     				var deliveryDate_new = new Date(deliverydates).getTime() / 1000;
	     				var collectionDay_new =new Date((new Date(deliverydates)).getTime()-1000 * 60 * 60 * 24 * 15)/1000;
		    			
	     				data.result.deliveryDate = deliveryDate_new;
	     				data.result.collectionDay = collectionDay_new;
	     				
		    			console.log(data.result);
		    			
		    			Service.updateContract(data.result,self.id,function(data){
		    				console.log(data.result);
					    	if(data.error != null){
    	                	   if(data.error_code == "70042"){
    							   dialog.render({lang:"contract_number_exists"});
    							   return;
    						   } 
    	                	}else{
    	                		self.fire("getcontractList");
    					        self.window.destroy();    		 	             	
    						}
					   });
		    		}
		    	});
	        });
		},

		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return Window;
});