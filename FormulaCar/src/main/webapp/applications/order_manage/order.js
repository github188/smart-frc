define(function(require) {
	var cloud = require("cloud/base/cloud");
	var html = require("text!./order.html");
	var NoticeBar = require("./notice-bar");
	var Order = require("./order-window");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var service = require("./service");
	var TableTemplate = require("../template/table");//模板
	
	var columns = [ {
		"title":locale.get({lang:"ssName"}),
		"dataIndex" : "ssName",
		"cls" : null,
		"width" : "12%"
	}, {
		"title":locale.get({lang:"ssNumber"}),
		"dataIndex" : "ssNumber",
		"cls" : null,
		"width" : "8%"
	}, {
		"title":locale.get({lang:"number_of_order"}),
		"dataIndex" : "orderId",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"time_of_order"}),
		"dataIndex" : "orderTime",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"name_of_consignee"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "8%"
	}, {
		"title":locale.get({lang:"phone_of_consignee"}),
		"dataIndex" : "phone",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"address_of_consignee"}),
		"dataIndex" : "address",
		"cls" : null,
		"width" : "18%"
	}, {
		"title":locale.get({lang:"title_of_phone"}),
		"dataIndex" : "title",
		"cls" : null,
		"width" : "10%"
	}, {
		"title":locale.get({lang:"purchase_model"}),
		"dataIndex" : "model",
		"cls" : "model",
		"width" : "14%",
		render:function(data, type, row){
			var display = "";
			if ("display" == type) {
				if(data){
					  display ="<a href='"+row.link+"' target='_blank' style='color:blue'>"+data+"</a>";
				}else{
					  display ="<a href='"+row.link+"' target='_blank' style='color:blue'></a>";
				}
			  
			    return display;
			}else {
				return data;
			}
		}
	}, {
		"title" : "",
		"dataIndex" : "link",
		"cls" : "link" + " " + "hide"
	}, {
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	
	var MicsiteFirmware = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.service = options.service;
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "order-bar",
					"class" : null
				},
				table : {
					id : "order-table",
					"class" : null
				},
				paging : {
					id : "order-paging",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			this.renderLayout();
			this._renderTable();
			this._renderNoticeBar();
			this.destroy();
		
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		renderLayout : function() {
			if (this.layout) {
				this.layout.destory();
			}
			this.layout = $("#order").layout({
				defaults : {
					paneClass : "pane",
					togglerClass : "cloud-layout-toggler",
					resizerClass : "cloud-layout-resizer",
					"spacing_open" : 1,
					"spacing_closed" : 1,
					"togglerLength_closed" : 50,
					resizable : false,
					slidable : false,
					closable : false
				},
				north : {
					paneSelector : "#" + this.elements.bar.id,
					size : "33"
				},
				center : {
					paneSelector : "#" + this.elements.table.id
				},
				south : {
					paneSelector : "#" + this.elements.paging.id,
					size : "38"
				}
			});
		},
		_renderTable : function() {
			this.orderTable = new Table({
				selector : "#" + this.elements.table.id,
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				//checkbox : "full",
				events : {
					 onRowClick: function(data) {
	                    	if(data){
	                    		if(this.order){
	                    			this.order.destroy();
	                    		}
	                    		this.order = new Order({
	                    			selector:"body",
	                    			datas:data
	                    		});
	                    	}
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
			this.renderLink();
		},
		loadData : function() {
			var self = this;
			var pagenew='';
		
			service.getUserMessage(function(data) {
				 if(data.result){
					 var oid = data.result.oid;//机构ID
					 //console.log("oid===="+oid);
					 $.ajax({
							type : 'GET',
							url : '/purchase_rainbow/yt/purchase/order?oid='+oid,
							async : false,
							dataType : "json",
							success : function(data) {
								var total = data.result.length;
			                	self.totalCount = data.result.length;
                             
			                	data.total = total;
								self.orderTable.render(data.result);
								self._renderpage(data, 1);
							}
						});
				 }
			});
		},
		renderLink:function(){
			
		},
        _renderpage:function(data, start){
        	var self = this;
        	if(this.page){
        		this.page.reset(data);
        	}else{
        		this.page = new Paging({
        			selector : $("#" + this.elements.paging.id),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				service.getUserMessage(function(data) {
        					 if(data.result){
        						 var oid = data.result.oid;//机构ID
        				         $.ajax({
        						   type : 'GET',
        						   url : '/purchase_rainbow/yt/purchase/order?cursor='+options.cursor+'&limit='+options.limit+"&oid="+oid,
        						   async : false,
        						   dataType : "json",
        						   success : function(data) {
        							   callback(data);
        						   }
        					    });
        					 }
        				});

        			},
        			turn:function(data, nowPage){
        			    self.totalCount = data.result.length;
        			    self.orderTable.clearTableData();
        			    self.orderTable.render(data.result);
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
    	_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#" + this.elements.bar.id,
				service : self.service,
				events : {
					query: function(ssName,startTime,endTime){
						var changeDisplay=$(".paging-limit-select").val();
						service.getUserMessage(function(data) {
       					 if(data.result){
       						 var oid = data.result.oid;//机构ID
					         $.ajax({
								  type:'GET',
								  url:'/purchase_rainbow/yt/purchase/order?limit='+changeDisplay+"&ssName="+ssName+"&cursor=0"+"&startTime="+startTime+"&endTime="+endTime+"&oid="+oid,
								  async:false,
								  dataType : "json",
								  success : function(data) {
									data.total = data.result.length;
									self.orderTable.render(data.result);
		        					self._renderpage(data, 1);
								 }
						    });
       					 }
						});
					}
				}
			});
		},
		
		destroy : function() {
//			if (this.layout) {
//                if (this.layout.destroy) {
//                    this.layout.destroy();
//                }
//                else {
//                    this.layout = null;
//                }
//            }
//            if(this.page){
//				this.page.destroy();
//				this.page = null;
//			}
//			
//			if(this.userlogTable){
//				this.userlogTable.destroy();
//				this.userlogTable = null;
//			}
//			
//            if (this.noticeBar) {
//                this.noticeBar.destroy();
//            }
		}
	});
	return MicsiteFirmware;
});