define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./containerConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.configData = null;  //上一页和详情传过来的数据包
			this.render();
			this.goodsWinWidth = 458;
	        this.goodsWinHeight = 378;
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.sumitButtonClick();//点击 完成  按钮
			this.lastSetpButtonClick();//点击 上一步 按钮
		},
		// 初始化货道个数
		showAndInitRoads:function(saveGoodsConfig){
			var self = this;
			self.showRoads(saveGoodsConfig);
			if(saveGoodsConfig&&saveGoodsConfig!=null){
				self.initRoadWindowImage(saveGoodsConfig);
			}
			cloud.util.unmask("#automat_cargo_road_config");
		},
		showRoads:function(saveGoodsConfig){
			var self = this;
			cloud.util.mask("#automat_cargo_road_config");
    		var row = 0;
        	var roadInfoHtml = "<table id='road_table' style='width:950px;margin-top: 10px;'>";
        	
            for(var i=0;i<saveGoodsConfig.length;i++){
            	if(i%8==0){
        			row = row + 1;
        			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
        		}
        		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
        										"<table style='width:100%'>"+
        											"<tr style='height:80px;width:100%'><td id='"+saveGoodsConfig[i].location_id+"' class='road_td_image' style='font-size:20px;'></td></tr>"+
        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='"+saveGoodsConfig[i].location_id+"_goods_name'><td><span style='font-weight:600' id='"+saveGoodsConfig[i].location_id+"_name_content'>&nbsp;"+"</span></td></tr>"+
        											"<tr style='width:100%;text-align:center;font-size:10px;' id='"+saveGoodsConfig[i].location_id+"_goods_price'><td><span style='font-weight:600'  id='"+saveGoodsConfig[i].location_id+"_price_content'>&nbsp;"+"</span></td></tr>"+
        										"</table>"+
        									  "</td>";
        		if(i%8==8){
        			roadInfoHtml = roadInfoHtml + "</tr>";
        		}
            }
            $("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#road_table").css({"height":"auto"});
		},
		initRoadWindowImage:function(data){
			var self = this;
			if(data==null||data.length==0){
				cloud.util.unmask("#automat_cargo_road_config");
			}else{
				$.each(data,function(n,item) {
					if(item!=null){
						var imagepath = item.img;
						var imageMd5 = item.imagemd5;
						
						var goodsConfig = {
			    				"location_id":item.location_id,
			    				"button_id":item.location_id,
			    				"goods_id":item.goods_id,
			    				"goods_name":item.goods_name,
			    				"goods_type":item.goods_type,
			    				"goods_typeName":item.goods_typeName,
			    				"price":item.price,
			    				"img":item.img,
			    				"payment_url":item.payment_url,
			    				"alipay_url":item.alipay_url,
			    				"imagemd5":item.imagemd5
			    		};
						
						if(imagepath){
							var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
							$("#"+item.location_id).html("<div style='width: 20px;height: 10px;font-size: 12px;margin-left: 5px;'>"+item.location_id+"</div><img src='"+src+"' style='height:60px;'/>");
		        			$("#"+item.location_id).append("<input type='hidden' id='imagemd5'/>");
		        		    $("#imagemd5").val(imageMd5);
						}else{
							$("#"+item.location_id).html("<div style='width: 20px;height: 10px;font-size: 12px;margin-left: 5px;margin-top: -30%;'>"+item.location_id+"</div>");
						}
	        		    if(item.goods_name){
	        		    	$("#"+item.location_id+"_name_content").html(item.goods_name);
	        		    }
	        			if(item.price){
	        				$("#"+item.location_id+"_price_content").html(item.price/100+locale.get({lang:"china_yuan"}));
	        			}
		    			
					}
					if( n == data.length-1){
						cloud.util.unmask("#automat_cargo_road_config");
					}
	            });	
			}
		},
		//保存按钮的事件
		sumitButtonClick:function(){
			var self = this;
			$("#model_submit").bind("click", function(){
				self.automatWindow.destroy();
			});
		},
		lastSetpButtonClick:function(){
			$("#model_last_step").bind("click",function(){
				$("#selfConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab1").addClass("active");
			})
		}
		
	});
	return config;
});