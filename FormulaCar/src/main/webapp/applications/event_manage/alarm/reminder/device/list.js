define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var Common = require("../../../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("../../../service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var columns = [{
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
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "25%"
    }];
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.automatWindow = options.automatWindow;     
            this.basedata = options.basedata;
            this.id =  options.id;
            this.deviceIds = options.deviceIds;
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
            $("#last_step").val(locale.get({lang: "price_step"}));
            $("#saveBtn2").val(locale.get({lang: "save"}));
           
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
                        var id = data._id;
                        if(self.deviceIds && self.deviceIds.length > 0 && $.inArray(id,self.deviceIds) > -1){
                        	$(tr).find('a').click();
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
            var userline = $("#userline").multiselect("getChecked").map(function() {//线路 
                
                return this.value;
            }).get(); 
            
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }

            var siteName = null;
            var assetId = null;
            if (search) {
                if (search == 0) {
                    assetId = searchValue;
                } else if (search == 1) {
                    siteName = searchValue;//点位名称
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
                 self.lineIds = lineIds;
                 if(userline.length == 0){
                	 userline = lineIds;
                 }
                 self.searchData = {
                         "siteName": siteName,
                         "assetId": assetId,
                         "lineId": userline,
                         "online":"0",
                         "vender":self.vender
                  };
	             Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
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
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
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
            $("#last_step").bind("click", function() {
            	$("#devicelist").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
            });
            
            
            $("#saveBtn2").bind("click", function() {
            	 var basedata = self.basedata;
            	 var deviceIds = [];
            	 var idsArr = self.getSelectedResources();
            	 if (idsArr.length >0){
                 	for (var i = 0; i < idsArr.length; i++) {
                         var id = idsArr[i]._id;
                         deviceIds.push(id);
                     }
                 }
            	 basedata.deviceIds =deviceIds;
            	 if(self.id){
         			Service.updateAlarmReminder(self.id,basedata,function(data){
             			console.log(data);
             			self.automatWindow.destroy();
             			self.fire("rendTableData");
             		});
         		}else{
         			Service.addAlarmReminder(basedata,function(data){
             			console.log(data);
             			self.automatWindow.destroy();
             		    self.fire("rendTableData");
             		});
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