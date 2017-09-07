define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var Common = require("../../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./deviceList.html");
    var Service = require("../service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var SelfConfigInfo = require("../config/selfConfig");
    var columns = [{
        "title": locale.get({lang: "network"}),
        "dataIndex": "online",
        "cls": null,
        "width": "10%",
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
    },{
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "20%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "20%"
    }];
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.automatWindow = options.automatWindow;     
            this.basedata = options.basedata;
            this.specialData = options.specialData;
            this.deviceLists = [];
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            
            this.elements = {
                bar: {
                    id: "device_list_bar1",
                    "class": null
                },
                table: {
                    id: "device_list_table1",
                    "class": null
                },
                paging: {
                    id: "device_list_paging1",
                    "class": null
                }
            };
            this._render();
   
        },
        _render: function() {
            this.renderDeviceTable();
            this._renderNoticeBar();
            this._renderBtn();
            $("#device_last_step").val(locale.get({lang: "price_step"}));
            $("#device_next_step").val(locale.get({lang: "next_step"}));
           
        },
        
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        renderDeviceTable:function(){
        	var self=this;
            this.listTable = new Table({
                selector: "#device_list_table1",
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
             
                        if(self.specialData != null && self.specialData.config != null){
                        	var lists = self.specialData.config.deviceConfig;
                        	if(lists != null && lists.length>0){
                        		for(var i=0;i<lists.length;i++){
                        			var deviceId = lists[i].deviceId;
                        			if(data._id == deviceId){
                        				$(tr).find('a').click();
                        			}
                        			
                        		}
                        	}
                        	
                        }
                        
                        
                    },
                    scope: this
                }
            });
            var height = $("#device_list_table1").height()+"px";
	        $("#device_list_table1-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#device_list_table1");
            var self = this;
            var search = $("#automatSearch").val();
            var automatValue = $("#automatValue").val();
            if (automatValue) {
          	  automatValue = self.stripscript(automatValue);
            }
            var assetId = null;
            var name = null;
            if (search) {
                if (search == 1) {
                    assetId = $("#automatValue").val();
                } else if (search == 0) {
                    name = automatValue;//售货机名称
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
                  if(roleType == 51){
		    			 lineIds = [];
                   }
                  if(roleType != 51 && lineIds.length == 0){
	                    lineIds = ["000000000000000000000000"];
	              }
                  
                  self.searchData = {
                      	"online":"0",
                      	"lineId": lineIds,
                        "assetId": assetId,
                        "name":name,
                        "startTime":self.basedata.startTime,
                        "endTime":self.basedata.endTime,
                        "type":self.basedata.type
                   };  
                   if(self.specialData != null){
                	    self.searchData.id = self.specialData._id;
                   }
                   Service.getAllAutomatsByPageLimitSpecial(self.searchData, limit, cursor, function(data) {
                       var total = data.result.length;
                       self.pageRecordTotal = total;
                       self.totalCount = data.result.length;
                       self.listTable.render(data.result);
                       self._renderpage(data, 1);
                       cloud.util.unmask("#device_list_table1");
                   }, self);
            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#device_list_paging1"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#device_list_table1");
                        Service.getAllAutomatsByPageLimitSpecial(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#device_list_table1");
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
                selector: "#device_list_bar1",
                events: {
                    query: function(areaVal) {
                        self.loadTableData($(".paging-limit-select").val(), 0, areaVal);
                    }
                }
            });
        },
        _renderBtn:function(){
        	var self = this;
            $("#device_last_step").bind("click", function() {
            	$("#devicelist").css("display", "none");
                $("#selfConfig").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab1").addClass("active");
            });
            
            
            $("#device_next_step").bind("click", function() {
            	
	                var deviceArr = self.getSelectedResources();
	                if (deviceArr.length == 0) {
	                     dialog.render({lang: "please_select_at_least_one_config_item"});
	                     return;
	                }

                 	var deviceConfigs = [];
                 	for(var j=0;j<deviceArr.length;j++){
                 		var device = deviceArr[j];
                 		console.log(deviceArr);
                 		var deviceConfig = {};
                 		deviceConfig.deviceId = device._id;
                 		deviceConfig.gwId = device.gwId;
                 		deviceConfig.assetId = device.assetId;
                 		var counters = [];
                 		
                 		
                 		if(self.specialData != null && self.specialData.config != null){
                        	var lists = self.specialData.config.deviceConfig;
                        	if(lists != null && lists.length>0){
                        		for(var i=0;i<lists.length;i++){
                        			var deviceId = lists[i].deviceId;
                        			if(deviceConfig.deviceId == deviceId){
                        				counters = lists[i].offerCids;
                        			}
                        			
                        		}
                        	}
                        	
                        }
                 		
                 		deviceConfig.counters = counters;
                 		
                 		deviceConfigs.push(deviceConfig);
                 	}
                 	
                 	$("#devicelist").css("display", "none");
 	            	$("#selfConfig").css("display", "block");
 	                $("#baseInfo").css("display", "none");
 	                $("#tab1").removeClass("active");
 	                $("#tab2").removeClass("active");
 	                $("#tab3").addClass("active");

 	                this.SelfConfig = new SelfConfigInfo({
 	                    selector: "#selfConfigInfo",
 	                    automatWindow: self.automatWindow,
 	                    deviceList:self.deviceLists,
 	                    basedata:self.basedata,
 	                    deviceConfigs:deviceConfigs,
 	                    specialData:self.specialData,
 	                    events: {
 	                        "rendTableData": function() {
 	                            self.fire("rendTableData");
 	                        }
 	                    }
 	                });
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