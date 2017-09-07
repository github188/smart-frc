define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");
	var SeeDeviceRecord = require("./see/seeReconciliation-window");
	var AddReplenishPlan = require("./add/addplan-window");
	var columns = [{
		"title":locale.get({lang:"automat_line"}),//线路
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"automat_replenishment_detail"}),//库存状态
		"dataIndex" : "stockRate",
		"cls" : null,
		"width" : "15%",
		 render: function(data, type, row) {
             var display = "";
             var color='';
             if (data) {
            	 var newData=data.substring(0,data.length-1);
            	 if(newData>30 || newData==30){
            		 if(newData>80 || newData == 80){
            			 color ='#6CAF00'; 
            		 }else{
            			 color ='#FFA500'; 
            		 }
            	 }else{
            		 color ='red'; 
            	 }
            	 display += new Template(
            			 "<div style=' background-color:#eee; height:14px;border-radius: 4px; width:120px; border:1px solid #bbb; color:#222;text-align: center;'>"+ 
            		        "<div style='width: "+data+"; background-color:"+color+";height:14px;font-size:10px;text-align: center;'></div>"+ 
            		        "<div style='z-index: 2;margin-top: -15px;'>"+data+"</div>"+
            		    "</div>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
             } else {
                 display = '-';
             }
             return display;
         }
	},{
		"title":locale.get({lang:"user_area"}),//区域
		"dataIndex" : "areaName",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"device_count"}),//售货机总数
		"dataIndex" : "deviceCount",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"device_count_online"}),//在线数量
		"dataIndex" : "deviceCountOnline",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"device_count_offline"}),//离线数量
		"dataIndex" : "deviceCountOffline",
		"cls" : null,
		"width" : "10%"
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title" : "",
		"dataIndex" : "valve",
		"cls" : "_id" + " " + "hide"
	} ];

	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.type = options.type;
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "stock-table-toolbar",
					"class" : null
				},
				table : {
					id : "stock-table-content",
					"class" : null
				},
				paging : {
					id : "stock-table-paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
		    $("#stock_list").css("width",$(".wrap").width());
			$("#stock-table-paging").css("width",$(".wrap").width());
			
			$("#stock_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#stock_list").height();
		    var barHeight = $("#stock-table-toolbar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#stock-table-content").css("height",tableHeight);
		    
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
				selector : "#stock-table-content",
				columns : columns,
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
	                        
	                        if(data.stockRate != "" && data.valve == 1){
	                        	$(tr).find("td").eq(2).css("color","red");
	                        }
	                        	
	                    },
	                   scope: this
				}
			});
			var height = $("#stock-table-content").height()+"px";
	        $("#stock-table-content-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			 var self = this;
			 cloud.util.mask("#stock-table-content");
			 require(["cloud/lib/plugin/jquery.multiselect"], function() {
				var search=$("#search").val();
	            var searchValue=$("#searchValue").val();
	
	            var userline = $("#userline").multiselect("getChecked").map(function(){//线路
						return this.value;	
				 }).get();
	            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	            var roleType = permission.getInfo().roleType;
	            Service.getLinesByUserId(userId,function(linedata){
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
	                
	                 if(userline.length == 0){
		                userline = lineIds;
		             }
	
	                 self.searchData = {
	                		 "lineId":userline
	                 }
				
					 Service.getAllLineStocksV3(self.searchData,limit,cursor,function(data){
						 
						 var total = data.result.length;
						 self.pageRecordTotal = total;
			        	 self.totalCount = data.result.length;
		      		     self.listTable.render(data.result);
			        	 self._renderpage(data, 1);
		
			        	 cloud.util.unmask("#stock-table-content");
					 }, self);
	            });
			 });
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#stock-table-paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#stock-table-content");
        				Service.getAllLineStocksV3(self.searchData, options.limit,options.cursor,function(data){
          				   self.pageRecordTotal = data.total - data.cursor;
  						   callback(data);
  						 cloud.util.unmask("#stock-table-content");
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
				selector : "#stock-table-toolbar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  add:function(){
						    if (this.addReplenishPlan) {
	                            this.addReplenishPlan.destroy();
	                        }
						    var assets = self.getSelectedResources();
                            var equipstatus = [];
                            var lineIds = [];
                            var assetIds = [];
			            	if (assets.length == 0) {
			                    dialog.render({lang: "please_select_at_least_one_config_item"});
			                    return;
			                }else{
			                	for (var i = 0; i < assets.length; i++) {
			                        var assetId = assets[i].assetId;
			                        var lineId = assets[i].lineId;
			                        var stateObj ={};
			                        stateObj.assetId = assetId;
			                        stateObj.state = 0;
			                        equipstatus[i] = stateObj;
			                        
			                        if($.inArray(lineId,lineIds) == -1){
			                        	lineIds.push(lineId);
			                        }
			                        if($.inArray(assetId,assetIds) == -1){
			                        	assetIds.push(assetId);
			                        }
			                    }
			                }
			            	
	                        this.addReplenishPlan = new AddReplenishPlan({
	                            selector: "body",
	                            equipstatus:equipstatus,
	                            lineIds:lineIds,
	                            assetIds:assetIds,
	                            events: {
	                                "getplanList": function() {
	                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                }
	                            }
	                        });
					  },
					  see:function(){
						  var selectedResouces = self.getSelectedResources();
						  
	                 	  if (selectedResouces.length === 0) {
		 					   dialog.render({lang:"please_select_at_least_one_config_item"});
		 					   return;
	                 	  }else if(selectedResouces.length >= 2){
		 				       dialog.render({lang:"select_one_gateway"});
		 				      return;
		 				  }else{
		 					  var _id= selectedResouces[0].lineId;
		 					  var lineName = selectedResouces[0].lineName;
		 					  var stocks = selectedResouces[0].stockRate;
		 					  if(stocks == ""){
		 						 dialog.render({lang:"stocks_null"});
		 						 return;
		 					  }
		 					  if(this.seeReplenishment){
		                  			this.seeReplenishment.destroy();
		                  	  }
		 					  
		 					  this.seeReplenishment = new SeeDeviceRecord({
		                  			selector:"body",
		                  			lineId:_id,
		                  			lineName:lineName,
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