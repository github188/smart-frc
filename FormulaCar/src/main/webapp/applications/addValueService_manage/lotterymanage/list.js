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
	
	var Seelottery = require("./see/seelottery-window");
	var Addlottery = require("./add/addlottery-window");
	var Updatelottery = require("./update/updatelottery-window");
	var columns = [ {
		"title":locale.get({lang:"lottery_name"}),//抽奖名称
		"dataIndex" : "lotteryName",
		"cls" : null,
		"width" : "20%",
		render: function(data, type, row) {
	       	 var display="";
	       	 display += new Template(
	                "<div  style='line-height: 25px;'><span id='"+row._id+"' name='"+row.lotteryName+"' style='color: #09c;cursor: pointer;' class='invendingLine' >"+data+"</span></div>")
	                .evaluate({ 
	                  status: ''
	               });
	       	 
	       	 return display;
	       }
	},{
		"title":locale.get({lang:"sales_promotion_machine_quantity"}),//售货机数量
		"dataIndex" : "devices",
		"cls" : null,
		"width" : "20%",
		render:function(data){
			if(data){
				return data.length;
			}
		}
	},{                                             //描述
		"title":locale.get({lang:"lottery_desc"}),
		"dataIndex" : "desc",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "20%",
		render: statusConvertor
	},{
		"title":locale.get({lang:"lottery_probalility"}),//中奖率
		"dataIndex" : "config",
		"cls" : null,
		"width" : "20%",
		render: function(data, type, row){
			if(data && data.probalility){
				
				return data.probalility/10 +"%";
				
			}
		}
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	}, {
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];
	function statusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({lang: "lottery_status_save"});
                    break;
                case 2:
                    display = locale.get({lang: "lottery_status_send"});
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "lottery_list_bar",
					"class" : null
				},
				table : {
					id : "lottery_list_table",
					"class" : null
				},
				paging : {
					id : "lottery_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#lottery_list").css("width",$(".wrap").width());
			$("#lottery_list_paging").css("width",$(".wrap").width());
			$("#lottery_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#lottery_list").height();
		    var barHeight = $("#lottery_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#lottery_list_table").css("height",tableHeight);
			this._renderTable();
			this._renderNoticeBar();
			
		},
		_renderBtn:function(){
			var self = this;
        	$(".invendingLine").click(function(){
        		var _id = $(this)[0].id;
        		var names = $(this)[0].innerText;
        		if (this.seeLine) {
                    this.seeLine.destroy();
                }
                this.seeLine = new Seelottery({
                    selector: "body",
                    lotteryId: _id,
                    lotteryName:names
                });
        	});
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
				selector : "#lottery_list_table",
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
			var height = $("#lottery_list_table").height()+"px";
	        $("#lottery_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#lottery_list_table");
        	var self = this;
        	var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
        	var roleType = permission.getInfo().roleType;
            Service.getAutomatByUserId(userId, function(data) {
           	 
           		    var deviceIds=[];
                    if(data.result && data.result.length>0){
   	    			  for(var i=0;i<data.result.length;i++){
   	    				deviceIds.push(data.result[i]._id);
   	    			  }
                    }
                    
                    //self.assetIds = assetIds;
                    if(roleType != 51 && deviceIds.length == 0){
                    	deviceIds = ["000000000000000000000000"];
	                }
                    self.deviceIds = deviceIds;
                    var name = $("#name").val();
                	if(name){
                		name = self.stripscript(name);
                	}
        			self.searchData = {
        				"lotteryName":name,
        				"deviceIds":deviceIds
        			};

                    	Service.getAllLotteryConfig(self.searchData,limit,cursor,function(data){
   	       				 var total = data.result.length;
   	       				 self.pageRecordTotal = total;
   	       	        	 self.totalCount = data.result.length;
   	               		 self.listTable.render(data.result);
   	       	        	 self._renderpage(data, 1);
   	       	        	 self._renderBtn();
   	       	        	 cloud.util.unmask("#lottery_list_table");
          			 }, self);
                
            }, self);       	
			
			
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#lottery_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#lottery_list_table");
        				Service.getAllLotteryConfig(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   self._renderBtn();
						   cloud.util.unmask("#lottery_list_table");
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
				selector : "#lottery_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	if (this.seelottery) {
	 	                            this.seelottery.destroy();
	 	                        }
	 	                        this.seelottery = new Seelottery({
	 	                            selector: "body",
	 	                           lotteryId:_id,
	 	                           lotteryName:selectedResouces[0].lotteryName
	 	                        });
	                        }
					  },
					  add:function(){
						    if (this.addlottery) {
	                            this.addlottery.destroy();
	                        }
	                        this.addlottery = new Addlottery({
	                            selector: "body",
	                            events: {
	                                "getlotteryList": function() {
	                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                }
	                            }
	                        });
					  },
					  modify:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	 if (this.addlottery) {
	 	                            this.addlottery.destroy();
	 	                        }
	 	                        this.addlottery = new Updatelottery({
	 	                            selector: "body",
	 	                            lotteryId:_id,//
	 	                            events: {
	 	                                "getlotteryList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                }
	 	                            }
	 	                        });
	                        }
					  },
					  drop:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                Service.deleteLotteryConfig(_id, function(data) {
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                                });
	                                                
	                                            }
	                                            
	                                            dialog.render({lang: "deletesuccessful"});
	                                            dialog.close();
	                                        }
	                                    },
	                                    {
	                                        lang: "cancel",
	                                        click: function() {
	                                            dialog.close();
	                                        }
	                                    }]
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