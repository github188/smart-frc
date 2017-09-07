define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("cloud/components/print");
	var Table = require("cloud/components/table");
	var Service = require("../service");

	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.planId;
			this.data = options.data;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this; 
			this.window = new _Window({
				container: "body",
				title: "",
				top: "center",
				left: "center",
				height:520,
				width: 900,
				mask: true,
				drag:true,
				content:"<div id='winContent' style='border-top: 1px solid #f2f2f2;'></div>",
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this.loadData();
			

		},
		_renderForm:function(data){		
			var self = this;
			var nums = 0;
			var subdata = self.data;
			$("#winContent").append("<div style='text-align: center;height: 36px;margin-top: 16px;font-size: 18px;border-bottom: 1px dashed #ddd;'><span>"+locale.get({lang:"replenish_plan_detail"})+"</span></div>");
			
			$("#winContent").append("<div class='plant1'>" +
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
			$("#winContent").append("<div style='margin-left: 20px;'>" +
					"<span style='margin-top: 6px;display: inline-block;'>"+locale.get({lang:"automat_line"})+":</span>" +
					"<table>" +
					lineHtml+
					"</table>" +
					"</div>");
			var htmls1 = "<div id='device_list_table' style='height:420px;margin-top:20px;overflow: auto;'>" +
					"<div>" +
					"<div style='height: 30px;line-height: 30px;border-bottom: 1px dashed #000;border-top: 0px solid #e7e7eb;'><span style='display: inline-block;width: 43%;margin-left: 20px;'>"+locale.get({lang:"shelf_goods_name"})+"</span><span>"+locale.get({lang:"shelf_need_replenish_num"})+"</span></thead>" +
					"</div>" +
					"<table style='width: 97%;margin: 0 auto;margin-left: 20px;'>" +
					"<tbody id='databody'>" +
					"</tbody>" +
					"</table></div>";
			
			$("#winContent").append(htmls1);		
		    for(var i=0;i<data.length;i++){
		    	if(data[i].replenishCount != 0){
		    		nums += data[i].replenishCount;
			    	$("#databody").append("<tr style='line-height: 30px;height: 30px;'>" +
			    			"<td width='45%'>" +data[i].goodsName+"</td>"+
			    			"<td>" +data[i].replenishCount+"</td>"+
			    			"<td></td>"+
			    			"</tr>");
		    	}		    	
		    	
		    }
			
		    $("#device_list_table").append("<div style='height: 30px;line-height: 30px;border-top: 1px dashed;'>" +
    				"<span style='display: inline-block;width: 45%;text-align: right;margin-left: 25px;'>" +nums+"</span>"+
    				"<span style='display: inline-block;margin-left: 160px;'>"+locale.get({lang:"replenish_person_name_sign"})+"：</span>"+
    				"</div>");
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
			
			Service.getReplenishPlanV2GoodsById(self._id,function(data){
				
				
				if(data.result && data.result.length >0){
					self._renderForm(data.result);
				}
				
				
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