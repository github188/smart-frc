define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("cloud/components/print");
	require("cloud/lib/plugin/jquery.datetimepicker");
	var Table = require("cloud/components/table");
	var Service = require("../service");

	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.planId;
			this.lineName = options.lineName;
			this.data = options.data;
			this.assetIds = options.assetIds;
			this.ftime = null;
			this._render();
			locale.render({element:this.element});
		},
		_render:function(){

			var self = this; 
			$("#price_step").val(locale.get({lang: "price_step"}));
			this.loadData();
			$("#price_step").bind("click", function() {
            	$("#baseInfo").css("display", "block");
                $("#salelist").css("display", "none");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
                //$("#tab1").removeClass("active");
            });
			$(function(){
				$("#forecastTime").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch",
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy/MM/dd hh:mm"));
                        var t = new Date(a).getTime() / 1000;
                        //if(self.ftime != null && t != self.ftime){
                      //  	self.ftime = t;
                        	self.loadData();
                       // }
                        
                        
                    }
				})
				//$("#startTime").val("");

			});


		},
		_renderForm:function(data){		
			var self = this;
			
			var actualnums = 0;
			var forecastnums = 0;
			var total = 0;
			var subdata = self.data;
			$("#salelistInfo").html("");
			$("#salelistInfo").append("<div style='text-align: center;height: 36px;margin-top: 12px;font-size: 18px;border-bottom: 1px dashed #ddd;'><span>"+locale.get({lang:"forecast_replenish_detail"})+"</span></div>");
			
/*			$("#salelistInfo").append("<div class='plant1'>" +
					"<span class='plansp1'><span style='margin-left: 20px;'>"+locale.get({lang:"numbers"})+":</span><span class='margin-left'>"+subdata.number+"</span></span>" +
					"<span class='plansp1' style='text-align: center;'><span>"+locale.get({lang:"replenish_plan_executive_person"})+":</span><span class='margin-left'>"+subdata.executivePerson+"</span></span>" +
					"<span class='plansp1' style='text-align: right;line-height: 60px;'><span>"+locale.get({lang:"replenish_plan_executive_time"})+":</span><span class='margin-left' style='margin-right:16px'>"+cloud.util.dateFormat(new Date(subdata.executiveTime), "yyyy-MM-dd")+"</span></span>" +
					"</div>");
			//线路html
			var lineHtml = "";
			var lines = subdata.lines;
			for(var x=0;x<lines.length;x++){
				lineHtml += "<tr><td>"+(x+1)+".</td><td>"+lines[x]+"</td></tr>"
			}
			$("#salelistInfo").append("<div style='margin-left: 20px;'>" +
					"<span style='margin-top: 6px;display: inline-block;'>"+locale.get({lang:"automat_line"})+":</span>" +
					"<table>" +
					lineHtml+
					"</table>" +
					"</div>");*/
			var htmls1 = "<div id='goods_list_table' style='height:310px;margin-top:5px;overflow: auto;'>" +
					"<div>" +
					"<div style='height: 30px;line-height: 30px;border-bottom: 1px dashed #000;border-top: 0px solid #e7e7eb;'><span style='display: inline-block;width: 23%;margin-left: 20px;'>"+locale.get({lang:"shelf_goods_name"})+"</span><span style='display: inline-block;width: 25%;'>"+locale.get({lang:"actual_sales"})+"</span><span style='display: inline-block;width: 25%;'>"+locale.get({lang:"forecast_num"})+"</span><span>"+locale.get({lang:"forecast_total"})+"</span></thead>" +
					"</div>" +
					"<table style='width: 97%;margin: 0 auto;margin-left: 20px;'>" +
					"<tbody id='databody'>" +
					"</tbody>" +
					"</table></div>";
			
			$("#salelistInfo").append(htmls1);		
		    for(var i=0;i<data.length;i++){
		    	
		    	if(i == 0){
		    		if(data[i].forecastTime != null){
		    			self.ftime = data[i].forecastTime;
			    		$("#forecastTime").val(cloud.util.dateFormat(new Date(data[i].forecastTime),"yyyy/MM/dd hh:mm"));
		    			
		    		}
		    	}
		    	
		    	if(data[i].salesNum != null){
		    		
		    		actualnums += data[i].salesNum;
		    		forecastnums += data[i].initForecast;
		    		total += data[i].sugNum;
		    		
		    		//nums += data[i].replenishCount;
			    	$("#databody").append("<tr style='line-height: 30px;height: 30px;'>" +
			    			"<td width='25%'>" +data[i].goodsName+"</td>"+
			    			"<td width='26%'>" +data[i].salesNum+"</td>"+
			    			"<td width='26%'>" +data[i].initForecast+"</td>"+
			    			"<td>" +data[i].sugNum+"</td>"+
			    			"</tr>");
		    	}		    	
		    	
		    	
		    	if(i == data.length-1){
		    		$("#databody").append("<tr style='line-height: 30px;height: 30px;border-top: 1px dashed;'>" +
			    			"<td width='25%'>"+locale.get({lang: "forecast_replenish_total"})+"</td>"+
			    			"<td width='26%'>" +actualnums+"</td>"+
			    			"<td width='26%'>" +forecastnums+"</td>"+
			    			"<td>" +total+"</td>"+
			    			"</tr>");
		    	}
		    }

		    //添加打印
	        $("#ui-window-title").append("<span class='printer' ></span>");
		    $(".printer").mouseover(function (){
				$('.printer').css("opacity","1");
			}).mouseout(function (){
				$('.printer').css("opacity","0.7");
			});
		    
		    $(".printer").bind("click",function(){
		    	$('.ui-window-content').printArea();
		    	
		    });
		    
		    $("#ui-window-title").css("height","30px");

		    
		},

		loadData:function(){
			var self = this;
			
			cloud.util.mask("#salelistInfo");
            var t = $("#forecastTime").val();
			
			self.searchData = {
					assetIds:self.assetIds
			}
			if(t != null && t != ""){
				var planReplenishTime = new Date(t).getTime() / 1000;
				self.searchData.time = planReplenishTime;
			}
			Service.getReplenishForecast(self.searchData,function(data){
				
				if(data.result && data.result.length >0){
					self._renderForm(data.result);
				}
				
				cloud.util.unmask("#salelistInfo");
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
	return updateWindow;
});