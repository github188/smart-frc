define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./selfConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	require("../css/table.css");
	require("../css/style.css");
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.configData = null;  //上一页和详情传过来的数据包
			this.render();
			this.saveGoodsConfig = null;
			this.goodsWinWidth = 458;
	        this.goodsWinHeight = 378;
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.initHTML();
			this.sumitButtonClick();
			this.lastSetpButtonClick();
			//self.showRoads();
		},
		
		//打开选择商品窗口
		showGoodsInfoWindow:function(roadId){
			var self = this;
			if(this.goodsWindow){
				this.goodsWindow.destroy();
			}
            this.goodsWindow =  new _Window({
            	container : "body",
                title : locale.get("automat_road_goods_choice",[roadId]),
                top: "center",
                left: "center",
                height: self.goodsWinHeight,
                width: self.goodsWinWidth,
                events : {
                    "onClose": function() {
                        self.goodsWindow = null;
                    },
                    scope : this
                }
            });
            this.goodsWindow.show();
            this.setGoodsContent(roadId);
		},
		
		//加载商品信息
		setGoodsContent:function(roadId){
			cloud.util.mask(".ui-window-content:last");
			var self = this;
			var html = "<div id='automat_cargo_road_config'>"+
						"<div style='margin:5px;'>"+
			              '<input id="goods_search_name_input" type="text" style="border-radius: 4px;width: 230px;height: 25px;" class="search-input-name input-search c666 module-input-row-el">'+
						  '&nbsp;&nbsp;<a id="goods_search_btn" class="btn btn-primary submit search-btn" style="margin-top: 0px;width:20px;min-width:30px;" lang="text:query">'+locale.get("query")+'</a><br>'+
						  "</div>"+
					   	   "<div id='goods_image'>";
			var row = 0;
			Service.getGoodslist(name,0,1000,function(data){
				if(data.result.length<=4){
					html =html+"<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
				}else{
					html =html+"<table id='goods_table'>";
				}
	    		for(var i=0;i<data.result.length;i++){
	        		if(i%4==0){
	        			row = row + 1;
	        			html = html + "<tr style='width:100%;'>";
	        		}
	        		var imagepath = data.result[i].imagepath;
        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        			html = html + "<td class='good_image_hover'width='20%' id="+data.result[i]._id+">"
        						+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' payUrl='"+data.result[i].payUrl+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width:"+self.goodsWinWidth/4.5+"px;height:"+self.goodsWinWidth/4.5+"px;'/>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
	        		if(i%4==3){
	        			html = html + "</tr>";
	        		}
	    		}
	    		html = html+"</table></div></div>";
	    		
	    		this.goodsContentContainer =$(html)
	            .height(this.goodsWinHeight-50).width(this.goodsWinWidth-20);
		        this.goodsWindow.setContents(this.goodsContentContainer);
	    		
		        
		        $(".good_image_hover").click(function(event){
	    			var imagepath = event.target.id;
	    			var price = event.srcElement.attributes.price.value;
	    			var goodsId = this.id;
	    			var name = event.srcElement.attributes.name.value;
	    			var type = event.srcElement.attributes.type.value;
	    			var typeName = event.srcElement.attributes.typeName.value;
	    			var payment_url = event.srcElement.attributes.payUrl.value;
	    			var image_md5 = event.srcElement.attributes.md5.value;
	    			
	    			if(!self.realRoadsData||self.realRoadsData == null){
	    				self.realRoadsData = new Object();
	    			}
	    			if(self.realRoadsData.goodsConfigs == null){
	    				self.realRoadsData.goodsConfigs = new Array();
	    			}
	    			var goodsConfig = {
	    				"location_id":roadId,
	    				"button_id":roadId,
	    				"goods_id":goodsId,
	    				"goods_name":name,
	    				"goods_type":type,
	    				"goods_typeName":typeName,
	    				"price":price,
	    				"img":imagepath,
	    				"payment_url":payment_url,
	    				"imagemd5":image_md5
	    			};
	    			var roadStartingNumber = $("#roadStartingNumber").val();
	    			self.realRoadsData.goodsConfigs[roadId-roadStartingNumber] = goodsConfig;
	    			self.goodsWindow.hiden();
	    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    			$("#"+roadId).html("<div style='width: 20px;height: 10px;font-size: 12px;'>"+roadId+"</div><img src='"+src+"' style='height:60px;'/>");
	    			$("#"+roadId+"_name_content").html(name);
	    			$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	    			$("#remove_road_"+roadId).click(function(){
	    				self.realRoadsData.goodsConfigs[roadId-roadStartingNumber] = null;
	    				$("#"+roadId).html("<div style='width: 20px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+roadId+"</div>+");
		    			$("#"+roadId+"_name_content").html("&nbsp");
		    			$("#"+roadId+"_price_content").html("&nbsp");
	    			});
	        	});
		        
		        $(".search-btn").click(function(){
		        	var name = $(".search-input-name").val();
                	cloud.util.mask(".ui-window-content:last");
                	self.service.getGoodslist(name,0,1000,function(data){
            			$("#goods_image").html("");
            			self.initGoodsView(data,roadId);
            			cloud.util.unmask(".ui-window-content:last");
                	},self);
		        });
		        $("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
	    		cloud.util.unmask(".ui-window-content:last");
	         },self);
		},
		
		initGoodsView:function(data,roadId){
			var self = this;
			$("#goods_image").html("");
			var goodsInfoHtml = "<table id='goods_table'>";
			if(data.result.length<=4){
				goodsInfoHtml = "<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
			}
        	var row = 0;
    		for(var i=0;i<data.result.length;i++){
        		if(i%4==0){
        			row = row + 1;
        			goodsInfoHtml = goodsInfoHtml + "<tr style='width:100%;'>";
        		}
        		var imagepath = data.result[i].imagepath;
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			goodsInfoHtml = goodsInfoHtml + "<td class='good_image_hover' width='20%' id="+data.result[i]._id+">"
				+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' payUrl='"+data.result[i].payUrl+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width:"+self.goodsWinWidth/4.5+"px;height:"+self.goodsWinWidth/4.5+"px;'/>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
        		if(i%4==3){
        			goodsInfoHtml = goodsInfoHtml + "</tr>";
        		}
    		}
    		goodsInfoHtml = goodsInfoHtml+"</table>"
    		$("#goods_image").html(goodsInfoHtml);
    		$("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
    		$(".good_image_hover").click(function(event){
    			var imagepath = event.target.id;
    			var price = event.srcElement.attributes.price.value;
    			var goodsId = this.id;
    			var name = event.srcElement.attributes.name.value;
    			var type = event.srcElement.attributes.type.value;
    			var typeName = event.srcElement.attributes.typeName.value;
    			var payment_url = event.srcElement.attributes.payUrl.value;
    			var image_md5 = event.srcElement.attributes.md5.value;
    			
    			if(self.realRoadsData == null||self.realRoadsData.goodsConfigs == null){
    				self.realRoadsData = new Object();
    				self.realRoadsData.goodsConfigs = new Array();
    			}
    			var goodsConfig = {
    				"location_id":roadId,
    				"button_id":roadId,
    				"goods_id":goodsId,
    				"goods_name":name,
    				"goods_type":type,
    				"goods_typeName":typeName,
    				"price":price,
    				"img":imagepath,
    				"payment_url":payment_url,
    				"imagemd5":image_md5
    			};
    			var roadStartingNumber = $("#roadStartingNumber").val();
    			self.realRoadsData.goodsConfigs[roadId-roadStartingNumber] = goodsConfig;
    			self.goodsWindow.hiden();
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			$("#"+roadId).html("<div style='width: 20px;height: 10px;font-size: 12px;'>"+roadId+"</div><img src='"+src+"' style='height:60px;'/>");
    			$("#"+roadId+"_name_content").html(name);
    			$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
    			$("#remove_road_"+roadId).click(function(){
    				self.realRoadsData.goodsConfigs[roadId-roadStartingNumber] = null;
    				$("#"+roadId).html("<div style='width: 20px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+roadId+"</div>+");
	    			$("#"+roadId+"_name_content").html("&nbsp");
	    			$("#"+roadId+"_price_content").html("&nbsp");
    			});
        	});
		},
		
		//保存按钮的事件
		sumitButtonClick:function(){
			var self = this;
			$("#model_submit").bind("click", function(){
				if(!self.saveAsWindow){
	        		self.saveAsWindow =  new _Window({
		                container : "body",
		                title : locale.get("prompt"),
		                top: "center",
		                left: "center",
		                height: 180,
		                width: 400,
		                mask: false,
		                onblur:true,
		                events : {
		                	"onClose":function(){
		                		self.saveAsWindow = null;
		                	},
		                    scope : self
		                }
		            });
		            var html = "<div style='margin-top:10px;'><strong style='margin-top:10px;font-weight:600;'>"+locale.get({lang:"save_as_goods_model_prompt"})+":</strong><br/><br/><center><input type='text' style='width:250px;border-radius: 4px;width: 270px;height: 25px;' id='goods_model_name'></center>"+
		            		   "</div>" +
		            		   "<div style='height:40px;'>"+
								   "<div style='text-align: right;width: 100%;margin-top: 10px;border-top: 1px solid #f2f2f2;'>"+
								     "<a id='save_as_goods_model' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"yesText"})+"</a><a id='save_as_goods_model_cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"noText"})+"</a></div>"+
								   "</div>"+
								"</div>";
		            self.saveContentContainer =$(html);
					self.saveAsWindow.setContents(self.saveContentContainer);
	        	}
				self.saveAsWindow.show();
				
				//是否保存存为模板按钮事件
				//保存为模板
				$("#save_as_goods_model").click(function(){
					var name = $("#goods_model_name").val();
					if(name == null||name ==""){
						dialog.render({lang:"automat_please_enter_goods_model_name"});
						return;
					}else{
						cloud.util.mask(".ui-window-body:last");
						var name = $("#goods_model_name").val();
						var goodsModelId = $("#automat_goods_roads option:selected").val();
						var modelId = $("#automat_model option:selected").val().split("_")[0];
						var modelName = $("#automat_model option:selected").text();
						var goodsConfigs = self.realRoadsData.goodsConfigs;
						if(self.realRoadsData.goodsConfigs!=null){
							self.saveGoodsConfig = self.realRoadsData.goodsConfigs.concat();
						}else{
							self.saveGoodsConfig = null;
						}
						self.saveAsWindow.destroy();
						Service.addGoodsModel(name,modelId,modelName,goodsConfigs,function(data){
							//cloud.util.unmask(".ui-window-body:first");
							if(data.error_code!=null&&data.error_code=="21322"){
								cloud.util.unmask(".ui-window-body:last");
								dialog.render({lang:"automat_goods_model_name_exists"});
								return;
							}else{
								if(data.result.goodsConfigs!=null){
									self.realRoadsData.goodsConfigs = data.result.goodsConfigs.concat();
									self.saveGoodsConfig = self.realRoadsData.goodsConfigs.concat();
								}else{
									if(self.realRoadsData==null){
										self.realRoadsData = new Object();
									}
									self.realRoadsData.goodsConfigs = null;
									self.saveGoodsConfig = null;
								}
								$("#automat_goods_roads").append("<option value='"+data.result._id+"'>"+data.result.name+"</option>");
								$("#automat_goods_roads option[value='"+data.result._id+"'] ").attr("selected",true);
								self.checkGoodsConfig(data.result.goodsConfigs);
								
								cloud.util.mask("#selfConfigInfo");
		        				//添加售货机
								if(self.configData._id){
									Service.updateAutomat(self.configData._id,null,self.configData.name,self.configData.modelId,
											self.configData.modelName,self.configData.siteId,self.configData.siteName,
											self.configData.assetId,goodsConfigs,true,function(data){
											
										cloud.util.unmask("#selfConfigInfo");
										self.saveAsWindow.destroy();
										self.saveAsWindow = null;
										self.automatWindow.destroy();
										self.fire("rendTableData");
									});
								}else{
									Service.addAutomat(self.configData.area,self.configData.name,self.configData.modelId,self.configData.modelName,
	            						       self.configData.siteId,self.configData.siteName,self.configData.assetId,goodsConfigs,function(data){
										cloud.util.unmask("#selfConfigInfo");
										self.saveAsWindow.destroy();
										self.saveAsWindow = null;
										self.automatWindow.destroy();
										self.fire("rendTableData");
									});
								}
							}
						});
					}
				});
				//不保存为模板
				$("#save_as_goods_model_cancel").click(function(){
					
					if(self.realRoadsData){
						var goodsConfigs = self.realRoadsData.goodsConfigs;
						if(self.realRoadsData.goodsConfigs!=null){
							self.saveGoodsConfig = self.realRoadsData.goodsConfigs.concat();
						}else{
							self.saveGoodsConfig = null;
						}
						self.realRoadsData.roadModelId = $("#automat_goods_roads option:selected").val();;
						self.realRoadsData.roadModelName = $("#automat_goods_roads option:selected").text();;
						self.checkGoodsConfig(goodsConfigs);
						self.saveAsWindow.destroy();
						cloud.util.mask("#selfConfigInfo");
        				//添加售货机
						if(self.configData._id){
							Service.updateAutomat(self.configData._id,null,self.configData.name,self.configData.modelId,
												  self.configData.modelName,self.configData.siteId,self.configData.siteName,
												  self.configData.assetId,goodsConfigs,true,function(data){
								cloud.util.unmask("#selfConfigInfo");
								self.saveAsWindow.destroy();
				 				self.saveAsWindow = null;
				 				self.automatWindow.destroy();
				 				self.fire("rendTableData");
							});
						}else{
							Service.addAutomat(self.configData.area,self.configData.name,self.configData.modelId,self.configData.modelName,
     						       self.configData.siteId,self.configData.siteName,self.configData.assetId,goodsConfigs,function(data){
								cloud.util.unmask("#selfConfigInfo");
				     			self.saveAsWindow.destroy();
				 				self.saveAsWindow = null;
				 				self.automatWindow.destroy();
				 				self.fire("rendTableData");
				     		});
						}
					}
				});
				
			})
		},
		
		lastSetpButtonClick:function(){
			$("#model_last_step").bind("click",function(){
				$("#selfConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#tab1").addClass("active");
			})
		},
		
		//初始货道配置界面
		initHTML:function(){
			var self = this;
			var html = "<div style='float:left;width:100%;height:40px;font-size: 14px;'>"+
	   						"<label style='margin:20px;'>"+locale.get({lang:"automat_cargoroad_model"})+"</label>"+
	   							"<select id='automat_goods_roads' style='width: 210px;height: 25px;-webkit-border-radius: 5px;'>"+
	   							"</select>&nbsp;&nbsp;&nbsp;"+
	   					"</div>"+
	   					"<div id='cargo_road_info' style='height:315px;width:100%;overflow: auto;'>"+
	   					"</div>"+
	   					"<div style='height:40px;'>"+
	   						"<div style='text-align: right;width: 100%;margin-top: 15px;border-top: 1px dotted #ccc;'>"+
	   							"<a id='model_last_step' style='margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"price_step"})+"</a>"+
	   							"<a id='model_submit' class='btn btn-primary submit' style='margin-left: 10px;margin-top: 8px;'>"+locale.get({lang:"complete"})+"</a>" +
	   						"</div>"+
	   					"</div>";
			
//			$("#automat_cargo_road_config").append(html);
			
			//上一页中选择了机型，下一页后将机型信息存到一个hidden中
			var modelInfo  = $("#selectModels").val();
			var modelId = modelInfo.split("_")[0];
			//填充货道模板选项
			Service.getAllGoodsModelInfo(modelId,function(data){
				$("#automat_goods_roads").append("<option value='none' >" + locale.get({"lang":"please_select_cargoroad_model"}) + "</option>");
				if(data.result.length>0){
	        		$.each(data.result,function(n,item) {
	        			if(n==0){
	        				self.select = item._id + "_"+item.roadNumber;
	        			}
        				$("#automat_goods_roads").append("<option value='" + item._id + "' >" + item.name + "</option>");
	                });
	        		$("#automat_goods_roads").change(function(){
	        			cloud.util.mask("#automat_cargo_road_config");
	        			self.showRoads();
	        			var goodsModelId = $("#automat_goods_roads option:selected").val();
	        			self.initRoadImageByGM(goodsModelId);
	        		});
	        	}
				self.showAndInitRoads();   //初始化货道个数
			},self);
		},
		// 初始化货道个数
		showAndInitRoads:function(){
			var self = this;
			self.showRoads();
			if(self.saveGoodsConfig&&self.saveGoodsConfig!=null){
				self.initRoadWindowImage(self.saveGoodsConfig);
			}
			cloud.util.unmask("#automat_cargo_road_config");
		},
		//根据机型信息绘制货道个数
		showRoads:function(){
			var self = this;
			cloud.util.mask("#automat_cargo_road_config");
    		var modelId = $("#selectModels").val().split("_")[0];
    		if(modelId){
    			Service.getModelById(modelId,function(data){
    				var row = 0;
    	    		if(!self.realRoadsData||self.realRoadsData == null){
    					self.realRoadsData = new Object();
    				}
    				if(self.realRoadsData.goodsConfigs == null){
    					self.realRoadsData.goodsConfigs = new Array();
    				}
    				
        			var roadStartingNumber = data.result.roadStartingNumber;
        			$("#roadStartingNumber").val(roadStartingNumber);
        			var roadInfoHtml = "<table id='road_table' style='width:100%;'>";
        			var roadNumber = $("#selectModels").val().split("_")[1];
        			var roadNumber_new;
        			if(roadStartingNumber == 0){
        				roadNumber_new = parseInt(roadNumber);
        			}else{
        				roadNumber_new = parseInt(roadNumber) + parseInt(roadStartingNumber);
        			}
            		for(var i=0;i<roadNumber_new;i++){
            			if(i < roadStartingNumber){
            			}else{
            				var numbers = parseInt(roadStartingNumber);
            				if(i%8 == numbers){
                    			row = row + 1;
                    			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
                    		}
                    		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
                    										"<table style='width:100%'>"+
                    											"<tr style='height:80px;width:100%'><td id='"+i+"' class='road_td_image' style='font-size:20px;'><div style='width: 20px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+i+"</div>+</td></tr>"+
                    											"<tr style='width:100%;text-align:center;font-size:10px;'  id='"+i+"_goods_name'><td><span style='font-weight:600' id='"+i+"_name_content'>&nbsp;"+"</span></td></tr>"+
                    											"<tr style='width:100%;text-align:center;font-size:10px;' id='"+i+"_goods_price'><td><span style='font-weight:600'  id='"+i+"_price_content'>&nbsp;"+"</span></td></tr>"+
                    										"</table>"+
                    									  "</td>";
                    		if(i%8 == (7+numbers)){
                    			roadInfoHtml = roadInfoHtml + "</tr>";
                    		}
                			
                			var goodsConfig = null;
                			if(i>=roadNumber){
                			}else{
                				self.realRoadsData.goodsConfigs[i] = goodsConfig;
                			}
                			
            			}
            		}
            		$("#cargo_road_info").html(roadInfoHtml);
            		$("#cargo_road_info").html(roadInfoHtml);
            		$("#cargo_road_info").html(roadInfoHtml);
            		$("#road_table").css({"height":"auto"});
            		$(".road_td_image").bind("click" , function(){
                		self.showGoodsInfoWindow(this.id);
                	});
        		});
    		}
    		
		},
		/*showRoads:function(){
			var self = this;
			cloud.util.mask("#automat_cargo_road_config");
			var roadInfoHtml = "<table id='road_table' style='width:100%;'>";
    		var roadNumber = $("#selectModels").val().split("_")[1];//$("#automat_model option:selected").val()==undefined?self.select.split("_")[1]:$("#automat_model option:selected").val().split("_")[1];
    		
    		var row = 0;
    		if(!self.realRoadsData||self.realRoadsData == null){
				self.realRoadsData = new Object();
			}
			if(self.realRoadsData.goodsConfigs == null){
				self.realRoadsData.goodsConfigs = new Array();
			}
    		for(var i=0;i<roadNumber;i++){
        		if(i%8==0){
        			row = row + 1;
        			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
        		}
        		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
        										"<table style='width:100%'>"+
        											"<tr style='height:80px;width:100%'><td id='"+i+"' class='road_td_image' style='font-size:20px;'>+</td></tr>"+
        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='"+i+"_goods_name'><td><span style='font-weight:600' id='"+i+"_name_content'>&nbsp;"+"</span></td></tr>"+
        											"<tr style='width:100%;text-align:center;font-size:10px;' id='"+i+"_goods_price'><td><span style='font-weight:600'  id='"+i+"_price_content'>&nbsp;"+"</span></td></tr>"+
        										"</table>"+
        									  "</td>";
        		if(i%8==7){
        			roadInfoHtml = roadInfoHtml + "</tr>";
        		}
    			
    			var goodsConfig = null;
    			self.realRoadsData.goodsConfigs[i] = goodsConfig;
    		}
    		
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#road_table").css({"height":"auto"});
    		$(".road_td_image").bind("click" , function(){
        		self.showGoodsInfoWindow(this.id);
        	});
		},*/
		
		//根据货道模板填充货道
		initRoadImageByGM:function(goodsModelId){
			var self = this;
			if(goodsModelId!=null&&goodsModelId!="none"){
				Service.getGoodsModelById(goodsModelId,function(data){
					var roadStartingNumber = data.result.roadStartingNumber;
					$("#roadStartingNumber").val(roadStartingNumber);
	        		self.initRoadWindowImage(data.result.goodsConfigs);
	        	},self);
			}
		},
		
		//根据货道配置填充货道
		initRoadWindowImage:function(data){
			var self = this;
			var modelId = $("#selectModels").val().split("_")[0];
    		if(modelId){
    			Service.getModelById(modelId,function(datas){
    				var roadStartingNumber = datas.result.roadStartingNumber;
        			$("#roadStartingNumber").val(roadStartingNumber);
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
        						self.realRoadsData.goodsConfigs[item.location_id-roadStartingNumber] = goodsConfig;
        	        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        	        			$("#"+item.location_id).html("<div style='width: 20px;height: 10px;font-size: 12px;'>"+item.location_id+"</div><img src='"+src+"' style='height:60px;'/>");
        	        			$("#"+item.location_id).append("<input type='hidden' id='imagemd5'/>");
        	        		    $("#imagemd5").val(imageMd5);
        	        		    
        	        			$("#"+item.location_id+"_name_content").html(item.goods_name);
        		    			$("#"+item.location_id+"_price_content").html(item.price+locale.get({lang:"china_yuan"})+"        <a id='remove_road_"+item.location_id+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
        		    			$("#remove_road_"+item.location_id).click(function(){
        		    				self.realRoadsData.goodsConfigs[item.location_id-roadStartingNumber] = null;
        		    				$("#"+item.location_id).html("<div style='width: 20px;height: 30px;font-size: 12px;margin-top: -20%;position: relative;'>"+item.location_id+"</div>+");
        		    				$("#"+item.location_id+"_name_content").html("&nbsp");
        		    				$("#"+item.location_id+"_price_content").html("&nbsp");
        		    			});
        					}
        					if( n == data.length-1){
        						cloud.util.unmask("#automat_cargo_road_config");
        					}
        	            });	
        			}
    			});
    		}
		},
		
		clearData:function(){
			var self = this;
			if(self.realRoadsData){
				if(self.realRoadsData.goodsConfigs){
					self.realRoadsData.goodsConfigs=null;
				}
				if(self.realRoadsData.name){
					self.realRoadsData.name = null;
				}
			}
		},
		checkGoodsConfig:function(goodsConfigs){
			var goodsConfigsNull = 0; //默认货道配置中都为空
			if(goodsConfigs!=null&&goodsConfigs.length>0){
				for(var i=0;i<goodsConfigs.length;i++){
					if(goodsConfigs&&goodsConfigs[i]!=null){
						goodsConfigsNull = 1;
						if($("#have_config_span").length>0){   //此id存在
							$("#have_config_span").text(locale.get({lang:"have_config"}));
						}else{           //此id不存在
							$("#automat_goods_roads_edit").append("<span id='have_config_span'>"+locale.get({lang:"have_config"})+"</span>");
						}
					}
					if(i==goodsConfigs.length-1&&goodsConfigsNull==0){
						if($("#have_config_span").length>0){   //此id存在
							$("#have_config_span").text(locale.get({lang:"have_not_config"}));
						}else{           //此id不存在
							$("#automat_goods_roads_edit").append("<span id='have_config_span'>"+locale.get({lang:"have_not_config"})+"</span>");
						}
					}else if(goodsConfigsNull==1){
						break;
					}
				}
			}
		}
		
	});
	return config;
});