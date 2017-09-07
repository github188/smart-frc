define(function(require) {
	var cloud = require("cloud/base/cloud");
	var Common = require("../../../common/js/common");
	var html = require("text!./list.html");
	require("cloud/lib/plugin/jquery-ui");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("../service");
	var VersionDownPage = require("./config/allConfig-window");
	var UpdateVersionPage = require("./config/updateConfig-window");
	var ShareVersionPage = require("./share/shareMan-window");
	var columns = [{
		"title":locale.get({lang:"version_description"}),//版本描述
		"dataIndex": "desc",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"organization_name"}),//机构简称
		"dataIndex": "oName",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"version_model"}),//机型
		"dataIndex": "versionmodel",
		"cls": null,
		"width": "20%",
		render:venderName					
		
	},{
		"title":locale.get({lang:"version_number"}),//版本号
		"dataIndex": "version",
		"cls": null,
		"width": "20%"
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "20%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
        "title": locale.get({lang:"operate"}),
        "dataIndex": "operate",
        "width": "20%",
        render:function(data,type,row){
            return "<a id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"配置\" lang=\"text:config\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:config\">"+locale.get({lang:"config"})+"</span></a>"
            	
        }
    }];
	function venderName(value, type) {
        var display = "";
        if ("display" == type) {
            
        	display = Common.getLangVender(value);
            return display;
        } else {
            return value;
        }
    }
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				    table : {
					    id : "versionDown_list_table",
					    "class" : null
				    },
				    paging : {
					    id : "versionDown_list_paging",
					    "class" : null
				    }
			};
			var execute = "inhand";
    		var domain = window.location.host;
    		this.domain = domain;
    		if(domain == "139.196.10.122"){
    			execute = "aucma";
			}else if(domain == "www.dfbs-vm.com"){
				execute = "fuji";
			}
    		this.executeOName = execute;
    		this.oName = null;
			this.render();
		},
		render:function(){
			this._renderHtml();
			this._renderTable();
			 
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		stripscript:function(s){ 
		    var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]") 
		    var rs = ""; 
		    for (var i = 0; i < s.length; i++) { 
		      rs = rs+s.substr(i, 1).replace(pattern, ''); 
		    } 
		    return rs; 
		},
		_bindBtnEvent:function(){
            var self = this;          
            this.datas.each(function(one){                              
                var vender = one.versionmodel;
                var version = one.version;
                var server = one.server;
                var orgName = one.oName;
                var desc = one.desc;

                if(self.oName == "admin"){
                	$("#"+one._id).parent().html("<a id='"+one._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"分配\" lang=\"text:share\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:share\">"+locale.get({lang:"share"})+"</span></a>");
                    $("#"+one._id).bind('click',function(e){
            	        e.preventDefault();
            	        if (this.shareVersion) {
                             this.shareVersion.destroy();
                        }
            			                   	
                        this.shareVersion = new ShareVersionPage({
                                selector: "body",
                                data:one,
                                oName:self.oName,
                                executeOName:self.executeOName,
                                events: {
                                   "getVersionList": function() {		                            	
                        	                  self.loadTableData($(".paging-limit-select").val(),0);
                                                }
                                        }
                        });
                   });
                }else{
                	
                Service.getAppVersionConfigInfo(desc,function(data) {
					
					if(data.result){
						
						if(data.result.configfileId){
							if($("#"+one._id+"\_download").length<=0){														
								
								$("#"+one._id).after("<a id='"+one._id+"\_download' style='margin-left:5px;'  class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" lang=\"text:download\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:download\">"+locale.get({lang:"download"})+"</span></a>");
							}
							$("#"+one._id+"_download").bind('click',function(e){
			                	e.preventDefault();
	                			var host = cloud.config.FILE_SERVER_URL;
	                			var fileId = data.result.configfileId;
			                	var url = host + "/api/versionconfig/downloadZip"+"?configfileId="+fileId+"&access_token="+cloud.Ajax.getAccessToken()+"&oid="+data.result.oid+"&id="+data.result._id;
	                			cloud.util.ensureToken(function() {
	                                window.open(url, "_self");
	                            });
			                	
			                });
						}else{
                            if($("#"+one._id+"\_download").length<=0){														
								
								$("#"+one._id).after("<span style='margin-left:6px;' id='"+one._id+"_packaged' >"+locale.get({lang:"being_packaged"})+"</span>");
							}
							
							var timer = setInterval(function(){
								
								Service.getAppVersionConfigInfo(desc,function(data) {
					        		
					        		if(data.result && data.result.configfileId != null && (data.result.configfileId).replace(/(^\s*)|(\s*$)/g,"")!=""){
					        			
					        			$("#"+one._id+"_packaged").remove();
					        			if($("#"+one._id+"\_download").length<=0){														
											
											$("#"+one._id).after("<a id='"+one._id+"\_download' style='margin-left:5px;'  class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"下载\" lang=\"text:download\"><span class=\"cloud-button-item cloud-button-text\" lang=\"text:download\">"+locale.get({lang:"download"})+"</span></a>");
										}
					        			$("#"+one._id+"_download").bind('click',function(e){
						                	e.preventDefault();
					            			var host = cloud.config.FILE_SERVER_URL;
					            			var fileId = data.result.configfileId;
						                	var url = host + "/api/versionconfig/downloadZip"+"?configfileId="+fileId+"&access_token="+cloud.Ajax.getAccessToken()+"&oid="+data.result.oid+"&id="+data.result._id;
					            			cloud.util.ensureToken(function() {
					                            window.open(url, "_self");
					                        });
						                	
						                });
					        			
					        			clearInterval(timer);
					        			
					        		}
					        	});
								
							},5000);
						}
						
						$("#"+one._id).bind('click',function(e){
		                	e.preventDefault();
		                	if (this.verUpdateDown) {
		                        this.verUpdateDown.destroy();
		                    }
		                			                	
		                    this.verUpdateDown = new UpdateVersionPage({
		                        selector: "body",
		                        data:data,
		                        server:server,
		                        version:version,
		                        orgName:orgName,
		                        desc:desc,
		                        events: {
		                            "getVersionList": function() {		                            	
		                            	self.loadTableData($(".paging-limit-select").val(),0);
		                            }
		                        }
		                    });
		                });
						
						
					}else{
						
						$("#"+one._id).bind('click',function(e){
		                	e.preventDefault();
		                	if (this.verDown) {
		                        this.verDown.destroy();
		                    }
		                    this.verDown = new VersionDownPage({
		                        selector: "body",
		                        data:one,
		                        events: {
		                            "getVersionList": function() {
		                            	self.loadTableData($(".paging-limit-select").val(),0);
		                            }
		                        }
		                    });
		                });
						
						//$("#"+one._id+"_download").css("display","none");
					}
			        
				});
               }
                
            });
            
            
        },
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#versionDown_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				checkbox : "single",
				events : {
					 onRowClick: function(data) {
						    this.listTable.unselectAllRows();
	                        var rows = this.listTable.getClickedRow();
	                        this.listTable.selectRows(rows);
	                        //this._bindBtnEvent();
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
			cloud.util.mask("#versionDown_list_table");
			var self = this;
			var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
			Service.getUserMessage(oid,function(datas) {
				if(datas.result){
					var name = datas.result.name;
					self.oName = name;
					if(name){
		        		name = self.stripscript(name);
		        		if(oid == "0000000000000000000abcde"){
		        			self.searchData = {
			        				"oName":name,
			        				"server":self.domain
			        				
			        			};
		        		}else{
		        			self.searchData = {
			        				"oName":name,
			        				"executeOName":self.executeOName
			        			};
		        		}
		        		
		        	}else{
		        		self.searchData = {
		        			};
		        	}
					Service.getVersionDistributionInfo(self.searchData,cursor, limit,function(data) {
						self.datas = data.result;
						var total = data.total;
												
						this.totalCount = data.result.length;
				        data.total = total;
				        self.listTable.render(data.result);
				        self._renderpage(data, 1);
				        self._bindBtnEvent();
				        cloud.util.unmask("#versionDown_list_table");
					});
					
					
				}
			});
			
		},
		 _renderpage:function(data, start){
	        	var self = this;
	        	if(this.page){
	        		this.page.reset(data);
	        	}else{
	        		this.page = new Paging({
	        			selector : $("#versionDown_list_paging"),
	        			data:data,
	    				current:1,
	    				total:data.total,
	    				limit:this.pageDisplay,
	        			requestData:function(options,callback){
	        				cloud.util.mask("#versionDown_list_table");
	        				Service.getVersionDistributionInfo(self.searchData,options.cursor, options.limit,function(data){
   							   callback(data);
   							cloud.util.unmask("#versionDown_list_table");
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