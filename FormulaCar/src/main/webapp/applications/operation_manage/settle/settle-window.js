define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery.datetimepicker");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"settle"}),
				top: "center",
				left: "center",
				height:162,
				width: 650,
				mask: true,
				drag:true,
				content: "<div id='winContent' style='border-top: 1px solid #f2f2f2;'></div>",
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
			this._renderSelect();
			this._renderBtn();
		},
		_renderForm:function(){				
		
			var htmls1= "<table width='90%' style='margin-left:80px;margin-top:10px;height: 60px;' border='1'>"
	    
				+"<tr style='height:30px;'>"
						+ "<td width='25%' height='20px' style='font-size: 14px;font-weight: bold;'><label style='color:red;'>*</label> <label>"+locale.get({lang:"settle_time"})+"</label></td>"
						+ "<td  height='20px'><input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_month'/></td>"
						+"</tr>"
					    + " </table>"
					    + "<div style='text-align: right;width: 94%;margin-top: 10px;border-top: 1px solid #f2f2f2;'><a id='product-config-save' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='product-config-cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a></div>";
	        $("#winContent").append(htmls1);
	        $("#ui-window-content").css("overflow","hidden");
		},
        _renderSelect: function() {
            $(function() {
                
            	var date = new Date(new Date().getTime() / 1000);
            	var nowDate = cloud.util.dateFormat(date, "yyyy/MM");


            	var year = nowDate.split("/")[0];
                var month = nowDate.split("/")[1];
                var preMonth = 0;
                if(month == 1){
                	preMonth = 12;
                	year = year -1;
                }else{
                	preMonth = month -1;
                }

                if(preMonth<10){
                	preMonth = "0"+preMonth;
                }
                var maxDate = year+"/"+preMonth;
                $("#times_month").val(maxDate).datetimepicker({
                    timepicker: false,
                    format: 'Y/m',
                    onShow: function() {
                        $(".xdsoft_calendar").hide();
                        
                    },
                    onChangeMonth: function(a, b) {
                    	
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
                    },
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                
            });
        },
		_renderBtn:function(){
			var self = this;
		    //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
            //保存
		    $("#product-config-save").bind("click",function(){
		    	var startTime = '';
		    	var endTime = '';
		    	var byMonth = $("#times_month").val();
		    	
		    	var year = byMonth.split('/')[0];
            	
                var months = byMonth.split('/')[1];
            	var  maxday = new Date(year,months,0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                	startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                	endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                	startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                	endTime = (new Date(byMonth + "/" +maxday + " 23:59:59")).getTime() / 1000;
                } else {
                	startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                	endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }

                
                var date = new Date(new Date().getTime() / 1000);
            	var nowDate = cloud.util.dateFormat(date, "yyyy/MM");
            	var nows = (new Date(nowDate + "/01" + " 00:00:00")).getTime() / 1000;

                if(startTime >= nows){
                	dialog.render({lang:"trade_settle_starttime"});
					return;
                }
	        	  
	        	  Service.addSettle(startTime,endTime,function(data){
	                	if(data.error!=null){
	                	   if(data.error_code == "70036"){
							   dialog.render({lang:"settle_already_exists"});
							   return;
						   }else if(data.error_code == "70038"){
							   dialog.render({lang:"please_set_rate"});
							   return;
						   }else if(data.error_code == "70039"){
							   dialog.render({lang:"please_set_correct_rate"});
							   return;
						   }
	                	}else{
							self.window.destroy();
		 	             	self.fire("getSettleList");
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