define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./list.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
	var _Window = require("cloud/components/window");

    var AddVender = require("./addVender-window");
 
    var Service = require("./service");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
    var columns = [{
        "title": locale.get({lang: "numbers"}),
        "dataIndex": "number",
        "cls": null,
        "width": "50%"
    },{
            "title": locale.get({lang: "vender"}),
            "dataIndex": "name",
            "cls": null,
            "width": "50%"
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }];
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "vender_list_bar",
                    "class": null
                },
                table: {
                    id: "vender_list_table",
                    "class": null
                },
                paging: {
                    id: "vender_list_paging",
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
				title: locale.get({lang:"manufacturer_maintenance"}),
				top: "center",
				left: "center",
				height:500,
				width: 625,
				mask: true,
				drag:true,
				content: html,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
							self.fire("getvenderList");
							
					},
					
					scope: this
				}
			});
			 this.window.show();	
			 this.render();
		},     
        render: function() {
            this._renderTable();
            this._renderNoticeBar();
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
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
            this.loadData(100,0);
        },
        loadData: function(limit,cursor) {
            cloud.util.mask("#vender_list_table");
            var self = this;

            var typename = $("#typename").val();
            self.typename = typename;
            Service.getVenderList(eurl,limit, cursor,typename, function(data) {
            	 var total = data.result.length;
				 self.pageRecordTotal = total;
	        	 self.totalCount = data.result.length;
        		 self.listTable.render(data.result);
                cloud.util.unmask("#vender_list_table");
            });
        },
        _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
	       			selector : $("#vender_list_paging"),
	       			data:data,
	   				current:1,
	   				total:data.total,
	   				limit:this.pageDisplay,
	       			requestData:function(options,callback){
	       				var typename = $("#typename").val();
	       				Service.getVenderList(eurl,options.limit,options.cursor,typename,function(data){
	       				       self.pageRecordTotal = data.total - data.cursor;
							   callback(data);
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
        _renderNoticeBar: function() {
            var self = this;           
            this.noticeBar = new NoticeBar({
                selector: "#"+self.elements.bar.id,
                events: {
                    query: function() {//查询
                        cloud.util.mask("#vender_list_table");
                        var pageDisplay = self.display;
                        var typename = $("#typename").val();
                        if (typename) {
                        	typename = self.stripscript(typename);
                        }    
                        
                        Service.getVenderList(eurl,pageDisplay,0,typename, function(data) {
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            cloud.util.unmask("#vender_list_table");
                        });
                    },
                    add: function() {//添加
                        if (this.addProType) {
                            this.addProType.destroy();
                        }
                        this.addProType = new AddVender({
                            selector: "body",
                            events: {
                                "getvenderList": function() {
                                    self.loadData($(".paging-limit-select").val(),0);
                                }
                            }
                        });
                    },
                    modify: function() {//修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({lang: "please_select_at_least_one_config_item"});
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({lang: "select_one_gateway"});
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.modifyProType) {
                                this.modifyProType.destroy();
                            }
                            this.modifyProType = new AddVender({
                                selector: "body",
                                id: _id,
                                events: {
                                    "getvenderList": function() {
                                        self.loadData($(".paging-limit-select").val(),0);
                                    }
                                }
                            });
                        }
                    },
                    drop: function() {//删除
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

                                                Service.deleteVenderById(eurl,_id, function(data) {
                                                	if(data.error != null){
                     	    	                	   if(data.error_code == "70040"){
                     	    	                		  dialog.render({lang: "vender_have_model_no_delete",width:430});
                     	    	                	   }
                                                	}
                                                });
                                            }
                                            self.loadData($(".paging-limit-select").val(),0);
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
            var selectedRes = $A();
            self.listTable && self.listTable.getSelectedRows().each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});
