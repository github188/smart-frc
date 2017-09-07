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
	var Service = require("../../service");
	var NoticeBar = require("./notice-bar");
	var Register = require("./register");
	var columns = [{
		"title":"公司简称",
		"dataIndex": "name",
		"cls": null,
		"width": "8%"
	},
	{
		"title":"公司全称",
		"dataIndex": "website",
		"cls": null,
		"width": "18%"
	},{
		"title":"用户名",
		"dataIndex":"creator",
		"cls": null,
		"width": "10%"
	},
	{
		"title":locale.get({lang:"email"}),
		"dataIndex":"email",
		"cls": null,
		"width": "14%"
	},{
		"title":"联系人",
		"dataIndex": "address",
		"cls": null,
		"width": "8%"
	},{
		"title":"联系电话",
		"dataIndex": "phone",
		"cls": null,
		"width": "10%",
		render: function (data) {
			if(data){
				return data.split("***")[0];
			}else{
				return data;
			}
		 }
	},{
		"title":"销售员",
		"dataIndex":"fax",
		"cls": null,
		"width": "8%",
		render: function (data) {
			if(data){
				return data.split("***")[1];
			}else{
				return data;
			}
		 }
	},{
		"title":"申请人",
		"dataIndex":"phone",
		"cls": null,
		"width": "8%",
		render: function (data) {
			if(data){
				return data.split("***")[1];
			}else{
				return data;
			}
		 }
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "8%",
		 render: function (data) {
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}else{
				return data;
			}
		 }
	},{
        "title": locale.get({lang:"operate"}),
        "dataIndex": "operate",
        "width": "8%",
        render: function(data, type, row) {
          	 var display="";
          	 display += new Template(
                   "<div  style='line-height: 20px;text-align: Center;font-size: 12px;border-radius: 0px;padding: 3px 10px;color: #333;border: 1px solid #ddd;background-color: #f7f7f7;width: 30px;cursor: pointer;'><span id='"+row._id+"' email='"+row.email+"' style='cursor: pointer;' class='invendingLine' >查看</span></div>")
                   .evaluate({ 
                     status: ''
                  });
          	 
          	 return display;
          }
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
			
			$("#oid_list").css("width",$(".wrap").width());
			$("#oid_list_paging").css("width",$(".wrap").width());
			
			$("#oid_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#oid_list").height();
		    var barHeight = $("#oid_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#oid_list_table").css("height",tableHeight);
			
			 var height = $("#oid_list_table").height()+"px";
		     $("#oid_list_table-table").freezeHeader({ 'height': height });
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
		_bindBtnEvent:function(){
            var self = this;    
            $(".invendingLine").click(function(){
            	var _id = $(this)[0].id;
            	var email = $(this)[0].attributes[1].value; 
            	
            	 Service.getpwdByOid(_id,email,function(data){
              		if(data && data.result){
              			var password = data.result.password.toUpperCase();
              			var option={};
              			option.param={
                  				client_id:"000017953450251798098136",
                  				client_secret:"08E9EC6793345759456CB8BAE52615F3",
                  				grant_type:"password",
                  				username:email,
                  				password:password,
                  				password_type:"2",
                  				language:locale.current()
                  		};
              			option.data=encodeURIComponent("clientSecret")+"="+encodeURIComponent("08E9EC6793345759456CB8BAE52615F3");
         				option.url="/oauth2/access_token"+"?"+self.makeParamToQueryString(option.param);
         				option.type="POST";
         				option.contentType="application/x-www-form-urlencoded";
         				option.dataType="JSON";
         				option.processData=false;
         				option.timeout=1200000;
         				option.error=function(error){
         			    };
         			    option.success=function(data){
         			    	var indexUrl=localStorage.getItem("indexURL");
         					if(indexUrl!="www"){
         						window.open("../../applications/index_other.html?access_token="+data.access_token+"&refresh_token="+data.refresh_token);
         					}else{
         						window.open("../applications/index_other.html?access_token="+data.access_token+"&refresh_token="+data.refresh_token);
         					}
         			    };
         			    $.ajax(option);
         			    
              		}
              	});
            });
           /* self.datas.each(function(one){  
                 $("#"+one._id).bind("click",function(){
                	 Service.getpwdByOid(one._id,one.email,function(data){
                 		if(data && data.result){
                 			var password = data.result.password.toUpperCase();
                 			var option={};
                 			option.param={
                     				client_id:"000017953450251798098136",
                     				client_secret:"08E9EC6793345759456CB8BAE52615F3",
                     				grant_type:"password",
                     				username:one.email,
                     				password:password,
                     				password_type:"2",
                     				language:locale.current()
                     		};
                 			option.data=encodeURIComponent("clientSecret")+"="+encodeURIComponent("08E9EC6793345759456CB8BAE52615F3");
            				option.url="/oauth2/access_token"+"?"+self.makeParamToQueryString(option.param);
            				option.type="POST";
            				option.contentType="application/x-www-form-urlencoded";
            				option.dataType="JSON";
            				option.processData=false;
            				option.timeout=1200000;
            				option.error=function(error){
            			    };
            			    option.success=function(data){
            			    	var indexUrl=localStorage.getItem("indexURL");
            					if(indexUrl!="www"){
            						window.open("../../applications/index_other.html?access_token="+data.access_token+"&refresh_token="+data.refresh_token);
            					}else{
            						window.open("../applications/index_other.html?access_token="+data.access_token+"&refresh_token="+data.refresh_token);
            					}
            			    };
            			    $.ajax(option);
            			    
                 		}
                 	});
            	 });
            });*/
		},
		_renderTable : function() {
			var self = this;
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
			cloud.util.mask("#oid_list_table");
			var self = this;
        	var name = $("#name").val();
        	var assetIds = $("#assetIds").val();
        	var email = $("#email").val();
            self.searchData={
        				name:name,
        				email:email,
        				assetIds:assetIds
            };
			
			Service.getAllOid(self.searchData,limit,cursor,function(data){
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
		        self._bindBtnEvent();
		        cloud.util.unmask("#oid_list_table");
			});
						
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#oid_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				Service.getAllOid(self.searchData, options.limit,options.cursor,function(data){
	         				   self.pageRecordTotal = data.total - data.cursor;
	 						   callback(data);
	 						   self._bindBtnEvent();
	         				});

	        			},
	        			turn:function(data, nowPage){
	        				self.datas = data.result;
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
	        _renderNoticeBar : function() {
				var self = this;
				this.noticeBar = new NoticeBar({
					selector : "#oid_list_bar",
					events : {
						  query: function(){//查询
							  self.loadTableData($(".paging-limit-select").val(),0);
						  },
						  add:function(){
							    if (this.register) {
		                            this.register.destroy();
		                        }
		                        this.register = new Register({
		                            selector: "body",
		                            events: {
		                                "getOidList": function() {
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
		                        	 if (this.register) {
				                            this.register.destroy();
				                     }
				                     this.register = new Register({
				                            selector: "body",
				                            id:_id,
				                            events: {
				                                "getOidList": function() {
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
		                                                Service.deleteOid(_id, function(data) {
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