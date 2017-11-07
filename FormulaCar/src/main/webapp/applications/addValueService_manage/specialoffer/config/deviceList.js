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
        "title": "店面编号",
        "dataIndex": "siteNum",
        "cls": null,
        "width": "33%"
    }, {
        "title": "店面名称",
        "dataIndex": "name",
        "cls": null,
        "width": "33%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "dealerName",
        "cls": null,
        "width": "33%"
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
            $("#device_save").val(locale.get({lang: "special_save"}));
           
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
             
                        if(self.specialData != null && self.specialData.siteNum != null){
                        	var lists = self.specialData.siteNum;
                        	if(lists.length>0){
                        		for(var i=0;i<lists.length;i++){
                        			var siteNum = lists[i];
                        			if(data.siteNum == siteNum){
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
            var name = null;
            var number = null;
            if (search) {
                if (search == 1) {//店面编号
                	number = automatValue;
                } else if (search == 0) {
                    name = automatValue;//店面名称
                }
            }
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            
            self.searchData = {
                "number": number,
                "name":name
           };  
           if(self.specialData != null){
        	    self.searchData.id = self.specialData._id;
           }
           Service.getAllSitesByPage(self.searchData, limit, cursor, function(data) {
               var total = data.result.length;
               self.pageRecordTotal = total;
               self.totalCount = data.result.length;
               self.listTable.render(data.result);
               self._renderpage(data, 1);
               cloud.util.unmask("#device_list_table1");
           }, self);
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
                        Service.getAllSitesByPage(self.searchData, options.limit, options.cursor, function(data) {
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
                $("#baseInfo").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
            });
            
            
            $("#device_save").bind("click", function() {
                var siteArr = self.getSelectedResources();
                if (siteArr.length == 0) {
                     dialog.render({lang: "please_select_at_least_one_config_item"});
                     return;
                }

             	var siteNums = [];
             	for(var j=0;j<siteArr.length;j++){
             		var site = siteArr[j];
             		siteNums.push(site.siteNum);
             		
             	}
             	self.basedata.siteNum = siteNums;
             	if(self.specialData != null){
            		Service.updateSpecialOffer(self.basedata, self.specialData._id,function(data) {
                        
            			if(data.error_code && data.error_code == 70002){
            				dialog.render({lang:"special_name_exists"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
            			
                    });
            		
            	}else{
            		Service.addSpecialOffer(self.basedata, function(data) {
            			if(data.error_code && data.error_code == 70002){
            				dialog.render({lang:"special_name_exists"});
							return;
            			}else{
            				self.automatWindow.destroy();
                            self.fire("rendTableData");
            			}
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