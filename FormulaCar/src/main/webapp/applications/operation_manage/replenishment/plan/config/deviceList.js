define(function(require) {
    require("cloud/base/cloud");

    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./deviceList.html");
    var Service = require("../service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    
    var SalelistInfo = require("../config/saleList");
    
    var columns = [{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "20%"
	}, /*{
		"title":locale.get({lang:"automat_name"}),//售货机名称
		"dataIndex" : "deviceName",
		"cls" : null,
		"width" : "15%"
	},*/ {
		"title":locale.get({lang:"replenish_cid"}),//货柜名称
		"dataIndex" : "cid",
		"cls" : null,
		"width" : "15%"
	}, {
		"title":locale.get({lang:"device_shelf_type"}),//货柜类型
		"dataIndex" : "machineType",
		"cls" : null,
		"width" : "15%",
		render:machineType
	},{
		"title":locale.get({lang:"automat_site_name"}),//点位名称
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "20%"
	},/*{
		"title":locale.get({lang:"automat_line"}),//线路名称
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "20%"
	},*/{
		"title":locale.get({lang:"automat_replenishment_detail"}),//库存状态
		"dataIndex" : "stockRate",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"shelf_sold_status"}),//售空状态
		"dataIndex" : "soldoutCount",
		"cls" : null,
		"width" : "25%",
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
			this.type = options.type;
			this.automatWindow = options.automatWindow;
			this.basedata = options.basedata;
			this.lineIds = options.basedata.lineIds;
			
			this.planId = options.planId;
			this.lines = options.lines;
			
			this.equipstatus = options.equipstatus;
			if(!this.equipstatus){
				this.equipstatus = [];
				this.assetIds = [];
			}else{
				this.assetIds = options.assetIds;
			}
			
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
			$("#plan_last_step").val(locale.get({lang: "price_step"}));
			$("#plan_save").val(locale.get({lang: "save"}));
		    this._render();
		    locale.render({element: this.element});
		   $("#content-table-paging").css("width",$("#content-table-content").width());
		    $("#content-table-paging").css({"margin-top":"0px","bottom":"150px"});
		},
		_render:function(){
			this._renderData();
			this._renderTable();
			this._renderBtn();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderData:function(){
			var self = this;
			var lines = self.lines;
			$("#leftlines").html("<span class='leftline_title'>"+locale.get({lang: "automat_line"})+"</span>");
			for(var i=0;i<lines.length;i++){
				var info = lines[i];
				
				
				$("#leftlines").append("<span class='lineleftspan' id='left_"+info.lineId+"'>"+info.lineName+"</span>");
				
				if(i == 0){
					$("#left_"+info.lineId).css("background-color","#44b549");
					self.lineIds = [];
					self.lineIds.push(info.lineId);
				}
				$("#left_"+info.lineId).bind('click',{lineId:info.lineId},function(e){
					$(".lineleftspan").removeAttr("style");
					$("#left_"+e.data.lineId).css("background-color","#44b549");

					self.selectAssets();
					
					self.lineIds = [];
					self.lineIds.push(e.data.lineId);
					self.loadTableData(30,0);
				});
				
			}
			
		},
		selectAssets:function(){
			var self = this;
			var assetIds = self.getSelectedResources();
			
			var all = self.listTable.getAllData();
			
			if (all.length > 0) {
				for (var j = 0; j < all.length; j++) {
					var assetId = all[j].assetId;
                    var cid = all[j].cid;
                    var stateObj ={};
                    stateObj.assetId = assetId;
                    stateObj.state = 0;
                    stateObj.cid = cid;
                    if($.inArray(assetId,self.assetIds) > -1){
                    	self.equipstatus.splice($.inArray(stateObj,self.equipstatus),1);
                    	self.assetIds.splice($.inArray(assetId,self.assetIds),1);
                    }
					
				}
				
			}
			
        	if (assetIds.length > 0) {
        		for (var i = 0; i < assetIds.length; i++) {
                    var assetId = assetIds[i].assetId;
                    var cid = assetIds[i].cid;
                    var stateObj ={};
                    stateObj.assetId = assetId;
                    stateObj.state = 0;
                    stateObj.cid = cid;
                    
                    if($.inArray(assetId,self.assetIds) == -1){
                    	self.equipstatus.push(stateObj);
                    	self.assetIds.push(assetId);
                    }
                    
                    
                }
            }
			
		},
		_renderBtn: function(){
			var self = this;
            $("#plan_last_step").bind("click", function() {
            	$("#devicelist").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
            });
            
          //保存
            $("#plan_save").bind("click", function() {
            	
            	self.selectAssets();
            	
            	var equipstatus = self.equipstatus;
            	equipstatus = $.unique(equipstatus);
            	
            	if (equipstatus.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }
            	var finalData = self.basedata;
            	
            	finalData.equipStatus = equipstatus;
            	finalData.completeRate = "0%";
                
                if(self.planId != null){
                	Service.updateReplenishPlan(finalData,self.planId, function(data) {

                    	if(data.error_code == null){
                    		self.automatWindow.destroy();
                            self.fire("getplanList");
                    	}
                        
                    });
                }else{
                	Service.addReplenishPlan(finalData, function(data) {
                    	
                        if(data.error_code == null){
                        	self.automatWindow.destroy();
                            self.fire("getplanList");
                    	}
                        
                    });
                }
                
            	
            });
			
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
						 
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        var c = $(tr).find("td").eq(6).text();
	                        if(c == locale.get({lang: "device_normal"})){
	                        	$(tr).find("td").eq(6).css("color","#458B00");
	                        }else if(c != locale.get({lang: "automat_unknown"})){
	                        	$(tr).find("td").eq(6).css("color","red");
	                        }
	                        if(data.stockRate != "" && data.valve == 1){
	                        	$(tr).find("td").eq(5).css("color","red");
	                        }
	                        if(self.assetIds != null && self.assetIds.length > 0){
	                        	
	                        	if($.inArray(data.assetId,self.assetIds) > -1){
	                        		$(tr).find("a").click();
	                        	}
	                        }
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
			 cloud.util.mask("#device_list");
                            
             self.searchData = {
        				"lineId":self.lineIds,
        				"type":"0"
        	 };
			
			Service.getAllDeviceReplenishmentV2(self.searchData,limit,cursor,function(data){
				 
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
      		     self.listTable.render(data.result);
	        	 self._renderpage(data, 1);

	        	 cloud.util.unmask("#device_list");
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
        				cloud.util.mask("#device_list");
        				Service.getAllDeviceReplenishmentV2(self.searchData, options.limit,options.cursor,function(data){
          				   self.pageRecordTotal = data.total - data.cursor;
  						   callback(data);
  						 cloud.util.unmask("#device_list");
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
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.listTable.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        },
        getAllResources: function() {
        	var self = this;
        	var rows = self.listTable.getRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
	});
	return list;
});