define(function(require) {
    require("cloud/base/cloud");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var Service = require("../service");
    var NoticeBar = require("./notice-bar");
    var rightList = require("../rightChart/list");
    
    var columns = [{
        "title": locale.get({lang: "network"}),
        "dataIndex": "online",
        "cls": null,
        "width": "16%",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({lang: "offline"});
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                            status: offlineStr
                        });
                        break;
                    case 0:
                        var onlineStr = locale.get({lang: "online"});
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                            status: onlineStr
                        });
                        break;
                    default:
                        break;
                }
                return display;
            } else {
                return data;
            }
        }
    }, {
        "title": locale.get({lang: "numbers"}),
        "dataIndex": "assetId",
        "cls": null,
        "width": "28%"
    }, {
        "title": locale.get({lang: "organization"}),
        "dataIndex": "siteName",
        "cls": null,
        "width": "28%"
    }, {
        "title": locale.get({lang: "automat_line"}),
        "dataIndex": "lineName",
        "cls": null,
        "width": "28%"
    }];
   
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "deviceVending_list_bar",
                    "class": null
                },
                table: {
                    id: "deviceVending_list_table",
                    "class": null
                },
                paging: {
                    id: "deviceVending_list_paging",
                    "class": null
                }
            };
            this._render();
        },
        _render: function() {
			$("#deviceVending_list_paging").css("width",$(".wrap").width()*0.25);
			$("#deviceVending_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
		    var listHeight = $("#deviceVending_list").height();
	        var barHeight = $("#deviceVending_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight;
		    $("#deviceVending_list_table").css("height",tableHeight);
		    
		    require(["cloud/base/fixTableHeaderV"], function(Account){
            	var height = $("#deviceVending_list_table").height()+"px";
      	        $("#deviceVending_list_table-table").freezeHeaderV({ 'height': height });
            });
		    
		    this._renderNoticeBar();
            this._renderTable();
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#deviceVending_list_bar",
                events: {
                    query: function() {
                    	self.loadTableData(30, 0, "");
                    },
                   
                }
            });
        },
       _renderTable: function() {
        	var self = this;
            this.listTable = new Table({
                selector: "#deviceVending_list_table",
                columns: columns,
                datas: [],
                pageSize: 30,
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
                        self.showStatistic(data.assetId);
                    },
                    onRowRendered: function(tr, data, index) {
                        if(index == 0){
                        	var assetId = data.assetId;
                            $(tr).addClass("cloud-table-shadow");
                            $(tr).css("border-bottom","2px solid #419277");
                            self.showStatistic(data.assetId);
                        }
                       
                    },
                    scope: this
                }
            });
           
            this.loadTableData(30, 0, "");
        },
        showStatistic: function(assetId){
        	var self = this;
        	//默认当天，以天查
        	var date = new Date();
        	date.setHours(0);
        	date.setMinutes(0);
        	date.setSeconds(0);
        	var startTime = Date.parse(date)/1000;
        	var endTime = new Date().setTime((startTime+24*60*60-1));
        	var options = {};
        	options.assetId = assetId;
        	options.type = 1;
        	options.startTime = startTime;
        	options.endTime = endTime;
        	options.offset = 0 - (date.getTimezoneOffset()*60*1000);
        	self._renderRight(options);
        },
        _renderRight: function(options){
        	this.rightList = new rightList({
                selector: "#shelf_right",
                defaultArgs: options
             });
        },
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#deviceVending_list_table");
	        var self = this;
            
	        var search = $("#search").val();
	        var searchValue = $("#searchValue").val();
	        if (searchValue) {
	           searchValue = self.stripscript(searchValue);
	        }
            
	        var siteName = null;
	        var assetId = null;
	        var lineId = "";
	        
	        if (search == 0) {
	               assetId = searchValue;
	        } else if (search == 1) {
	               siteName = searchValue;
	        }else if (search == 2) {
	        	   if($("#userline").attr("multiple") != undefined){
		            	lineId = $("#userline").multiselect("getChecked").map(function() {
		                      return this.value;
		                  }).get();
		           }
	        }
	        var shelf_manage_assetId = localStorage.getItem("shelf_manage_assetId");
            if(shelf_manage_assetId){
            	assetId = shelf_manage_assetId;
            }
	                  
	        var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	        var roleType = permission.getInfo().roleType;
	        Service.getAreaByUserId(userId,function(areadata){
	              var areaIds=[];
	              if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
	                  areaIds = areadata.result.area;
	              }
	              if(roleType == 51){
	                  areaIds = [];
	              }
	                      
	              if(roleType != 51 && areaIds.length == 0){
	                  areaIds = ["000000000000000000000000"];
	              }
	              cloud.Ajax.request({
	      	   	       url:"api/automatline/list",
	      			   type : "GET",
	      			   parameters : {
	      			       areaId: areaIds,
	      			       cursor:0,
	      			       limit:-1
	      	           },
	      			   success : function(linedata) {
	      				  var lineIds=[];
 			    		  if(linedata && linedata.result && linedata.result.length>0){
 			    			  for(var i=0;i<linedata.result.length;i++){
 			    				  lineIds.push(linedata.result[i]._id);
 			    			  }
 		                   }
 			    		  
 			    		  if(roleType == 51 ){
 			    			  lineIds = [];
 			              }
 			    		  if(lineId.length != 0){
 			    			  lineIds = lineId;
 			    		  }
 			    		  
 			    		  if(roleType != 51 && lineIds.length == 0){
 			    			   lineIds = ["000000000000000000000000"];
 			    		  }
 			                self.lineIds = lineIds;
	      			                
	      			         self.searchData = {
	      			                "siteName": siteName,
	      			                "assetId": assetId,
	      			                "lineId": lineIds
	      			         };
	      			            	 
	      			         Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
	      			                      var total = data.result.length;
	      			                      self.pageRecordTotal = total;
	      			                      self.totalCount = data.result.length;
	      			                     
	      			                      self.listTable.render(data.result);
	      			                      self._renderpage(data, 1);
	      			                      localStorage.setItem("shelf_manage_assetId","");
	      			                      cloud.util.unmask("#deviceVending_list_table");
	      			         }, self);  
	      			     }
	       			});
	           });

        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#deviceVending_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#deviceVending_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                        	
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#deviceVending_list_table");
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
            if($("#deviceVending_list_paging .paging-box")[0]){
			   var id = $("#deviceVending_list_paging .paging-box")[0].id;
			    $("#"+id).removeClass("paging-box");
			    $("#"+id).css("margin","0 auto");
			    $("#"+id).css("margin-top","3px");
			    $("#"+id).css("height","23px");
			    $("#"+id).css("margin-left","12%");
            }
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        }
    });
    return list;
});