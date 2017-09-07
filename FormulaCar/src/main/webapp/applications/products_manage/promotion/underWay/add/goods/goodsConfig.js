define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var html = require("text!./goods.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../../../service");
	var priceWin=require("../setPrice");
	
	var columns = [ {
		"title":locale.get({lang:"product_name"}),
		"dataIndex" : "goods_name",
		"cls" : null,
		"width" : "60%"
	},{
		"title":locale.get({lang:"product_retail_price"}),
		"dataIndex" : "price",
		"cls" : null,
		"width" : "40%",
		 render:priceConvertor
	},{
		"title" : "",
		"dataIndex" : "goods_id",
		"cls" : "_id" + " " + "hide"
	} ];
	function priceConvertor(value,type){
		return value/100;
	}
	var columns_content=[
	{
	     "title": locale.get("automat_name_of_commodity"),
	     "dataIndex" : "name",
	     "width": "20%"
    },
	{
	     "title": locale.get("preferential_price"),
	     "dataIndex" : "preferential_price",
	     "width": "20%"						     
	},
	{
	     "title": locale.get("automat_wx_pay"),
	     "dataIndex" : "micropay_price",
	     "width": "20%"						     
	},
	{
	     "title": locale.get("automat_alipay"),
	     "dataIndex" : "alipay_price",
	     "width": "20%"						     
	},
	{
	     "title": locale.get("automat_baifubao"),
	     "dataIndex" : "baiduPay_price",
	     "width": "20%"						     
	}];
	var goodsConfig = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.activityId = options.activityId;
			this.activityWindow = options.activityWindow;
		    this.element.html(html);
			locale.render({element:this.element});
			this._render();
		},
		_render:function(){
			this.display = 30;
			this.pageDisplay = 30;
			$("#beforeStep_goods").val(locale.get({lang:"price_step"}));
			$("#finish_goods").val(locale.get({lang:"price_finished"}));
			this.renderGoodsTable();
			this.renderGoodsTable_content();
			this.renderBindEvent();
		},
		renderBindEvent:function(){
			var self = this;
			//点击 上一步
			$("#beforeStep_goods").bind("click",function(){
				$("#goodsConfig").css("display","none");
				$("#deviceConfig").css("display","block");
				$("#tab3").removeClass("active");
				$("#tab2").addClass("active");
			});
			//点击 完成
			$("#finish_goods").bind("click",function(){
				var goods_content=self.goodstable_content.getAllData();
				if(goods_content.length>0){
					for(var i=0;i<goods_content.length;i++){
						if(goods_content[i].alipay_price!=null||goods_content[i].baiduPay_price!=null||goods_content[i].micropay_price!=null||goods_content[i].preferential_price!=null){
						}else{
							 dialog.render({lang:"at_least_one_price"});
							 return;
						}
					}
					self.activityWindow.destroy();
					self.fire("rendTableData");
                    //创建一条任务
					Service.addActivityTask(self.activityId,function(data){
					});
					
				}else{
					dialog.render({lang:"goods_in_the_activities"});
				}
				
			});
			$("#addGoods").bind("click",function(){
				var selectedResouces = self.getSelectedResources_left();
				if(selectedResouces.length == 0){
            		dialog.render({lang:"please_select_at_least_one_config_item"});
            		return;
            	}
				Service.getActivite(self.activityId,function(data){
					var obj=[];
					var ooo;
					var check_same=false;
					
					if(data.result.goodsInfo.length ==0){
						for(var i=0;i<selectedResouces.length;i++){
							ooo={
									'goodsIds':selectedResouces[i].goods_id,
								    'name':selectedResouces[i].goods_name
								};
							obj.push(ooo);
					   }
					}else{
						obj=data.result.goodsInfo;
						for(var i=0;i<selectedResouces.length;i++){
							for(var j=0;j<obj.length;j++){
								if(obj[j].goodsIds==selectedResouces[i].goods_id){
									check_same=true;
								}
							}
							if(check_same!=true){
							  ooo={
									'goodsIds':selectedResouces[i].goods_id,
								    'name':selectedResouces[i].goods_name
								};
							  obj.push(ooo);
							}
							check_same=false;
							}
						}
					var activityData={
							endTime:data.result.endTime,
					        goodsInfo:obj
					};
					Service.updateActivityInfo(self.activityId,activityData,function(data) {
					   if(data){
						    Service.getActivite(self.activityId,function(data){
							   self.goodstable_content.render(data.result.goodsInfo);
							});
						}
					});
				});
			});
            $("#removeGoods").bind("click",function(){
            	var selectedResouces = self.getSelectedResources_content();
            	if(selectedResouces.length == 0){
            		dialog.render({lang:"please_select_at_least_one_config_item"});
            		return;
            	}
            	var obj=[];
				var ooo;
				Service.getActivite(self.activityId,function(data){
					obj=data.result.goodsInfo;
					for(var i=0;i<selectedResouces.length;i++){
						for(var j=0;j<obj.length;j++){
							if(obj[j].goodsIds==selectedResouces[i].goodsIds){
								obj.splice(j,1);
							}
						}
					}
					data.result.goodsInfo=obj;
					Service.updateActivityInfo(self.activityId,data.result,function(data) {
					    if(data){
						    Service.getActivite(self.activityId,function(data){
							    self.goodstable_content.render(data.result.goodsInfo);
							});
						}
					});
				});
			});
		},
		getSelectedResources_content:function(){
	        var self = this;
	        var selectedRes = $A();
	        self.goodstable_content && self.goodstable_content.getSelectedRows().each(function(row){
	        	selectedRes.push(self.goodstable_content.getData(row));
	        });
	        return selectedRes;
	    },
		getSelectedResources_left:function(){
	        var self = this;
	        var selectedRes = $A();
	        self.goodstable && self.goodstable.getSelectedRows().each(function(row){
	        	selectedRes.push(self.goodstable.getData(row));
	        });
	        return selectedRes;
	    },
		renderGoodsTable:function(){
			this.goodstable = new Table({
				selector:"#con2_left",
				limit:100,
				checkbox:"full",
				count:false,
				mask:true,
				page:false,
				columns:columns
			});
			this.getData();
		},
		renderGoodsTable_content:function(){
			this.goodstable_content = new Table({
				selector:"#con2_content",
				limit:100,
				checkbox:"full",
				count:false,
				mask:true,
				page:false,
				columns:columns_content,
				events : {
					 onRowClick: function(data) {
						     var self = this;
	                    	 if(this.setPircewin){
	                    		this.setPircewin.destroy();
	                    	 }
	                    	 this.setPircewin= new priceWin({
	                    		selector:"body",
	                    		datas:data,
	                    		activityId:self.activityId,
	                    		events : {
	                      				"getGoodsList":function(){
	                      					Service.getActivite(self.activityId,function(data){
	                      						self.goodstable_content.render(data.result.goodsInfo);
	                      					});
	                      				}
	                      		}
	                    	});  
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
		},
		getData:function(){
			var self = this;
			var deviceIds = [];
			cloud.util.mask("#con2_left");
			Service.getActivite(self.activityId,function(data){
				 if(data && data.result.automatInfo && data.result.automatInfo.length>0){
			        for(var i=0;i<data.result.automatInfo.length;i++){
			        	
			        	deviceIds.push(data.result.automatInfo[i].deviceId);
			        }
			        var ids = "";
				    for(var j = 0;j<deviceIds.length;j++){
						if(j == deviceIds.length-1){
						      ids = ids+deviceIds[j];
						}else{
							  ids = ids+deviceIds[j]+",";
						}
					}
					Service.getActiviteGoodsByDeviceIds(ids,function(data){
						self.goodstable.render(data.goodsIds);
						cloud.util.unmask("#con2_left");
				    });
				 }
			});
		}
	});
	return goodsConfig;
});