define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./awardConfig.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("./css/style.css");
    var Service = require("../service");

    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.automatWindow = options.automatWindow;
            this.countersList = options.countersList;
            this.basedata = options.basedata;
            this.participate = options.participate;
            this.deviceList= options.deviceList;
            this.lotteryData = options.lotteryData;
            if(options.lotteryData!=null){
            	this.conversion = options.lotteryData.config.conversion;
            }else{
            	this.conversion = [];
            }
            this.render();
            this.goodsWinWidth = 458;
            this.goodsWinHeight = 378;
            this.channelsList = [];
          //  this.conversion =[];
        },
        render: function() {
            this.sumitButtonClick();//点击 完成  按钮
            this.lastSetpButtonClick();//点击 上一步 按钮
            this.renderTable();
        },
        renderTable:function(){
        	var self=this;
            
        	self.setCounters(self.countersList);
        },
        setCounters:function(counters) {
        	var self = this;
        	
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
				
				var j=i+1;
				$("#awardgoodsall").append(
					 "<li  id='cid_"+cid+"_award' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
						    "<a id='tab_"+j+"'>"+cid+"("+type+")</a>"+
					 "</li>"
			    );
				$("#cid_"+cid+"_award").bind("click",{cid:cid,shelves:shelves}, function(e){
					$(".tab_navs li").removeClass("selected");
					$("#cid_"+e.data.cid+"_award").addClass("selected");
					var shelves = e.data.shelves;
					var cid = e.data.cid;
					$("#awardgoodsContent").html("");
					
				  
					var row = 0;
		        	var roadInfoHtml = "<table id='road_table_award' style='width:930px;margin-top: 10px;'>";
		        	for(var i = 0;i<e.data.shelves.length;i++){
		        		
		        		if(i%8==0){
		        			row = row + 1;
		        			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
		        		}
		        		var total = (e.data.shelves.length)/8;
		        		var sp = (e.data.shelves.length)%8;
		        		var width=0;
		        		if(total<1){
		        			width = sp*12.5;
		        			
		        		}else{
		        			width = 100;
		        			
		        		}
		        		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
		        										"<table style='width:"+width+"%'>"+
		        											"<tr style='height:82px;width:100%'><td id='"+e.data.shelves[i].location_id+"_award' class='road_td_image' style='font-size:20px;'><div style='width: 30px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+e.data.shelves[i].location_id+"</div>+</td></tr>"+
		        											"<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='"+e.data.shelves[i].location_id+"_goods_name_award'><td><span style='font-weight:600' id='"+e.data.shelves[i].location_id+"_name_content_award'>&nbsp;"+"</span></td></tr>"+       											
		        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + e.data.shelves[i].location_id + "_goods_price_award'><td><input type='text' value='0' style='width:30px;height: 10px;text-align:right;'   disabled='disabled' id='" + e.data.shelves[i].location_id+ "_price_content_award' />" + "<span>"+locale.get({lang: "china_yuan"})+"</span>&nbsp;&nbsp;<span id='" + e.data.shelves[i].location_id + "_check_award'></span></td></tr>" +
		        										"</table>"+
		        									  "</td>";
		        		if(i%8==8){
		        			roadInfoHtml = roadInfoHtml + "</tr>";
		        		}
		        	};
		        	$("#awardgoodsContent").html(roadInfoHtml);
		        	var conversions = null;
		        	var devicecol = false;
		        	if(self.lotteryData != null){
		        		self.conversion = self.lotteryData.config.conversion;
		        		var lotteryDevices = self.lotteryData.devices;
			        	var chooseDevices = self.deviceList;
			        	
			        	if(lotteryDevices.length != chooseDevices.length){
			        		devicecol = false;		        		
			        	}else{
			        		
			        		for(var e=0;e<lotteryDevices.length;e++){
			        			for(var c=0;c<chooseDevices.length;c++){
			        				if(lotteryDevices[e].deviceId == chooseDevices[c].deviceId){
			        					devicecol = true;
			        					break;
			        				}else{
			        					devicecol = false;
			        				}
			        				
			        			}	        			
			        			if(!devicecol){
			        				break;
			        			}
			        		}
			        	}
		        	}else{
		 	   	    	if(self.conversion == undefined){
		 	   	    		
		 	   	    	    self.conversion = [];
		 	   	    	
		 	   	    	}
		 	   	    
		 	   	    }
		        	
		        	
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
			        			$("#"+roadId+"_award").html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
			        			$("#"+roadId+"_name_content_award").html(name);	        			
			        			$("#" + roadId + "_price_content_award").val(price);
			                    $("#" + roadId + "_check_award").html("        <input type='checkbox'  id='"+cid+"_"+roadId+"_change_award'  name='"+cid+"_"+tempe+"' class='"+cid+"_check_goods_award' style='width:18px;height:18px;position:absolute;'>");
			                    if(self.lotteryData != null){
			                    	$("#"+cid+"_"+ roadId + "_change_award").bind('click', {goodsId:goodsId,cid:cid,roadId:roadId,conversion:self.conversion},function(e){
					    				
				        				 var flag = $(this).attr("checked");
		       							 if(flag == 'checked'){
		       								$(this).val(e.data.goodsId);
		       								var flag = false;
	       									var flagc = false;
	       									for(var i=0;i<e.data.conversion.length;i++){
	       										
		       									if(e.data.cid == e.data.conversion[i].cid){
		       										flagc = true;
		       										var channels = e.data.conversion[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												flag = true;
		       												break;
		       											}
		       										}
		       										if(!flag){
		       											var channel = {};
				       									channel.channelId = e.data.roadId;
			   											channel.goodsId = e.data.goodsId;
			   											e.data.conversion[i].channels.push(channel);
		       										}
		       									}
		       								}
	       									
	       									if(!flagc){
	       										var channelsList = [];
		       									var channel = {};
		       									channel.channelId = e.data.roadId;
	   											channel.goodsId = e.data.goodsId;
	   											channelsList.push(channel);
		       									var conversionObj={
		       				                			cid:e.data.cid,
		       				                			type:tempe,
		       				                			channels:channelsList
		       				                	};
		       									e.data.conversion.push(conversionObj);
	   										}
		       							 }else{
		       								$(this).val(0);
		       								for(var i=0;i<e.data.conversion.length;i++){
		       									if(e.data.cid == e.data.conversion[i].cid){
		       										
		       										var channels = e.data.conversion[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												
		       												e.data.conversion[i].channels.splice(j,1);
		       												break;
		       											}
		       										}
		       										
		       										
		       									}
		       								}
		       							 }
					    				
					    			});	
			                    }else{
			                    	$("#"+cid+"_"+ roadId + "_change_award").bind('click', {goodsId:goodsId,cid:cid,roadId:roadId},function(e){
					    				
				        				 var flag = $(this).attr("checked");
		       							 if(flag == 'checked'){
		       								$(this).val(e.data.goodsId);
		       								var flag = false;
	       									var flagc = false;
	       									for(var i=0;i<self.conversion.length;i++){
	       										
		       									if(e.data.cid == self.conversion[i].cid){
		       										flagc = true;
		       										var channels = self.conversion[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												flag = true;
		       												break;
		       											}
		       										}
		       										if(!flag){
		       											var channel = {};
				       									channel.channelId = e.data.roadId;
			   											channel.goodsId = e.data.goodsId;
			   											self.conversion[i].channels.push(channel);
		       										}
		       									}
		       								}
	       									
	       									if(!flagc){
	       										var channelsList = [];
		       									var channel = {};
		       									channel.channelId = e.data.roadId;
	   											channel.goodsId = e.data.goodsId;
	   											channelsList.push(channel);
		       									var conversionObj={
		       				                			cid:e.data.cid,
		       				                			type:tempe,
		       				                			channels:channelsList
		       				                	};
		       									self.conversion.push(conversionObj);
	   										}
		       							 }else{
		       								$(this).val(0);
		       								for(var i=0;i<self.conversion.length;i++){
		       									if(e.data.cid == self.conversion[i].cid){
		       										
		       										var channels = self.conversion[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												
		       												self.conversion[i].channels.splice(j,1);
		       												break;
		       											}
		       										}
		       										
		       										
		       									}
		       								}
		       							 }
					    				
					    			});	
			                    }
			                    
			        			if(self.conversion != null && self.conversion.length > 0){
			        				for(var n=0;n<self.conversion.length;n++){
				        				var cocid = self.conversion[n].cid;
				        				var channels = self.conversion[n].channels;
				        				if(cid == cocid){
				        					for(var k=0;k<channels.length;k++){
				        						var channelId = channels[k].channelId;
				        						if(roadId == channelId){
				        							$("#"+cid+"_"+ roadId + "_change_award").attr("checked",true);
				        							$("#"+cid+"_"+ roadId + "_change_award").click();
				        							$("#"+cid+"_"+ roadId + "_change_award").attr("checked",true);
				        						}
				        					}			        					
				        					
				        				}			        				
				        				
				        			}
			        				
			        			}
			        			/*if(conversions != null && devicecol){
			        				for(var n=0;n<conversions.length;n++){
				        				var cocid = conversions[n].cid;
				        				var channels = conversions[n].channels;
				        				if(cid == cocid){
				        					for(var k=0;k<channels.length;k++){
				        						var channelId = channels[k].channelId;
				        						if(roadId == channelId){
				        							$("#"+ roadId + "_change_award").attr("checked",true);
				        							$("#"+ roadId + "_change_award").click();
				        							$("#"+ roadId + "_change_award").attr("checked",true);
				        						}
				        					}			        					
				        					
				        				}			        				
				        				
				        			}
			        				
			        			}*/
			        					        			 			       		        		        		        		       		
		        	    }   
		        		       		
		           };
		           $("#road_table_award").css({"height":"auto"});
			   	   
				});
			}

        	$("#cid_master_award").click();
        },
        sumitButtonClick: function() {
            var self = this;
            //保存
            $("#award_submit").bind("click", function() {
            	
            	var config = {
            			participate:self.participate,
            			conversion:self.conversion,
            			probalility:self.basedata.probalility
            	};
            	
            	var finalData={
            			lotteryName:self.basedata.lotteryName,
            			desc:self.basedata.desc,
            			devices:self.deviceList,
            			status:1,//保存
            			config:config
            	}
            	if(self.lotteryData != null){
            		Service.updateLotteryConfig(finalData, self.lotteryData._id,function(data) {
                        self.automatWindow.destroy();
                        self.fire("rendTableData");
                    });
            		
            	}else{
            		Service.addLotteryConfig(finalData, function(data) {
                        self.automatWindow.destroy();
                        self.fire("rendTableData");
                    });
            		
            	}
            	
            });
            //下发配置
            $("#award_save").bind("click", function() {
            	 
           	var config = {
           			participate:self.participate,
           			conversion:self.conversion,
           			probalility:self.basedata.probalility
           	};
           	var finalData={
           			lotteryName:self.basedata.lotteryName,
           			desc:self.basedata.desc,
           			devices:self.deviceList,
           			status:2,//下发配置
           			config:config,
           			autoRun:self.basedata.autoRun,
           			canBuy:self.basedata.canBuy
           	}
           
           	if(self.lotteryData != null){
        		Service.updateLotteryConfig(finalData, self.lotteryData._id,function(data) {
                    self.automatWindow.destroy();
                    self.fire("rendTableData");
                });
        		
        	}else{
        		Service.addLotteryConfig(finalData, function(data) {
                    self.automatWindow.destroy();
                    self.fire("rendTableData");
                });
        		
        	}

           });
        },
        lastSetpButtonClick: function() {
            $("#award_last_step").bind("click", function() {
            	$("#selfConfig").css("display", "block");
                $("#awardConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#devicelist").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").removeClass("active");
                $("#tab4").removeClass("active");
                $("#tab3").addClass("active");
                //$("#master").addClass("selected");
                $("#cid_master").click();
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
    return config;
});