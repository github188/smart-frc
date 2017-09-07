define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var Common = require("../../../../common/js/common");
	var layout = require("cloud/lib/plugin/jquery.layout");
	require("./opt.css");
	var html = require("text!./list.html");
	var Service = require("../service");
	var Util = require("../util");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var columns = [{
		"title":locale.get({lang:"automat"}),//机器编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"site"}),//点位编号
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"shelf_platformsalenum"}),//销量
		"dataIndex" : "count",
		"cls" : null,
		"width" : "25%",
        render:function(data, type, row){
        	return data?data:0;
        }
	},{
		"title":locale.get({lang:"sales_amount"}),//销售额
		"dataIndex" : "cost",
		"cls" : null,
		"width" : "25%",
        render:function(data, type, row){
        	return data?data/100:0;
        }
	},{
		 "title": locale.get({lang:"operate"}),
	     "dataIndex": "operate",
	     "cls" : null,
	     "width": "20%",
	     render:function(data,type,row){
	    	 var display = "<div>";
	    	 display += "<a id='0_"+row.assetId+"' class=\"optbackground background\" title=\"Optimization\"></a>";
	    	 display += "<a id='1_"+row.assetId+"' class=\"merbackground background\" title=\"Merchandising\"></a>";
	    	 display += "</div>";
	    	 return display;
	     }
	}];
	
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
			this.elements = {
				bar : {
					id : "opt_list_bar",
					"class" : null
				},
				table : {
					id : "opt_list_table",
					"class" : null
				},
                paging: {
                    id: "opt_list_paging",
                    "class": null
                }
			};
		    this._render();
		},
		_render:function(){
			$("#opt_list").css("width",$(".wrap").width());
			$("#opt_list_paging").css("width",$(".wrap").width());
			
			$("#opt_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#opt_list").height();
		    var barHeight = $("#opt_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#opt_list_table").css("height",tableHeight);
			this._renderNoticeBar();
			this._renderTable();
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
				selector : "#opt_list_table",
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
		    var height = $("#opt_list_table").height()+"px";
		    $("#opt_list_table-table").freezeHeader({ 'height': height });
		    this.loadTableData(30, 0);
		},
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#opt_list_bar",
				events : {
					query: function() {//查询
                        self.getOptList(30, 0);
                    }
				}
			});
			
			$("#days").bind("keydown", Util.numberLimit);
		},
		loadTableData: function(limit, cursor) {
	        var self = this;
	        self.getOptList(limit, cursor);
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#opt_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	self.getOptList(options.limit, options.cursor);
                    },
                    turn: function(data, nowPage) {
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);
                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
		getSearchVal: function(limit, cursor){
			var searchValue= {};
			searchValue.limit = limit;
			searchValue.cursor = cursor;
            searchValue.days = $("#days").val();
            searchValue.language = localStorage.getItem("language");
            return searchValue;
		},
		getOptList: function(limit, cursor) {
			cloud.util.mask("#opt_list_table");
			var self = this;
			self.getMachineData(limit, cursor, function(data){
				if(data.result.length > 0){
					var deviceIds = [];
					for (var i = 0; i < data.result.length; i++) {
						deviceIds.push(data.result[i]["_id"]);
					}
					var searchValue = self.getSearchVal(limit, cursor);
					searchValue.deviceIds = deviceIds;
		            Service.getOptList(searchValue, function(optdata) {
		                self.pageRecordTotal = data.total - data.cursor;
		                self.totalCount = data.result.length;
		                
		                for(var i = 0; i < data.result.length; i++){
		                	for(var j = 0; j < optdata.result.length; j++){
		                		if(data.result[i]["_id"] == optdata.result[j].deviceId){
		                			data.result[i].count = optdata.result[j].count;
		                			data.result[i].cost = optdata.result[j].cost;
		                			break;
		                		}
		                	}
		                }
		                self.listTable.render(data.result);
		                self._renderpage(data, 1);
		           		$("#opt_list_table").find(".background").bind("click", self.getDetail);
		   	        	cloud.util.unmask("#opt_list_table");
		            });
				}else{
					self.listTable.render(data.result);
	                self._renderpage(data, 1);
	   	        	cloud.util.unmask("#opt_list_table");
				}
				
			});
			
		},
		getDetail: function(event){
			var id = event.srcElement.id;
			var url;
			if(id.startsWith("0")){//optimization
				localStorage.setItem("optimization_assetId", id.substr(2));
				url = "../optMachine/optMain";
			}
			if(id.startsWith("1")){//merchandising
				localStorage.setItem("merchandising_assetId", id.substr(2));
				url = "../merchandising/merMain";
			}
			
			require([url], function(Application) {
				$("#user-content").empty();
                if (Application) {
                    new Application({
                        container: "#user-content"
                    });
                }
                cloud.util.unmask("#user-content");
            }.bind(this));
		},
		getMachineData : function(limit, cursor, callback) {
			var self = this;
			var search = $("#search").val();
			var searchValue = $("#searchValue").val();
			if (searchValue) {
				searchValue = self.stripscript(searchValue);
			}
			var siteName = null;
			var assetId = null;
			var lineId = "";
			if (search == 0) {
				assetId = searchValue;
			} else if (search == 1) {
				siteName = searchValue;
			}
			var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			Service.getAreaByUserId(userId, function(areadata) {
				var areaIds = [];
				if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
					areaIds = areadata.result.area;
				}
				if (roleType == 51) {
					areaIds = [];
				}
				if (roleType != 51 && areaIds.length == 0) {
					areaIds = [ "000000000000000000000000" ];
				}
				cloud.Ajax.request({
					url : "api/automatline/list",
					type : "GET",
					parameters : {
						areaId : areaIds,
						cursor : 0,
						limit : -1
					},
					success : function(linedata) {
						var lineIds = [];
						if (linedata && linedata.result && linedata.result.length > 0) {
							for (var i = 0; i < linedata.result.length; i++) {
								lineIds.push(linedata.result[i]._id);
							}
						}

						if (roleType == 51) {
							lineIds = [];
						}
						if (lineId.length != 0) {
							lineIds = lineId;
						}
						if (roleType != 51
								&& lineIds.length == 0) {
							lineIds = [ "000000000000000000000000" ];
						}
						self.lineIds = lineIds;
						self.searchData = {
							"siteName" : siteName,
							"assetId" : assetId,
							"lineId" : lineIds
						};
						Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
							callback.call(this, data);
						}, self);
					}
				});
			});
		}
		
	});
	return list;
});