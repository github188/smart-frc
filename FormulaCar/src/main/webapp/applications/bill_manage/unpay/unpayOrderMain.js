define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.dataTables");
    var Table = require("../../template/tableTemplate");
    var html = require("text!./unpayOrderMain.html");
    var statusMg = require("../../template/menu");
    var beforBillManage = require("./beforeList");
    var billManage = require("./list");
    var Service = require("./service");
    var operationMenu = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.service = options.service;
            this.element.html(html);
            this.elements = {
                conent_el: "content-operation-menu"
            };
            this._render();
            locale.render({element: this.element});

        },
        _render: function() {
        	$("#content-operation-menu").height($("#user-content").height()-18);
            this.renderContent();
            
        },
        renderContent: function() {
        	var organs_pay_Array = ["unpay_bill_manage"];
            
            if (this.proMg) {
                this.proMg.destroy();
            }
            this.proMg = new statusMg({
                "container": "#col_slide_main",
                "lis": organs_pay_Array,
                "events": {
                    click: function(id) {
                        $(".main_bd").empty();
                        
                        $("#user-content").scrollTop(0);
                        if (id == "unpay_bill_manage") {
                           
                            
                            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                            Service.getOrganizationById(oid,function(datas){
                            	var type = datas.result.payStyle;
                            	if(type == 1){//后付费
                            		 if (this.organ_statistics) {
                                         this.organ_statistics.destroy();
                                     }
                                     this.organ_statistics = new billManage({
                                         "container": ".main_bd"
                                     });
                            	}else if(type == 2){//预付费
                            		if (this.organ_statistics) {
                                        this.organ_statistics.destroy();
                                     }
                           		    this.organ_statistics = new beforBillManage({
                                       "container": ".main_bd"
                                    });
                            	}
                            });
                        }
                    }
                }
            });
            $("#unpay_bill_manage").click();
        }
    });
    return operationMenu;
});