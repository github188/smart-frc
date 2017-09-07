define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var Service = require("../../service");

	var columns = [{
		"title":locale.get({lang:"automat_line"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"automat_site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "120"
	}, {
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "120px"
	},{
		"title":locale.get({lang:"sales_volume"}),//销售量
		"dataIndex" : "recordData",
		"cls" : null,
		"width" : "180px",
		render:function(data, type, row){
			  var display = "";
			  var total='';var cash='';var nocash='';
			  if(data.machineType == 3){
				  total = data.stockData.saleCount.cpNumSInit;
				  cash = data.stockData.saleCount.cpCashNumSInit;
				  nocash = data.stockData.saleCount.cpNcashNumSInit;
	   		    }else{
	   		      total = data.saleData.saleCount.cpNumSInit;
	   		      cash = data.saleData.saleCount.cpCashNumSInit;
	   		      nocash = data.saleData.saleCount.cpNcashNumSInit;
	   		    }
			 
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;width:50px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+total+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+cash+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+nocash+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"sales_amount"})+'('+locale.get({lang:"china_yuan"})+')',//销售额
		"dataIndex" : "recordData",
		"cls" : null,
		"width" : "180px",
		render:function(data, type, row){
			  var display = "";
			  var total='';var cash='';var nocash='';
			  if(data.machineType == 3){
				  total = data.stockData.saleCount.cpMoneySInit;
				  cash = data.stockData.saleCount.cpCashMoneySInit;
				  nocash =data.stockData.saleCount.cpNcashMoneySInit;
	   		    }else{
	   		      total = data.saleData.saleCount.cpMoneySInit;
	   		      cash = data.saleData.saleCount.cpCashMoneySInit;
	   		      nocash = data.saleData.saleCount.cpNcashMoneySInit;
	   		    }
			 
	    	  display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;width:50px;'>"+locale.get({lang:"sale_total"})+":</td><td>"+total+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;'>"+locale.get({lang:"sale_cash"})+":</td><td>"+cash+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td style='text-align: center;'>"+locale.get({lang:"sale_no_cash"})+":</td><td>"+nocash+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    	 return display;
		}
	},{
		"title":locale.get({lang:"note_income"}),//纸币收支
		"dataIndex" : "noteIncome",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"coin_income_expense"}),//硬币收支
		"dataIndex" : "coinInExpense",
		"cls" : null,
		"width" : "100px"
	},{
		"title":locale.get({lang:"last_time_of_replenishment"}),//上次补货时间
		"dataIndex" : "lastTime",
		"cls" : null,
		"width" : "120px",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"this_time_of_replenishment"}),//本次补货时间
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "120px",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"replenish_person_name"}),//补货人
		"dataIndex" : "replenishPersonName",
		"cls" : null,
		"width" : "100px"
	}, {
		"title":locale.get({lang:"device_shelf_type"}),//货柜类型
		"dataIndex" : "machineType",
		"cls" : null,
		"width" : "80px",
		render:machineType
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
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
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
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
					id : "content-table-pag",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#devices_list").css("width",$(".wrap").width());
			$("#content-table-pag").css("width",$(".wrap").width());
			
			$("#devices_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#devices_list").height();
		    var barHeight = $("#content-table-toolbar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#content-table-content").css("height",tableHeight);
		    
			$("#content-table-content").css("width",$(".wrap").width());
			
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
			//$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00");
			
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
				start = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 00:00:00")).getTime()/1000;
			 }
			 var end ='';
			 if(endTime){
				end = (new Date(endTime+":59")).getTime()/1000; 
			 }else{
				end = (new Date(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59:59")).getTime()/1000;;
			 }
			 if(start!=null&&end!=null&&start>=end){
              	
              	dialog.render({lang:"start_date_cannot_be_greater_than_end_date"});
        		return;
             }
             
             var userline = "";
             if($("#userline").attr("multiple") != undefined){
            	 userline = $("#userline").multiselect("getChecked").map(function(){//线路
 					return this.value;	
 			 }).get();
             }
             
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
                 	 }else if(search == 2){
                 		self.searchData = {
                				"lineId":userline,
                				"startTime":start,
                				"endTime":end,
                				"personName":searchValue
                		};
        		      };
                 	 
                  }else{
                 	 self.searchData = {
                 				"lineId":userline,
                 				"startTime":start,
                 				"endTime":end
                 	 };
                  }
                 
     			
     			Service.getAllDeviceReplenishmentV2(self.searchData,limit,cursor,function(data){
     				 console.log(data);
     				 var total = data.result.length;
     				 self.pageRecordTotal = total;
     	        	 self.totalCount = data.result.length;
            		 self.listTable.render(data.result);
     	        	 self._renderpage(data, 1);
     	        	 cloud.util.unmask("#content-table-content");
     			 }, self);
             });
             
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#content-table-pag"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#content-table-content");
        				Service.getAllDeviceReplenishmentV2(self.searchData, options.limit,options.cursor,function(data){
         				   self.pageRecordTotal = data.total - data.cursor;
 						   callback(data);
 						  cloud.util.unmask("#content-table-content");
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