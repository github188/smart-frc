define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./puton.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    	
    var columns = [{
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "deviceName",
        "cls": null,
        "width": "80%"
    }];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.adId = options.adId;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "immediate_upgrade"}),
                top: "center",
                left: "center",
                height: 440,
                width: 700,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nowBase").val(locale.get({lang: "immediate_upgrade"}));
            this._renderTable();
            this.renderDeviceList();
            this._renderBtn();
        },
        _renderBtn: function() {
        	var self = this;
        	$("#nowBase").bind("click", function() {
          	    Service.getGradeById(self.adId,function(data){
       		        var _id = data.result._id;
       		        var finalData = {
       		        		upgradeName:data.result.upgradeName,
            				upgradeType:data.result.upgradeType,
            				firmwareList:data.result.firmwareList,
            				appList:data.result.appList,
            				vmcList:data.result.vmcList,
            				deviceList:data.result.deviceList,
            				status:1   
             	    };
       		        Service.updateGrade(finalData,_id,function(data){
             			   self.fire("getAdvertiseList");
             			   self.adWindow.destroy();
             	    });
       	      });
        	});
        },
        _renderTable: function() {
        	var self=this;
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
        },
        renderDeviceList:function(){
        	var self =this;
            Service.getGradeById(self.adId,function(data){
        		 self.listTable.render(data.result.deviceList);
        	 });
        	
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});