define(function(require){
	require("cloud/base/cloud");
	var html = require("text!./list.html");
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var ManModel =  require("./treatedWindow");
	var columns = [ {
		"title":locale.get({lang:"ad_filename"}),//文件名称
		"dataIndex" : "modelPicName",
		"cls" : null,
		"width" : "20%"
	},{
		"title":locale.get({lang:"trade_automat_number"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "10%"
		
	},{
		"title":locale.get({lang:"device_shelf_number"}),//货柜编号
		"dataIndex" : "cid",
		"cls" : null,
		"width" : "10%"
		
	},{
		"title":locale.get({lang:"purchase_model"}),//型号
		"dataIndex" : "model",
		"cls" : null,
		"width" : "15%"
		
	},{
		"title":locale.get({lang:"applicant_model"}),//申请人
		"dataIndex" : "cpemail",
		"cls" : null,
		"width" : "18%"
	},{                                             //创建时间
		"title":locale.get({lang:"applicant_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "12%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	},{
		"title":locale.get({lang:"state"}),//状态
		"dataIndex" : "state",
		"cls" : null,
		"width" : "8%",
		 render: stateConfig
	},{
        "title": locale.get({lang:"operate"}),
        "dataIndex": "operate",
        "width": "7%",
        render:function(data,type,row){
            return "<a id='"+row._id+"\'  href='/mapi/file/"+row.modelPicId+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" lang=\"text:download\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:config\">"+locale.get({lang:"download"})+"</span></a>"
            	
        }
    }];
	function stateConfig(value, type) {
	        var display = "";
	        if ("display" == type) {
	            switch (value) {
	                case 1:
	                    display = locale.get({lang: "untreated_model"});
	                    break;
	                case 0:
	                    display = locale.get({lang: "already_processed"});
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
					id : "undo_models_list_bar",
					"class" : null
				},
				table : {
					id : "undo_models_list_table",
					"class" : null
				},
				paging : {
					id : "undo_models_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
		    
		    $("#undo_models_list").css("width",$(".wrap").width());
			$("#undo_models_list_paging").css("width",$(".wrap").width());
			
			$("#undo_models_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#undo_models_list").height();
		    var barHeight = $("#undo_models_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#undo_models_list_table").css("height",tableHeight);
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
				selector : "#undo_models_list_table",
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

			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#undo_models_list_table");
        	var self = this;
        	var state = $("#state").find("option:selected").val();
        	if(state){
        		if(state=='0'){
            		state = '';
            	}else{
            		state = state - 1;
            	}
        	}
        	
			Service.getAllUnCreateModel(eurl,limit,cursor,state,function(data){
				 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
	        	 self._renderpage(data, 1);
	        	 cloud.util.unmask("#undo_models_list_table");
			 }, self);
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#undo_models_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#undo_models_list_table");
        				var state = $("#state").find("option:selected").val();
        				if(state){
        	        		if(state=='0'){
        	            		state = '';
        	            	}else{
        	            		state = state - 1;
        	            	}
        	        	}
        				Service.getAllUnCreateModel(eurl,options.limit,options.cursor,state,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#undo_models_list_table");
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
				selector : "#undo_models_list_bar",
				events : {
					query: function(state) {//查询
                        cloud.util.mask("#undo_models_list_table");
                        var pageDisplay = self.display;
                        var state = $("#state").find("option:selected").val();
                        if(state){
                    		if(state=='0'){
                        		state = '';
                        	}else{
                        		state = state - 1;
                        	}
                    	}
                        Service.getAllUnCreateModel(eurl,30, 0, state, function(data) {
                        	 var total = data.result.length;
	           				 self.pageRecordTotal = total;
	           	        	 self.totalCount = data.result.length;
	                   		 self.listTable.render(data.result);
	           	        	 self._renderpage(data, 1);
	           	        	 cloud.util.unmask("#undo_models_list_table");
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