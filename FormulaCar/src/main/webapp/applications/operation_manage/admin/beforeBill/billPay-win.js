define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.datetimepicker");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("./service");
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.number =  options.number;
			this.name = options.name;
			this.type = options.type;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: "确认收款",
				top: "center",
				left: "center",
				height:200,
				width: 500,
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
			this.renderBtn();
			this.renderTime();
		},
		_renderForm:function(){				
			var htmls1= "<div style='text-align: center;width: 100%;margin-top: 40px;'>"
					      +"<table style='width:100%;'>"
					      +"<tr>"
					      +"<td>"
					       +"<label style='margin:auto 10px auto 10px ;margin-right: 6px;'>实际付款日期</label>" 
			               +"<input type='text' class='notice-bar-calendar-input datepicker' id='payTime' name='payTime' style='width:150px;height:28px;'/>"
					      +"</td>"
					      +"<td></td>"
					      +"</tr>"
					      +"<tr>"
					      +"<td></td>"
					      +"<td>"
					      +"<div style='text-align:left;'>"
					        +"<a id='config-pay' style='margin-top: 8px;margin-left:10px;' class='btn btn-primary submit'>确认收款</a>"
					      +"</div>"
					      +"</td>"
					      +"</tr>"
					      +"</table>"
					    +"</div>";
	        $("#winContent").append(htmls1);
		},
		renderTime:function(){
        	var self = this;
        	$(function(){
				$("#payTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                    }
				});
        	});
        },
		renderBtn:function(){
			var self = this;
			$("#config-pay").click(function(){
				
		    	var payTime = $("#payTime").val();
		    	payTime = (new Date(payTime+ " 00:00:00")).getTime() / 1000;
		    	
		    	dialog.render({
                    lang: "affirm_paybill",
                    buttons: [{
                            lang: "affirm",
                            click: function() {
                            	Service.affirmBeforeBill(self.name,self.number,payTime,self.type,function(data){
                            		console.log(data);
                            		dialog.close();
                            		self.window.destroy();
                            		self.fire("getbeforebillList");
                            	});
                            }
                        },
                        {
                            lang: "cancel",
                            click: function() {
                                dialog.close();
                            }
                        }]
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