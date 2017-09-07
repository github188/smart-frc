define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./content.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Table = require("cloud/components/table");
	var Service = require('../../../service');
	var columns = [
	/*{
		"title":locale.get({lang:"date"}),
		"dataIndex" : "statisticTime",
		"cls" : null,
		"width" : "30%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
        }
	}, */{
		"title":locale.get({lang:"automat_name_of_commodity"}),
		"dataIndex" : "goodsName",
		"cls" : null,
		"width" : "40%"
	}, {
		"title":locale.get({lang:"automat_transaction_count"}),
		"dataIndex" : "sum",
		"cls" : null,
		"width" : "30%"
	},{
		"title":locale.get({lang:"automat_transaction_money"}),
		"dataIndex" : "amount",
		"cls" : null,
		"width" : "30%",
		render:function(data, type, row){
			return data/100;
        }
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	}];
	
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.time = options.time;
			this.type = options.type;
			this.service = new Service();
			this.elements = {
				table : {
					id : "goods_sta_list_table",
					"class" : null
				},
				paging : {
					id : "goods_sta_list_paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			this.setDataTable();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			var self = this;
			this.listTable = new Table({
				selector : "#goods_sta_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
                   scope: this
				}
			});
			
		},
		setDataTable : function() {
			//cloud.util.mask("#goods_sta_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			self.service.getLinesByUserId(userId,function(linedata){
	            	var lineIds=[];
	                if(linedata && linedata.result && linedata.result.length>0){
		    			  for(var i=0;i<linedata.result.length;i++){
		    				  lineIds.push(linedata.result[i]._id);
		    			  }
	                }
	                if(roleType == 51){
	                	 lineIds = [];
	                  }
	                if(roleType != 51 && lineIds.length == 0){
	                    lineIds = ["000000000000000000000000"];
	                }
            	    self.lineIds = lineIds;

                	self.service.getGoodsStatisticByPage(self.type,self.time,pageDisplay,0,lineIds, function(data) {
 	    				var total = data.total;
 	    				self.totalCount = data.result.length;
 	    		        //data.total = total;
 	    		        self.pageRecordTotal = total;
 	    		        self.listTable.render(data.result);
 	    		       $("#goods_statistics_detail_table").css("height",10+$("#goods_sta_list_table-table").height()+$(".paging-page-box").height());
 	    		        //self._renderpage(data, 1);
 	    		       // cloud.util.unmask("#goods_sta_list_table");
 	    		    }); 
	                
	         });
		},
		 _renderpage:function(data, start){
        	var self = this;
        	
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#goods_sta_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        			//	cloud.util.mask("#goods_sta_list_table");
        				self.service.getGoodsStatisticByPage(self.type,self.time, options.limit,options.cursor,self.lineIds,function(data){
        					self.pageRecordTotal = data.total - data.cursor;
        					callback(data);
        				//	cloud.util.unmask("#goods_sta_list_table");
        				});
        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.listTable.clearTableData();
        			    self.listTable.render(data.result);
        				self.nowPage = parseInt(nowPage);
        				$("#goods_statistics_detail_table").css("height",10+$("#goods_sta_list_table-table").height()+$(".paging-page-box").height());
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