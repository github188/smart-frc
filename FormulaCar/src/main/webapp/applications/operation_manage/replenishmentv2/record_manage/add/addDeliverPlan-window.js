define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var winHtml = require("text!./addDeliverPlan.html");
	var _Window = require("cloud/components/window");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Service = require("../service");
	require("../config/css/common.css");

	var SalesInfo = require("../config/saleList");
	
	var deviceColumns = [{
		"title":locale.get({lang:"automat_no1"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"automat_container_quantity"}),//货柜数
		"dataIndex" : "cidSales",
		"cls" : null,
		"width" : "20%",
         render:function(data, type, row){
			
			if(data != null){
				return data.length;
			}else{
				return 0;
			}

		}
		
	},{
		"title":locale.get({lang:"site_name"}),//点位
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"line_man_name"}),//线路
		"dataIndex" : "lineName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"automat_replenishment_detail"}),//库存状态
		"dataIndex" : "stockRate",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"shelf_sold_status"}),//售空状态
		"dataIndex" : "soldoutCount",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			
			if(data != "0" && data != 0){
				return locale.get({lang:"shelf_status_1"})+"("+data+locale.get({lang:"shelf_num"})+")";
			}else{
				return locale.get({lang:"shelf_status_0"});
			}

		}
	},{
		"title" : "",
		"dataIndex" : "id",
		"cls" : "_id" + " " + "hide"
	} ];
	function statusConvertor(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"shelf_status_1"});
					break;
				case "0":
					display = locale.get({lang:"shelf_status_0"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	function priceConvertor(value,type){
		return value/100;
	}
	function machineType(value, type) {
        var display = "";
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
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	function recordType(value,type){
		var display = "";
		if("display"==	type){
			switch (value) {
				case "1":
					display = locale.get({lang:"report_of_the_vending_machine"});
					break;
				case "2":
					display = locale.get({lang:"manual_introduction"});
					break;
				default:
					break;
			}
			return display;
		}else{
			return value;
		}
	}
	var updateWindow = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.lineId = options.lineId;
			this.lineName = options.lineName;
			this.display = 30;
			this.pageDisplay = 30;
			
			this.recordId = null;
			this.elements = {

				table : {
					id : "device_list_table",
					"class" : null
				},
				paging : {
					id : "device_list_paging",
					"class" : null
				}
			};
			this._renderWindow();
			//locale.render({element:this.element});
			//$("#device_list_paging").css("width",$("#device_list_table").width());
		},
		_renderWindow:function(){
			
			var self = this; 
			var title = self.lineName;
			var str = "";
			
			if(title != null && title.length>0){
				for(var n=0;n<title.length;n++){
					if(n != title.length-1){
						str += title[n] +",";
					}else{
						str += title[n];
					}
					
				}
				
			}
			this.window = new _Window({
				container: "body",
				title: str,
				top: "center",
				left: "center",
				height:550,
				width: 1000,
				mask: true,
				drag:true,
				content:winHtml,
				events: {
					"onClose": function() {
						this.window.destroy();
						cloud.util.unmask();
					},
					scope: this
				}
			});

			this.window.show();	
			this._renderForm();
			this.renderTable();
			this._renderBtn();
			locale.render({element: this.element});
		},
		_renderForm:function(){		
			var self = this;

		    
		},
        _renderBtn: function() {
        	var self = this;
        	$("#nextBase").bind("click", function() {
        		
        		var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                var userName = cloud.storage.sessionStorage("accountInfo").split(",")[5].split(":")[1];
                var email = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];
                var executivePersonId = userId;
        		var executivePersonEmail = email;
        		var executivePersonName = userName;
                
        		var assets = self.getSelectedResources();

        		var lineReplenish = [];
        		var tempA = [];
                var assetIds = [];
            	if (assets.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	
                	for(var i=0;i<assets.length;i++){
                		console.log(assets[i]);
                		var lineObj = {};
                		var lineId = assets[i].lineId;
                		var lineName = assets[i].lineName;
                		var assetId = assets[i].assetId;
                		var index = tempA.indexOf(lineId);
                		if(index > -1){
                			lineReplenish[index].assetIds.push(assetId);
                		}else{
                			var assetIds = [];
                			assetIds.push(assetId);
                			lineObj.lineId = lineId;
                			lineObj.lineName = lineName;
                			lineObj.assetIds = assetIds;
                			lineReplenish.push(lineObj);
                			tempA.push(lineId);
                		}
                		
                		//assetIds.push(assets[i].assetId);
                		
                	}
                	
                }
            	
            	self.basedata = {
            			createPersonId:userId,
                		createPerson:userName,
                	    cpemail:email,
            			executivePersonId:executivePersonId,
                		executivePerson:executivePersonName,
                		epemail:executivePersonEmail,
                		lineNames:self.lineName,
                		lineReplenish:lineReplenish
            			
            	}
            	
                self.assetIds = assetIds;

				$("#salelist").css("display", "block");

                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
                this.Sales = new SalesInfo({
                    selector: "#salelistInfo",
                    automatWindow: self.window,
                    basedata:self.basedata,
                    lines:self.line,
                    lineName:self.lineName,
                    assetIds:self.assetIds,
                    lineReplenish:lineReplenish,
                    events: {
                        "getplanList": function() {
                            self.fire("getplanList");
                        }
                    }
                });

        	});
        },
		renderTable:function() {
			var self = this;
			this.listTable = new Table({
				selector : "#device_list_table",
				columns : deviceColumns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					   onRowClick: function(data) {
						 
						 
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        
	                        if(index == 0 ){
	                        	//$(tr).css("background-color","rgb(204, 238, 193)");
	                        	$(tr).addClass("cloud-table-shadow");
	                        }
	                        var c = $(tr).find("td").eq(6).text();
	                        if(c == locale.get({lang: "device_normal"})){
	                        	$(tr).find("td").eq(6).css("color","#458B00");
	                        }else if(c != locale.get({lang: "automat_unknown"})){
	                        	$(tr).find("td").eq(6).css("color","red");
	                        	//$(tr).find("td").eq(3).css("color","red");
	                        }
	                        
	                        if(data.stockRate != "" && data.valve == 1){
	                        	$(tr).find("td").eq(5).css("color","red");
	                        }
	                        
	                    },
	                   scope: this
				}
			});
			var height = $("#device_list_table").height()+"px";
	        $("#device_list_table-table").freezeHeader({ 'height': height });
			//this.renderShelfTable();
	        $("#nextBase").val(locale.get({lang: "next_step"}));
	        
	        this.loadData(30,0);
		},
		loadData:function(limit,cursor){
			var self = this;
			cloud.util.mask("#device_list_table");
			self.searchData = {
					"lineId":self.lineId,
       				"type":"0"
			}
			Service.getAllDeviceReplenishmentV3(self.searchData,limit,cursor,function(data){
				 
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
     		     self.listTable.render(data.result);
     		         		     
	        	 self._renderpage(data, 1);

	        	 cloud.util.unmask("#device_list_table");
			 }, self);
		},
	    _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
       			selector : $("#device_list_paging"),
       			data:data,
   				current:1,
   				total:data.total,
   				limit:this.pageDisplay,
       			requestData:function(options,callback){
       				cloud.util.mask("#device_list_table");
       				Service.getAllDeviceReplenishmentV3(self.searchData, options.limit,options.cursor,function(data){
         				   self.pageRecordTotal = data.total - data.cursor;
 						   callback(data);
 						 cloud.util.unmask("#device_list_table");
         				});
       			},
       			turn:function(data, nowPage){
       			    self.totalCount = data.result.length;
       			    self.listTable.clearTableData();
       			    self.listTable.render(data.result);
       				self.nowPage = parseInt(nowPage);
       			},
       			events : {
       			    "displayChanged" : function(display){
       			        self.display = parseInt(display);
       			    }
       			}
       		});
       		this.nowPage = start;
       	}
       }, 
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		},
		getSelectedResources: function() {
        	var self = this;
        	var rows = self.listTable.getSelectedRows();
        	var selectedRes = new Array();
        	rows.each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return updateWindow;
});