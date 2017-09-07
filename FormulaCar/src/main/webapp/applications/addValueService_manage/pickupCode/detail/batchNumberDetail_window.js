define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./batchNumberDetail.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var Service=require("../service");
    var codeTable=require("./list");
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.batchNumber = options.batchNumber;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.codewindow = new _Window({
                container: "body",
                title: locale.get({lang: "pickup_code_management"}),
                top: "center",
                left: "center",
                height: 450,
                width: 800,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.codewindow.destroy();
                        cloud.util.unmask();
                        self.listTable.loadTableData();
                    },
                    scope: this
                }
            });
            this.codewindow.show();
            this.render();
        },
        render:function(){
        	 this. _renderTable();
        },
        _renderTable : function() {
        	var self= this;
			this.listTable = new codeTable({
				selector : "#codeDetail",
				batchNumber : self.batchNumber
				
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