define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./seespecial.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var columns = [{
        "title": "店面编号",
        "dataIndex": "siteNum",
        "cls": null,
        "width": "20%"
    }, {
        "title": "店面名称",
        "dataIndex": "siteName",
        "cls": null,
        "width": "20%"
    }, {
        "title": "经销商",
        "dataIndex": "dealerName",
        "cls": null,
        "width": "20%"
    },{
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.specialId = options.specialId;
            this.specialName = options.specialName;
            this._renderWindow();
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: this.specialName,
                top: "center",
                left: "center",
                height: 650,
                width: 1000,
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
            this.renderData();
            this.renderDeviceList();
        },
        renderData:function(){
        	var self = this;
        	Service.getSpecialOfferById(self.specialId,function(data){
        		self.specialData = data.result;
        		$("#specialname").val(data.result.name);
        		$("#specialtype").val(data.result.type);
        		if(data.result.type == 2){//立减
        			$("#special_amount").val(data.result.specialConfig[0].discount);
        			$("#amount").show();
        		}else if(data.result.type == 1){//折扣
        			$("#special_scale").val(data.result.specialConfig[0].discount);
        			$("#scale").show();
        		}
        		
				$("#startTime").val(cloud.util.dateFormat(new Date(data.result.startTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                        
                        
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date(data.result.endTime),"yyyy-MM-dd")).datetimepicker({
					format:'Y-m-d',
					step:1,
					startDate:'-1970-01-08',
					lang:locale.current() === 1 ? "en" : "ch",
					timepicker: false,
					onShow: function() {
                        $(".xdsoft_calendar").show();
                    },
                    onChangeMonth: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                        b.val(cloud.util.dateFormat(date, "yyyy-MM-dd"));
                    },
                    onClose: function(a, b) {
                        var date = new Date(new Date(a).getTime() / 1000);
                    }
				});  
				
				var specialConfigText="";
				var specialConfig = data.result.specialConfig;
				if(specialConfig != null && specialConfig.length>0){
					for (var i = 0; i < specialConfig.length; i++) {
						specialConfigText = specialConfigText +" "+specialConfig[i].money;
                    }
				}
				$("#specialConfig").val(specialConfigText);
				
				var siteList=[];
	        	if(data.result.siteNum && data.result.siteNum.length>0){
	        		for(var i=0;i<data.result.siteNum.length;i++){
	        			var siteObj={};
	        			siteObj.siteNum = data.result.siteNum[i];
	        			siteObj.siteName = "";
	        			siteObj.dealerName = "";
	        			siteList.push(siteObj);
	        		}
	        	}
	        	if(siteList.length>0){
	        		self.searchData = {
                          	"siteNums":data.result.siteNum
                    };   
	        		cloud.util.mask("#deviceInfo");
	        		Service.getAllAutomatsByPage(self.searchData, -1, 0, function(data_device) {
	        			 
	        			if(data_device.result && data_device.result.length>0){
	        				for(var i=0;i<siteList.length;i++){
                      		  for(var j=0;j<data_device.result.length;j++){
                      			if(siteList[i].siteNum == data_device.result[j].siteNum){
                      				siteList[i].siteName = data_device.result[j].name;
                      				siteList[i].dealerName = data_device.result[j].dealerName;
                      			}
                      		  }
	        				}
	        			}
	        			self.DeviceListTable.render(siteList);
	        			cloud.util.unmask("#deviceInfo");
	        		});
	        	}
	        	
        	},self);
        },
        renderDeviceList:function(){
       	 this.DeviceListTable = new Table({
                selector: "#deviceInfo",
                columns: columns,
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