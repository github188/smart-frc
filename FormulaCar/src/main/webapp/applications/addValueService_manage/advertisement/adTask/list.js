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
	var SeeDetail = require("./seedetail-window");
	
	var columns = [{
		"title":locale.get({lang:"task_name"}),//任务名称
		"dataIndex" : "taskName",
		"cls" : null,
		"width" : "25%"
	}, {
		"title":locale.get({lang:"trade_automat_number"}),//售货机编号
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"task_schedule"}),//任务进度
		"dataIndex" : "data",
		"cls" : null,
		"width" : "25%",
		render:function(data, type, row){
			 var display = "";
			if(data && data.files && data.files.length>0){
				var finish =0;
				for(var i=0;i<data.files.length;i++){
					if(data.files[i].pushStatus == 1){
						finish =finish +1
					}
				}
				var result = parseInt((finish/data.files.length) *100);
				result = result + "%";
				display += new Template(
           			 "<div style=' background-color:#eee; height:14px;border-radius: 4px; width:120px; border:1px solid #bbb; color:#222;text-align: center;'>"+ 
           		        "<div style='width: "+result+"; background-color:rgb(132, 196, 74);height:14px;font-size:10px;text-align: center;'></div>"+
           		        "<div style='z-index: 2;margin-top: -15px;'>"+result+"</div>"+
           		    "</div>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
			}
		    return display;
		}
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "25%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
		}
	}];
	
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.type = options.type;
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "adTask_list_bar",
					"class" : null
				},
				table : {
					id : "adTask_list_table",
					"class" : null
				},
				paging : {
					id : "adTask_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			
			$("#adTask_list").css("width",$(".wrap").width());
			$("#adTask_list_paging").css("width",$(".wrap").width());
			
			$("#adTask_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#adTask_list").height();
		    var barHeight = $("#adTask_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#adTask_list_table").css("height",tableHeight);
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
				selector : "#adTask_list_table",
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
			var height = $("#adTask_list_table").height()+"px";
	        $("#adTask_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			cloud.util.mask("#adTask_list_table");
        	var self = this;
        	var taskname = $("#taskname").val();
        	var name =  $("#name").val();
        	self.searchData={
        			name:taskname,
        			assetId:name,
        			type:self.type
        	}
        	Service.getAllAdTask(self.searchData, limit,cursor,function(data){
        		 //console.log(data);
        		 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 cloud.util.unmask("#adTask_list_table");
        	});
        	
			
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#adTask_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#adTask_list_table");
        				Service.getAllAdTask(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   cloud.util.unmask("#adTask_list_table");
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
				selector : "#adTask_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see:function(){
						  var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length === 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                            var data = selectedResouces[0].data;
	                            this.seeInfo = new SeeDetail({
                                    selector: "body",
                                    data:data,
                                    events: {
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