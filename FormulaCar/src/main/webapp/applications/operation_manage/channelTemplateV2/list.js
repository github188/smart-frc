define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
    var Common = require("../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var NoticeBar = require("./notice-bar");
    var Service = require("./service");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var ManTemplate = require("./manage/manageTemplate-window");
    
    var columns = [{
            "title": locale.get({lang: "template_name"}), //模板名称
            "dataIndex": "name",
            "cls": null,
            "width": "20%"
        },{
            "title": locale.get({lang: "model_manufacturer"}), //厂家
            "dataIndex": "vender",
            "cls": null,
            "width": "20%",
            render:venderName
        },{
            "title": locale.get({lang: "device_shelf_type"}), //货柜类型
            "dataIndex": "machineType",
            "cls": null,
            "width": "20%",
            render: machineType
        },{
            "title": locale.get({lang: "purchase_model"}), //型号
            "dataIndex": "modelName",
            "cls": null,
            "width": "20%"
        }, {
            "title": locale.get({lang: "create_time"}), //创建时间
            "dataIndex": "createTime",
            "cls": null,
            "width": "20%",
            render: function(data, type, row) {
                return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
            }
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }];
    function machineType(value, type) {
        var display = "";
      //国外Beverage machine就相当于1，Snack machine机型相当于2
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
                case 4:
                    display = locale.get({lang: "coffee_machine"});
                    break;
                case 5:
                    display = locale.get({lang: "wine_machine"});
                    break;
/*                case 4:
                    display = "Beverage machine";
                    break;
                case 5:
                    display = "Snack machine";
                    break;*/
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
    function venderName(value, type) {
        var display = "";
        if ("display" == type) {       	
        	display = Common.getLangVender(value);
            return display;
        } else {
            return value;
        }
    }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "template_list_bar",
                    "class": null
                },
                table: {
                    id: "template_list_table",
                    "class": null
                },
                paging: {
                    id: "template_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
        	$("#template_list").css("width",$(".wrap").width());
			$("#template_list_paging").css("width",$(".wrap").width());
			
			$("#template_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#template_list").height();
		    var barHeight = $("#template_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#template_list_table").css("height",tableHeight);
			
		    
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
                selector: "#template_list_table",
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
            var height = $("#template_list_table").height()+"px";
	        $("#template_list_table-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(0, 30);
        },
        loadTableData: function(cursor,limit) {
            var self = this;
            cloud.util.mask("#template_list_table");

            var search = $("#search").val();
            var searchValue = $("#searchValue").val();

            if (search) {

            } else {
                search = 0;
            }
            if(search == 1){
            	searchValue = $('#vender option:selected').val();
            	if(searchValue == 0){
            		searchValue="";
            	}
            }else{
            	if (searchValue) {
                    searchValue = self.stripscript(searchValue);
                } 
            }
            
 
            
            Service.getAllTemplateList(cursor,limit,search,searchValue,function(data) {
                var total = data.result.length;
                self.pageRecordTotal = total;
                self.totalCount = data.result.length;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#template_list_table");
            }, self);
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#template_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#template_list_table");
                    	var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        if (search) {

                        } else {
                            search = 0;
                        }
                        if(search == 1){
                        	searchValue = $('#vender option:selected').val();
                        	if(searchValue == 0){
                        		searchValue="";
                        	}
                        }else{
                        	if (searchValue) {
                                searchValue = self.stripscript(searchValue);
                            } 
                        }
                    	
                        Service.getAllTemplateList(options.cursor,options.limit,search,searchValue, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#template_list_table");
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
                selector: "#template_list_bar",
                events: {
                	query: function(search, searchValue) {//查询
                        cloud.util.mask("#template_list_table");
                        var pageDisplay = self.display;
                        if (search) {

                        } else {
                            search = 0;
                        }
                        if(search == 1){
                        	searchValue = $('#vender option:selected').val();
                        	if(searchValue == 0){
                        		searchValue="";
                        	}
                        }else{
                        	if (searchValue) {
                                searchValue = self.stripscript(searchValue);
                            } 
                        }
                        Service.getAllTemplateList(0, 30, search, searchValue, function(data) {
                            var total = data.total;
                            
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#template_list_table");
                        });
                    },
                    add: function() {
                        if (this.addTemplate) {
                            this.addTemplate.destroy();
                        }
                        
                        this.addTemplate = new ManTemplate({
                            selector: "body",
                            events: {
                                "getTemplateList": function() {
                                    self.loadTableData(0, 30);
                                }
                            }
                        });
                    },
                    update: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.modifyTemplate) {
                                this.modifyTemplate.destroy();
                            }
                            Service.getTemplateInfoById(_id,function(data){
                            	this.modifyTemplate = new ManTemplate({
                                    selector: "body",
                                    templateId: data.result._id,
                                    data:data,
                                    events: {
                                        "getTemplateList": function() {
                                            self.loadTableData(0, 30);
                                        }
                                    }
                                });
                            });
                            
                        }
                    },
                    del: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
                                            for (var i = 0; i < selectedResouces.length; i++) {
                                                var _id = selectedResouces[i]._id;

                                                Service.deleteTemplateInfo(_id, function(data) {
                                                	self.loadTableData(0, 30);
                                                });
                                            }
                                            
                                            dialog.render({lang: "deletesuccessful"});
                                            dialog.close();
                                        }
                                    },
                                    {
                                        lang: "cancel",
                                        click: function() {
                                            dialog.close();
                                        }
                                    }]
                            });
                        }
                    }
                    
                }
            });
        },
        getSelectedResources: function() {
            var self = this;
            var selectedRes = $A();
            self.listTable && self.listTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});