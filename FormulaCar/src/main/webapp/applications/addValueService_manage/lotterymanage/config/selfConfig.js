define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./selfConfig.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("./css/style.css");
    var Service = require("../service");
    var AwardConfigInfo = require("./awardConfig");
  
    var config = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(winHtml);
            locale.render({element: this.element});
            this.automatWindow = options.automatWindow;
            //this.shelvesList = options.shelvesList;
            this.countersList = options.countersList;
            this.lotteryData = options.lotteryData;
            if(options.lotteryData!=null){
            	this.participate = options.lotteryData.config.participate;
            }else{
            	this.participate = [];
            }
            this.basedata = options.basedata;
            this.deviceList= options.deviceList;
            this.render();
            this.goodsWinWidth = 458;
            this.goodsWinHeight = 378;
            this.channelsList = [];
   //         this.participate =[];
            
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
				//self.shelves = shelves;
				
				var j=i+1;
				$("#devicegoodsall").append(
					 "<li  id='cid_"+cid+"' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
						    "<a id='tab_"+j+"'>"+cid+"("+type+")</a>"+
					 "</li>"
			    );
				
				$("#cid_"+cid).bind("click",{cid:cid,shelves:shelves},function(e){
					$(".tab_navs li").removeClass("selected");
					$("#cid_"+e.data.cid).addClass("selected");
					var shelves = e.data.shelves;
					var cid = e.data.cid;
					$("#goodsConfigContent").html("");
					
				  
					var row = 0;
		        	var roadInfoHtml = "<table id='road_table' style='width:930px;margin-top: 10px;'>";
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
		        											"<tr style='height:82px;width:100%'><td id='"+e.data.shelves[i].location_id+"' class='road_td_image' style='font-size:20px;'><div style='width: 30px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+e.data.shelves[i].location_id+"</div>+</td></tr>"+
		        											"<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='"+e.data.shelves[i].location_id+"_goods_name'><td><span style='font-weight:600' id='"+e.data.shelves[i].location_id+"_name_content'>&nbsp;"+"</span></td></tr>"+       											
		        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + e.data.shelves[i].location_id + "_goods_price'><td><input type='text' value='0' style='width:30px;height: 10px;text-align: right;'   disabled='disabled' id='" + e.data.shelves[i].location_id+ "_price_content' />" + "<span>"+locale.get({lang: "china_yuan"})+"</span>&nbsp;&nbsp;<span id='" + e.data.shelves[i].location_id + "_check'></span></td></tr>" +
		        										"</table>"+
		        									  "</td>";
		        		if(i%8==8){
		        			roadInfoHtml = roadInfoHtml + "</tr>";
		        		}
		        	};
		        	$("#goodsConfigContent").html(roadInfoHtml);
		        	var participates = null;
		        	var devicecol = false; 
		        	
		 	   	    if(self.lotteryData != null){
		 	   	        self.participate = self.lotteryData.config.participate;	
		 	   	       
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
		 	   	    	if(self.participate == undefined){
		 	   	    		
		 	   	    	    self.participate = [];
		 	   	    	
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
			        			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
			        			$("#"+roadId+"_name_content").html(name);	        			
			        			$("#" + roadId + "_price_content").val(price);
			                    $("#" + roadId + "_check").html("        <input type='checkbox'  id='"+cid+"_"+roadId+"_change'  name='"+cid+"_"+tempe+"' class='"+cid+"_check_goods' style='width:18px;height:18px;position:absolute;'>");
			        			if(self.lotteryData != null){
			        				$("#"+cid+"_"+ roadId + "_change").bind('click', {goodsId:goodsId,cid:cid,roadId:roadId,participate:self.participate},function(e){
					    				
				        				
				        				 var flag = $(this).attr("checked");
		       							 if(flag == 'checked'){
		       								$(this).val(e.data.goodsId);
		       								
	       									var flag = false;
	       									var flagc = false;
	       									for(var i=0;i<e.data.participate.length;i++){
	       										
		       									if(e.data.cid == e.data.participate[i].cid){
		       										flagc = true;
		       										var channels = e.data.participate[i].channels;
		       										
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
			   											e.data.participate[i].channels.push(channel);
		       										}
		       									}
		       								}
	       									
	       									if(!flagc){
	       										var channelsList = [];
		       									var channel = {};
		       									channel.channelId = e.data.roadId;
	   											channel.goodsId = e.data.goodsId;
	   											channelsList.push(channel);
		       									var participateObj={
		       				                			cid:e.data.cid,
		       				                			type:tempe,
		       				                			channels:channelsList
		       				                	};
		       									e.data.participate.push(participateObj);
	   										}
	       									
		       							 }else{
		       								$(this).val(0);
		       								
		       								for(var i=0;i<e.data.participate.length;i++){
		       									if(e.data.cid == e.data.participate[i].cid){
		       										
		       										var channels = e.data.participate[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												
		       												e.data.participate[i].channels.splice(j,1);
		       												break;
		       											}
		       										}
		       										
		       										
		       									}
		       								}
		       								
		       							 }
					    				
					    			});	
			        			}else{
			        				$("#"+cid+"_"+ roadId + "_change").bind('click', {goodsId:goodsId,cid:cid,roadId:roadId,participate:self.participate},function(e){
					    				
				        				
				        				 var flag = $(this).attr("checked");
		       							 if(flag == 'checked'){
		       								$(this).val(e.data.goodsId);
		       								
	       									var flag = false;
	       									var flagc = false;
	       									for(var i=0;i<self.participate.length;i++){
	       										
		       									if(e.data.cid == self.participate[i].cid){
		       										flagc = true;
		       										var channels = self.participate[i].channels;
		       										
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
			   											self.participate[i].channels.push(channel);
		       										}
		       									}
		       								}
	       									
	       									if(!flagc){
	       										var channelsList = [];
		       									var channel = {};
		       									channel.channelId = e.data.roadId;
	   											channel.goodsId = e.data.goodsId;
	   											channelsList.push(channel);
		       									var participateObj={
		       				                			cid:e.data.cid,
		       				                			type:tempe,
		       				                			channels:channelsList
		       				                	};
		       									self.participate.push(participateObj);
	   										}
	       									
		       							 }else{
		       								$(this).val(0);
		       								
		       								for(var i=0;i<self.participate.length;i++){
		       									if(e.data.cid == self.participate[i].cid){
		       										
		       										var channels = self.participate[i].channels;
		       										
		       										for(var j=0;j<channels.length;j++){
		       											if(e.data.roadId == channels[j].channelId){
		       												
		       												self.participate[i].channels.splice(j,1);
		       												break;
		       											}
		       										}
		       										
		       										
		       									}
		       								}
		       								
		       							 }
					    				
					    			});	
			        			}
			                    
                              
			        			if(self.participate != null && self.participate.length > 0 ){
			        				for(var n=0;n<self.participate.length;n++){
				        				var pacid = self.participate[n].cid;
				        				var channels = self.participate[n].channels;
				        				if(cid == pacid){
				        					for(var k=0;k<channels.length;k++){
				        						var channelId = channels[k].channelId;
				        						if(roadId == channelId){
				        							$("#"+cid+"_"+ roadId + "_change").attr("checked",true);
				        							$("#"+cid+"_"+ roadId + "_change").click();
				        							$("#"+cid+"_"+ roadId + "_change").attr("checked",true);
				        						}
				        					}			        					
				        					
				        				}			        				
				        				
				        			}
			        				
			        				
			        			}
			        			
			        			/*if(participates != null && devicecol){
			        				for(var n=0;n<participates.length;n++){
				        				var pacid = participates[n].cid;
				        				var channels = participates[n].channels;
				        				if(cid == pacid){
				        					for(var k=0;k<channels.length;k++){
				        						var channelId = channels[k].channelId;
				        						if(roadId == channelId){
				        							$("#"+cid+"_"+ roadId + "_change").attr("checked",true);
				        							$("#"+cid+"_"+ roadId + "_change").click();
				        							$("#"+cid+"_"+ roadId + "_change").attr("checked",true);
				        						}
				        					}			        					
				        					
				        				}			        				
				        				
				        			}
			        			}*/
			        			
			        			 			       		        		        		        		       		
		        	    }   
		        		       		
		           };
		           $("#road_table").css({"height":"auto"});
			   	   
				});
			   }

             	   	   
 	   	     $("#cid_master").click();
 	   	    
 	   	       
        	
        },
        
        sumitButtonClick: function() {
            var self = this;
            
            $("#model_next_step").bind("click", function() {
            	
            	$("#selfConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#awardConfig").css("display", "block");
                $("#devicelist").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab4").addClass("active");
                if(this.AwardConfig){
                	$("#master_award").find("a").addClass("selected");
                	
                	 $("#master_award").click();
                	 
                }else{
                	this.AwardConfig = new AwardConfigInfo({
                        selector: "#awardConfigInfo",
                        automatWindow: self.automatWindow,
                        deviceList:self.deviceList,
                        countersList:self.countersList,
                        basedata:self.basedata,
                        participate:self.participate,
                        lotteryData:self.lotteryData,
                        events: {
                            "rendTableData": function() {
                                self.fire("rendTableData");
                            }
                        }
                    });
                }
                
                
            });
        },
        lastSetpButtonClick: function() {
            $("#model_last_step").bind("click", function() {
                $("#selfConfig").css("display", "none");
                $("#awardConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#devicelist").css("display", "block");
                $("#tab1").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab4").removeClass("active");
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