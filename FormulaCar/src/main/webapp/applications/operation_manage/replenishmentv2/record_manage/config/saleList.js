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
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	
    	eurl = "gapi";
    	
    }else{
    	
    	eurl = "api";
    }
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this._id = options.planId;
			this.lineName = options.lineName;
			this.data = options.data;
			this.assetIds = options.assetIds;
			this.lineReplenish = options.lineReplenish;
			this.basedata = options.basedata;
			this.automatWindow = options.automatWindow;
			this.ftime = null;
			this._render();
			locale.render({element:this.element});
		},
		getGoods:function(){
			var self = this;
			
		},
		openConfigWindow:function(){
			var self = this;
			if(this.configWindow){
				this.configWindow.destroy();
			}
            this.configWindow =  new _Window({
            	container : "#ui-window-body",
                title : locale.get({lang: "product_choose"}),
                top: "center",
                left: "center",
                height: 310,
                width: 300,
                mask: true,
                drag: true,
                events : {
                    "onClose": function() {
                        self.configWindow = null;
                    },
                    scope : this
                }
            });
            this.configWindow.show();
            
            var html = "<div style='text-align: center;position: absolute;width: 100%;background: white;'><input type='text' placeholder='"+locale.get({lang: "enter_goods_name"})+"' id='searchGoods' /></div><div style='width: 100%;margin-top: 30px;overflow: auto;height: 250px;position: absolute;'><table id='goods-list' style='margin:5px;width: 98%;'>"+
                    
                    
	               "</table></div>";
            
            this.configWindow.setContents(html);

            
            $("#searchGoods").bind("input",function(){
            	
            	var value = $(this).val();
            	
            	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
            	var eurl;
            	if(oid == '0000000000000000000abcde'){
            	     eurl = "mapi";
            	}else{
            	     eurl = "api";
            	}
                	Service.getGoodsList(eurl,value,function(data) {
                	    	
                	        if(data.error_code == null){
                	        	$("#goods-list").html("");
                	        	var goods = data.result;
                	        	for(var i=0;i<goods.length;i++){
                	        		$("#goods-list").append("<tr style='height:30px;border-bottom: 1px solid #ddd;' ><td class='goods'>" +
                	        				goods[i].name+
                	        				"</td></tr>");
                	        		
                	        		
                	        	}
                	        	$(".goods").unbind();
                			    $(".goods").bind("click",function(){
                			    	var goods = $(this).html();
                			    	
                			    	var len = $("#databody").find('tr').length;
                    		    	
                    		    	$("#databody").find('tr').eq(len-1).before("<tr style='line-height: 30px;height: 30px;'>" +
                    		    			"<td width='23%'>"+goods+"</td>"+
                    		    			"<td width='15%'>0</td>"+
                    		    			"<td width='15%'>0</td>"+
                    		    			"<td width='15%'>0</td>"+
                    		    			"<td width='15%'><input type='text' class='subinput' style='width:108px' value='0' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
                    		    			"<td ><span class='del' style='color:#28b5d6;cursor: pointer;'>"+locale.get({lang: "delete"})+"</span></td>"+
                    		    	"</tr>");
                			    	//$("body").scrollTop($("body")[0].scrollHeight);

                    		    	$(".del").unbind();
                    		    	$(".del").bind('click',function(){
                    		    		
                    		    		var all = $("#totalsum").val();
                    		    		if($(this).parent().parent().find("input").val() != ""){
                    		    			$("#totalsum").val(all-parseInt($(this).parent().parent().find("input").val()));
                    		    		}
                    			    	
                    			    	$(this).parent().parent().remove();
                    		    	});
                    		    	
                    		    	$(".subinput").on('input',function(e){
                    			    	var all = 0;
                    			    	
                    			    	$(".subinput").each(function(){
                    			    		if($(this).val() != ""){
                    			    			all += parseInt($(this).val());
                    			    		}
                    			    		
                    			    	});
                    			    	
                    			    	$("#totalsum").val(all);
                    			    });
                			    	
                			    	self.configWindow.destroy();
                			    	
                			    });
                	    	}
                	        
                	    });
            	
            	
            	
            });
            
            var value = "";
        	
        	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
        	var eurl;
        	if(oid == '0000000000000000000abcde'){
        	     eurl = "mapi";
        	}else{
        	     eurl = "api";
        	}
            	Service.getGoodsList(eurl,value,function(data) {
            	    	
            	        if(data.error_code == null){
            	        	$("#goods-list").html("");
            	        	var goods = data.result;
            	        	for(var i=0;i<goods.length;i++){
            	        		$("#goods-list").append("<tr style='height:30px;border-bottom: 1px solid #ddd;' ><td class='goods'>" +
            	        				goods[i].name+
            	        				"</td></tr>");
            	        		
            	        		
            	        	}
            	        	$(".goods").unbind();
            			    $(".goods").bind("click",function(){
            			    	var goods = $(this).html();
            			    	
            			    	var len = $("#databody").find('tr').length;
                		    	
                		    	$("#databody").find('tr').eq(len-1).before("<tr style='line-height: 30px;height: 30px;'>" +
                		    			"<td width='23%'>"+goods+"</td>"+
                		    			"<td width='15%'>0</td>"+
                		    			"<td width='15%'>0</td>"+
                		    			"<td width='15%'>0</td>"+
                		    			"<td width='15%'><input type='text' class='subinput' style='width:108px' value='0' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
                		    			"<td ><span class='del' style='color:#28b5d6;cursor: pointer;'>"+locale.get({lang: "delete"})+"</span></td>"+
                		    	"</tr>");
            			    	//$("body").scrollTop($("body")[0].scrollHeight);

                		    	$(".del").unbind();
                		    	$(".del").bind('click',function(){
                		    		
                		    		var all = $("#totalsum").val();
                		    		if($(this).parent().parent().find("input").val() != ""){
                		    			$("#totalsum").val(all-parseInt($(this).parent().parent().find("input").val()));
                		    		}
                			    	
                			    	$(this).parent().parent().remove();
                		    	});
                		    	
                		    	$(".subinput").on('input',function(e){
                			    	var all = 0;
                			    	
                			    	$(".subinput").each(function(){
                			    		if($(this).val() != ""){
                			    			all += parseInt($(this).val());
                			    		}
                			    		
                			    	});
                			    	
                			    	$("#totalsum").val(all);
                			    });
            			    	
            			    	self.configWindow.destroy();
            			    	
            			    });
            	    	}
            	        
            	    });
            
		},
		_render:function(){

			var self = this; 
			$("#add").val(locale.get({lang: "add_deliver_goods"}));
			$("#price_step").val(locale.get({lang: "price_step"}));
			$("#save").val(locale.get({lang: "add_deliver_plan"}));
			
			//this.getGoods();
			
			this.loadData();
			$("#price_step").bind("click", function() {
            	$("#baseInfo").css("display", "block");
                $("#salelist").css("display", "none");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
                //$("#tab1").removeClass("active");
            });
			$("#save").bind("click", function() {
				
				var planTotal = 0;
				var deliverTotal = 0;
				
				var goodsInventorys = [];
				
				var tableObj = document.getElementById("databody"); 
				if(tableObj && tableObj.rows.length >1 ){
					for(var i=0;i<tableObj.rows.length -1;i++){//行 
						var goodsObj ={};
                        
						var fg = $(tableObj.rows[i]).find('select');
						
						if(fg.length > 0){
							goodsObj.goodsName = $(tableObj.rows[i].cells[0].children[0]).find('option:selected').text();
							
						}else{
							
							goodsObj.goodsName = $(tableObj.rows[i].cells[0]).text();
						}
						console.log(goodsObj.goodsName);
						goodsObj.planSum = parseInt($(tableObj.rows[i].cells[3]).text());
						if($(tableObj.rows[i].cells[4].children[0]).val() != ""){
							goodsObj.deliverSum = parseInt($(tableObj.rows[i].cells[4].children[0]).val());
						}else{
							goodsObj.deliverSum = 0;
						}
						//goodsObj.deliverSum = parseInt($(tableObj.rows[i].cells[4].children[0]).val());
						
						
						planTotal += goodsObj.planSum;
						deliverTotal += goodsObj.deliverSum;
						
						goodsInventorys.push(goodsObj);
					}
					
					
					var inventory = {
							planTotal:planTotal,
							deliverTotal:deliverTotal,
							goodsInventory:goodsInventorys
							
					};
					self.basedata.status = 0;
					self.basedata.inventory = inventory;
					
					var t = $("#forecastTime").val();
					if(t != null){
						var planReplenishTime = new Date(t).getTime() / 1000;
						self.basedata.planReplenishTime = planReplenishTime;
					}
					
					console.log(self.basedata);
					
					Service.addDeliverPlan(self.basedata, function(data) {
	                	
	                    if(data.error_code == null){
	                    	self.automatWindow.destroy();
	                        self.fire("getplanList");
	                	}
	                    
	                });
				}else{
					dialog.render({lang:"please_add_deliver_goods"});
            	    return;
				}
				
				
			});
			
			$("#add").bind("click",function(){
				self.openConfigWindow();
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
                       // var t = new Date(a).getTime() / 1000;
                        //if(t != self.ftime){
                       // 	self.ftime = t;
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
					"<div style='height: 30px;line-height: 30px;border-bottom: 1px dashed #000;border-top: 0px solid #e7e7eb;'><span style='display: inline-block;width: 20%;margin-left: 20px;'>"+locale.get({lang:"shelf_goods_name"})+"</span><span style='display: inline-block;width: 15%;'>"+locale.get({lang:"actual_sales"})+"</span><span style='display: inline-block;width: 15%;'>"+locale.get({lang:"forecast_num"})+"</span><span style='display: inline-block;width: 15%;'>"+locale.get({lang:"forecast_total"})+"</span><span style='display: inline-block;width: 15%;'>"+locale.get({lang:"deliver_count"})+"</span><span>"+locale.get({lang:"operate"})+"</span></thead>" +
					"</div>" +
					"<table style='width: 97%;margin: 0 auto;margin-left: 20px;'>" +
					"<tbody id='databody'>" +
					"</tbody>" +
					"</table></div>";
			
			$("#salelistInfo").append(htmls1);	
			if(data.length > 0){
			    for(var i=0;i<data.length;i++){
			    	
			    	if(i == 0){
			    		if(data[i].forecastTime != null){
			    			//self.ftime = data[i].forecastTime;
				    		$("#forecastTime").val(cloud.util.dateFormat(new Date(data[i].forecastTime),"yyyy/MM/dd hh:mm"));
			    			
			    		}
			    		
			    	}
			    	
			    	if(data[i].salesNum != null){
			    		
			    		actualnums += data[i].salesNum;
			    		forecastnums += data[i].initForecast;
			    		total += data[i].sugNum;
			    		
			    		//nums += data[i].replenishCount;
				    	$("#databody").append("<tr style='line-height: 30px;height: 30px;'>" +
				    			"<td width='23%'>" +data[i].goodsName+"</td>"+
				    			"<td width='15%'>" +data[i].salesNum+"</td>"+
				    			"<td width='15%'>" +data[i].initForecast+"</td>"+
				    			"<td width='15%'>" +data[i].sugNum+"</td>"+
				    			"<td width='15%'><input class='subinput' type='text' style='width:108px' value='0' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
				    			"<td ><span class='del' style='color:#28b5d6;cursor: pointer;'>"+locale.get({lang: "delete"})+"</span ></td>"+
				    	"</tr>");
			    	}		    	
			    	
			    	
			    	
			    	
			    	if(i == data.length-1){
			    		$("#databody").append("<tr style='line-height: 30px;height: 30px;border-top: 1px dashed;'>" +
				    			"<td width='23%'>"+locale.get({lang: "forecast_replenish_total"})+"</td>"+
				    			"<td width='15%'>" +actualnums+"</td>"+
				    			"<td width='15%'>" +forecastnums+"</td>"+
				    			"<td width='15%'>" +total+"</td>"+
				    			"<td width='15%'><input id='totalsum' type='text' style='width:108px' value='0' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
				    			"<td ></td>"+
			    		"</tr>");
			    	}

			    }
			}else{
				$("#databody").append("<tr style='line-height: 30px;height: 30px;border-top: 1px dashed;'>" +
		    			"<td width='23%'>"+locale.get({lang: "forecast_replenish_total"})+"</td>"+
		    			"<td width='15%'>" +actualnums+"</td>"+
		    			"<td width='15%'>" +forecastnums+"</td>"+
		    			"<td width='15%'>" +total+"</td>"+
		    			"<td width='15%'><input id='totalsum' type='text' style='width:108px' value='0' style='ime-mode:disabled;' onpaste='return false;'  onkeypress='if(event.keyCode >=48 && event.keyCode <=57){return true;}else{return false;}'/></td>" +
		    			"<td ></td>"+
	    		"</tr>");
			}


		    $(".del").bind('click',function(){
		    	
		    	var all = $("#totalsum").val();
		    	if($(this).parent().parent().find("input").val() != ""){
		    		$("#totalsum").val(all-parseInt($(this).parent().parent().find("input").val()));
		    	}
		    	
		    	$(this).parent().parent().remove();
		    });

		    $(".subinput").on('input',function(e){
		    	var all = 0;
		    	
		    	$(".subinput").each(function(){
		    		if($(this).val() != ""){
		    			all += parseInt($(this).val());
		    		}
		    		
		    	});
		    	
		    	$("#totalsum").val(all);
		    });

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
				
				if(data.result){
					self._renderForm(data.result.goodsForecast);
				}
				
				cloud.util.unmask("#salelistInfo");
			});
		}
	});
	return updateWindow;
});