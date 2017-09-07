define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./list.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var productMan = require("./manage/productManage-window");
    var ImportProduct = require("./importproduct-window");
    var IntroducedProduct = require("./introducedproduct-window");    
    var Service = require("../../service");
    var offproMan = require("./offShelf/productOff-window");
    require("cloud/base/fixTableHeader");
    var columns = [{
            "title": locale.get({lang: "product_name"}),
            "dataIndex": "name",
            "cls": null,
            "width": "15%"
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
            "width": "6%"
        }, {
            "title": locale.get({lang: "product_type"}),
            "dataIndex": "typeName",
            "cls": null,
            "width": "8%"
        }, {
            "title": locale.get({lang: "product_time"}),
            "dataIndex": "createTime",
            "cls": null,
            "width": "13%",
            render: dateConvertor
        }, {
            "title": locale.get({lang: "product_form_of_packing"}),
            "dataIndex": "packingForm",
            "cls": null,
            "width": "8%",
            render: packConvertor
        }, {
            "title": locale.get({lang: "product_specifications"}),
            "dataIndex": "everyRong",
            "cls": null,
            "width": "10%"
        },{
            "title": locale.get({lang: "product_manufacturer"}),
            "dataIndex": "manufacturer",
            "cls": null,
            "width": "15%"
        }
        /*,{
            "title": locale.get({lang: "replenishments"}),
            "dataIndex": "state",
            "cls": null,
            "width": "7%",
            render: stateConvertor
        }*/
        ,  {
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
    function stateConvertor(value, type){
    	var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({lang: "the_goods_shelves"});
                    break;
                case 1:
                    display = locale.get({lang: "off_the_shelf"});
                    break;
                default:
                    break;
            }
            return display;
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
                    id: "products_list_bar",
                    "class": null
                },
                table: {
                    id: "products_list_table",
                    "class": null
                },
                paging: {
                    id: "products_list_paging",
                    "class": null
                }
            };
           
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderTable();
            this._renderNoticeBar();
           // $("#button-24").css("margin-left","5px");
           // $("#button-25").css("margin-left","-4px");

        },
        _renderHtml: function() {
            this.element.html(html);
            $("#goods_list").css("width",$(".wrap").width());
			$("#products_list_paging").css("width",$(".wrap").width());
			
			$("#goods_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#goods_list").height();
		    var barHeight = $("#products_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#products_list_table").css("height",tableHeight);

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
                selector: "#products_list_table",
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
            var height = $("#products_list_table").height()+"px";
            $("#products_list_table-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
        },
        loadData: function() {
            cloud.util.mask("#products_list_table");
            var self = this;
            var pageDisplay = self.display;

            var type = $("#type").val();
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (type) {

            } else {
                type = 0;
            }
            if (search) {

            } else {
                search = 0;
            }
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            } 
            Service.getGoodsList(eurl,0, pageDisplay, type, search, searchValue, function(data) {
                var total = data.total;
                this.totalCount = data.result.length;
                data.total = total;
                self.listTable.render(data.result);
                self._renderpage(data, 1);
                cloud.util.unmask("#products_list_table");
            });
            /*Service.getGoodsInfo(0, pageDisplay,function(data) {
             var total = data.total;
             this.totalCount = data.result.length;
             data.total = total;
             self.listTable.render(data.result);
             self._renderpage(data, 1);
             cloud.util.unmask("#product_list_table");
             });*/

        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#products_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        /*Service.getGoodsInfo(options.cursor, options.limit,function(data){
                         callback(data);
                         });*/
                    	cloud.util.mask("#products_list_table");
                        var type = $("#type").val();
                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        if (type) {

                        } else {
                            type = 0;
                        }
                        if (search) {

                        } else {
                            search = 0;
                        }
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }
                        Service.getGoodsList(eurl,options.cursor, options.limit, type, search, searchValue, function(data) {
                            callback(data);
                            cloud.util.unmask("#products_list_table");
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
                selector: "#products_list_bar",
                events: {
                    query: function(type, search, searchValue) {//查询
                        cloud.util.mask("#products_list_table");
                        var pageDisplay = self.display;
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }                       
                        Service.getGoodsList(eurl,0, pageDisplay, type, search, searchValue, function(data) {
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#products_list_table");
                        });
                    },
                    add: function() {//添加
                        if (this.addPro) {
                            this.addPro.destroy();
                        }
                        this.addPro = new productMan({
                            selector: "body",
                            events: {
                                "getGoodsList": function() {
                                    self.loadData();
                                }
                            }
                        });
                    },
                    offShelf: function() {//下架
                    	 var selectedResouces = self.getSelectedResources();
                         if (selectedResouces.length === 0) {
                             dialog.render({lang: "please_select_at_least_one_config_item"});
                         } else if (selectedResouces.length >= 2) {
                             dialog.render({lang: "select_one_gateway"});
                         } else {
                        	 var _id = selectedResouces[0]._id;
                        	 var name =  selectedResouces[0].name;
                             if (this.offPro) {
                                 this.offPro.destroy();
                             }
                             this.offPro = new offproMan({
                                 selector: "body",
                                 goodId: _id,
                                 name:name,
                                 events: {
                                     "getGoodsList": function() {
                                         self.loadData();
                                     }
                                 }
                             });
                         }
                    },
                    modify: function() {//修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.modifyPro) {
                                this.modifyPro.destroy();
                            }
                            this.modifyPro = new productMan({
                                selector: "body",
                                goodId: _id,
                                events: {
                                    "getGoodsList": function() {
                                        self.loadData();
                                    }
                                }
                            });
                        }
                    },
                    drop: function() {//删除
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

                                                Service.deleteGoods(eurl,_id, function(data) {
                                                	
                                                	if(data.error!=null){
                         	 	                	   if(data.error_code == "70035"){
                         								   dialog.render({lang:"goods_already_used"});
                         								   return;
                         							   }
                         	 	                	}else{
                         	 	                		self.loadData();
                                                    	dialog.render({lang: "deletesuccessful"});
                         							}
                                                	
                                                });
                                            }
                                            
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
                    },
                    exReport: function() {
                        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "goodsReport.xlsx";

                        var type = $("#type").val();
                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        var number = '';
                        var name = '';
                        var manufacturer = '';

                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }
                        if (search == 0) {
                            number = searchValue;
                        } else if (search == 1) {
                            name = searchValue;
                        } else if (search == 2) {
                            manufacturer = searchValue;
                        }

                        if (type == 0) {
                            type = '';
                        }
                        
                        var now = Date.parse(new Date())/1000;
                        var path = "/home/goods/"+now+"/"+reportName;
                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
                        
                        Service.createGoodsExcel(eurl,now,name,number,manufacturer,type,language, reportName,function(data){
                        	
                        	if(data){
                        		
                        		var len = $("#pro-search-bar").find("a").length;
                        		var id = $("#pro-search-bar").find("a").eq(len-3).attr("id");
                        		$("#"+id).html("");
                        		if(document.getElementById("bexport")!=undefined){
                        			$("#bexport").show();
                        		}else{
                        			$("#"+id).after("<span style='margin-left:6px;' id='bexport'>"+locale.get({lang:"being_export"})+"</span>");
                        		}
                        		$("#"+id).hide();
                        		
                        		var timer = setInterval(function(){
                                	
                                	Service.findGoodsExcel(eurl,now,"goods.txt",function(data){
                                	
                                		if(data.onlyResultDTO.result.res == "ok"){
                                			
                                			cloud.util.ensureToken(function() {
					                            window.open(url, "_self");
					                        });
                                			clearInterval(timer);
                                			$("#"+id).html("");
                                			if($("#bexport")){
                                				$("#bexport").hide();
                                			}
                                    		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>"+locale.get({lang: "goods_export_excel"})+"</span>");
                                    		$("#"+id).show();
                                		}
                                	})
        					               
        				            
        							
        						},5000);
                        	}
                        	
                        });
                    },
                    imReport: function() {
                        if (this.imPro) {
                            this.imPro.destroy();
                        }
                        this.imPro = new ImportProduct({
                            selector: "body",
                            events: {
                                "getGoodsList": function() {
                                    self.loadData();
                                }
                            }
                        });
                    },
                    exReportXML: function() {
                        Service.getUserMessage(function(data) {
                            if (data.result) {
                                var oid = data.result.oid;//机构ID
                                
                                var language = locale._getStorageLang() === "en" ? 1 : 2;
                                var host = cloud.config.FILE_SERVER_URL;
                                var reportName = "smartVendingGoods.zip";

                                var type = $("#type").val();
                                var search = $("#search").val();
                                var searchValue = $("#searchValue").val();
                                var number = '';
                                var name = '';
                                var manufacturer = '';

                                if (searchValue) {
                                    searchValue = self.stripscript(searchValue);
                                }
                                if (search == 0) {
                                    number = searchValue;
                                } else if (search == 1) {
                                    name = searchValue;
                                } else if (search == 2) {
                                    manufacturer = searchValue;
                                }

                                if (type == 0) {
                                    type = '';
                                }
                                
                                var now = Date.parse(new Date())/1000;
                                var path = "/usr/share/nginx/html/"+now+"/"+reportName;
                                var url = host + "/"+eurl+"/goodsxml/getGoodsXML?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
                                
                                Service.createGoodsXml(eurl,oid,now,name,number,manufacturer,type,language, reportName,function(data){
                                	
                                	if(data){
                                		
                                		var len = $("#pro-search-bar").find("a").length;
                                		var id = $("#pro-search-bar").find("a").eq(len-2).attr("id");
                                		$("#"+id).html("");
                                		if(document.getElementById("bexport")!=undefined){
                                			$("#bexport").show();
                                		}else{
                                			$("#"+id).after("<span style='margin-left:6px;' id='bexport'>"+locale.get({lang:"being_export"})+"</span>");
                                		}
                                		$("#"+id).hide();
                                		
                                		var timer = setInterval(function(){
                                        	
                                        	Service.findGoodsXml(eurl,now,"goodsxml.txt",function(data){
                                        	
                                        		if(data.onlyResultDTO.result.res == "ok"){
                                        			
                                        			cloud.util.ensureToken(function() {
        					                            window.open(url, "_self");
        					                        });
                                        			clearInterval(timer);
                                        			$("#"+id).html("");
                                        			if($("#bexport")){
                                        				$("#bexport").hide();
                                        			}
                                            		$("#"+id).append("<span class='cloud-button-item cloud-button-text'>"+locale.get({lang: "goods_export_xml"})+"</span>");
                                            		$("#"+id).show();
                                        		}
                                        	})
                					               
                				            
                							
                						},5000);
                                	}
                                	
                                });
                            }
                        });

                    },
                    introduced:function(){
                        if (this.introPro) {
                            this.introPro.destroy();
                        }
                        this.introPro = new IntroducedProduct({
                            selector: "body",
                            events: {
                                "getGoodsList": function() { 
                                    self.loadData();
                                }
                            }
                        });
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