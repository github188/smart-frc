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
		},
		render:function(){
		},
		setconfig:function(assetId){
			$("#goodsconf0").text(assetId);
		},
		getTab:function(saveGoodsConfig){
			var self=this;
			this.goodsConfig = new goodsConfigInfo({
      			selector:"#goodsConfigContent",
      			automatWindow:self.automatWindow,
      			events : {
      				
      			}
      	    });
			this.saveGoodsConfig = saveGoodsConfig;
			self.bindGoodsClick();
			self.goodsConfig.showAndInitRoads(saveGoodsConfig);
		},
		bindGoodsClick:function(){
			var self =this;
			$("#goodsConfig").bind("click", function(){
				$("#goodsConfigContent").empty();
				if($("#goodsConfigContent").length>0){
				}else{
					$("#component-3").append(
					     "<div id='goodsConfigContent' style='height:800px;position: relative;'>"+
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
				self.goodsConfig.showAndInitRoads(self.saveGoodsConfig);
			});
		},
		getOtherTab:function(containerGoodsConfig){
			var self = this;
			if(containerGoodsConfig && containerGoodsConfig.length > 0){
				for(var i =0;i<containerGoodsConfig.length;i++){
					var cid = containerGoodsConfig[i].cid;//货柜编号
					var shelves = containerGoodsConfig[i].shelves;//货柜货道配置
					self.shelves = shelves;
					var j=i+1;
					$("#devicegoodsall").append(
						 "<li  id='"+cid+"' data-index='"+j+"' class='tab_nav  js_top' data-id='media2'>"+
							    "<a id='tab_"+j+"'>"+cid+"</a>"+
						 "</li>"
				    );
					$("#"+cid).bind("click", function(){
						$(".tab_navs li").removeClass("selected");
						$("#"+cid).addClass("selected");
						if(this.containerConfig){
							this.containerConfig.destroy();
						}
						$("#goodsConfigContent").empty();
						if($("#goodsConfigContent").length>0){
						}else{
							$("#component-3").append(
							     "<div id='goodsConfigContent' style='height:800px;position: relative;'>"+
								 "</div>"
							);
						}
						this.containerConfig = new containerConfigInfo({
			      			selector:"#goodsConfigContent",
			      			automatWindow:self.automatWindow,
			      			events : {
			      				
			      			}
			      	    });
						this.containerConfig.showAndInitRoads(self.shelves);
					});
				}
			}
		}
	});
	return config;
});