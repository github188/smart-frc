define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./codeMan-win.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("./service");
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
            this.automatWindow = new _Window({
                container: "body",
                title:"取货码管理",
                top: "center",
                left: "center",
                height: 450,
                width: 800,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            $("#saveBase").val(locale.get({lang: "save"}));
            
            this.renderTime();
            this.renderBtn();
            if(this.id){
            	 this.getData();
            }
           
        },
        getData:function(){
        	Service.getCode(function(data){
        		if(data.result && data.result.tgcode){
					var parDay = data.result.tgcode[2];
					var parWeek = data.result.tgcode[3];
					
					var startTime = cloud.util.dateFormat(new Date(parseInt(data.result.tgcode[0])), "yyyy-MM-dd")
					var endTime = cloud.util.dateFormat(new Date(parseInt(data.result.tgcode[1])), "yyyy-MM-dd");
					$("#startTime").val(startTime);
					$("#endTime").val(endTime);
					$("#perDay").val(parDay);
					$("#perWeek").val(parWeek);
        		}
        	});
        },
        renderBtn:function(){
        	 var self = this;
        	 $("#saveBase").bind('click', function() {
        		 var startTime =$("#startTime").val();//有效期  开始时间
        		 var endTime = $("#endTime").val();//有效期 结束时间
        		 if(startTime){
              		startTime = (new Date(startTime)).getTime()/1000;
          		 }
              	 if(endTime){
              	 	endTime = (new Date(endTime)).getTime()/1000;
          		 }
              	 var perDay = $("#perDay").val();
              	 var perWeek = $("#perWeek").val();
              	 var strP=/^\d+(\.\d+)?$/; 
              	 
              	 if(perDay == null || perDay == 0){
       			      dialog.render({text: "每人每天取货次数不能为空"});
                      return;
       		     }
         		
        	     if(!strP.test(perDay)){
        	    	  dialog.render({text: "每人每天取货次数必须是数字"});
        	    	  return; 
        	     }
        	     if(perWeek == null || perWeek == 0){
      			      dialog.render({text: "每人每周取货次数不能为空"});
                      return;
      		     }
        		
       	         if(!strP.test(perWeek)){
       	    	      dialog.render({text: "每人每周取货次数必须是数字"});
       	    	      return; 
       	         }
       	        var config={
     				 startTime:startTime,
     				 endTime:endTime,
     				 perDay:perDay,
     				 perWeek:perWeek
     		    };
       	        Service.addCode(config,function(data){
       	        	console.log(data);
       	        	self.fire("getcodeList");
       	            self.automatWindow.destroy();
       	        });
        	 });
        	 $("#closeBase").bind('click', function() {
        		 self.automatWindow.destroy();
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
                    	var date = new Date(new Date(a).getTime() / 1000);
                    }
				});
			});
        },
        destroy: function() {
            if (this.automatWindow) {
                this.automatWindow.destroy();
            } else {
                this.automatWindow = null;
            }
        }
    });
    return updateWindow;
});