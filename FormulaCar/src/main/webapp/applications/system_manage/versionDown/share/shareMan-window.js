define(function(require) {
    var cloud = require("cloud/base/cloud");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./shareMan.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    var Paging = require("cloud/components/paging");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var columns = [{
		"title":locale.get({lang:"organization_name"}),
		"dataIndex": "name",
		"cls": null,
		"width": "25%"
	},
	{
		"title":locale.get({lang:"email"}),
		"dataIndex":"email",
		"cls": null,
		"width": "25%"
	},{
		"title":locale.get({lang:"creator"}),
		"dataIndex":"creator",
		"cls": null,
		"width": "25%"
	},{
		"title":locale.get({lang:"create_time"}),
		"dataIndex":"createTime",
		"cls": null,
		"width": "25%",
		 render: function (data) {
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}else{
				return data;
			}
		 }
	}];
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.data = options.data;
            this.oName = options.oName;
            this.executeOName = options.executeOName;
            this.display = 30;
			this.pageDisplay = 30;
			this.nameA = [];
			this.elements = {
				
				table : {
					id : "oid_list_table",
					"class" : null
				},
				paging : {
					id : "oid_list_paging",
					"class" : null
				}
			};
            this._renderWindow();
            
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "version_distribution"}),
                top: "center",
                left: "center",
                height: 600,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.adWindow.show();
            $("#saveBase").val(locale.get({lang: "save"}));
            $("#ui-window-content").css("overflow","hidden");
            
            this.renderTable();
            this._renderBtn();
            this.getData();
            
        },
        getData:function(){
        	var self = this;
        	self.searchData = {};
        	
        	Service.getAllOid(self.searchData,30,0,function(data){
        		
        		var Data = {
        				"server":self.data.server,
        				"executeOName":self.executeOName
        		};
        		Service.getVersionDistributionInfo(Data,0,100,function(datas) {
        			var index = [];
        			self.nameA = [];
        			if(datas.result.length > 0){
        				for(var i=0;i<datas.result.length;i++){
        					
        					var name = datas.result[i].oName;
        					for(var j=0;j<data.result.length;j++){
        						
        						if((data.result[j].name == name) || (data.result[j].name == "admin")){
        							if($.inArray(j,index) == -1){
        								index.push(j);
            							data.total --;
            							self.nameA.push(data.result[j].name);
        							}
        							
        						}
        						
        					}
        					
        				}
        			}
        			
        			for(var k=0;k<index.length;k++){
        				data.result.splice(index[k]-k,1);
        			}
        			
        			var total = data.total;
    				this.totalCount = data.result.length;
    		        data.total = total;
    		        self.listTable.render(data.result);
    		        self._renderpage(data, 1);
    		        cloud.util.unmask("#oid_list_table");
				});
				
			});
        		
        },
        _renderBtn: function() {
        	var self = this;
        	
        	$("#saveBase").bind("click", function() {

        		var idsArr = self.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                		
                		var name =  idsArr[i].name;
                		
                		self.data.oName = name;
                		self.data.executeOName = self.executeOName;
                		Service.addVersionDistribution(self.data,function(data){
            				if (data.error_code == null && data.result) {						
            					self.fire("getVersionList");
                    			self.adWindow.destroy();
    						}else if(data.error_code == "70030"){
    							dialog.render({lang: "version_desc_exists"});
    							return ;
    						}
                		});
                		
                    }
                }
        		
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
        				Service.getAllOid(self.searchData, options.limit,options.cursor,function(datas){
        					
        					var index = [];
        					
            				for(var i=0;i<self.nameA.length;i++){
            					
            					var name = self.nameA[i];
            					for(var j=0;j<datas.result.length;j++){
            						
            						if((datas.result[j].name == name) || (datas.result[j].name == "admin")){
            							if($.inArray(j,index) == -1){
            								index.push(j);
                							datas.total --;
            							}

            							
            						}
            						
            					}
            					
            				}
                			
            				for(var k=0;k<index.length;k++){
                				datas.result.splice(index[k]-k,1);
                			}
                			
    	        			self.pageRecordTotal = datas.total - datas.cursor;
  						    callback(datas);
        					
        					
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
        renderTable:function(){
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
	                	   
	                    },
	                   scope: this
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
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});