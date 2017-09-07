define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../../service");
	var columns = [
	{
		"title":locale.get({lang:"trade_order_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:dateConvertor
	}, {
		"title":locale.get({lang:"trade_automat_number"}),
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "18%"
	}, {
		"title":locale.get({lang:"trade_product_name"}),
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"trade_price"}),
		"dataIndex" : "price",
		"cls" : null,
		"width" : "8%",
		render:priceConvertor
	}, {
		"title":locale.get({lang:"counts_of_phone"}),
		"dataIndex" : "count",
		"cls" : null,
		"width" : "8%"
	}, {
		"title":locale.get({lang:"trade_pay_style"}),
		"dataIndex" : "payStyle",
		"cls" : null,
		"width" : "14%",
		render:typeConvertor
	},{
		"title":locale.get({lang:"trade_pay_status"}),
		"dataIndex" : "payStatus",
		"cls" : null,
		"width" : "10%",
		render:payStatusConvertor
	},{
		"title":locale.get({lang:"deliver_status"}),
		"dataIndex" : "deliverStatus",
		"cls" : null,
		"width" : "10%",
		render:deliverConvertor
	},{
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
			    case 1:
	                display = locale.get({lang: "deliver_status_1"});//出货失败
	                break;
	            case 2:
	                display = locale.get({lang: "deliver_status_1"});//出货失败
	                break;
	            case 0:
	                display = locale.get({lang: "deliver_status_0"});//出货成功
	                break;
	            case 3:
	                display = locale.get({lang: "deliver_status_1"});//出货失败
	                break;
	            case -1:
	                display = locale.get({lang: "deliver_status_11"});//待出货
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
			 case "1":
	                display = locale.get({lang: "trade_baifubao"});
	                break;
	            case "2":
	                display = locale.get({lang: "trade_wx_pay"});
	                break;
	            case "3":
	                display = locale.get({lang: "trade_alipay"});
	                break;
	            case "4":
	                display = locale.get({lang: "trade_cash_payment"});
	                break;
	            case "5":
	                display = locale.get({lang: "trade_pos_mach"});/* POS机 */
	                break;
	            case "6":
	                display = locale.get({lang: "trade_scanner_card"});/* 扫胸牌 */
	                break;
	            case "7":
	                display = locale.get({lang: "trade_claim_number"});/* 取货码 */
	                break;
	            case "8":
	                display = locale.get({lang: "trade_game"});/* 游戏 */
	                break;
	            case "9":
	                display = locale.get({lang: "trade_soundwave_pay"});/* 声波支付 */
	                break;
	            case "10":
	                display = locale.get({lang: "trade_reversescan_pay"});/* 支付宝反扫支付 */
	                break;
	            case "11":
	                display = locale.get({lang: "wechat_reversescan_pay"});/* 微信反扫支付 */
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
			this._renderHtml();
			this._renderTable();
		
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

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadData();
		},
		loadData : function() {
			
			cloud.util.mask("#tradeDetail_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			Service.getTradeInfoBySiteId(self.siteId,0, pageDisplay,function(data) {
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        cloud.util.unmask("#tradeDetail_list_table");
			});
			
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#tradeDetail_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				Service.getTradeInfoBySiteId(self.siteId,options.cursor, options.limit,function(data){
	   							   callback(data);
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
	        }
	});
	return list;
});