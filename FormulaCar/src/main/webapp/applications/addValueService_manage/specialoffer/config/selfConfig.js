define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./selfConfig.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("./css/style.css");
    require("./css/common.css");
    var Service = require("../service");
  
    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.automatWindow = options.automatWindow;
            this.specialData = options.specialData;
            this.deviceConfigs = options.deviceConfigs;
            this.basedata = options.basedata;
            this.deviceList= options.deviceList;

            this.ntcid = this.deviceConfigs[0].assetId;
            this.render();
            this.goodsWinWidth = 458;
            this.goodsWinHeight = 378;
            this.channelsList = [];
            this.specialConfig = [];
        },
        render: function() {
            this.sumitButtonClick();//点击 完成  按钮
            this.lastSetpButtonClick();//点击 上一步 按钮
            this.renderTable();
        },
        renderTable:function(){
        	var self=this;       	
        	self.specialConfig = [];
        	
        	$("#device_list").html("<div style='border-bottom: 1px solid #ddd;height: 36px;line-height: 36px;background-color: #f4f5f9;text-align: center;font-size: 14px;'>"+locale.get({lang: "automat_no1"})+"</div>");
        	
        	for(var i=0;i<self.deviceConfigs.length;i++){
        		var offerCids = [];
        		var assetId = self.deviceConfigs[i].assetId;
        		var deviceId = self.deviceConfigs[i].deviceId;
        		var gwId = self.deviceConfigs[i].gwId;
        		var counterData = self.deviceConfigs[i].counters;
        		if(counterData != null && counterData.length > 0){
        			offerCids = counterData;
        		}
        		var config = {
        				"deviceId":deviceId,
        				"assetId":assetId,
        				"gwId":gwId,
        				"offerCids":offerCids
        		};
        		self.specialConfig.push(config);

        		$("#device_list").append("<div class='devicediv' id="+deviceId+">"+assetId+"</div>");
        		
        		$("#"+deviceId).on("click",{deviceId:deviceId},function(e){
        			cloud.util.mask("#shelf_list");
        			var specialConfig = self.specialConfig;
        			Service.getAutomatById(e.data.deviceId, function(data) {
        				cloud.util.unmask("#shelf_list");
        				var counters = [];
        				if(data.result.goodsConfigs){
 							var deviceShelvesArray = [];
 							var counter = {};
             				counter.cid = "master";
             				counter.type = data.result.masterType;
     						for(var mo=0;mo<data.result.goodsConfigs.length;mo++){
     							var goodsConfig = data.result.goodsConfigs[mo];
     							if(goodsConfig.goods_id){
     								var shelves = {};
     								shelves.machineType = "master";
         							shelves.location_id = goodsConfig.location_id;
         							shelves.goods_id = goodsConfig.goods_id;
         							shelves.goods_name = goodsConfig.goods_name;
         							shelves.price = goodsConfig.price;
         							shelves.img = goodsConfig.img;
         							shelves.type = data.result.masterType;
         							deviceShelvesArray.push(shelves);
     							}
     						}
     						counter.channels = deviceShelvesArray;
     						counters.push(counter);
 						}
 						
     					if(data.result.containers){
     						
     						for(var mc=0;mc<data.result.containers.length;mc++){
     							var deviceShelvesArray = [];
     							var counter = {};
     							var container = data.result.containers[mc];
     							var shelvesArray = container.shelves;
     							counter.cid = container.cid;
                 				counter.type = container.type;
     							for(var sh=0;sh<shelvesArray.length;sh++){
     								var goodsConfig = shelvesArray[sh];
     								if(goodsConfig.goods_id){
     									var shelves = {};
         								shelves.machineType = "container";
         								shelves.location_id =goodsConfig.location_id;
         								shelves.goods_id = goodsConfig.goods_id;
         								shelves.goods_name = goodsConfig.goods_name;
         								shelves.price = goodsConfig.price;
         								shelves.img = goodsConfig.img;
         								shelves.type = container.type;
         								deviceShelvesArray.push(shelves);
     								}
     							}
     							if(deviceShelvesArray.length > 0){
     								counter.channels = deviceShelvesArray;
             						counters.push(counter);
     							}
     							
     						}
     						
     					}
     	        		if(data.result.vendingState&&data.result.vendingState.shelvesState){
     	        			self.setCounters(counters,data.result._id,specialConfig,data.result.vendingState.shelvesState);
     	        		}else{
     	        			self.setCounters(counters,data.result._id,specialConfig,null);
     	        		}
     					
     					
     					
        			});
        			
        			$(".devicediv").removeAttr("style");
					$(this).css("background-color","#44b549");
        			
        			
        		});
        		
        		
        		if(i==0){
        			$("#"+deviceId).click();
        		}
        	}
        	
            //self.setCounters(self.countersList);
        },
        
        setCounters:function(counters,deviceId,specialConfig,shelvesState) {
        	var self = this;
        	$("#devicegoodsall").html("");
        	self.specialConfig = specialConfig;

        	for(var i =0;i<counters.length;i++){
				var cid = counters[i].cid;//货柜编号
				
				var type = counters[i].type;//货柜类型
				var tempe = counters[i].type;
				if(type==1){
					type = locale.get({lang: "drink_machine"});
                }else if(type==2){
                	type = locale.get({lang: "spring_machine"});
                }else if(type==3){
                	type = locale.get({lang: "grid_machine"});
                }
				var shelves = counters[i].channels;//货柜货道配置
				//self.shelves = shelves;
				
				var j=i+1;
				$("#devicegoodsall").append(
					 "<li  id='cid_"+cid+"' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
						    "<a id='tab_"+j+"'>"+cid+"("+type+")</a>"+
					 "</li>"
			    );
				
				$("#cid_"+cid).bind("click",{cid:cid,shelves:shelves,type:tempe},function(e){
					$(".tab_navs li").removeClass("selected");
					$("#cid_"+e.data.cid).addClass("selected");
					var shelves = e.data.shelves;
					var cid = e.data.cid;
					$("#goodsConfigContent").html("");
					
				    
					var row = 0;
		        	var roadInfoHtml = "<table id='road_table' style='width:750px;margin-top: 10px;'>";
		        	for(var i = 0;i<e.data.shelves.length;i++){
		        		
		        		if(i%5==0){
		        			row = row + 1;
		        			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
		        		}
		        		var total = (e.data.shelves.length)/5;
		        		var sp = (e.data.shelves.length)%5;
		        		var width=0;
		        		if(total<1){
		        			width = sp*20;
		        			
		        		}else{
		        			width = 100;
		        			
		        		}
		        		roadInfoHtml = roadInfoHtml + "<td style='width:20%;'>"+
		        										"<table style='width:"+width+"%'>"+
		        											"<tr style='height:82px;width:100%'><td id='"+e.data.shelves[i].location_id+"' class='road_td_image' style='font-size:20px;'><div style='width: 60px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+e.data.shelves[i].location_id+"</div>+</td></tr>"+
		        											"<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='"+e.data.shelves[i].location_id+"_goods_name'><td><span style='font-weight:600' id='"+e.data.shelves[i].location_id+"_name_content'>&nbsp;"+"</span></td></tr>"+       											
		        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + e.data.shelves[i].location_id + "_goods_price'><td><input type='text' value='0' style='width:30px;height: 10px;text-align: right;'   disabled='disabled' id='" + e.data.shelves[i].location_id+ "_price_content' />" + "<span>"+locale.get({lang: "china_yuan"})+"</span>&nbsp;&nbsp;<span id='" + e.data.shelves[i].location_id + "_check'></span></td></tr>" +
		        										"</table>"+
		        									  "</td>";
		        		if(i%5==5){
		        			roadInfoHtml = roadInfoHtml + "</tr>";
		        		}
		        	};
		        	$("#goodsConfigContent").html(roadInfoHtml);
		        	
		        	for(var i = 0;i<shelves.length;i++){
		        		var roadId = shelves[i].location_id;
		        		var price = shelves[i].price;
		    			var goodsId = shelves[i].goods_id;
		    			var name = shelves[i].goods_name;
		    			var imagepath = shelves[i].img;  	
		    			var machineType = shelves[i].machineType;
		    			var masterType = shelves[i].masterType;
		        		if(goodsId!="" && goodsId!=null){
		        				        				
			        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();                      
			        			$("#"+roadId).html("<div style='width: 60px;height: 10px;font-size: 12px;'><input value='"+imagepath+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
			        			
			        			var $span = '<span id='+roadId+'_span class="mask-wrapper">'+
					                '<span class="img-mask">'+
					                  '<span class="mask-bg"></span>'+
					                  '<span class="mask-img"></span>'+
					                '</span>'+
					              '</span>'	
                                $("#" + roadId).append($span);
			        			
			        			
			        			$("#"+roadId+"_name_content").html(name);	        			
			        			$("#" + roadId + "_price_content").val(price);
			                    $("#" + roadId + "_check").html("        <input type='checkbox'  id='"+cid+"_"+roadId+"_change'  value='0' name='"+cid+"_"+tempe+"' class='"+cid+"_check_goods' style='width:18px;height:18px;position:absolute;'>");
			        			
			                    if(shelvesState && shelvesState.length>0){
			                    	for(var j = 0; j < shelvesState.length; j++){
		                        		if(shelvesState[j].shelvesId == roadId && shelvesState[j].state == 1){
		                        			$("#" + roadId + "_span").show();
		                                    var soldouttime = shelvesState[j].soldoutTime;
		                        			
		                        			if(soldouttime != "" && soldouttime != undefined && soldouttime != null){
		                        				var time = "售空时间："+self.fotmatDate(soldouttime*1000);
		                        				$("#" + roadId + "_span").attr('title',time);
		                        			}
		                        		}else if(shelvesState[j].shelvesId == roadId && shelvesState[j].state != 1){
		                        			$("#" + roadId + "_span").hide();
		                        		}
		                        	}
			                    }
			                    
			                    if(self.specialConfig != null && self.specialConfig.length>0){//判断是否为修改页面跳转
			                    	
			                    	//for(var n=0;n<self.specialConfig.length;n++){
			                    		
			                    		var dindex = self.checkArray(self.specialConfig, "deviceId", deviceId);
			                    		
			                    		if(dindex != -1){
			                				var cindex = self.checkArray(self.specialConfig[dindex].offerCids, "cid", cid);
			                				
			                				if(cindex != -1){
			                					var sindex = self.checkArray(self.specialConfig[dindex].offerCids[cindex].channels, "channelId", roadId);
			                					
			                					if(sindex != -1){
			                						
			                				    	$("#"+cid+"_"+ roadId + "_change").val(1);
						                      		$("#"+cid+"_"+ roadId + "_change").attr("checked", true);
			                				    }
			                				}
			                			}
			                    	
			                    }
			                    
			                    $("#"+cid+"_"+ roadId + "_change").bind('click',{goodsId:goodsId,cid:cid,roadId:roadId,type:e.data.type},function(e){
			                    	var temp = $(this).val();
			                      	
			                    	var tempConfig = {
		                      				"deviceId":deviceId,
		                      				"cid":e.data.cid,
		                      				"roadId":e.data.roadId,
		                      				"goodsId":e.data.goodsId,
		                      				"cidType":e.data.type
		                      		};
			                    	
			                      	if(temp == 0 || temp == "0"){
			                      		$("#"+e.data.cid+"_"+ e.data.roadId + "_change").val(1);
			                      		$("#"+e.data.cid+"_"+ e.data.roadId + "_change").attr("checked", true);
			                      		
			                      		tempConfig["type"] = 1;
			                      		self.operaSpecialConfig(tempConfig);
			                      		
			                      		
			                      	}else{
			                      		$("#"+e.data.cid+"_"+ e.data.roadId + "_change").val(0);
			                      		$("#"+e.data.cid+"_"+ e.data.roadId + "_change").removeAttr("checked");
			                      		
			                      		tempConfig["type"] = 0;
			                      		self.operaSpecialConfig(tempConfig);
			                      		
			                      		
			                      	}
			                    	
			                    });
			                    
		        	    }   
		        		       		
		           };
		           $("#road_table").css({"height":"auto"});
			   	   
				});
			   }

             	   	   
 	   	     $("#cid_master").click();
 	   	    
 	   	       
        	
        },
        fotmatDate:function(time){
        	var date = new Date(time);
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
			var D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
			var h = date.getHours() + ':';
			var m = date.getMinutes() + ':';
			var s = date.getSeconds(); 
			var stime = Y+M+D+h+m+s;
			return stime;
        	
        },
        checkArray:function(arr,index,value){//判断数组某个字段值
        	
        	var flag = -1;
        	for(var i=0;i<arr.length;i++){
        		var temp = arr[i][index];
        		if(temp == value){
        			flag = i;
        			break;
        		}
        		
        	}
        	return flag;
        	
        },
        operaSpecialConfig: function(config){
        	var self = this;
        	var len = self.specialConfig.length;
        	var channelConfig = {
        			"channelId":config.roadId,
        			"goodsId":config.goodsId
        	}
        	if(config.type == 1){//添加
        		for(var i=0;i<len;i++){
        			var spconfig = self.specialConfig[i];
        			if(spconfig.deviceId == config.deviceId){//找到该设备
        				var offerCids = spconfig.offerCids;
        				if(offerCids != null){//有选择记录
        					var index = self.checkArray(offerCids, "cid", config.cid);
        					console.log(index);
        					if(index != -1){//添加
        						spconfig.offerCids[index].channels.push(channelConfig);
        						
        					}else{//新增
        						
        						var channels = [];
        						channels.push(channelConfig);
        						var cidInfo = {
        							"cid":config.cid,
        							"type":config.cidType,
        							"channels":channels
        						}
        						spconfig.offerCids.push(cidInfo);
        					}
        					
        				}else{//新增
        					var channels = [];
    						channels.push(channelConfig);
    						var cidInfo = {
    							"cid":config.cid,
    							"type":config.cidType,
    							"channels":channels
    						}
    						var tempofferCids = [];
    						tempofferCids.push(cidInfo);
    						spconfig.offerCids = tempofferCids;
        				}
        				
        			}
        		}
        		
        	}else if(config.type == 0){//删除
        		
        		for(var j=0;j<len;j++){
        			
        			var dindex = self.checkArray(self.specialConfig, "deviceId", config.deviceId);
        			
        			var cindex = self.checkArray(self.specialConfig[dindex].offerCids, "cid", config.cid);
        		
        		    var sindex = self.checkArray(self.specialConfig[dindex].offerCids[cindex].channels, "channelId", config.roadId);
        		 
        		    self.specialConfig[dindex].offerCids[cindex].channels.splice(sindex,1);
        		}
        		
        		
        	}
        	console.log(self.specialConfig);
        	
        },
        sumitButtonClick: function() {
            var self = this;
            
            $("#save").bind("click", function() {
            	self.basedata.status = 1;
            	self.basedata.config.deviceConfig = self.specialConfig;
            	
            	console.log(self.basedata);
            	if(self.specialData != null){
            		Service.updateSpecialOffer(self.basedata, self.specialData._id,function(data) {
                        
            			if(data.error_code){
            				dialog.render({lang:"update_offer_filed"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
            			
                    });
            		
            	}else{
            		Service.addSpecialOffer(self.basedata, function(data) {
                        if(data.error_code){
                        	dialog.render({lang:"create_offer_filed"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
                    });
            		
            	}
                
                
            });
            
         $("#check_all").bind("click",function(){
        	 
        	 $("input[type='checkbox']").each(function(){
        		 
        		 var temp = $(this).val();
        		 if(temp == 0 || temp == "0"){
        			 $(this).click();
        			 $(this).attr("checked",true); 
        		 }
        		 
        	 }); 
        	 
         });
         $("#cancel").bind("click",function(){
        	 
             $("input[type='checkbox']").each(function(){
        		 
        		 var temp = $(this).val();
        		 if(temp == 1 || temp == "1"){
        			 $(this).click();
        			 $(this).attr("checked",false); 
        		 }
        		 
        	 });
        	 
         });
         $("#offer_save").bind("click", function() {
        	    self.basedata.status = 2;
            	self.basedata.config.deviceConfig = self.specialConfig;
            	
            	if(self.specialData != null){
            		Service.updateSpecialOffer(self.basedata, self.specialData._id,function(data) {
                        
            			if(data.error_code){
            				dialog.render({lang:"update_offer_filed"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
            			
                    });
            		
            	}else{
            		Service.addSpecialOffer(self.basedata, function(data) {
                        if(data.error_code){
                        	dialog.render({lang:"create_offer_filed"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
                    });
            		
            	}
                
                
            });
        },
        lastSetpButtonClick: function() {
            $("#last_step").bind("click", function() {
                $("#selfConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#devicelist").css("display", "block");
                $("#tab1").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab2").addClass("active");
            });
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
      
    });
    return config;
});