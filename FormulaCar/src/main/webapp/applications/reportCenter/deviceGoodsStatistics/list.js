define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var winHtml = require("text!./list.html");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");

	var Service = require("../service");
	//require("../config/css/common.css");
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
		"width" : "8%",
		render:function(data, type, row){
			
			if(row.status == "1"){
				return "0";
			}else{
				return data;
			}
			
		}
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
	
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			
			 this.element.html(winHtml);
		        this.display = 30;
				this.pageDisplay = 30;
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
			    this._render();
			
		},
		_render:function(){
			this.renderTable();
			$("#device_list_paging").css("width",$("#device_list_table").width());
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
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
			
			var height = $("#device_list_table").height()+"px";
	        $("#device_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			var self = this;
			cloud.util.mask("#device_list_table");
	        self.searchData={
	        };
	        Service.getDeviceList(self.searchData, limit,cursor,function(data){
	        	 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
				 cloud.util.unmask("#device_list_table");
		    });
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
       				Service.getDeviceList(self.searchData, options.limit,options.cursor,function(data){
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