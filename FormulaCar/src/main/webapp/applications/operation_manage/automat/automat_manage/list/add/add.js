/**
 * @author zhangcy
 * 
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var infoHtml = require("text!./add.html");
	var validator = require("cloud/components/validator");
	var Window = require('cloud/components/window');
	//var maps = require("cloud/components/map");
	require("cloud/components/Lmap");
	//require("../css/table.css");
	//require("../css/style.css");
	var InfoModel = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(infoHtml);
			locale.render({element:this.element});
			this.winHeight = 524;
	        this.winWidth = 982;
	        this.service = options.service;
	        this.goodsWinWidth = 458;
	        this.goodsWinHeight = 378;
			this.infoId = options.id;
			this.hasSaveConfig = 0;//尚未保存货道信息
			this.modelChange = 1;
			this.saveGoodsConfig = null;
			this.flag = 1;
            this._render();
		},
		_render:function(){
			$("#automat-info-edit-sub").hide();
			this._renderModelSelect();
			this._renderSiteSelect();
			this._renderBtn();
			this._renderCss();
			this._renderEventListener();
		},
		/**
		 * init all button
		 */
		_renderBtn:function(){
			$(".info-buttonset-bottom").show();
			var self = this;
			//取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.fire("hide");
		    });
			 $("#automat-info-add").bind("click",function(){
				 	cloud.util.mask("#info-table");
					var automat_name = $("#automat_name_add").val();
    				var assetId = $("#automat_no_add").val();
    				var siteId = $("#module_info_automat_site_add option:selected").val()=="none"?"":$("#module_info_automat_site_add option:selected").val();
    				var siteName = $("#module_info_automat_site_add option:selected").text();
    				
    				var cargoRoadId = $("#automat_goods_roads option:selected").val();
    				var cargoRoadName = $("#automat_goods_roads option:selected").text();
    				var modelId = $("#automat_model option:selected").val();
    				var modelName = $("#automat_model option:selected").text();
    				if(modelId == null||modelId == ""){
    					cloud.util.unmask("#info-table");
    					dialog.render({lang:"pleas_add_least_one_model_record"});
						return;
    				}
    				
    				var userDefine = -1;
    				if(automat_name == null||automat_name == ""){
    					cloud.util.unmask("#info-table");
    					dialog.render({lang:"automat_name_not_exists"});
						return;
    				}
    				if(assetId == null||assetId == ""){
    					cloud.util.unmask("#info-table");
    					dialog.render({lang:"automat_no_not_exists"});
						return;
    				}
    				if(assetId.indexOf(";") != -1||assetId.indexOf("；") != -1){
    					cloud.util.unmask("#info-table");
    					dialog.render({lang:"automat_asset_id_cannot_"});
						return;
    				}
    				if(siteId == null||siteId == ""){
    					cloud.util.unmask("#info-table");
    					dialog.render({lang:"site_is_not_null"});
						return;
    				}
    				
    				var area = $("#module_info_automat_site_add option:selected")[0].attributes[1].value;
					var goodsConfigs = null;
					if(self.saveGoodsConfig==null){
						goodsConfigs = null;
						var roadNumber = modelId.split("_")[1];
						goodsConfigs = new Array();
						for(var i=0;i<roadNumber;i++){
							goodsConfigs[i] = null;
						}
					}else{
						goodsConfigs = self.saveGoodsConfig;
						var roadNumber = modelId.split("_")[1];
						var count = goodsConfigs.length;
						if(count<roadNumber){
							for(var i=count;i<roadNumber;i++){
								goodsConfigs[i] = null;
							}
						}
					}
					modelId = modelId.split("_")[0];
	        		self.service.addAutomat(area,automat_name,modelId,modelName,siteId,siteName,assetId,goodsConfigs,function(data){
						if(data.error_code==null){
							dialog.render({lang:"save_success"});
							$("#automat_goods_roads").append("<option value='"+data.result._id+"'>"+data.result.name+"</option>");
							$("#automat_goods_roads").val(data.result._id);
							self.hasSaveConfig = 1;//保存了货道信息
							$("#automat_name").val(data.result.name==null?"":data.result.name);
            				$("#automat_model").val(data.result.modelName==null?"":data.result.modelName);
            				$("#module_info_automat_site").val(data.result.siteId==null?"":data.result.siteId);
            				self.infoId = data.result._id;
            				self.fire("refreshTable",data.result._id);
						}else if(data.error_code == "21322"){
							dialog.render({lang:"automat_name_exists"});
							return;2
						}else if(data.error_code == "70002"){
							dialog.render({lang:"automat_goods_model_assertid_exists"});
							return;
						}
						cloud.util.unmask("#info-table");
            		},self);
    				
			 });
			
			this.submitButton = new Button({
                container: this.element.find(".info-buttonset-bottom"),
                id: "module-info-tag-submit",
                text: "提交",
                lang:"{title:submit,text:submit}",
                events: {
                    click: function(){
                    }
                }
            });

            this.cancelButton = new Button({
                container: this.element.find(".info-buttonset-bottom"),
                id: "module-info-tag-cancel",
                text: "取消",
                lang:"{title:cancel,text:cancel}",
                events: {
                	click: self.fire("addCancel")
                }
            });
			this.configEditBtn = new Button({
				container:"#automat_goods_roads_edit",
				id:"automat_goods_roads_edit_",
				imgCls:"cloud-icon-watch module-info-imghelper",
				events:{
					click : function(){
						var modelId = $("#automat_model option:selected").val();
						if(!modelId||modelId == null||modelId == ""){
							dialog.render({lang:"pleast_select_model_at_least_one"});
							return;
						}else{
							self.showGoodsConfigWindow();
						}
					}
				}
			});
			
			//添加时的自动定位复选框
			this.autoPositionAddView=new Button({
            	container:self.element.find("#info-automat-automatic-positioning-add"),
            	id:"info-autoamt-automatic-positioning-autoamt-add",
            	checkbox:true,
            	text:locale.get("automatic_positioning"),
            	lang:"{title:automatic_positioning,text:automatic_positioning}"
            });
		},
		//打开货道配置的页面
		showGoodsConfigWindow:function(){
			var self = this;
			if(this.roadWindow){
				this.roadWindow.destroy();
			}
			if(this.saveAsWindow){
				this.saveAsWindow.destroy();
				this.saveAsWindow = null;
			}
			$(".ui-window-content").html("");
			this.roadWindow = null;
            this.roadWindow =  new Window({
                container : "body",
                title : locale.get("automat_cargo_road_config"),
                top: "center",
                left: "center",
                height: self.winHeight,
                width: self.winWidth,
                mask: true,
                onblur:true,
                events : {
                	"onClose":function(){
    		    		$("#goods-road-config-userdefine .cloud-button-checkbox-icon").addClass("cloud-icon-active");
    		    		$("#goods-road-config-userdefine .cloud-button-checkbox-icon").removeClass("cloud-icon-default");
    		    		$("#automat_cargo_road_config").html("");
    		    		
                		self.roadWindow = null;
                		//self.clearData();
                	},
                	"beforeClose":function(){
        		    	if($("#goods-road-config-userdefine .cloud-button-checkbox-icon").hasClass("cloud-icon-default")){
        		    		$("#goods-road-config-userdefine .cloud-button-checkbox-icon").addClass("cloud-icon-default");
        		    	}
        		    	if($("#goods-road-config-userdefine .cloud-button-checkbox-icon").hasClass("cloud-icon-active")){
        		    		$("#goods-road-config-userdefine .cloud-button-checkbox-icon").addClass("cloud-icon-active");
        		    	}
                	},
                    scope : this
                }
            });
            this.roadWindow.show();
            this.setRoadContent();
            
		},
		//根据货道模板填充货道
		initRoadImageByGM:function(goodsModelId){
			var self = this;
			if(goodsModelId!=null&&goodsModelId!="none"){
				self.service.getGoodsModelById(goodsModelId,function(data){
					if(self.saveGoodsConfig!=null){
						/*self.realRoadsData.name = data.result.name;
		        		self.realRoadsData.modelId = data.result.modelId;
		        		self.realRoadsData.modelName = data.result.modelName;*/
		        		if(self.saveGoodsConfig == null){
		        			self.realRoadsData.goodsConfigs = null;
		        		}else{
		        			self.realRoadsData.goodsConfigs = self.saveGoodsConfig.concat();
		        		}
		        		
					}else{
						/*self.realRoadsData = new Object();
						self.realRoadsData.name = data.result.name;
		        		self.realRoadsData.modelId = data.result.modelId;
		        		self.realRoadsData.modelName = data.result.modelName;*/
						if(!self.realRoadsData||self.realRoadsData==null){
							self.realRoadsData = new Object();
						}
		        		self.realRoadsData.goodsConfigs = data.result.goodsConfigs;
					}
	        		self.initRoadWindowImage(self.realRoadsData.goodsConfigs);
	        	},self);
			}
		},
		//根据货道配置填充货道
		initRoadWindowImage:function(data){
			var self = this;
			if(data==null||data.length==0){
				cloud.util.unmask("#automat_cargo_road_config");
			}else{
				$.each(data,function(n,item) {
					if(item!=null){
						var imagepath = item.img;
						var imageMd5 = item.imagemd5;
						
	        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	        			$("#"+item.location_id).html("<img src='"+src+"' style='height:60px;'/>");
	        			
	        			$("#"+item.location_id).html("<input type='hidden' id='imagemd5'/>");
	        		    $("#imagemd5").val(imageMd5);
	        		    
	        			$("#"+item.location_id+"_name_content").html(item.goods_name);
		    			$("#"+item.location_id+"_price_content").html(item.price+locale.get({lang:"china_yuan"})+"        <a id='remove_road_"+item.location_id+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			$("#remove_road_"+item.location_id).click(function(){
		    				self.realRoadsData.goodsConfigs[item.location_id] = null;
		    				$("#"+item.location_id).html("+");
		    				$("#"+item.location_id+"_name_content").html("&nbsp");
		    				$("#"+item.location_id+"_price_content").html("&nbsp");
		    			});
					}
					if( n == data.length-1){
						cloud.util.unmask("#automat_cargo_road_config");
					}
	            });	
			}
		},
		//初始化货道信息页面
		setRoadContent:function(){
			var self = this;
			var html = "<div id='automat_cargo_road_config'>"+
							"<div style='float:left;width:100%;height:40px;margin-top:20px'>"+
					   			"<label style='margin:20px;'>"+locale.get({lang:"automat_cargoroad_model"})+"</label>"+
					   			"<select id='automat_goods_roads' style='width: 210px;'>"+
					   			"</select>&nbsp;&nbsp;&nbsp;"+
					   		"</div>"+
					    	"<div id='cargo_road_info' style='min-height:265px;height:auto;width:100%;'>"+
				   		    "</div>"+
				   		    "<div style='height:40px;'>"+
							   "<div style='text-align: right;width: 100%;margin-top: 10px;border-top: 1px solid #f2f2f2;'>"+
							     "<a id='model_submit' class='btn btn-primary submit' style='margin-top: 8px;'>"+locale.get({lang:"save"})+"</a><a id='model_submit_cancel' style='margin-left: 10px;margin-top: 8px;' class='btn btn-primary submit'>"+locale.get({lang:"cancel"})+"</a>"+
							   "</div>"+
							"</div>"+
						"</div>";
			this.editContentContainer =$(html)
            .height(this.winHeight-50).width(this.winWidth-20);
	        this.roadWindow.setContents(this.editContentContainer);
	        cloud.util.mask("#cargo_road_info");
	        $("#save_as_model_name").hide();
			$("#automat_goods_roads").html("");
			self.showRoads();
			var modelInfo  = $("#automat_model option:selected").val();
			var modelId = modelInfo.split("_")[0];
			this.service.getAllGoodsModelInfo(modelId,function(data){
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
				self.showAndInitRoads();
			},self);
			
			
	        $("#model_submit").click(function(){
	        	if(!self.saveAsWindow){
	        		self.saveAsWindow =  new Window({
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
						self.service.addGoodsModel(name,modelId,modelName,goodsConfigs,function(data){
							//cloud.util.unmask(".ui-window-body:first");
							if(data.error_code!=null&&data.error_code=="21322"){
								cloud.util.unmask(".ui-window-body:last");
								dialog.render({lang:"automat_goods_model_name_exists"});
								return;
							}else{
								cloud.util.unmask(".ui-window-body:last");
								self.roadWindow.destroy();
								
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
								cloud.util.mask("#info-table");
								$("#automat_goods_roads").append("<option value='"+data.result._id+"'>"+data.result.name+"</option>");
								$("#automat_goods_roads option[value='"+data.result._id+"'] ").attr("selected",true);
								self.fire("roadConfig",self.saveGoodsConfig);
								self.checkGoodsConfig(data.result.goodsConfigs);
								self.saveAsWindow.destroy();
								self.saveAsWindow = null;
							}
							cloud.util.unmask("#info-table");
						});
					}
				});
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
						self.fire("roadConfig",self.saveGoodsConfig);
						self.checkGoodsConfig(goodsConfigs);
					}
					self.saveAsWindow.destroy();
					self.saveAsWindow = null;
					self.roadWindow.destroy();
				});
				
	        	$("#goods-road-config-userdefine .cloud-button-checkbox-icon").addClass("cloud-icon-active");
	    		$("#goods-road-config-userdefine .cloud-button-checkbox-icon").removeClass("cloud-icon-default");
	        });
	        $("#model_submit_cancel").click(function(){
	        	self.clearData();
	        	self.saveGoodsConfig = null;
	        	$("#have_config_span").text(locale.get({lang:"have_not_config"}));
	        	self.roadWindow.destroy();
            });
		},
		
		
		showAndInitRoads:function(){
			var self = this;
			self.showRoads();
			if(self.saveGoodsConfig&&self.saveGoodsConfig!=null){
				self.initRoadWindowImage(self.saveGoodsConfig);
			}
			cloud.util.unmask("#automat_cargo_road_config");
		},
		showRoads:function(){
			var self = this;
			cloud.util.mask("#automat_cargo_road_config");
			var roadInfoHtml = "<table id='road_table' style='width:100%;'>";
    		var roadNumber = $("#automat_model option:selected").val()==undefined?self.select.split("_")[1]:$("#automat_model option:selected").val().split("_")[1];
    		var row = 0;
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
    		}
    		$("#cargo_road_info").html(roadInfoHtml);
    		$("#road_table").css({"height":"auto"});
    		$(".road_td_image").click(function(){
        		self.showGoodsInfoWindow(this.id);
        	});
		},
		showGoodsInfoWindow:function(roadId){
			var self = this;
			if(this.goodsWindow){
				this.goodsWindow.destroy();
			}
            this.goodsWindow =  new Window({
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
			self.service.getGoodslist(name,0,1000,function(data){
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
	    				"goods_id":goodsId,
	    				"goods_name":name,
	    				"goods_type":type,
	    				"goods_typeName":typeName,
	    				"price":price,
	    				"img":imagepath,
	    				"payment_url":payment_url,
	    				"imagemd5":image_md5
	    			};
	    			self.realRoadsData.goodsConfigs[roadId] = goodsConfig;
	    			self.goodsWindow.hiden();
	    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    			$("#"+roadId).html("<img src='"+src+"' style='height:60px;'/>");
	    			$("#"+roadId+"_name_content").html(name);
	    			$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	    			$("#remove_road_"+roadId).click(function(){
	    				self.realRoadsData.goodsConfigs[roadId] = null;
	    				$("#"+roadId).html("+");
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
    				"goods_id":goodsId,
    				"goods_name":name,
    				"goods_type":type,
    				"goods_typeName":typeName,
    				"price":price,
    				"img":imagepath,
    				"payment_url":payment_url,
    				"imagemd5":image_md5
    			};
    			self.realRoadsData.goodsConfigs[roadId] = goodsConfig;
    			self.goodsWindow.hiden();
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			$("#"+roadId).html("<img src='"+src+"' style='height:60px;'/>");
    			$("#"+roadId+"_name_content").html(name);
    			$("#"+roadId+"_price_content").html(price+locale.get("china_yuan")+"         <a id=remove_road_"+roadId+" class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
    			$("#remove_road_"+roadId).click(function(){
    				self.realRoadsData.goodsConfigs[roadId] = null;
    				$("#"+roadId).html("+");
	    			$("#"+roadId+"_name_content").html("&nbsp");
	    			$("#"+roadId+"_price_content").html("&nbsp");
    			});
        	});
		},
		_renderEventListener:function(){
			var self = this;
	    	$("#goods-road-config-userdefine .cloud-button-text").click(function(){
		    	$("#goods-road-config-userdefine .cloud-button-checkbox-icon").removeClass("cloud-icon-default");
		    	$("#goods-road-config-userdefine .cloud-button-checkbox-icon").addClass("cloud-icon-active");
		    	self.showGoodsConfigWindow();
		    });
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
		_renderCss:function(){
			$(".info-header").css({
				"height":"32px",
				"margin-top":"20px",
				"margin-bottom":"20px"/*,
				"min-height":"26px"*/
			});
			$(".info-online-status").css({
				"float":"left"
			});
			$(".info-header-btn").css({
				"float":"left",
				"width":"72px",
				"height":"17px",
				"margin-top":"3px"
			});
			$(".info-header .info-device-favor").css({
				"margin-left":"0px"
			});
			$(".info-buttonset-bottom").css({
				"margin":"6px 0 -5px 0",
				"height":"32px",
				"width":"100%",
				"overflow":"hidden"
			});
			$("automat-info-body>div").css({
        		"margin":"10px 5px 10px 15px"
        	});
        	$("ul.automat-info-form-ul li").css({
        		"overflow":"hidden",
        		"margin":"10px 0 0 20px"
        	});
        	$("ul.automat-info-form-ul li p,ul.user-info-form-ul li select").css({
        		"float":"left",
        		"display":"inline"
        	});
        	$(".automat-info-body .label").css({
        		"line-height":"22px"
        	});
        	$(".automat-info-map-panel .user-info-map-label").css({
        		"margin-bottom":"10px"
        	});
        	$(".automat-info-map-panel #user-info-map").css({
        		"height":"120px",
        		"width":"190px",
        		"border":"1px solid #A6A29A"
        	});
        	$(".module-info-automat-buttonset").css({
        		'text-align':"center"
        	});
        	$(".module-info-automat-label").css({
        		"float":"left",
        		"margin":"4px 4px"
        	});
        	$(".automat-info-title-input").css({
        		"float":"left"
        	});
        	$(".automat-info-title-button").css({
        		"display":"block",
        		"float":"left"
        	});
        	$(".automat-info-input-title").css({
        		"width":"60px",
        		"height":"24px",
        		"line-height":"24px"
        	});
		},
		_renderModelSelect:function(){
			var self = this;
			cloud.util.mask("#info-table");
			self.service.getModelInfo(0,500,function(data){
				if(data.result&&data.result.length>0){
	        		$.each(data.result,function(n,item) {
	        			if(n==0){
	        				self.select = item._id + "_"+item.roadNumber;
	        			}
        				$("#automat_model").append("<option value='" + item._id + "_"+item.roadNumber+"'>" + item.name + "</option>");
	                });
	        		$("#automat_model").change(function(){
	        			if(self.realRoadsData&&self.realRoadsData.goodsConfigs){
	        				self.realRoadsData.goodsConfigs = null;
	        			}
	        			self.modelChange = 2;
	            		self.showRoads();
	            	});
	        		self.showRoads();
	        	}else{
	        		$("#model_submit").hide();
	        		dialog.render({lang:"pleas_add_least_one_model_record"});
	        		return;
	        	}
				cloud.util.unmask("#info-table");
	        }, self);
		},
		_renderSiteSelect:function(){
			var self = this;
			$("#module_info_automat_site_add").append("<option value='none'>" + locale.get({"lang":"please_select"}) + "</option>");
			this.service.getAllSite(null,function(data){
				$.each(data.result,function(n,item) {   
	  				$("#module_info_automat_site_add").append("<option value='" + item._id + "'  name='" + item.area + "'>" + item.name + "</option>");
	  		    }); 
			},self)
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
	return InfoModel;
    
});