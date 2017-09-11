define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("./service");
    var NoticeBar = require("./flag-notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var columns = [{
            "title": locale.get({lang: "network"}),
            "dataIndex": "online",
            "cls": null,
            "width": "5%",
            render: function(data, type, row) {
                var display = "";
                if ("display" == type) {
                    switch (data) {
                        case 1:
                            var offlineStr = locale.get({lang: "offline"});
                            display += new Template(
                                    "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                    .evaluate({
                                status: offlineStr
                            });
                            break;
                        case 0:
                            var onlineStr = locale.get({lang: "online"});
                            display += new Template(
                                    "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                    .evaluate({
                                status: onlineStr
                            });
                            break;
                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        }, {
            "title": locale.get({lang: "numbers"}),
            "dataIndex": "assetId",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "name1"}),
            "dataIndex": "name",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "automat_vmcconnection_state"}),//Vmc连接状态
            "dataIndex": "vendingState",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.vmcOnline && data.vmcOnline == 1) {
                    	display = locale.get({lang: "automat_vmcconnection_state_conn"});
                    } else if(data.vmcOnline && data.vmcOnline == 0){
                    	display = locale.get({lang: "automat_vmcconnection_state_off"});
                    }else {
                    	display = locale.get({lang: "automat_unknown"});
                    }
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "automat_sale"}),//是否可售卖
            "dataIndex": "vendingState",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.isSale && data.isSale == 1) {
                    	display = locale.get({lang: "automat_can_be_sold"});
                    } else if(data.isSale == 0){
                    	display = locale.get({lang: "automat_can_not_be_sold"});
                    }else{
                    	display = locale.get({lang: "automat_unknown"});
                    }
                    
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "firmware_version_information"}),//固件版本
            "dataIndex": "inboxConfig",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.fireware) {
                    	display = data.fireware;
                    }else {
                    	display = locale.get({lang: "automat_unknown"});
                    }
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "automat_falut"}),//故障
            "dataIndex": "vendingState",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.vendingFault && data.vendingFault.length>0) {
                    	display = locale.get({lang: "fault"});
                    } else {
                        display = locale.get({lang: "automat_unknown"});
                    }
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "upper_lower_limit_of_refrigeration_temperature"}),//制冷温度上限/下限
            "dataIndex": "vendingState",
            "cls": null,
            "width": "12%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.temperState && data.temperState.length>0) {
                    	for(var i=0;i<data.temperState.length;i++){
                    		if(data.temperState[i].cid == 'master'){
                    			if(data.temperState[i].temperDetail.cryTemUL && data.temperState[i].temperDetail.cryTemDL){
                    				var cryTemUL = data.temperState[i].temperDetail.cryTemUL;//制冷温度上限
                        			var cryTemDL = data.temperState[i].temperDetail.cryTemDL;//制冷温度下限
                        			display = cryTemUL+'/'+cryTemDL;
                    			}else{
                    				display = locale.get({lang: "automat_unknown"});
                    			}
                    		}
                    	}
                    }else {
                        display = locale.get({lang: "automat_unknown"});
                    } 
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "upper_lower_limit_of_thermal_temperature"}),//制热温度上限/下限
            "dataIndex": "vendingState",
            "cls": null,
            "width": "12%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.temperState && data.temperState.length>0) {
                    	for(var i=0;i<data.temperState.length;i++){
                    		if(data.temperState[i].cid == 'master'){
                    			if(data.temperState[i].temperDetail.heatTemUL && data.temperState[i].temperDetail.heatTemDL){
                    				var heatTemUL = data.temperState[i].temperDetail.heatTemUL;//制热温度上限
                        			var heatTemDL = data.temperState[i].temperDetail.heatTemDL;//制热温度下限
                        			display = heatTemUL+'/'+heatTemDL;
                    			}else{
                    				display = locale.get({lang: "automat_unknown"});
                    			}
                    		}
                    	}
                    }else {
                        display = locale.get({lang: "automat_unknown"});
                    } 
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "left_ventricular_temperature"}),//左室温度
            "dataIndex": "vendingState",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.temperState && data.temperState.length>0) {
                    	for(var i=0;i<data.temperState.length;i++){
                    		if(data.temperState[i].cid == 'master'){
                    			if(data.temperState[i].temperDetail.leftRmTem){
                        			display = data.temperState[i].temperDetail.leftRmTem;
                    			}else{
                    				display = locale.get({lang: "automat_unknown"});
                    			}
                    		}
                    	}
                    }else {
                        display = locale.get({lang: "automat_unknown"});
                    } 
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }, {
            "title": locale.get({lang: "right_ventricular_temperature"}),//右室温度
            "dataIndex": "vendingState",
            "cls": null,
            "width": "8%",
            render: function(data, type, row) {
                var display = "";
                if (data) {
                    if (data.temperState && data.temperState.length>0) {
                    	for(var i=0;i<data.temperState.length;i++){
                    		if(data.temperState[i].cid == 'master'){
                    			if(data.temperState[i].temperDetail.rightRmTem){
                        			display = data.temperState[i].temperDetail.rightRmTem;
                    			}else{
                    				display = locale.get({lang: "automat_unknown"});
                    			}
                    		}
                    	}
                    }else {
                        display = locale.get({lang: "automat_unknown"});
                    } 
                } else {
                    display = locale.get({lang: "automat_unknown"});
                }
                return display;
            }
        }];

    
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.deviceIdArr = [];
            this.onlineType = options.onlineType;
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "device_list_bar",
                    "class": null
                },
                table: {
                    id: "device_list_table",
                    "class": null
                },
                paging: {
                    id: "device_list_paging",
                    "class": null
                }
            };
            this._render();
   
        },
        _render: function() {
            this._renderTable();
            this._renderNoticeBar();
        },
        
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderTable: function() {
            this.listTable = new Table({
                selector: "#device_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
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
           
	        require(["cloud/base/fixTableHeaderV"], function(Account){
            	var height = $("#device_list_table").height()+"px";
      	        $("#device_list_table-table").freezeHeaderV({ 'height': height });
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        }, 
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#device_list_table");
            var self = this;
            var online = $("#online").val();
            if (online) {
                //0 在线 1离线
                if (online == -1) {
                    online = '';
                }
            } else {
                //查所有
            }
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }
            var assetId = null;
            var name = null;
            if (search) {
                if (search == 0) {
                    assetId = $("#searchValue").val();
                } else if (search == 1) {
                    name = searchValue;//售货机名称
                }
            }
            
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
                 var lineIds=[];
                 if(linedata.result && linedata.result.length>0){
	    			  for(var i=0;i<linedata.result.length;i++){
	    				  lineIds.push(linedata.result[i]._id);
	    			  }
                 }
                 
                 self.lineIds = lineIds;
                 var fg = true;
                 
                 if(roleType != 51 && lineIds.length == 0){
                 	fg = false;
                 }
                 if(fg){
                	 if(self.onlineType){
                      	self.searchData = {
                                  "online": online,
                                  "assetId": assetId,
                                  "lineId": lineIds,
                                  "name":name,
                                  "onlineType":self.onlineType
                              };
                      }else{
                      	self.searchData = {
                                  "online": online,
                                  "assetId": assetId,
                                  "lineId": lineIds,
                                  "name":name
                          };
                      }
                      Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                          var total = data.result.length;
                          for(var i = 0 ;i<total;i++){
                          	self.deviceIdArr.push(data.result[i]._id);
                          }
                          
                          self.pageRecordTotal = total;
                          self.totalCount = data.result.length;
                          self.listTable.render(data.result);
                          self._renderpage(data, 1);
                          cloud.util.unmask("#device_list_table");
                      }, self);
                 }else{
                	 var total = 0;
                  	 var data = {
                  			 "cursor": 0,
                  			 "limit": 30,
                  			 "result": [],
                  			 "total": 0 
                  	 };
       	        	 self.totalCount = 0;
               		 self.listTable.render(data.result);
       	        	 self._renderpage(data, 1);
       	        	 cloud.util.unmask("#device_list_table"); 
                 }
                  
            });
            
                     

        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#device_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#device_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#device_list_table");
                        });
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
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#device_list_bar",
                onlineType : self.onlineType,
                events: {
                    query: function(areaVal) {
                        self.loadTableData($(".paging-limit-select").val(), 0, areaVal);
                    }



                   
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }  
    });
    return list;
});