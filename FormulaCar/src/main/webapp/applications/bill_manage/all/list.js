define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Paging = require("cloud/components/paging");
	var SeeBillWin = require("../../operation_manage/admin/bill/detail/BillDetail");
	var columns = [ {
		"title":locale.get({lang:"bill_no"}),//账单编号
		"dataIndex" : "number",
		"cls" : null,
		"width" : "20%",
		render: function(data, type, row) {
	       	 var display="";
	       	 display += new Template(
	                "<div><span id='"+row._id+"' number='"+row.number+"' style='color: #09c;cursor: pointer;' class='invendingLine' >"+data+"</span></div>")
	                .evaluate({ 
	                  status: ''
	               });
	       	 
	       	 return display;
	       }
	},{
		"title":"账单类型",
		"dataIndex" : "type",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			if(data == 0){
				return "后付费"
			}else if(data == 1){
				return "续费"
			}else if(data == 2){
				return "增点"
			}
		}
	},{
		"title":locale.get({lang:"bill_month"}),//月份
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			var date  = cloud.util.dateFormat(new Date(data), "MM")
	    	return date-1;
		}
	},{
		"title":locale.get({lang:"bill_points"}),//点数
		"dataIndex" : "nums",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"bill_amount_payable"}),//应付金额
		"dataIndex" : "payAmount",
		"cls" : null,
		"width" : "12%",
		render:function(data, type, row){
			var display="";
			if(data>0 && (data!=row.money)){
				display += new Template(
	                    "<div><span>"+data+locale.get({lang:"yuan"})+"</span>&nbsp;<span style='text-decoration:line-through;color: rgba(191, 185, 185, 0.92);'>"+row.money+locale.get({lang:"yuan"})+"</span></div>")
	                    .evaluate({ 
	                      status: ''
	                   });
			}else{
				display += new Template(
	                    "<div><span>"+data+locale.get({lang:"yuan"})+"</span></div>")
	                    .evaluate({ 
	                      status: ''
	                   });
			}
			
			return display;
		}
	},{
		"title":locale.get({lang:"bill_payment_deadline"}),//付款截止时间
		"dataIndex" : "deadline",
		"cls" : null,
		"width" : "10%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{
		"title":locale.get({lang:"bill_state"}),//账单状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			var display="";
			if(data || data == 0){
				if(data == 0){
					
					display += new Template(
                            "<div  style='line-height: 25px;'><span style='color: red;'>"+locale.get({lang: "bill_not_paying"})+"</span></div>")
                            .evaluate({ 
                              status: ''
                           });
				}else if(data == 1){
					display += new Template(
                            "<div  style='line-height: 25px;'><span style='color: rgb(69, 139, 0);'>"+locale.get({lang: "bill_paying"})+"</span></div>")
                            .evaluate({ 
                              status: ''
                           });
				}
			}else{
				display=locale.get({lang: "automat_unknown"});
			}
			return display;
		}
	},{                                             //创建时间
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	}];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.display = 30;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
					id : "all_list_bar",
					"class" : null
				},
				table : {
					id : "all_list_table",
					"class" : null
				},
				paging : {
					id : "all_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#all_list").css("width",$(".wrap").width());
			$("#all_list_paging").css("width",$(".wrap").width());
			
			$("#all_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#all_list").height();
		    var barHeight = $("#all_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#all_list_table").css("height",tableHeight);
			    
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
		_renderBtn:function(data){
			var self = this;
        	$(".invendingLine").click(function(){
        		var _id = $(this)[0].id;
        		var number = $(this)[0].innerText;
        		if(data.result && data.result.length>0){
        			for(var i=0;i<data.result.length;i++){
        				if(data.result[i]._id ==_id ){
        					if (this.seeBill) {
        	                    this.seeBill.destroy();
        	                }
        	                this.seeBill = new SeeBillWin({
        	                    selector: "body",
        	                    id: _id,
        	                    number:number,
        	                    data:data.result[i]
        	                });
        				}
        			}
        		}
        		
        	});
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#all_list_table",
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
			var height = $("#all_list_table").height()+"px";
	        $("#all_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			var self = this;
			cloud.util.mask("#all_list_table");
			
			var organName = $("#user-panel-oidName").val();
			var number = $("#billNo").val();//账单编号
			
		    var state ="";
		    if($("#state").attr("multiple") != undefined){
		    	state = $("#state").multiselect("getChecked").map(function() {
                    return this.value;
                }).get();
		    }
		    
		    var startTime = '';
            var endTime = '';
		    var selectedId = $("#reportType").find("option:selected").val();
            if(selectedId){
		    	
		    }else{
		    	var date  = new Date();
		    	var months = date.getMonth();
		    	var year=date.getFullYear(); 
		    	var byMonth = year +"/"+months;
		    	var  maxday = new Date(year,months,0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime() / 1000;
                } else {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }
		    }
		    if (selectedId == "0") {
		    	var  byMonth = $("#times_month").val();
		    	var year= byMonth.split('/')[0]; 
                var months = byMonth.split('/')[1];
            	var  maxday = new Date(year,months,0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/" +maxday+ " 23:59:59")).getTime() / 1000;
                } else {
                    startTime = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }
                
            }else if(selectedId == "1"){
            	var  byYear = $("#year").val();
            	startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
                endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;
            }
			
			var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
			Service.getOidById(oid,function(datas){
				self.searchData={
						org:datas.result.name,
						state:state,
						number:number,
						startTime:startTime,
						endTime:endTime,
						type:datas.result.payStyle
				};
				Service.getAllBill(self.searchData,limit,cursor,function(data){
					 console.log(data);
					 var total = data.result.length;
	   				 self.pageRecordTotal = total;
	   	        	 self.totalCount = data.result.length;
	           		 self.listTable.render(data.result);
	   	        	 self._renderpage(data, 1);
	   	        	 self._renderBtn(data);
	   	        	 cloud.util.unmask("#all_list_table");
				});
			});
			
        	
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#all_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#all_list_table");
        				Service.getAllBill(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   self._renderBtn();
						   cloud.util.unmask("#all_list_table");
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
				selector : "#all_list_bar",
				events : {
					  query: function(){
						  self.loadTableData($(".paging-limit-select").val(),0);
					  },
					  see:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                        } else if (selectedResouces.length >= 2) {
	                            dialog.render({lang: "select_one_gateway"});
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                        	var number = selectedResouces[0].number;
	                        	
	                        	if (this.seeBill) {
	                                this.seeBill.destroy();
	                            }
	                            this.seeBill = new SeeBillWin({
	                                selector: "body",
	                                id: _id,
	                                number:number,
	                                data:selectedResouces[0]
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