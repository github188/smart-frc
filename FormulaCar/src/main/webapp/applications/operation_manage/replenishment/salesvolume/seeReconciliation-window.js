define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Table = require("cloud/components/table");
	var Service = require("../../service");
	var columns = [{
		"title":locale.get({lang:"record_container"}),//货柜
		"dataIndex" : "shelfId",
		"cls" : null,
		"width" : "8%"
	}, {
		"title":locale.get({lang:"automat_cargo_road_id"}),//货道
		"dataIndex" : "shelvesId",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"automat_name_of_commodity"}),//商品名称
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"reconciliation_alipay_count"}),//支付宝
		"dataIndex" : "alipay_count",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"reconciliation_weixin_count"}),//微信
		"dataIndex" : "wechat_count",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"reconciliation_baifubao_count"}),//百付宝
		"dataIndex" : "baidubao_count",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"reconciliation_cash_count"}),//现金支付
		"dataIndex" : "cash_count",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"the_remaining_number"}),//机存
		"dataIndex" : "surplus",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"shelf_rong"}),//容量
		"dataIndex" : "capacity",
		"cls" : null,
		"width" : "12%"
	}];
	function priceConvertor(value,type){
		return value/100;
	}
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.id = options.id;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this; 
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"device_check_list"}),
				top: "center",
				left: "center",
				height:520,
				width: 1000,
				mask: true,
				drag:true,
				content:"<div id='winContent' style='border-top: 1px solid #f2f2f2;'></div>",
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
		},
		_renderForm:function(){				
			var htmls1= "<div id='device_list_table' style='height:90%;margin-top:2px;'></div>";
	        $("#winContent").append(htmls1);
		},
		renderTable : function() {
			this.listTable = new Table({
				selector : "#device_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "single",
				events : {
					 onRowClick: function(data) {
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                    },
	                   scope: this
				}
			});

			this.loadData();
		},
		loadData:function(){
			var self = this;
			Service.getReconciliationRecordDetail(self.id,function(data){
				self.listTable.render(data.result);
			});
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