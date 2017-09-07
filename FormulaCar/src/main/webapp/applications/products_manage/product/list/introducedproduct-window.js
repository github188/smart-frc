define(function(require) {
    var cloud = require("cloud/base/cloud");
    var winHtml = require("text!./introducedproduct-window.html");
    require("cloud/lib/plugin/jquery-ui");
    var _Window = require("cloud/components/window");
    var NoticeBar = require("./win-notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator"); 
    var Service = require("../../service");
    var columns = [{
            "title": locale.get({lang: "imageGridTitle"}),
            "dataIndex": "imagepath",
            "cls": null,
            "width": "10%",
            render:function(data, type, row){
   			    var productsImage = locale.get({lang:"products"});
   			    var  display = "";
   			    if(data){
   			    	var src = cloud.config.FILE_SERVER_URL + "/gapi/file/" +data + "?access_token=" + cloud.Ajax.getAccessToken();
   	                display += new Template(
   	                    "<img src='"+src+"' style='width: 20px;height: 60px;'/>")
   	                    .evaluate({
   	                        status : productsImage
   	                    });
   			    }
                return display;
            }
        },{
            "title": locale.get({lang: "product_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "12%"
        },{
            "title": locale.get({lang: "product_full_name"}),
            "dataIndex": "fullName",
            "cls": null,
            "width": "15%"
        }, {
            "title": locale.get({lang: "product_number"}),
            "dataIndex": "number",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "product_retail_price"}),
            "dataIndex": "price",
            "cls": null,
            "width": "8%"
        }, {
            "title": locale.get({lang: "product_type"}),
            "dataIndex": "typeName",
            "cls": null,
            "width": "10%"
        }, {
            "title": locale.get({lang: "product_time"}),
            "dataIndex": "createTime",
            "cls": null,
            "width": "15%",
            render: dateConvertor
        }, {
            "title": locale.get({lang: "product_form_of_packing"}),
            "dataIndex": "packingForm",
            "cls": null,
            "width": "10%",
            render: packConvertor
        }, {
            "title": locale.get({lang: "product_manufacturer"}),
            "dataIndex": "manufacturer",
            "cls": null,
            "width": "10%"
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }];
    
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	
    	eurl = "gapi";
    	
    }else{
    	
    	eurl = "api";
    }
    function dateConvertor(value, type) {
        if (type === "display") {
            return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
        } else {
            return value;
        }
    }
    function packConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({lang: "bottled"});
                    break;
                case 1:
                    display = locale.get({lang: "canning"});
                    break;
                case 2:
                    display = locale.get({lang: "in_bags"});
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "product_win_list_bar",
                    "class": null
                },
                table: {
                    id: "product_win_list_table",
                    "class": null
                },
                paging: {
                    id: "product_win_list_paging",
                    "class": null
                }
            };
            this._renderWindow();
            locale.render({element:this.element});
          
        },
        _renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"introduced"}),
				top: "center",
				left: "center",
				height:600,
				width: 920,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			 this.window.show();	
			this.render();
		
		},        
        render: function() {
             
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
            var self = this;
            this.listTable = new Table({
                selector: "#"+self.elements.table.id,
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

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
        },
        getQueryData: function(){
            var self = this;
            var type = $("#type","#win-search-bar").val();
            var search = $("#search","#win-search-bar").val();
            var searchValue = $("#searchValue","#win-search-bar").val();
            var number = "";
            var name = "";
            var manufacturer = "";
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }
            
            if (search == 0) {
                number = searchValue;
            } else if (search == 1) {
                name = searchValue;
            } else if (search == 2) {
                manufacturer = searchValue
            }
            var searchData = {
                "number": number,
                "name": name,
                "manufacturer": manufacturer 
            };
            if (!type) {
                type = "";
            }else{
                searchData.type=type;
            }
            return searchData;
        },
        loadData: function() {
            
            var self = this;
            cloud.util.mask("#"+self.elements.table.id);
            var pageDisplay = self.display;

            var searchData = self.getQueryData();
            Service.getAdminGoodsList(searchData,0, pageDisplay, function(data) {
                var total = data.total;
                this.totalCount = data.result.length;
                data.total = total;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#"+self.elements.table.id);
            },self); 
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: "#"+self.elements.paging.id,
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        var searchData = self.getQueryData();
                        Service.getAdminGoodsList(searchData,options.cursor, options.limit, function(data) {
                            callback(data);
                        },self);

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
                selector: "#"+self.elements.bar.id,
                events: {
                    query: function() {//查询
                        cloud.util.mask("#"+self.elements.table.id);
                        var pageDisplay = self.display;
                        var searchData = self.getQueryData();
                        Service.getAdminGoodsList(searchData,0, pageDisplay,function(data) {
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#"+self.elements.table.id);
                        },self);
                    },
                     
                    introduced: function() {//引入
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else {
                            dialog.render({
                                lang: "affirm_introduced",
                                buttons: [{
                                        lang: "affirm",
                                        click: function() {
//                                            Service.getAdminToken(function(data){ 
//                                                var adminToken = data.access_token;
                                                for (var i = 0; i < selectedResouces.length; i++) {
                                                    var _id = selectedResouces[i]._id; 
                                                    Service.introducedGoods(eurl,_id,"", function(data) {
                                                        
                                                    },self);
                                                } 
                                                dialog.render({lang: "introducedsuccessful"}); 
                                                dialog.close();
                                                self.fire("getGoodsList"); 
                                                self.window.destroy();
//                                            }); 
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