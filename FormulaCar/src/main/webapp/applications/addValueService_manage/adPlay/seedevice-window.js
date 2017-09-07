define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seeDevice.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("./service");
    var adDetailcolumns= [  {
		"title":locale.get({lang:"automat_serial_number"}),
		"dataIndex" : "number",
		"cls" : null,
		"width" : "10%",

	},{
		"title":locale.get({lang:"advertise_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "50%",

	},{
		"title":locale.get({lang:"equipment_statistics"}),
		"dataIndex" : "status",
		"cls" : null,
		"width" : "40%",
		render:status
	}];
    function status(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "being_played"});
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.deviceId = options.deviceId;
            this.deviceIdArr = options.deviceIdArr;
            this.automatNo=options.automatNo;
            this._renderWindow();
            this.data = null;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title:locale.get({lang: "advertisment_info"})+" ["+locale.get({lang: "automat_no3"})+this.automatNo+"]",
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            $("#closeBase").val(locale.get({lang: "close"}));
            this.bindEvent();
            this.renderAdDetailList();
            this.loadDeviceData();

        },
        renderAdDetailList:function(){
       	 this.adDetaillistTable = new Table({
                selector: "#adDtaillist",
                columns: adDetailcolumns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                events: {
                    onRowClick: function(data) { 
                        this.adDetaillistTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.adDetaillistTable.selectRows(rows);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this; 
                    },
                    scope: this
                }
            });
       },
        bindEvent:function(){
        	var self = this;
        	 $("#closeBase").bind("click", function() {
        		 self.automatWindow.destroy();
             });
        },
        loadDeviceData: function() {
            var self = this;
            cloud.util.mask("#deviceForm");
            Service.getAutomatById(self.deviceId, function(data) {
                console.log(data);
                if(data.result.adFileList){
        			self.adDetaillistTable.render(data.result.adFileList);
        		}
                cloud.util.unmask("#deviceForm");
            }, self);
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