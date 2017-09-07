define(function(require) {
    var cloud = require("cloud/base/cloud");
	var html = require("text!./clone.html");
    require("cloud/lib/plugin/jquery-ui");
   // var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
	var _Window = require("cloud/components/window");
	var Service = require("../service");
	  var columns = [{
	        "title": locale.get({lang: "numbers"}),
	        "dataIndex": "assetId",
	        "cls": null,
	        "width": "25%"
	    },{
	            "title": locale.get({lang: "name1"}),
	            "dataIndex": "name",
	            "cls": null,
	            "width": "25%"
	     },{
	            "title": locale.get({lang: "automat_site_name"}),
	            "dataIndex": "siteName",
	            "cls": null,
	            "width": "25%"
	      }, {
	            "title": locale.get({lang: "line_man_name"}),
	            "dataIndex": "lineName",
	            "cls": null,
	            "width": "25%"
	     }];
	
	    var list = Class.create(cloud.Component, {
	        initialize: function($super, options) {
	        	  $super(options);
	        	   this.display = 30;
	               this.pageDisplay = 30;
	               this.containerGoods=options.containerGoods;
	               this.masterType=options.masterType;
	               this.goodsConfigsNew=options.goodsConfigsNew;
	               this.modelConfigsNew=options.modelConfigsNew;
                   this.config=options.config;
                   this.deviceId=options.deviceId;
	               this.elements = {
	               
	                   table: {
	                       id: "automat_list_table",
	                       "class": null
	                   },
	                   paging: {
	                       id: "automat_list_paging",
	                       "class": null
	                   }
	               };
	               this._renderWindow();
	               locale.render({element:this.element});
	        	
	        },
	        _renderWindow:function(){
				var bo = $("body");
				var self = this;
				this.window = new _Window({
					container: "body",
					title: locale.get({lang:"select_cloning_machine"}),
					top: "center",
					left: "center",
					height:470,
					width: 625,
					mask: true,
					drag:true,
					content: html,
					events: {
						"onClose": function() {
								this.window.destroy();
								cloud.util.unmask();
							//	self.fire("getVendMachineList");
								
						},
						
						scope: this
					}
				});
				 this.window.show();	
				 this.render();
			},     
			render: function() {
		            this._renderTable();
		            this.clonesubmit();
		          //  this._renderNoticeBar();
		    },
	        _renderTable: function() {
	        	var self = this;
	            this.listTable = new Table({
	                selector:"#"+self.elements.table.id,
	                columns: columns,
	                datas: [],
	                pageSize: 100,
	                autoWidth: false,
	                pageToolBar: false,
	                checkbox: "full",
	                events: {
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
	        setDataTable: function() {
	            this.loadData(10,0);
	        },
	        loadData: function(limit,cursor) {
	            cloud.util.mask("#automat_list_table");
	            var self = this;
	            var searchData={
	            		containersNew:self.containerGoods,
	  	               masterType:self.masterType,
	  	               goodsConfigsNew:self.goodsConfigsNew,
	  	               modelConfigsNew:self.modelConfigsNew,
	                   config:self.config
	            };
	           var resultmap=[];
	           Service.getCloningList(searchData,function(data) {
	        	  
		        	for (var i = 0; i <  data.result.length; i++) {
		        		if(data.result[i]._id==self.deviceId){
		        			data.result.splice(i,1);
		        		}
					} 
		        	 var total = data.result.length;
		        	   	//self.pageRecordTotal = total;
			        	 self.totalCount = data.result.length;
	        		 self.listTable.render(data.result);
	        	    cloud.util.unmask("#automat_list_table");
	           });
	        /*    Service.getAllAutomatsByPage(searchData,limit, cursor, function(data) {
	            	for (var i = 0; i < data.result.length; i++) {
	            		if(self.masterType&&data.result[i].masterType&&self.masterType==data.result[i].masterType){
		            		resultmap.push(data.result[i]);
		            		
		            	}
					}
	            	 var total = resultmap.length;
					 self.pageRecordTotal = total;
		        	 self.totalCount = resultmap.length;
	        		 self.listTable.render(resultmap);
	        		 self._renderpage(resultmap, 1);
	                cloud.util.unmask("#automat_list_table");
	            });*/
	        },
	        _renderpage: function(data, start) {
	            var self = this;
	            if (self.page) {
	                self.page.reset(data);
	            } else {
	                self.page = new Paging({
	                    selector: $("#automat_list_table"),
	                    data: data,
	                    current: 1,
	                    total: data.total,
	                    limit: this.pageDisplay,
	                    requestData: function(options, callback) {
	                    	cloud.util.mask("#automat_list_table");
	                    	  var searchData={
	          	            		limit:-1,
	          	            		cursor:0,
	          	            		vflag:1,
	          	            		verbose:5
	          	            };
	                        Service.getAllAutomatsByPage(searchData, options.limit, options.cursor, function(data) {
	                        	
	                            self.pageRecordTotal = data.total - data.cursor;
	                            callback(data);
	                            cloud.util.unmask("#automat_list_table");
	                        });
	                    },
	                    turn: function(data, nowPage) {
	                    /*	 var resultmap=[];
	                    	for (var i = 0; i < data.length; i++) {
	    	            		if(self.masterType&&data[].masterType&&self.masterType==data.result[i].masterType){
	    		            		resultmap.push(data.result[i]);
	    		            		
	    		            	}
	    					}*/
	                        self.totalCount = data.length;
	                        self.listTable.clearTableData();
	                        self.listTable.render(data);
	                        self.nowPage = parseInt(nowPage);
	                        
	                    },
	                    events: {
	                        "displayChanged": function(display) {
	                            self.display = parseInt(display);
	                        }
	                    }
	                });
	                this.nowPage = start;
	            }
	        },
	        clonesubmit:function(){
	        	var self = this;
	        	$("#clone_submit").bind("click", function(){
	        		var ids=[];
	        		 var selectedResouces = self.getSelectedResources();
                     if (selectedResouces.length === 0) {
                         dialog.render({lang: "please_select_at_least_one_config_item"});
                     }
                     for (var i = 0; i < selectedResouces.length; i++) {
						ids.push(selectedResouces[i]._id);
					}
	        		
	        		var subdata = {};
	        		subdata.goodsConfigsNew =self.goodsConfigsNew;
	        		subdata.ids = ids;
	        		subdata.containersNew=self.containerGoods;
	        		if(ids==null||ids.length!=0){
	        			Service.cloningGoodsToAutomat(subdata,function(data){
		        			if(data.result=="ok"){
		        				dialog.render({lang: "clonesuccess"});
		        				self.window.destroy();
		                        cloud.util.unmask();
		        			}else{
		        				dialog.render({lang: "clonefail"});
		        			}
		        		});
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
	
    return list;
});