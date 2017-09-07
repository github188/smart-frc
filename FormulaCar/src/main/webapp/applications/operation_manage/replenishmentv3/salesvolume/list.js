define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");
	var SeeDeviceRecord = require("./seeReconciliation-window");
	var columns = [{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "11%"
	}, {
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "13%"
	},{
		"title":locale.get({lang:"automat_site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "12%"
	},{
		"title":locale.get({lang:"automat_line"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "13%"
	},{
		"title":locale.get({lang:"total_sales_volume"}),//总销量
		"dataIndex" : "total_count",
		"cls" : null,
		"width" : "6%"
	},{
		"title":locale.get({lang:"reconciliation_baifubao_count"}),//百付宝支付数量
		"dataIndex" : "baidubao_count",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"reconciliation_alipay_count"}),//支付宝支付数量
		"dataIndex" : "alipay_count",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"reconciliation_weixin_count"}),//微信支付数量
		"dataIndex" : "wechat_count",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"reconciliation_cash_count"}),//现金支付数量
		"dataIndex" : "cash_count",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"the_time_of_replenishment"}),//时间
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "13%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function priceConvertor(value,type){
		return value/100;
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
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.type = options.type;
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "content-table-toolbar",
					"class" : null
				},
				table : {
					id : "content-table-content",
					"class" : null
				},
				paging : {
					id : "content-table-paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			this._renderTable();
			this._renderNoticeBar();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#content-table-content",
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

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			 var self = this;
			 cloud.util.mask("#content-table-content");
			 var search=$("#search").val();
             var searchValue=$("#searchValue").val();
             var startTime=$("#startTime").val();
             var endTime=$("#endTime").val();
              var start ='';
			  if(startTime){
				  start = (new Date(startTime)).getTime()/1000; 
			  }else{
				  start =null;
			  }
			  var end ='';
			  if(endTime){
				  end = (new Date(endTime)).getTime()/1000; 
			  }else{
				  end =null;
			  }
			  if(start!=null&&end!=null&&start>=end){
              	
              	dialog.render({lang:"start_date_cannot_be_greater_than_end_date"});
        			return;
              }
             var userline = $("#userline").multiselect("getChecked").map(function(){//线路
					return this.value;	
			 }).get();
             if(search!=null){
            	 if(search ==0){
            		 self.searchData = {
              				"assetId":searchValue,
              				"lineId":userline,
              				"startTime":start,
              				"endTime":end
              		 };
            	 }else if(search ==1){
            		 self.searchData = {
               				"siteName":searchValue,
               				"lineId":userline,
               				"startTime":start,
               				"endTime":end
               		};
            	 }
             }else{
            	 self.searchData = {
            				"lineId":userline,
            				"startTime":start,
            				"endTime":end
            	 };
             }
            if(this.type == 0){
            	self.searchData.type = 0;
            }else if (this.type == 1){
            	self.searchData.type = 1;
            }
			Service.getAllDeviceReconciliation(self.searchData,limit,cursor,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
       		     self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#content-table-content");
			 }, self);
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#content-table-paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				Service.getAllDeviceReconciliation(self.searchData, options.limit,options.cursor,function(data){
         				   self.pageRecordTotal = data.total - data.cursor;
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
        }, 
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#content-table-toolbar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see:function(){
						  var selectedResouces = self.getSelectedResources();
	                 	  if (selectedResouces.length === 0) {
		 					   dialog.render({lang:"please_select_at_least_one_config_item"});
		 				  }else if(selectedResouces.length >= 2){
		 				       dialog.render({lang:"select_one_gateway"});
		 				  }else{
		 					  var _id= selectedResouces[0].id;
		 					  if(this.seeReplenishment){
		                  			this.seeReplenishment.destroy();
		                  	  }
		 					  this.seeReplenishment = new SeeDeviceRecord({
		                  			selector:"body",
		                  			id:_id,
		                  			events : {
		                  				"getGoodsList":function(){
		                  					self.setDataTable();
		                  				}
		                  			}
		                  	  });
		 				  }
					  }
				}
			});
		},
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.listTable.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return list;
});