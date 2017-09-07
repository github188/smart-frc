define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var SeeDevice = require("./seedevice-window");
	var columns = [ {
		"title":locale.get({lang:"network"}),//网络
		"dataIndex" : "online",
		"cls" : null,
		"width" : "10%",
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
	},{
		"title":locale.get({lang:"numbers"}),//编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "20%"
	}, {
        "title": locale.get({lang: "line_man_name"}),//线路
        "dataIndex": "lineName",
        "cls": null,
        "width": "20%"
    }, {
        "title": locale.get({lang: "automat_site_name"}),//点位
        "dataIndex": "siteName",
        "cls": null,
        "width": "20%"
    }, {
    	 "title": locale.get({lang: "in_a_broadcast_advertisement"}),//在播广告
         "dataIndex": "adFiles",
         "cls": null,
         "width": "30%"
    }];
	
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "ad_device_list_bar",
					"class" : null
				},
				table : {
					id : "ad_device_list_table",
					"class" : null
				},
				paging : {
					id : "ad_device_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#ad_device_list").css("width",$(".wrap").width());
			$("#ad_device_list_paging").css("width",$(".wrap").width());
			
			$("#ad_device_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#ad_device_list").height();
		    var barHeight = $("#ad_device_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#ad_device_list_table").css("height",tableHeight);
			this._renderTable();
			this._renderNoticeBar();

		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#ad_device_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
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
			var height = $("#ad_device_list_table").height()+"px";
	        $("#ad_device_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			    cloud.util.mask("#ad_device_list_table");
        	    var self = this;
                var online = $("#online").val();
                if (online) {
                   if (online == -1) {//0 在线 1离线
                      online = '';
                  }
                } else {
                     //查所有
                }
                 var areaId = "";
                 var lineId = "";
            
                 if($("#userarea").attr("multiple") != undefined){
            	     areaId = $("#userarea").multiselect("getChecked").map(function() {//
	                     return this.value;
	                 }).get();
            	    lineId = $("#userline").multiselect("getChecked").map(function() {//
                         return this.value;
                    }).get();
                  }
                  var lineFlag = 1;
                  if(areaId.length != 0){
                  	if($("#userline").find("option").length <=0){
                      	lineFlag = 0;
                      }
                  }
                  var search = $("#search").val();
                  var searchValue = $("#searchValue").val();
                  if (searchValue) {
                      searchValue = self.stripscript(searchValue);
                  }
                  var siteName = null;
                  var assetId = null;
                  var name = null;
                  if (search) {
                      if (search == 0) {
                          assetId = $("#searchValue").val();
                      } else if (search == 1) {
                          siteName = searchValue;//点位名称
                      }else if (search == 2) {
                          name = searchValue;//售货机名称
                      }
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
                      if(areaId.length != 0){
                      	areaIds = areaId;
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
      			    		  
      			    		  if(roleType == 51 && areaId.length == 0){
      			    			  lineIds = [];
      			              }
      			    		  if(lineId.length != 0){
      			    			  lineIds = lineId;
      			    		  }else{
      			    			  if(lineFlag == 0){
      			    				  lineIds = ["000000000000000000000000"];
      			    			  }
      			    		  }
      			    		  
      			    		  if(roleType != 51 && lineIds.length == 0){
      			    			   lineIds = ["000000000000000000000000"];
      			    		  }
      			                self.lineIds = lineIds;
      			                if(self.onlineType){
      			                  	self.searchData = {
      			                              "online": online,
      			                              "siteName": siteName,
      			                              "assetId": assetId,
      			                              "lineId": lineIds,
      			                              "name":name,
      			                              "onlineType":self.onlineType
      			                          };
      			                  }else{
      			                  	self.searchData = {
      			                              "online": online,
      			                              "siteName": siteName,
      			                              "assetId": assetId,
      			                              "name":name,
      			                              "lineId": lineIds
      			                      };
      			                  }
      			            	 
      			                  Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
      			                      var total = data.result.length;
      			                      self.pageRecordTotal = total;
      			                      self.totalCount = data.result.length;
      			                     
      			                      self.listTable.render(data.result);
      			                      self._renderpage(data, 1);
      			                      cloud.util.unmask("#ad_device_list_table");
      			                  }, self);  
      			                  
      			                  Service.getAllAutomatIds(self.searchData,-1, 0, function(data) {
      			                	  
      			                 	 if(data && data.result){
      			                 		 var automatIds=[];
      			                          if(data.result && data.result.length>0){
      			         	    			  for(var i=0;i<data.result.length;i++){
      			         	    				  automatIds.push(data.result[i]._id);
      			         	    			  }
      			                          }
      			                          self.automatIds = automatIds.reverse();
      			                 	 }
      			                      
      			                  }, self);
      			    	  }
       			     });
                  });
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#ad_device_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				 cloud.util.mask("#ad_device_list_table");
                         Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#ad_device_list_table");
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
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#ad_device_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                            var _id = selectedResouces[0]._id;
	                            var assetId=selectedResouces[0].assetId;
	                            if (this.seeDevice) {
	                                this.seeDevice.destroy();
	                            }
	                            this.seeDevice = new SeeDevice({
	                                  selector: "body",
	                                  deviceId: _id,
	                                  automatNo:assetId,
	                                  events: {
	                                        "getDeviceList": function() {
	                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
	                                        }
	                                  }
	                             });
	                        }
					  }
				}
			});
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