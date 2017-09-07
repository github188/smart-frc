define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./editContract.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var deviceConfigInfo = require("./deviceList/config");
    var Service=require("../service");
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            this.basedata = {};
            this.deviceInfo=[];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "contract_management"}),
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
            
            this.render();
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#cooperation_mode").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
    		$("#cooperation_mode").append("<option value='1'>"+locale.get({lang: "contract_lease"})+"</option>");
    		$("#cooperation_mode").append("<option value='2'>"+locale.get({lang: "contract_buy"})+"</option>");
    		$("#deliveryDateBuy").css("display","none");
    		$("#collectionDayBuy").css("display","none");
    		$("#startTimeBuy").css("display","none");
    		$("#endTimeBuy").css("display","none");
    		if(this.id){
    			this.getData();
    		}else{
    			$("#deliveryHistory").css("display","none");
    		}
    		
        },
        render:function(){
        	this.renderTime();
        	this.bindEvent();
        },
        getData:function(){
        	Service.getContractById(this.id,function(data){
        		console.log(data);
        		$("#numbers").val(data.result.number==null?"":data.result.number);
        		$("#cooperation_mode option[value='"+data.result.style+"']").attr("selected","selected");
        		if(data.result.style == 2){
        			$("#deliveryHistory").css("display","none");
        		}
        		if(data.result.cycle){
        			$("#payment_cycle").val(data.result.cycle);
        			$("#payment_cycle").css("color","black");
        		}else{
        			$("#payment_cycle").val("忽略此信息");
        			$("#payment_cycle").css("color","#BDB7B7");
        		}
        		if(data.result.email){
        			$("#emails").val(data.result.email);
        			$("#emails").css("color","black");
        		}else{
        			$("#emails").val("忽略此信息");
        			$("#emails").css("color","#BDB7B7");
        		}
        		if(data.result.startTime){
        			$("#startTime").val(cloud.util.dateFormat(new Date(data.result.startTime),"yyyy-MM-dd"));
        			$("#startTime").css("color","black");
        		}else{
        			$("#startTime").val("忽略此信息");
        			$("#startTime").css("color","#BDB7B7");
        		}
        		if(data.result.endTime){
        			$("#endTime").val(cloud.util.dateFormat(new Date(data.result.endTime),"yyyy-MM-dd"));
        			$("#endTime").css("color","black");
        		}else{
        			$("#endTime").val("忽略此信息");
        			$("#endTime").css("color","#BDB7B7");
        		}
        		if(data.result.deliveryDate){
        			$("#deliveryDate").val(cloud.util.dateFormat(new Date(data.result.deliveryDate),"yyyy-MM-dd"));
        			$("#deliveryDate").css("color","black");
        		}else{
        			$("#deliveryDate").val("忽略此信息");
        			$("#deliveryDate").css("color","#BDB7B7");
        		}
        		if(data.result.collectionDay){
        			$("#collectionDay").val(cloud.util.dateFormat(new Date(data.result.collectionDay),"yyyy-MM-dd"));
        			$("#collectionDay").css("color","black");
        		}else{
        			$("#collectionDay").val("忽略此信息");
        			$("#collectionDay").css("color","#BDB7B7");
        		}
        		if(data.result.historyInfo){
	        	       if(data.result.historyInfo && data.result.historyInfo.length>0){
		    			   for(var i=0;i<data.result.historyInfo.length;i++){
		    				   var deliveryTime = cloud.util.dateFormat(new Date(data.result.historyInfo[i].deliveryTime),"yyyy-MM-dd");
		            	       var createTime  = cloud.util.dateFormat(new Date(data.result.historyInfo[i].createTime),"yyyy-MM-dd");
		    				    $("#deliveryConfig").append("<tr>"
		    						+"<td class='channelTable'>"
		    						+  "<label>"+deliveryTime+"</label>"
		    						+"</td>"
		    						+"<td class='channelTable'>"
		    						+  "<label>"+createTime+"</label>"
		    						+"</td>"
		    						+"</tr>");
		    			   }
	    		        }
	        	}else{
	        		  $("#deliveryConfig").append("<tr>"
	    						+"<td class='channelTable'>"
	    						+  "<label>-</label>"
	    						+"</td>"
	    						+"<td class='channelTable'>"
	    						+  "<label>-</label>"
	    						+"</td>"
	    						+"</tr>");
	        	}
        	});
        },
        bindEvent:function(){
        	var self = this;
        	$("#cooperation_mode").change(function(){
        		var type = $(this).children('option:selected').val();
        		if(type ==2){
        			$("#deliveryDate").val("");
        			$("#collectionDay").val("");
        		
        			$("#payment_cycle").attr("readOnly",true);
        			$("#emails").attr("readOnly",true);
        			$("#deliveryDate").css("display","none");
        			$("#collectionDay").css("display","none");
            		$("#startTime").css("display","none");
            		$("#endTime").css("display","none"); 
        			
        			$("#deliveryDateBuy").css("display","block");
            		$("#collectionDayBuy").css("display","block");
            		$("#startTimeBuy").css("display","block");
            		$("#endTimeBuy").css("display","block");
            		
            		$("#deliveryDateBuy").val("忽略此信息");
            		$("#collectionDayBuy").val("忽略此信息");
            		$("#startTimeBuy").val("忽略此信息");
            		$("#endTimeBuy").val("忽略此信息");
            		$("#payment_cycle").val("忽略此信息");
            		$("#emails").val("忽略此信息");
            		$("#payment_cycle").css("color","#BDB7B7");
            		$("#emails").css("color","#BDB7B7");
        		}else if(type == 1){
        			$("#startTime").val("");
        			$("#endTime").val("");
        			$("#payment_cycle").val("3");
        			$("#emails").val("");
        			
        			$("#payment_cycle").attr("readOnly",false);
        			$("#emails").attr("readOnly",false);
        			$("#deliveryDate").css("display","block");
        			$("#collectionDay").css("display","block");
            		$("#startTime").css("display","block");
            		$("#endTime").css("display","block"); 
        			
        			$("#deliveryDateBuy").css("display","none");
            		$("#collectionDayBuy").css("display","none");
            		$("#startTimeBuy").css("display","none");
            		$("#endTimeBuy").css("display","none");
            		$("#payment_cycle").css("color","black");
            		$("#emails").css("color","black");
        		}
        	});
        	$("#deliveryDate").change(function(){ //手动变更租金交付日 租金催收日自动变化为租金交付日减15天
        		var deliveryDate = $("#deliveryDate").val();
        		//租金催收日=租金交付日-15日
 				$("#collectionDay").val(cloud.util.dateFormat(new Date(((new Date(deliveryDate)).getTime()-1000 * 60 * 60 * 24 * 15)/1000),"yyyy-MM-dd"));
        	});
        	$("#payment_cycle").change(function(){ //付款周期发生变化
        		 var startTime = $("#startTime").val();
                 if(startTime){
                    startTime = (new Date(startTime)).getTime()/1000;
                    var payment_cycle = $("#payment_cycle").val();
                	// 租金交付日=租金起收日+付款周期
     				var d = new Date()
     				d.setTime(startTime * 1000);
     				var year = d.getFullYear();
     				var month=d.getMonth() ;
     				var month_ = d.getMonth()+1;
     				var date = d.getDate();
     				
     				var dates = new Date(year,month,date);
     				dates.setMonth(dates.getMonth()+parseInt(payment_cycle));
     				dates = self.formatDate(dates);
     				
     				$("#deliveryDate").val(dates);
     				//租金催收日=租金交付日-15日
     				$("#collectionDay").val(cloud.util.dateFormat(new Date(((new Date(dates)).getTime()-1000 * 60 * 60 * 24 * 15)/1000),"yyyy-MM-dd"));
         		}
                 
        	});
            $("#nextBase").bind("click", function() {
            	var number = $("#numbers").val();
            	var cooperation_mode = $("#cooperation_mode").find("option:selected").val();//合作方式
            	var startTime = $("#startTime").val();//租金起收日
            	var endTime = $("#endTime").val();//租金截止日
            	var cycle = $("#payment_cycle").val();//付款周期
            	var deliveryDate = $("#deliveryDate").val();
            	var collectionDay = $("#collectionDay").val();
            	var email = $("#emails").val();
            	
            	if(startTime){
            		startTime = (new Date(startTime)).getTime()/1000;
        		}
            	if(endTime){
            		endTime = (new Date(endTime)).getTime()/1000;
        		}
            	if(deliveryDate){
            		deliveryDate = (new Date(deliveryDate)).getTime()/1000;
        		}
            	if(collectionDay){
            		collectionDay = (new Date(collectionDay)).getTime()/1000;
        		}
            	
            	if(number == null || number == 0){
     			    dialog.render({lang: "please_enter_contractnumber"});
                    return;
     		    }
            	if(cooperation_mode == null || cooperation_mode == 0){
     			    dialog.render({lang: "please_select_cooperation_mode"});
                    return;
     		    }
            	if(cooperation_mode == 1){//租赁
            		if(startTime == null || startTime == 0){
         			    dialog.render({lang: "please_enter_startTime"});
                        return;
         		    }
            		if(endTime == null || endTime == 0){
         			    dialog.render({lang: "please_enter_endTime"});
                        return;
         		    }
            		if(cycle == null || cycle == 0){
         			    dialog.render({lang: "please_enter_payment_cycle"});
                        return;
         		    }
            		if(deliveryDate == null || deliveryDate == 0){
         			    dialog.render({lang: "please_enter_deliveryDate"});
                        return;
         		    }
            		if(collectionDay == null || collectionDay == 0){
         			    dialog.render({lang: "please_enter_collectionDay"});
                        return;
         		    }
            		if(email == null || email == 0){
         			    dialog.render({lang: "please_enter_contract_email"});
                        return;
         		    }
            	}else{
            		startTime='';
        			endTime='';
        			cycle='';
        			deliveryDate='';
        			collectionDay='';
        			email='';
            	}
            	
            	var baseData={
            			number:number,
            			style:cooperation_mode,
            			startTime:startTime,
            			endTime:endTime,
            			cycle:cycle,
            			deliveryDate:deliveryDate,
            			collectionDay:collectionDay,
            			email:email
            	};
            	
            	this.DeliveryDateConfig = new deviceConfigInfo({
  	                 selector: "#devicelistInfo",
  	                 adWindow: self.adWindow,
  	                 id:self.id,
  	                 baseData:baseData,
  	                 events: {
  	                      "rendTableData": function() {
  	                           self.fire("getcontractList");
  	                       }
  	                  }
  	             });
                $("#baseInfo").css("display", "none");
                $("#devicelist").css("display", "block");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
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
        renderTime:function(){
        	var self = this;
        	$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                        
                        var startTime = $("#startTime").val();
                        if(startTime){
                    		startTime = (new Date(startTime)).getTime()/1000;
                    		var payment_cycle = $("#payment_cycle").val();
            				// 租金交付日=租金起收日+付款周期
            				var d = new Date()
            				d.setTime(startTime * 1000);
            				var year = d.getFullYear();
            				var month=d.getMonth() ;
            				var month_ = d.getMonth()+1;
            				var date = d.getDate();
            				
            				var dates = new Date(year,month,date);
            				dates.setMonth(dates.getMonth()+parseInt(payment_cycle));
            				dates = self.formatDate(dates);
            				
            				$("#deliveryDate").val(dates);
            				//租金催收日=租金交付日-15日
            				$("#collectionDay").val(cloud.util.dateFormat(new Date(((new Date(dates)).getTime()-1000 * 60 * 60 * 24 * 15)/1000),"yyyy-MM-dd"));
                		}
        				
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
				$("#deliveryDate").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                        //b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
				$("#collectionDay").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                        //b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
				$("#startTime").val("");
				$("#endTime").val("");
				$("#deliveryDate").val("");
				$("#collectionDay").val("");
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