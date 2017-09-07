define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./tradelist.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../service");
	var columns = [
	{
		"title":locale.get({lang:"trade_product_name"}),
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "33%"
	},{
		"title":locale.get({lang:"sales"}),
		"dataIndex" : "salesPrice",
		"cls" : null,
		"width" : "33%",
		render:priceConvertor
	}, {
		"title":locale.get({lang:"sales_volume"}),
		"dataIndex" : "salesVolume",
		"cls" : null,
		"width" : "33%"
	}, /*{
		"title":locale.get({lang:"the_remaining_number"}),
		"dataIndex" : "remaining_number",
		"cls" : null,
		"width" : "25%"
	},*/{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	
	function priceConvertor(value,type){
		return value/100;
	}
	
	function deliverConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case -1:
					display = locale.get({lang:"deliver_status_11"});
					break;
				case 0:
					display = locale.get({lang:"deliver_status_0"});
					break;
				case 1:
					display = locale.get({lang:"deliver_status_1"});
					break;
				case 2:
					display = locale.get({lang:"deliver_status_2"});
					break;
			
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	
	function dateConvertor(value, type) {
		if(type === "display"){
			return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
		}else{
			return value;
		}
	}
	function payStatusConvertor(value, type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case 0:
					display = locale.get({lang:"trade_pay_status_0"});
					break;
				case 1:
					display = locale.get({lang:"trade_pay_status_1"});
					break;
				case 2:
					display = locale.get({lang:"trade_pay_status_2"});
					break;
			
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
		
	}
	function typeConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case 1:
					display = locale.get({lang:"trade_baifubao"});
					break;
				case 2:
					display = locale.get({lang:"trade_wx_pay"});
					break;
				case 3:
					display = locale.get({lang:"trade_alipay"});
					break;
				case 4:
					display = locale.get({lang:"trade_cash_payment"});
					break;
				case 5:
					display = locale.get({lang:"trade_pos_mach"});/* POS机 */
					break;
				case 6:
					display = locale.get({lang:"trade_scanner_card"});/* 扫胸牌 */
					break;
				case 7:
					display = locale.get({lang:"trade_claim_number"});/* 取货码 */
					break;
				case 8:
					display = locale.get({lang:"trade_game"});/* 游戏 */
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.siteId = options.siteId;
			this.elements = {
				table : {
					id : "tradeDetail_list_table",
					"class" : null
				},
				paging : {
					id : "tradeDetail_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			var startTime='';
			var endTime='';
			
			this._renderHtml();
			this._renderTable();
			this.setDataTable(startTime,endTime);
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			var self = this;
			this.listTable = new Table({
				selector : "#tradeDetail_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						 self.fire("click",data._id);
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});
		},
		setDataTable : function(startTime,endTime) {
			this.loadData(startTime,endTime);
		},
		loadData : function(startTime,endTime) {
			var self = this;
			cloud.util.mask("#tradeDetail_list_table");
			if(startTime && endTime){
			}else{
				var self = this;
				var myDate=new Date();
				var full = myDate.getFullYear(); 
				var month = myDate.getMonth() +1;
				var day = myDate.getDate();
				var date =  full+"/"+month+"/"+day;
				startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
				endTime =(new Date(date+" 23:59:59")).getTime()/1000;
			}
			Service.getTradeInfoBySiteId(self.siteId,startTime,endTime,function(data) {
				//console.log(data);
		        self.listTable.render(data.result[0].goods);
		        cloud.util.unmask("#tradeDetail_list_table");
			});
		}
		
	});
	return list;
});