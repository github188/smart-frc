define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var winHtml = require("text!./seeReconciliation.html");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");

	var Service = require("../../../service");
	require("../config/css/common.css");
	var columns = [{
		"title":locale.get({lang:"device_shelf_number"}),//货柜
		"dataIndex" : "cid",
		"cls" : null,	
		"width" : "12%"
	},{
		"title":locale.get({lang:"shelf_location_id"}),//货道编号
		"dataIndex" : "locationId",
		"cls" : null,	
		"width" : "12%"
	}, {
		"title":locale.get({lang:"shelf_goods_name"}),//商品名称
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "20%"
	},/*{
		"title":locale.get({lang:"shelf_goods_price"}),//商品价格
		"dataIndex" : "price",
		"cls" : null,
		"width" : "10%"
	},*/{
		"title":locale.get({lang:"shlef_capacity"}),//容量
		"dataIndex" : "capacity",
		"cls" : null,
		"width" : "8%"
		//render:priceConvertor
	},{
		"title":locale.get({lang:"shelf_platformsalenum"}),//销量
		"dataIndex" : "platformSaleNum",
		"cls" : null,
		"width" : "8%"
		//render:priceConvertor
	},{
		"title":locale.get({lang:"shelf_stock"}),//库存
		"dataIndex" : "stock",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"shelf_status"}),//状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "12%",
		render:statusConvertor
	},{
		"title":locale.get({lang:"shelf_soldouttime"}),//售空时间
		"dataIndex" : "soldoutTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data != null && data != "" && data != "null"){
				
				return cloud.util.dateFormat(new Date(parseInt(data)), "yyyy-MM-dd hh:mm:ss");
			}else{
				return "";
			}
			
		}
	}];
	
	var deviceColumns = [{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "20%"
	}, {
		"title":locale.get({lang:"line_man_name"}),//线路
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"automat_replenishment_detail"}),//库存状态
		"dataIndex" : "stockRate",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"shelf_sold_status"}),//售空状态
		"dataIndex" : "soldoutCount",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			
			if(data != "0" && data != 0){
				return locale.get({lang:"shelf_status_1"})+"("+data+locale.get({lang:"shelf_num"})+")";
			}else{
				return locale.get({lang:"shelf_status_0"});
			}

		}
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function statusConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"shelf_status_1"});
					break;
				case "0":
					display = locale.get({lang:"shelf_status_0"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	function priceConvertor(value,type){
		return value/100;
	}
	function machineType(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "drink_machine"});
                    break;
                case 2:
                    display = locale.get({lang: "spring_machine"});
                    break;
                case 3:
                    display = locale.get({lang: "grid_machine"});
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	function recordType(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"report_of_the_vending_machine"});
					break;
				case "2":
					display = locale.get({lang:"manual_introduction"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.lineId = options.lineId;
			this.lineName = options.lineName;
			this.display = 30;
			this.pageDisplay = 30;
			
			this.recordId = null;
			this.elements = {

				table : {
					id : "device_list_table",
					"class" : null
				},
				paging : {
					id : "device_list_paging",
					"class" : null
				}
			};
			this._renderWindow();
			//locale.render({element:this.element});
			$("#device_list_paging").css("width",$("#device_list_table").width());
		},
		_renderWindow:function(){
			
			var self = this; 
			var title = self.lineName;
						
			this.window = new _Window({
				container: "body",
				title: title,
				top: "center",
				left: "center",
				height:520,
				width: 1000,
				mask: true,
				drag:true,
				content:winHtml,
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});
			this.window.show();	
			this._renderForm();
			this.renderTable();
			
			locale.render({element: this.element});
		},
		_renderForm:function(){		
			var self = this;
	        
	        //添加刷新图标
	        $("#ui-window-title").append("<span class='refresh'></span>");
		    $(".refresh").mouseover(function (){
				$('.refresh').css("opacity","1");
			}).mouseout(function (){
				$('.refresh').css("opacity","0.7");
			});
		    
		    $(".refresh").bind("click",function(){
		    	
		    	if(self.recordId != null){
		    		cloud.util.mask("#shelf_list_table");
		    		Service.getRecordDetailV3(self.recordId,function(data){
						 
		    			var tdata = [];
        		    	if(data.result.length>0){
        		    		for(var i=0;i<data.result.length;i++){
        		    			var cidData = data.result[i];
        		    			var cid = cidData.cid;
        		    			var type = cidData.machineType;
                                var shelves = cidData.replenishDetails;
        		    			
        		    			//在合适位置显示货柜编号
        						var len = shelves.length;
        						var index = 0;
        						if(len%2 == 0){
        							index = len/2;
        						}else if(len%2 == 1){
        							index = (len-1)/2;
        						}
        						shelves[index].cid = cid;
        		    			for(var m=0;m<len;m++){
        		    				if(m == len-1){
        		    					shelves[m].range = 1;
        		    				}
        		    				tdata.push(shelves[m]);
        		    			}
        		    			
        		    		}
        		    		
        		    	}
        		    	self.shelflistTable.render(tdata);
						 
						cloud.util.unmask("#shelf_list_table");
					 });
		    	}
		    	
		    	
		    });
		    
		},
		renderShelfTable:function(){
			
			var self = this;
			this.shelflistTable = new Table({
				selector : "#shelf_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "none",
				events : {
					 onRowClick: function(data) {
						 
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        
	                        if(data.range != null){
	                        	$(tr).find("td").eq(0).css("border-bottom","1px solid #ddd");
	                        }else{
	                        	$(tr).find("td").eq(0).css("border","1px solid white");
	                        }
	                        $(tr).find("td").eq(0).css("background","white");
	                        var c = $(tr).find("td").eq(6).text();
	                        if(c == locale.get({lang: "device_normal"})){
	                        	$(tr).find("td").eq(6).css("color","#458B00");
	                        }else if(c != locale.get({lang: "automat_unknown"})){
	                        	$(tr).find("td").eq(6).css("color","red");
	                        	$(tr).find("td").eq(5).css("color","red");
	                        }
	                    },
	                   scope: this
				}
			});
			
			var height = $("#shelf_list_table").height()+"px";
	        $("#shelf_list_table-table").freezeHeader({ 'height': height });
			this.loadData(30,0);
			
		},
		renderTable : function() {
			var self = this;
			this.listTable = new Table({
				selector : "#device_list_table",
				columns : deviceColumns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "none",
				events : {
					 onRowClick: function(data) {
						 cloud.util.mask("#shelf_list_table");
						 var recordId = data._id;
						 self.recordId = recordId;
						 Service.getRecordDetailV3(recordId,function(data){
							 var tdata = [];
		        		    	if(data.result.length>0){
		        		    		for(var i=0;i<data.result.length;i++){
		        		    			var cidData = data.result[i];
		        		    			var cid = cidData.cid;
		        		    			var type = cidData.machineType;
		        		    			var shelves = cidData.replenishDetails;
		        		    			
		        		    			//在合适位置显示货柜编号
		        						var len = shelves.length;
		        						var index = 0;
		        						if(len%2 == 0){
		        							index = len/2;
		        						}else if(len%2 == 1){
		        							index = (len-1)/2;
		        						}
		        						shelves[index].cid = cid;
		        		    			for(var m=0;m<len;m++){
		        		    				if(m == len-1){
		        		    					shelves[m].range = 1;
		        		    				}
		        		    				tdata.push(shelves[m]);
		        		    			}
		        		    			
		        		    		}
		        		    		//self.shelflistTable.render(tdata);
		        		    		
		        		    	}
		        		    	self.shelflistTable.render(tdata);
							    cloud.util.unmask("#shelf_list_table");
							 
						 });
						 
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        
	                        if(index == 0 ){
	                        	//$(tr).css("background-color","rgb(204, 238, 193)");
	                        	$(tr).addClass("cloud-table-shadow");
	                        }
	                        var c = $(tr).find("td").eq(4).text();
	                        if(c == locale.get({lang: "device_normal"})){
	                        	$(tr).find("td").eq(4).css("color","#458B00");
	                        }else if(c != locale.get({lang: "automat_unknown"})){
	                        	$(tr).find("td").eq(4).css("color","red");
	                        	//$(tr).find("td").eq(3).css("color","red");
	                        }
	                        
	                        if(data.stockRate != "" && data.valve == 1){
	                        	$(tr).find("td").eq(3).css("color","red");
	                        }
	                        
	                    },
	                   scope: this
				}
			});
			var height = $("#device_list_table").height()+"px";
	        $("#device_list_table-table").freezeHeader({ 'height': height });
			this.renderShelfTable();
			
		},
		loadData:function(limit,cursor){
			var self = this;
			cloud.util.mask("#device_list_table");
			self.searchData = {
					"lineId":self.lineId,
       				"type":"0"
			}
			Service.getAllDeviceReplenishmentV3(self.searchData,limit,cursor,function(data){
				 
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
     		     self.listTable.render(data.result);
     		     
     		     if(data.result && data.result.length > 0){
     		    	 self.recordId = data.result[0]._id;
        		     Service.getRecordDetailV3(self.recordId,function(shelfdata){
   					 
        		    	var tdata = [];
        		    	if(shelfdata.result.length>0){
        		    		for(var i=0;i<shelfdata.result.length;i++){
        		    			var cidData = shelfdata.result[i];
        		    			var cid = cidData.cid;
        		    			var type = cidData.machineType;
        		    			var shelves = cidData.replenishDetails;
        		    			
        		    			//在合适位置显示货柜编号
        						var len = shelves.length;
        						var index = 0;
        						if(len%2 == 0){
        							index = len/2;
        						}else if(len%2 == 1){
        							index = (len-1)/2;
        						}
        						shelves[index].cid = cid;
        		    			for(var m=0;m<len;m++){
        		    				if(m == len-1){
        		    					shelves[m].range = 1;
        		    				}
        		    				tdata.push(shelves[m]);
        		    			}
        		    			
        		    		}
        		    		
        		    		//self.shelflistTable.render(tdata);
        		    		
        		    	}
        		    	self.shelflistTable.render(tdata);
   					 
   					 
   				     });
     		     }
     		     
     		     
	        	 self._renderpage(data, 1);

	        	 cloud.util.unmask("#device_list_table");
			 }, self);
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
       			selector : $("#device_list_paging"),
       			data:data,
   				current:1,
   				total:data.total,
   				limit:this.pageDisplay,
       			requestData:function(options,callback){
       				cloud.util.mask("#device_list_table");
       				Service.getAllDeviceReplenishmentV3(self.searchData, options.limit,options.cursor,function(data){
         				   self.pageRecordTotal = data.total - data.cursor;
 						   callback(data);
 						 cloud.util.unmask("#device_list_table");
         				});
       			},
       			turn:function(data, nowPage){
       			    self.totalCount = data.result.length;
       			    self.listTable.clearTableData();
       			    self.listTable.render(data.result);
       				self.nowPage = parseInt(nowPage);
       			},
       			events : {
       			    "displayChanged" : function(display){
       			        self.display = parseInt(display);
       			    }
       			}
       		});
       		this.nowPage = start;
       	}
       }, 
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return updateWindow;
});