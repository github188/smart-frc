define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./addspecialoffer.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var DeviceListInfo = require("../config/deviceList");
    var columns = [{
        "title": locale.get({lang: "automat_no1"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_name"}),
        "dataIndex": "name",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "25%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "25%"
    }];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._renderWindow();
            this.basedata = {};
            this.deviceLists = [];
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "special_offer_config"}),
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
                        $("a").css("margin-top","-3px");
                        $("a").css("margin-right","0px");
                        $("a").css("margin-bottom","0px");
                        $("a").css("margin-left","6px");
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#nextBase").val(locale.get({lang: "next_step"}));
          //  this.renderDeviceTable();
            this.renderSelect();
            this._renderBtn();
        },
        renderSelect:function(){

            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#money").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: "优惠金额",
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 180,
                    height: 120
                });
            });
        	
        },
        renderDeviceTable:function(){
        	var self=this;
            this.listTable = new Table({
                selector: "#devicelist",
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
            this.loadTableData(1000, 0);
        }, 
        loadTableData: function(limit, cursor) {
            cloud.util.mask("#devicelist");
            var self = this;
           
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getLinesByUserId(userId,function(linedata){
            	  var lineIds=[];
                  if(linedata.result && linedata.result.length>0){
 	    			  for(var i=0;i<linedata.result.length;i++){
 	    				  lineIds.push(linedata.result[i]._id);
 	    			  }
                  }
                  if(roleType == 51){
		    			 lineIds = [];
                  }
                  if(roleType != 51 && lineIds.length == 0){
                	  lineIds = ["000000000000000000000000"];
                  }
                  if(linedata!=null){
                	  self.searchData = {
                            	//"online":"0",
                            	"lineId": lineIds
                        };
                  }else{
                	  self.searchData = {
                            	//"online":"0"
                        };
                  }
                  Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                      var total = data.result.length;
                      self.pageRecordTotal = total;
                      self.totalCount = data.result.length;
                      self.listTable.render(data.result);
                      cloud.util.unmask("#devicelist");
                  }, self);
            });
          
        },
        _renderBtn: function() {
        	var self = this;

        	$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                       // b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));        				
                    }
				});
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy-MM-dd")).datetimepicker({
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
                       // b.val(cloud.util.dateFormat(date, "yyyy/MM/dd"));
                    }
				});
        	});
        	
        	$("#specialtype").bind("change",function(){
        		if($(this).val() == 2){//立减
        			$("#amount").show();
        			$("#scale").hide();
        		}else if($(this).val() == 1){//折扣
        			$("#scale").show();
        			$("#amount").hide();
        		}
        	});
        	
        	$("#nextBase").unbind("click").bind("click", function() {
        		var specialname = $("#specialname").val();
        		var specialtype = $("#specialtype").val();
        		
        		var amount = $("#special_amount").val();
        		var scale = $("#special_scale").val();
        		
        		var startTime = (new Date($("#startTime").val() + " 00:00:00")).getTime() / 1000;
        		var endTime = (new Date($("#endTime").val() + " 23:59:59")).getTime() / 1000;
        		
        		var money = $("#money").multiselect("getChecked").map(function() {//支付方式
                    return this.value;
                }).get();
        		
        		if(money.length == 0){
        			dialog.render({text:"请选择优惠金额"});
           			return;
        		}
        		
        		if(specialname==null||specialname.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_special_name"});
           			return;
           		}
                
        		if(specialtype == 2 && (amount == null || amount.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_special_amount"});
           			return;
        		}
        		if(specialtype == 1 && (scale == null || scale.replace(/(^\s*)|(\s*$)/g,"")=="")){
        			dialog.render({lang:"please_enter_special_rate"});
           			return;
        		}
        		
        		var bool=/^[0-9]{0}([0-9]|[.])+$/;
        		if(specialtype==2&&(!bool.test(amount))){
        			dialog.render({lang:"amount_must_be_number"});
        			return;
        		}
        		var bool1=/^([1-9](.[0-9])?||10)$/;
        		if(specialtype==1&&(!bool1.test(scale))){
        			dialog.render({lang:"scale_must_be_number"});
        			return;
        		}
        		amount=parseFloat(amount);
        		
        		if (startTime>endTime) {
        			dialog.render({lang:"starttime_gt_endtime"});
           			return;
				}
        		var configArray = [];
        		
        		for(var i=0;i<money.length;i++){
        			var config = {};
        			config.money = money[i];
        			if(specialtype == 2){//立减
        				config.discount = amount;
            		}else if(specialtype == 1){//折扣
            			config.discount = scale;
            		}
        			configArray.push(config);
        		}
        		
                self.basedata={
                		name:specialname,
                		type:parseInt(specialtype),
                		startTime:startTime,
                		endTime:endTime,
                		config:configArray
                };
                
				$("#devicelist").css("display", "block");
                $("#selfConfig").css("display", "none");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                this.Devicelist = new DeviceListInfo({
                    selector: "#devicelistInfo",
                    automatWindow: self.adWindow,
                    basedata:self.basedata,
                    events: {
                        "rendTableData": function() {
                            self.fire("getSpecialList");
                        }
                    }
                });

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