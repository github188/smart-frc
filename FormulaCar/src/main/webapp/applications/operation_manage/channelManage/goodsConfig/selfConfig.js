define(function(require){
	var winHtml = require("text!./selfConfig.html");
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	require("../css/detail.css");
	var statusMg = require("../../../template/menu");
	var goodsConfigInfo  = require("./goodsConfig");
	var containerConfigInfo = require("./containerConfig");
	var Service = require("../service");
	var clone  = require("../clone/clone");
	
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.autoData = null;
			
			this.flag = false;
			this.render();
	        this.automatWindow = options.automatWindow;
	        this.saveGoodsConfig = null;
	        this.shelves = null;
	        this.containerGoods = null;
	        this.containerReals = new Array();
	        
	        
		},
		render:function(){
			$("#buttonDiv").css("width",$("#channel_list_table").width());
			this.sumitButtonClick();//点击 完成  按钮
		},
		//保存按钮的事件
		sumitButtonClick:function(){
			var self = this;
			$("#goodsconfig_submit").click(function(){
			    dialog.render({
                    lang: "affirm_modify",
                    buttons: [{
                            lang: "affirm",
                            click: function() {
                            	var deviceId = self.autoData._id;
                				Service.getAutomatById(deviceId, function(data) {
                					self.saveGoodsConfig = self.goodsConfig.saveGoodsConfig;
                					
                					self.autoData.goodsConfigsNew = self.saveGoodsConfig;
                					self.autoData.containersNew = self.containerGoods;
                					self.autoData.containers = data.result.containers;
                					self.autoData.goodsConfigs = data.result.goodsConfigs;
                					
                					
                						
                					//判断主柜里的同一种商品的价格是否一致
                					var hashMap = {};  
                					var commonGoods = {};
                					$(".road_td_image").each(function(){
  						    		      $(this).css("border","0px");
  						    	    });
                					if(self.saveGoodsConfig && self.saveGoodsConfig.length > 0){
                						for(var i=0;i<self.saveGoodsConfig.length;i++){
                							if( self.saveGoodsConfig[i].goods_id in commonGoods) {
                								commonGoods[self.saveGoodsConfig[i].goods_id] = commonGoods[self.saveGoodsConfig[i].goods_id] +','+self.saveGoodsConfig[i].location_id;
                							}else{
                								commonGoods[self.saveGoodsConfig[i].goods_id] = self.saveGoodsConfig[i].location_id;  
                							}
                						}
                						for(var i=0;i<self.saveGoodsConfig.length;i++){
                							if( self.saveGoodsConfig[i].goods_id in hashMap)  
                						    {  
                								
                						       if(parseFloat(hashMap[self.saveGoodsConfig[i].goods_id]).toFixed(2) == parseFloat(self.saveGoodsConfig[i].price).toFixed(2)){
                						       }else{
                						    	   var location_ids_array = commonGoods[self.saveGoodsConfig[i].goods_id].split(",");
                						    	   $(".road_td_image").each(function(){
                						    		   for(var k=0;k<location_ids_array.length;k++){
                						    			   if($(this)[0].id == location_ids_array[k]){
                						    				   $(this).css("border","2px solid red");
                						    			   }
                						    		   }
                						    	   });
                						    	   dialog.render({lang:"please_make_sure_that_the_price_of_the_same_kind_of_product_is_consistent"});
                    			           		   return;
                						       }
                						      
                						    }else{
                						    	hashMap[self.saveGoodsConfig[i].goods_id] = self.saveGoodsConfig[i].price;  
                						    }  
                						}
                					}
                					//判断辅柜里的同一种商品价格是否一致
                					
                					if(self.containerGoods && self.containerGoods.length > 0){
            							for(var ii =0;ii<self.containerGoods.length;ii++){
            								var shelves = self.containerGoods[ii].shelves;
            								var hashcontainerMap = {}; 
            								var commonGoodscontainer = {};
            								if(shelves && shelves.length > 0){
            									for(var j=0;j<shelves.length;j++){
                        							if( shelves[j].goods_id in commonGoodscontainer) {
                        								commonGoodscontainer[shelves[j].goods_id] = commonGoodscontainer[shelves[j].goods_id] +','+shelves[j].location_id;
                        							}else{
                        								commonGoodscontainer[shelves[j].goods_id] = shelves[j].location_id;  
                        							}
                        						}
            									for(var j=0;j<shelves.length;j++){
            										if( shelves[j].goods_id in hashcontainerMap)  
                        						    {  
                        						       if(parseFloat(hashcontainerMap[shelves[j].goods_id]).toFixed(2) == parseFloat(shelves[j].price).toFixed(2)){
                        						       }else{
                        						    	   var location_ids_array = commonGoodscontainer[shelves[j].goods_id].split(",");
                        						    	   $(".road_td_image").each(function(){
                        						    		   for(var k=0;k<location_ids_array.length;k++){
                        						    			   if($(this)[0].id == location_ids_array[k]){
                        						    				   $(this).css("border","2px solid red");
                        						    			   }
                        						    		   }
                        						    	   });
                        						    	   dialog.render({lang:"please_make_sure_that_the_price_of_the_same_kind_of_product_is_consistent"});
                            			           		   return;
                        						       }
                        						      
                        						    }else{
                        						    	hashcontainerMap[shelves[j].goods_id] = shelves[j].price;  
                        						    }  
            									}
            								}
            							}
            						}
                					cloud.util.mask("#channel_list_table");
                					Service.updateAutomat(deviceId, self.autoData, function(data) {
                						dialog.render({lang:"modify_the_channel_configuration_successfully"});
                						cloud.util.unmask("#channel_list_table");
                					});
                				});
                                dialog.close();
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

		setconfig:function(assetId,masterType){
			$("#tab_0").text(assetId+"("+masterType+")");
		},
		getData:function(deviceData){
			var self = this;
			self.autoData = deviceData;
		},
		getTab:function(saveGoodsConfig){
			var self=this;
			
			this.saveGoodsConfig = saveGoodsConfig;
			this.goodsConfig = new goodsConfigInfo({
      			selector:"#goodsConfigContent",
      			saveGoodsConfig:self.saveGoodsConfig,
      			events : {
      			}
      	    });
			
			self.bindGoodsClick();
			self.goodsConfig.showAndInitRoads(saveGoodsConfig);
		},
		
		bindGoodsClick:function(){
			var self =this;
			$("#goodsConfig").bind("click", function(){
				$("#goodsConfigContent").remove();
				if($("#component-deviceconfig-3 div").length == 0){
					$("#component-deviceconfig-3").append(
						     "<div id='goodsConfigContent' style='height:430px;position: relative;'>"+
							 "</div>"
					);
				}
				$(".tab_navs li").removeClass("selected");
				$("#goodsConfig").addClass("selected");

				if(this.goodsConfig){
					this.goodsConfig.destroy();
				}
				this.goodsConfig = new goodsConfigInfo({
	      			selector:"#goodsConfigContent",
	      			saveGoodsConfig:self.saveGoodsConfig,
	      			events : {
	      			}
	      	    });
				if(self.goodsConfig.realRoadsData.goodsConfigs){
					self.saveGoodsConfig = self.goodsConfig.realRoadsData.goodsConfigs;
				}
				self.goodsConfig.showAndInitRoads(self.saveGoodsConfig);
			});
		},
		
		getOtherTab:function(containerGoodsConfig){
			var self = this;

			self.containerGoods = containerGoodsConfig;
			var con = $("#devicegoodsall").find('li');

			for(var j=1;j<con.length;j++){
				$(con[j]).remove();
			}
			$("#goodsConfig").addClass("selected");
			self.containerReals = [];
            
			if(self.containerGoods && self.containerGoods.length > 0){
				for(var i =0;i<self.containerGoods.length;i++){
					var cid = self.containerGoods[i].cid;//货柜编号
					var type = self.containerGoods[i].type;//货柜类型
					var typen = self.containerGoods[i].type;
					
					if(type==1){
						type = locale.get({lang: "drink_machine"});
                    }else if(type==2){
                    	type = locale.get({lang: "spring_machine"});
                    }else if(type==3){
                    	type = locale.get({lang: "grid_machine"});
                    	
                    }
					var shelves = self.containerGoods[i].shelves;//货柜货道配置
					self.shelves = shelves;
					
					var j=i+1;
					
					$("#devicegoodsall").append(
						 "<li  id='cid_"+cid+"' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
							    "<a id='tab_"+j+"'>"+cid+"("+type+")</a>"+
						 "</li>"
				    );
					
					$("#cid_"+cid).bind("click",{cid:cid,shelves:shelves,type:typen}, function(e){
						$(".tab_navs li").removeClass("selected");
						
						$("#cid_"+e.data.cid).addClass("selected");
					
						$("#goodsConfigContent").remove();
						if($("#component-deviceconfig-3 div").length == 0){
							$("#component-deviceconfig-3").append(
								     "<div id='goodsConfigContent' style='height:430px;position: relative;'>"+
									 "</div>"
							);
						}
						
						var containerShelvesData = e.data.shelves;
						var tempf = true;
						var conlen = self.containerReals.length;
						
						if(self.containerShelvesConfig){
							
							for(var m=0;m<conlen;m++){
								
								if(self.containerReals[m].cid == self.containerShelvesConfig.containerRealDatas.cid){
									self.containerReals[m].goodsConfig = self.containerShelvesConfig.containerRealDatas.containerRealRoadsData.goodsConfigs;
									tempf = false;
									
								}
								
							}
							if(tempf){
								var containerData = {};
								containerData.cid = self.containerShelvesConfig.containerRealDatas.cid;
								containerData.goodsConfig = self.containerShelvesConfig.containerRealDatas.containerRealRoadsData.goodsConfigs;
								self.containerReals.push(containerData);
							}
							
							if(self.containerShelvesConfig.containerRealDatas.hasOwnProperty(e.data.cid)){
								
								containerShelvesData = self.containerShelvesConfig.containerRealDatas[e.data.cid].goodsConfigs;
							}
							
						}else{
							var containerData = {};
							containerData.cid = e.data.cid;
							containerData.goodsConfig = containerShelvesData;
							self.containerReals.push(containerData);
						}
						
						if(self.flag){
							self.containerReals = [];
						}
						if(self.containerGoods && self.containerGoods.length > 0){
							for(var ii =0;ii<self.containerGoods.length;ii++){
								
								if(self.containerGoods[ii].cid == e.data.cid){
									if(self.containerReals.length > 0){
										
										for(var x=0;x<self.containerReals.length;x++){
											if(self.containerReals[x].cid == self.containerGoods[ii].cid){
												self.containerGoods[ii].shelves = self.containerReals[x].goodsConfig;
											}
										}
									}
									
									
								}
							}
						}
						
						if(self.containerShelvesConfig){
							self.containerShelvesConfig.destroy();
						}
						
						self.containerShelvesConfig = new containerConfigInfo({
			      			selector:"#goodsConfigContent",
			      			containerGoods:self.containerGoods,
			      			cid:e.data.cid,
			      			machineType:e.data.type,
			      			events : {
			      				
			      			}
			      	    });
						for(var k=0;k<self.containerReals.length;k++){
							if(self.containerReals[k].cid == e.data.cid){
								containerShelvesData = self.containerReals[k].goodsConfig;
							}
						}
						self.containerShelvesConfig.showAndInitRoads(containerShelvesData);
						self.flag = false;
					});
				}
			}
		}
	});
	return config;
});