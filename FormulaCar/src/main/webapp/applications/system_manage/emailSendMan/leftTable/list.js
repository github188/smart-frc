define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var columns = [{
		"title":"公司简称",
		"dataIndex": "name",
		"cls": null,
		"width": "30%"
	},
	{
		"title":"公司全称",
		"dataIndex": "website",
		"cls": null,
		"width": "30%"
	},
	{
		"title":locale.get({lang:"email"}),
		"dataIndex":"email",
		"cls": null,
		"width": "40%"
	}];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "oid_list_bar",
					"class" : null
			    },
				table : {
					id : "oid_list_table",
					"class" : null
				},
				paging : {
					id : "oid_list_paging",
					"class" : null
				}
			};
			this.allEmail=[];
			this.render();
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			this._renderNoticeBar();
			this._renderBtnEvent();
			
			$("#oid_list").css("width",$(".email_left").width());
			
			$("#oid_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#oid_list").height();
		    var barHeight = $("#oid_list_bar").height();
			var tableHeight=listHeight - barHeight - 5;
			$("#oid_list_table").css("height",tableHeight);
			
			 var height = $("#oid_list_table").height()+"px";
		     $("#oid_list_table-table").freezeHeader({ 'height': height });
		     
		     $("#email_right").css("width",$("#emailMain").width() - $("#email_left").width());
		     $("#email_right").css("height",$("#email_left").height());
		},
		_renderBtnEvent:function(){
			var self = this;
			var flag=false;
			$("span").click(function(){
				var emails="";
				if($(this).parent().parent()[0].localName == "th"){//全选
					var flag = $("#flag").val();
					if(flag == "1"){
						$("#toemail").val("");
				    	$("#flag").val("");
					}else{
						if(self.allEmail.length>0){
		                	for(var i=0;i<self.allEmail.length;i++){
		                		if (i == self.allEmail.length - 1) {
		                			emails = emails + self.allEmail[i];
		                           } else {
		                           	emails = emails + self.allEmail[i] + ";";
		                           }
		                	}
		                	$("#toemail").val(emails);
		                	$("#flag").val("1");
					    }
					}
				}
        	});
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		makeParamToQueryString:function(param){
			var arr = [];
			for(var attr in param){
				if($.isArray(param[attr])){
					arr.push(attr + "=" + param[attr].join(","));
				}else{
					arr.push(attr + "=" + param[attr]);	
				}
			}
			return arr.join("&");
		},
		_renderTable : function() {
			var self = this;
			self.emailList=[];
			this.listTable = new Table({
				selector : "#oid_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "full",
				events : {
					 onRowClick: function(data) {
						   // this.listTable.unselectAllRows();
	                       // var rows = this.listTable.getClickedRow();
	                        //this.listTable.selectRows(rows);
	                       // console.log(self.getSelectedResources());
	                        var emails="";
	                        if(self.getSelectedResources().length>0){
	                        	for(var i=0;i<self.getSelectedResources().length;i++){
	                        		if (i == self.getSelectedResources().length - 1) {
	                        			emails = emails + self.getSelectedResources()[i].email;
		                            } else {
		                            	emails = emails + self.getSelectedResources()[i].email + ";";
		                            }
	                        	}
	                        	$("#toemail").val(emails);
	                        }
	                   },
	                   onRowRendered: function(tr, data, index) {
	                        var self = this;
	                        self.allEmail.push(data.email);
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
			cloud.util.mask("#oid_list_table");
			var self = this;
        	var name = $("#name").val();
        	var email = $("#email").val();
            self.searchData={
        				name:name,
        				email:email
            };
			
			Service.getAllOid(self.searchData,100000,cursor,function(data){
				self.datas = data.result;
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        cloud.util.unmask("#oid_list_table");
			});
						
		},
	    _renderNoticeBar : function() {
				var self = this;
				this.noticeBar = new NoticeBar({
					selector : "#oid_list_bar",
					events : {
						  query: function(){//查询
							  self.loadTableData($(".paging-limit-select").val(),0);
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