define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	

	var columns = [ 
	               {
	                   "title":locale.get({lang:"trade_claim_number"}),//取货码
	                   "dataIndex" : "code",
	                   "cls" : null,
	                   "width" : "60%"
	               },{
	                   "title":locale.get({lang:"replenishments"}),//状态
	                   "dataIndex" : "status",
	                   "cls" : null,
	                   "width" : "40%",
	                   render:statusConvertor
	               }, {
	                   "title": "",
	                   "dataIndex": "id",
	                   "cls": "_id" + " " + "hide"
	               }
	           ];
	function statusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({lang: "can_use"});// 0：可用  1：不可用 2 未启用
                    break;
                case 1:
                    display = locale.get({lang: "not_geted"});
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
	        this.batchNumber = options.batchNumber;
			this.elements = {
				bar : {
					id : "codeDetail_list_bar",
					"class" : null
				},
				table : {
					id : "codeDetail_list_table",
					"class" : null
				}
				
			};
		    this._render();
		},
		_render:function(){
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
				selector : "#codeDetail_list_table",
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
			var height = $("#codeDetail_list_table").height()+"px";
	        $("#codeDetail_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData();
		},
		loadTableData : function() {
			cloud.util.mask("#codeDetail_list_table");
        	var self = this;
        	var status = $("#status").find("option:selected").val();
        	if(status == 0 || status == 1){
        	}else{
        	   status="";
        	}
        	self.searchData={
        			status:status,
        			batchNumber:self.batchNumber
        	};
        	Service.getCodeByBatchNumber(self.searchData,function(data){
       		   console.log(data);
       		   self.listTable.render(data.result);
       		   cloud.util.unmask("#codeDetail_list_table");
       	   });
		},
		
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#codeDetail_list_bar",
				events : {
					  query: function(){
						  self.loadTableData();
					  },
					  modify:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else {
	                            dialog.render({
		                                lang: "affirm_revoke",
		                                buttons: [{
		                                        lang: "affirm",
		                                        click: function() {
		                                        	 for (var i = 0; i < selectedResouces.length; i++) {
		                                        		   var data={
				                                        			status:1
				                                        	};
		                                        		    var _id = selectedResouces[i]._id;
				                                        	Service.upDateCodeStatusById(data,_id,function(data){
				            	                        		self.loadTableData();
				            	                        	});
			                                          }
		                                             dialog.render({lang: "revoke_successful"});
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