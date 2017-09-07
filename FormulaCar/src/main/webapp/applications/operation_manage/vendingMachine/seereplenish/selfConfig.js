define(function(require){
	var winHtml = require("text!./selfConfig.html");
	var cloud = require("cloud/base/cloud");
    var Button = require("cloud/components/button");
	var validator = require("cloud/components/validator");
	require("../css/detail.css");
	var statusMg = require("../../../template/menu");
	var goodsConfigInfo  = require("./goodsConfig");
	var containerConfigInfo = require("./containerConfig");
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.configData = null;  //上一页和详情传过来的数据包
			this.render();
	        this.automatWindow = options.automatWindow;
	        this.saveGoodsConfig = null;
	        this.shelves = null;
	        this.shelvesState = null;
	        this.shelvesState_main = [];
	        this.shelvesState_container = [];
		},
		render:function(){
			
		},
		setconfig:function(assetId,masterType){
			$("#devicegoodsall").html("");
			$("#devicegoodsall").append("<li id='goodsConfig' data-index='0' class='tab_nav first js_top selected' data-id='media10'><a id='tab_0'></a></li>");
			$("#tab_0").text(assetId+"("+masterType+")");
		},
		getTab:function(saveGoodsConfig,shelvesState){
			var self=this;
			
			this.goodsConfig = new goodsConfigInfo({
      			selector:"#goodsConfigContent",
      			automatWindow:self.automatWindow,
      			events : {
      				
      			}
      	    });
			this.saveGoodsConfig = saveGoodsConfig;
			this.shelvesState = shelvesState;
			var asset = $("#tab_0").text();
			var assetId = asset.split("(")[0];
			
			if(shelvesState && shelvesState.length>0){
				for(var i=0;i<shelvesState.length;i++){
					if(shelvesState[i].cid == assetId){//主柜
						var config={
								shelvesId:shelvesState[i].shelvesId,
								state:shelvesState[i].state
						};
						this.shelvesState_main.push(config);
					}
				}
			}
			self.bindGoodsClick();
			self.goodsConfig.showAndInitRoads(saveGoodsConfig,this.shelvesState_main);
		},
		bindGoodsClick:function(){
			var self =this;
			$("#goodsConfig").bind("click", function(){
				
				$("#goodsConfigContent").remove();
				if($("#component-deviceconfig-3 div").length == 0){
					$("#component-deviceconfig-3").append(
						     "<div id='goodsConfigContent' style='height:400px;position: relative;'>"+
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
	      			automatWindow:self.automatWindow,
	      			events : {
	      				
	      			}
	      	    });
				self.goodsConfig.showAndInitRoads(self.saveGoodsConfig,self.shelvesState_main);
			});
		},
		getOtherTab:function(containerGoodsConfig,shelvesState){
			var self = this;
			if(containerGoodsConfig && containerGoodsConfig.length > 0){
				for(var i =0;i<containerGoodsConfig.length;i++){
					var cid = containerGoodsConfig[i].cid;//货柜编号
					var type = containerGoodsConfig[i].type;//货柜类型
					if(type==1){
						type = locale.get({lang: "drink_machine"});
                    }else if(type==2){
                    	type = locale.get({lang: "spring_machine"});
                    }else if(type==3){
                    	type = locale.get({lang: "grid_machine"});
                    }
					var shelves = containerGoodsConfig[i].shelves;//货柜货道配置
					self.shelves = shelves;
					
					var j=i+1;
					$("#devicegoodsall").append(
						 "<li  id='cid_"+cid+"' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
							    "<a id='tab_"+j+"'>"+cid+"("+type+")</a>"+
						 "</li>"
				    );
					$("#cid_"+cid).bind("click",{cid:cid,shelves:self.shelves}, function(e){
						$(".tab_navs li").removeClass("selected");
						$("#cid_"+e.data.cid).addClass("selected");
						
						$("#goodsConfigContent").remove();
						if($("#component-deviceconfig-3 div").length == 0){
							$("#component-deviceconfig-3").append(
								     "<div id='goodsConfigContent' style='height:400px;position: relative;'>"+
									 "</div>"
							);
						}
						
						if(this.containerConfig){
							this.containerConfig.destroy();
						}
						this.containerConfig = new containerConfigInfo({
			      			selector:"#goodsConfigContent",
			      			automatWindow:self.automatWindow,
			      			events : {
			      				
			      			}
			      	    });
	
						self.shelvesState = shelvesState;
						var assetId = e.data.cid;
						
						if(shelvesState && shelvesState.length>0){
							for(var i=0;i<shelvesState.length;i++){
								if(shelvesState[i].cid == assetId){//辅柜
									var config={
											shelvesId:shelvesState[i].shelvesId,
											state:shelvesState[i].state
									};
									self.shelvesState_container.push(config);
								}
							}
						}
						
						
						
						this.containerConfig.showAndInitRoads(e.data.shelves,self.shelvesState_container);
					});
				}
			}
		}
	});
	return config;
});