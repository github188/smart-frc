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
	var Addspecial = require("./add/addspecialoffer-window");
	var Updatespecial = require("./update/updatespecialoffer-window");
	var SeeSpecialoffer = require("./see/seespecialoffer-window");
	require("cloud/lib/plugin/jquery.multiselect")
	var columns = [ {
		"title":locale.get({lang:"name1"}),//活动名称
		"dataIndex" : "name",
		"cls" : null,
		"width" : "15%",
		render: function(data, type, row) {
	       	 var display="";
	       	 display += new Template(
	                "<div  style='line-height: 25px;'><span id='"+row._id+"_see' name='"+row.name+"' style='color: #09c;cursor: pointer;' class='invendingLine' >"+data+"</span></div>")
	                .evaluate({ 
	                  status: ''
	               });
	       	 
	       	 return display;
	       }
	},{
		"title":locale.get({lang:"special_offer_type"}),//优惠类型
		"dataIndex" : "type",
		"cls" : null,
		"width" : "15%",
		render:function(data){
			if(data){
				if(data == 1){
					return locale.get({lang:"buy_discount_perference"});
				}else if(data == 2){
					return locale.get({lang:"buy_discount"});
				}
				
			}
		}
	},{                                             //开始时间
		"title":locale.get({lang:"special_start_time"}),
		"dataIndex" : "startTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{                                             //结束时间
		"title":locale.get({lang:"special_end_time"}),
		"dataIndex" : "endTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	},{                                             
		"title":locale.get({lang:"update_time"}),//更新时间
		"dataIndex" : "updateTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	},/*{
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "12%",
		render: statusConvertor
	},{                                             
		"title":locale.get({lang:"operate"}),//操作
		"dataIndex" : "config",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			if(data){
				
				if(data.codeFileId){
					return "<a style='display:none' id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" ><span class=\"cloud-button-item cloud-button-text\" >"+locale.get({lang:"download"})+"</span></a>"
				}
				
			}
		}
	},*/ {
        "title": "",
        "dataIndex": "id",
        "cls": "_id" + " " + "hide"
    }];

	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.status =options.status;
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "special_list_bar",
					"class" : null
				},
				table : {
					id : "special_list_table",
					"class" : null
				},
				paging : {
					id : "special_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#special_list").css("width",$(".wrap").width());
			$("#special_list_paging").css("width",$(".wrap").width());
			$("#special_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#special_list").height();
		    var barHeight = $("#special_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#special_list_table").css("height",tableHeight);
			
			this._renderNoticeBar();
			this._renderTable();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_renderBtn:function(){
			var self = this;
        	$(".invendingLine").click(function(){
        		var _id = $(this)[0].id.split('_')[0];
        		var names = $(this)[0].innerText;
        		if (this.seespecialoffer) {
                    this.seespecialoffer.destroy();
                }
        		this.seespecialoffer = new SeeSpecialoffer({
                     selector: "body",
                     specialId:_id,
                     specialName:names
                 });
        	});
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#special_list_table",
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
			var height = $("#special_list_table").height()+"px";
	        $("#special_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#special_list_table");
        	var self = this;
        	var name = $("#name").val();
        	if(name){
        		name = self.stripscript(name);
        	}
        	self.searchData = {};
        	if(name){
        		self.searchData.name = name;
        	}
        	
        	
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
                	
                	var specialType=[];
                	if($("#specialTypeList").attr("multiple") != undefined){
                		specialType = $("#specialTypeList").multiselect("getChecked").map(function() {
                           return this.value;
                        }).get();
                	}
                	
        			self.searchData = {
        				"name":name,
        				"types":specialType
        			};

                    Service.getAllSpecialOffer(self.searchData,limit,cursor,function(data){
                    	 self.datas = data.result;
                    	 var total = data.result.length;
   	       				 self.pageRecordTotal = total;
   	       	        	 self.totalCount = data.result.length;
   	               		 self.listTable.render(data.result);
   	       	        	 self._renderpage(data, 1);
   	       	             self._bindBtnEvent();
   	       	             self._renderBtn();
   	       	        	 cloud.util.unmask("#special_list_table");
          			 }, self);
                
            }, self);  
            
		},
		
		_bindBtnEvent:function(){
			var self = this;          
            this.datas.each(function(one){                              
                if(one.type == 1){
                	if($("#"+one._id+"\_download").length<=0){														
    					
    					$("#"+one._id).after("<a id='"+one._id+"\_download' style='margin-left:5px;'  class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" lang=\"text:download\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:download\">"+locale.get({lang:"download"})+"</span></a>");
    				}
    				$("#"+one._id+"_download").bind('click',function(e){
                    	e.preventDefault();
            			var host = cloud.config.FILE_SERVER_URL;
            			var fileId = one.config.codeFileId;
            			var url= cloud.config.FILE_SERVER_URL + "/api/file/" +fileId+ "?access_token=" + cloud.Ajax.getAccessToken();
            			cloud.util.ensureToken(function() {
                            window.open(url, "_self");
                        });
                    	
                    });
                }
                
            });
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#special_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				Service.getAllSpecialOffer(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   self._renderBtn();
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
				selector : "#special_list_bar",
				status:self.status,
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see: function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	if (this.seespecialoffer) {
	 	                            this.seespecialoffer.destroy();
	 	                        }
	 	                        this.seespecialoffer = new SeeSpecialoffer({
	 	                            selector: "body",
	 	                            specialId:_id,
	 	                            specialName:selectedResouces[0].name
	 	                        });
	                        }
					  },
					  add:function(){
						    if (this.addSpecialOffer) {
	                            this.addSpecialOffer.destroy();
	                        }
	                        this.addSpecialOffer = new Addspecial({
	                            selector: "body",
	                            events: {
	                                "getSpecialList": function() {
	                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                	 $("a").css("margin-top","-3px");
	                                     $("a").css("margin-right","0px");
	                                     $("a").css("margin-bottom","0px");
	                                     $("a").css("margin-left","6px");
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
	                        	 if (this.updateSpecialOffer) {
	 	                            this.updateSpecialOffer.destroy();
	 	                        }
	 	                        this.updateSpecialOffer = new Updatespecial({
	 	                            selector: "body",
	 	                            specialId:_id,
	 	                            events: {
	 	                                "getSpecialList": function() {
	 	                                	self.loadTableData($(".paging-limit-select").val(),0);
	 	                                    $("a").css("margin-top","-3px");
	 	                                    $("a").css("margin-right","0px");
	 	                                    $("a").css("margin-bottom","0px");
	 	                                    $("a").css("margin-left","6px");
	 	                                }
	 	                            }
	 	                        });
	                        }
					  },
					  drop:function(){
						  var selectedResouces = self.getSelectedResources();
						  var idsArr = self.getSelectedResources();
	                        if (idsArr.length == 0) {
	                            cloud.util.unmask("#content-table");
	                            dialog.render({
	                                lang: "please_select_at_least_one_config_item"
	                            });
	                            return;
	                        } else {
	                            cloud.util.unmask("#content-table");
	                            var ids = "";
	                            for (var i = 0; i < idsArr.length; i++) {
	                                if (i == idsArr.length - 1) {
	                                    ids = ids + idsArr[i]._id;
	                                } else {
	                                    ids = ids + idsArr[i]._id + ",";
	                                }
	                            }
	                            dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                    lang: "affirm",
	                                    click: function() {
	                                        //cloud.util.mask("#site_list_table");
	                                        self.listTable.mask();
	                                        Service.deleteSpecialByIds(ids, function(data) {
	                                            if (data.result.error_code) {
	                                                if (data.result.error_code && data.result.error_code == "70013") {
	                                                    dialog.render({
	                                                        lang: data.result.error_code
	                                                    });
	                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
	                                                } else if (data.result.error_code == "70060") {
	                                                    dialog.render({
	                                                        lang: data.result.error_code
	                                                    });
	                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
	                                                }
	                                            } else {
	                                                if (data.result == "OK") {
	                                                    if (self.pageRecordTotal == 1) {
	                                                        var cursor = ($(".paging-page-current").val() - 2) * $(".paging-limit-select").val();
	                                                        if (cursor < 0) {
	                                                            cursor = 0;
	                                                        }
	                                                        self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
	                                                    } else {
	                                                        self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
	                                                    }
	                                                    self.pageRecordTotal = self.pageRecordTotal - 1;
	                                                    dialog.render({
	                                                        lang: "deletesuccessful"
	                                                    });
	                                                }
	                                            }

	                                        }, self);
	                                        self.listTable.unmask();
	                                        dialog.close();
	                                    }
	                                }, {
	                                    lang: "cancel",
	                                    click: function() {
	                                        self.listTable.unmask();
	                                        dialog.close();
	                                    }
	                                }]
	                            });
	                        }
					  },
					  stop:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_pause",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                var finalData={
	                                                		status:3,
	                                                		type:2
	                                                }
	                                                Service.updateDiscount(finalData,_id,function(data){
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                                });
	                                                
	                                            }
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
					  },
					  active:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
	                                lang: "affirm_recover",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            for (var i = 0; i < selectedResouces.length; i++) {
	                                                var _id = selectedResouces[i]._id;
	                                                var finalData={
	                                                		status:2,
	                                                		type:2
	                                                }
	                                                Service.updateDiscount(finalData,_id,function(data){
	                                                	self.loadTableData($(".paging-limit-select").val(),0);
	                                                });
	                                                
	                                            }
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