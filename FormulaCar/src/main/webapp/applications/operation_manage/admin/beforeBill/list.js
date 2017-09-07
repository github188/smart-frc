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
	var BillManageWin = require("./manage/billInfo_Win");
	var SeeBillWin = require("./detail/BillDetail");
	var billPayWin = require("./billPay-win");
	
	var columns = [ {
		"title":locale.get({lang:"bill_no"}),//账单编号
		"dataIndex" : "number",
		"cls" : null,
		"width" : "14%",
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
		"title":"类型",//账单类型
		"dataIndex" : "type",
		"cls" : null,
		"width" : "4%",
		render: function(data, type, row) {
	       	 var display="";
	       	 if(data && data==1){//续费账单
	       		display = new Template(
		                "<div><span  style='color: rgb(69, 139, 0);'>续费</span></div>")
		                .evaluate({ 
		                  status: ''
		               });
	       	 }else if(data && data==2){//增点账单
	       		display = new Template(
                       "<div><span  style='color: orange;'>增点</span></div>")
                       .evaluate({ 
                          status: ''
                        });
	       	 }
	       	 
	       	 return display;
	       }
	},{
		"title":"使用期限",//使用期限
		"dataIndex" : "",
		"cls" : null,
		"width" : "16%",
		render: function(data, type, row) {
			var display= cloud.util.dateFormat(new Date(row.startTime), "yyyy-MM-dd") +" 至 " +cloud.util.dateFormat(new Date(row.endTime), "yyyy-MM-dd")
			return display;
		}
	},{
		"title":locale.get({lang:"bill_organization_name"}),//公司简称
		"dataIndex" : "name",
		"cls" : null,
		"width" : "8%"
	},{
		"title":locale.get({lang:"bill_points"}),//点数
		"dataIndex" : "nums",
		"cls" : null,
		"width" : "5%"
	}
	,{
		"title":locale.get({lang:"bill_amount_payable"}),//应付金额
		"dataIndex" : "payAmount",
		"cls" : null,
		"width" : "14%",
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
	}
	,{
		"title":locale.get({lang:"bill_payment_deadline"}),//付款截止时间
		"dataIndex" : "deadline",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{
		"title":locale.get({lang:"bill_actual_payment_time"}),//实际付款时间
		"dataIndex" : "payTime",
		"cls" : null,
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				if(row.status == 1 && row.money=="0"){
					return cloud.util.dateFormat(new Date(row.createTime), "yyyy-MM-dd");
				}
			}
		}
	},{
		"title":locale.get({lang:"bill_state"}),//账单状态
		"dataIndex" : "status",
		"cls" : null,
		"width" : "6%",
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
				}else if(data == 2){
					display += new Template(
                            "<div  style='line-height: 25px;'><span>"+locale.get({lang: "save"})+"</span></div>")
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
		"width" : "9%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}
		}
	},{
        "title": locale.get({lang:"operate"}),
        "dataIndex": "operate",
        "width": "10%",
        render: function(data, type, row) {
        	if(row.status == 2){
        		 var display="";
             	 display += new Template(
                      "<div><span>无</span></div>")
                      .evaluate({ 
                        status: ''
                     });
                return display;
        		
        	}else{
        		if(row.status == 1 || row.money=="0"){
           		     var display="";
                 	 display += new Template(
                          "<div><span>无</span></div>")
                          .evaluate({ 
                            status: ''
                     });
                 	 
	                return display;
	           	}else{
	           		 var display="";
	                 display += new Template(
	                          "<div  style='line-height: 15px;text-align: Center;font-size: 12px;border-radius: 0px;padding: 3px 10px;color: #fff;border: 1px solid #09c;background-color: #09c;width: 50px;cursor: pointer;'><span id='"+row._id+"' number='"+row.number+"' name='"+row.name+"' type='"+row.type+"' style='cursor: pointer;' class='beforebillpay' >确认收款</span></div>")
	                          .evaluate({ 
	                            status: ''
	                         });
	                 	 
	                return display;
	           	}
        		
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
					id : "beforebill_list_bar",
					"class" : null
				},
				table : {
					id : "beforebill_list_table",
					"class" : null
				},
				paging : {
					id : "beforebill_list_paging",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			$("#beforebill_list").css("width",$(".wrap").width());
			$("#beforebill_list_paging").css("width",$(".wrap").width());
			
			$("#beforebill_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
			var listHeight = $("#beforebill_list").height();
		    var barHeight = $("#beforebill_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#beforebill_list_table").css("height",tableHeight);
			
			
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
			//确认收款
		    $(".beforebillpay").click(function(){
		    	var number = $(this)[0].attributes[1].value;
		    	var name = $(this)[0].attributes[2].value;
		    	var type = $(this)[0].attributes[3].value;
		    	if (this.beforebillPay) {
                    this.beforebillPay.destroy();
                }
                this.beforebillPay = new billPayWin({
                    selector: "body",
                    number:number,
                    name:name,
                    type:type,
                    events: {
                        "getbeforebillList": function() {
                        	 self.loadTableData($(".paging-limit-select").val(),0);
                        }
                    }
                });
			});
        	$(".invendingLine").click(function(){
        		var _id = $(this)[0].id;
        		var number = $(this)[0].innerText;
        		if(data.result && data.result.length>0){
        			for(var i=0;i<data.result.length;i++){
        				if(data.result[i]._id ==_id ){
        					if (this.seebeforebill) {
        	                    this.seebeforebill.destroy();
        	                }
        	                this.seebeforebill = new SeeBillWin({
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
				selector : "#beforebill_list_table",
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
			var height = $("#beforebill_list_table").height()+"px";
	        $("#beforebill_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable : function() {
			this.loadTableData(30,0);
		},
		loadTableData : function(limit,cursor) {
			var self = this;
			cloud.util.mask("#beforebill_list_table");
			
			var organName = $("#organName").val();//公司简称
			var type ="";
			
		    var saler="";
		    var state ="";
		    if($("#salesman").attr("multiple") != undefined){
		    	
		    	saler = $("#salesman").multiselect("getChecked").map(function() {
		            return this.value;
		        }).get();
		    	
		    	state = $("#state").multiselect("getChecked").map(function() {
                    return this.value;
                }).get();
		    	
		    	type = $("#type").multiselect("getChecked").map(function() {
                    return this.value;
                }).get();
		    }
		    if(type.length ==0){
		    	type=[1,2];
		    }
			self.searchData={
					org:organName,
					saler:saler,
					state:state,
					type:type
			};
			Service.getAllBill(self.searchData,limit,cursor,function(data){
				 console.log(data);
				 var total = data.result.length;
   				 self.pageRecordTotal = total;
   	        	 self.totalCount = data.result.length;
           		 self.listTable.render(data.result);
   	        	 self._renderpage(data, 1);
   	        	 self._renderBtn(data);
   	        	 cloud.util.unmask("#beforebill_list_table");
			});
		},
		 _renderpage:function(data, start){
			 var self = this;
			 if(self.page){
				 self.page.reset(data);
			 }else{
				 self.page = new Paging({
        			selector : $("#beforebill_list_paging"),
        			data:data,
    				current:1,
    				total:data.total,
    				limit:this.pageDisplay,
        			requestData:function(options,callback){
        				cloud.util.mask("#beforebill_list_table");
        				Service.getAllBill(self.searchData, options.limit,options.cursor,function(data){
        				   self.pageRecordTotal = data.total - data.cursor;
						   callback(data);
						   self._renderBtn(data);
						   cloud.util.unmask("#beforebill_list_table");
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
				selector : "#beforebill_list_bar",
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
	                        	
	                        	if (this.seebeforebill) {
	                                this.seebeforebill.destroy();
	                            }
	                            this.seebeforebill = new SeeBillWin({
	                                selector: "body",
	                                id: _id,
	                                number:number,
	                                data:selectedResouces[0]
	                            });
	                        }
					  },
					  add:function(){
						  if (this.addPro) {
	                            this.addPro.destroy();
	                      }
	                      this.addPro = new BillManageWin({
	                            selector: "body",
	                            events: {
	                                "getBillList": function() {
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
	                        	if (this.modifyPro) {
	                                this.modifyPro.destroy();
	                            }
	                            this.modifyPro = new BillManageWin({
	                                selector: "body",
	                                id: _id,
	                                events: {
	                                    "getBillList": function() {
	                                    	self.loadTableData($(".paging-limit-select").val(),0);
	                                    }
	                                }
	                            });
	                        }
					  },
					  drop:function(){
						    var selectedResouces = self.getSelectedResources();
	                        if (selectedResouces.length == 0) {
	                            dialog.render({lang: "please_select_at_least_one_config_item"});
	                            return;
	                        } else {
	                        	var _id = selectedResouces[0]._id;
	                            var status = selectedResouces[0].status;
	                          
	                            dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            self.listTable.mask();
	                                            Service.deleteBeforeBillById(_id, function(data) {
	                                                console.log(data);
	                                                self.loadTableData($(".paging-limit-select").val(),0);
	                                            }, self);
	                                            self.listTable.unmask();
	                                            dialog.close();
	                                        }
	                                    },
	                                    {
	                                        lang: "cancel",
	                                        click: function() {
	                                            self.listTable.unmask();
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