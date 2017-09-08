define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var Common = require("../../../common/js/common");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var ManModel = require("./modelEdit/updateModel-window");
	var SeeModelWin = require("./see/seeModel-window");
	var columns = [ {
		"title":locale.get({lang:"purchase_model"}),//型号
		"dataIndex" : "moduleNum",
		"cls" : null,
		"width" : "20%",
		render: function(data, type, row) {
	       	 var display="";
	       	 display += new Template(
	                "<div  style='line-height: 25px;'><span id='"+row._id+"' name='"+row.name+"' class='invendingModel' style='color: #09c;cursor: pointer;'>"+data+"</span></div>")
	                .evaluate({
	                  status: ''
	               });
	       	 return display;
	       }
	},{
		"title":locale.get({lang:"stage_type"}),//类型
		"dataIndex" : "deviceType",
		"cls" : null,
		"width" : "20%",
		 render: machineType
	},{
		"title":"赛道个数",
		"dataIndex" : "runwayCount",
		"cls" : null,
		"width" : "15%"
	},{
		"title":"赛道起始编号",
		"dataIndex" : "runwayStartNum",
		"cls" : null,
		"width" : "15%"
	},{
		"title":locale.get({lang:"product_manufacturer"}),//厂家
		"dataIndex" : "vender",
		"cls" : null,
		"width" : "15%",
		render:venderName
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}];
	 function venderName(value, type) {
	        var display = "";
	        if ("display" == type) {
	        	switch (value) {
	                case "vender1":
	                    display = "厂家1";
	                    break;
	                case "vender2":
	                    display = "厂家2";
	                    break;
	                case "vender3":
	                    display = "厂家3";
	                    break;
	                default:
	                    break;
               }
               return display;
	        } else {
	            return value;
	        }
	    }
	function machineType(value, type) {
	        var display = "";
	        if ("display" == type) {
	            switch (value) {
	                case "1":
	                    display = "2赛道";
	                    break;
	                case "2":
	                    display = "3赛道";
	                    break;
	                default:
	                    break;
	            }
	            return display;
	        } else {
	            return value;
	        }
	    }
	 var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	 var eurl;
	 if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	 }else{
	     eurl = "api";
	 }
	 
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "models_list_bar",
					"class" : null
				},
				table : {
					id : "models_list_table",
					"class" : null
				},
				paging : {
					id : "models_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#models_list").css("width",$(".wrap").width());
			$("#models_list_paging").css("width",$(".wrap").width());
			
			$("#models_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#models_list").height();
		    var barHeight = $("#models_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#models_list_table").css("height",tableHeight);
			
			this._renderTable();
			this._renderNoticeBar();
		},
		_renderBtn:function(){
			var self = this;
        	$(".invendingModel").click(function(){
        		var _id = $(this)[0].id;
        		var names = $(this)[0].innerText;
        		if (this.seeModel) {
                    this.seeModel.destroy();
                }
                this.seeModel = new SeeModelWin({
                    selector: "body",
                    id: _id,
                    name:names
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
				selector : "#models_list_table",
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
		    var height = $("#models_list_table").height()+"px";
		    $("#models_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#models_list_table");
        	var self = this;
        	var moduleNum = $("#moduleNum").val();

			Service.getAllModel(limit,cursor,moduleNum,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 self._renderBtn();
	        	 cloud.util.unmask("#models_list_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#models_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#models_list_table");
        				var moduleNum = $("#moduleNum").val();
                        Service.getAllModel(options.limit,options.cursor,moduleNum,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   self._renderBtn();
						   cloud.util.unmask("#models_list_table");
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
				selector : "#models_list_bar",
				events : {
					query: function(search, searchValue) {//查询
						self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val());
                    },
                    see:function(){
                    	 var selectedResouces = self.getSelectedResources();
	                     if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                     } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                     } else {
	                        	var _id = selectedResouces[0]._id;
	                        	var name = selectedResouces[0].name;
	                        	if (this.seeModel) {
	                                this.seeModel.destroy();
	                            }
	                            this.seeModel = new SeeModelWin({
	                                selector: "body",
	                                id: _id,
	                                name:name
	                            });
	                     }
	                        	
                    },
					add:function(){
						   if (this.addModel) {
	                            this.addModel.destroy();
	                       }
						   this.addModel = new ManModel({
                               selector: "body",
                               events: {
                                   "getModelList": function() {
                                       self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val());
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
	                        	   	if (this.modifyPro) {
		                                this.modifyPro.destroy();
		                            }
		                            this.modifyPro = new ManModel({
		                                selector: "body",
		                                id: _id,
		                                events: {
		                                    "getModelList": function() {
		                                    	self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val());
		                                    }
		                                }
		                            });
	                        	
	                     
	                        }
					  },
					  drop:function(){
	                        var idsArr = self.getSelectedResources();
	                        if (idsArr.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
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
		                                         Service.deleteModel(ids, function(data) {
		                                            if(data){
		                                                if(data.error && data.error_code==70028){
		                                                   dialog.render({lang: "this_model_has_template"});
		                                                   self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val());
		                                                }else{
		                                                  self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val());
		   		                                          dialog.render({lang: "deletesuccessful"});
		                                                }
		                                             }
		                                         });
	                                        	 
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