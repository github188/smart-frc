define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var wechatConfig = require("../payStyle/wechat_pay/configuration");
    var alipayConfig = require("../payStyle/ali_pay/configuration");
    var bestConfig = require("../payStyle/best_pay/configuration");
    var jdConfig = require("../payStyle/jd_pay/configuration");
    var columns = [ {
        "title": "支付方式",
        "dataIndex": "payStyle",
        "cls": null,
        "width": "100%"
    }];
   
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.data = options.data;
			this.smartData = options.smartData;
            this.automatWindow = options.automatWindow;
            this.element.html(html);
            this.elements = {
                table: {
                    id: "pay_list_table",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
			$("#pay_list_table").css("height","450px");
            this._renderTable();
        },
        _renderTable:function(){
        	var self = this;
            this.listTable = new Table({
                selector: "#pay_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "none",
                events: {
                    onRowClick: function(data) { 
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        
                        $("tr").css("border-bottom","0px");
                        $(".cloud-table-shadow").css("border-bottom","2px solid #419277");
                        $("#shelf_right").html("");
                        
                        if(data.payStyle == "微信"){
                        	cloud.payStyle = "wechat";
                        	this.payTable = new wechatConfig({
                                selector: "#shelf_right",
                                data:self.data,
       	                        smartData:self.smartData,
                                automatWindow:self.automatWindow
                            });
                        }else if(data.payStyle == "支付宝"){
                        	cloud.payStyle = "alipay";
                        	this.payTable = new alipayConfig({
                                selector: "#shelf_right",
                                data:self.data,
       	                        smartData:self.smartData,
                                automatWindow:self.automatWindow
                            });
                        }else if(data.payStyle == "翼支付"){
                        	cloud.payStyle = "best";
                        	this.payTable = new bestConfig({
                                selector: "#shelf_right",
                                data:self.data,
       	                        smartData:self.smartData,
                                automatWindow:self.automatWindow
                            });
                        }else if(data.payStyle == "京东支付"){
                        	cloud.payStyle = "jd";
                        	this.payTable = new jdConfig({
                                selector: "#shelf_right",
                                data:self.data,
       	                        smartData:self.smartData,
                                automatWindow:self.automatWindow
                            });
                        }
                        
                    },
                    onRowRendered: function(tr, data, index) {
                    	if(index == 0){
                    		 $("#shelf_right").html("");
                    		 cloud.payStyle = "wechat";
                    		 this.payTable = new wechatConfig({
                                 selector: "#shelf_right",
                                 automatWindow:self.automatWindow,
                                 data:self.data,
        	                     smartData:self.smartData
                             });
                    		 $(tr).addClass("cloud-table-shadow");
                             $(tr).css("border-bottom","2px solid #419277");
                    	}
                    },
                    scope: this
                }
            });
            var data=[
                      {"payStyle":"微信"},
                      {"payStyle":"支付宝"},
                      {"payStyle":"翼支付"},
                      {"payStyle":"京东支付"}
            ];
            this.listTable.render(data);
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