define(function(require) {
    require("cloud/base/cloud");
    require("cloud/base/fixTableHeader");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    
    var NoticeBar = require("./notice-bar-ed");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var Service = require("./service");
    var columns = [{
		"title":locale.get({lang:"user_area"}),//区域
		"dataIndex" : "areaname",
		"cls" : null,
		"width" : "10%"
	},{
		"title":locale.get({lang:"trade_range_time"}),//交易时间
		"dataIndex" : "tradeRangeTime",
		"cls" : null,
		"width" : "20%"
	},{                                             
		"title":locale.get({lang:"settle_time"}),    //结算时间
		"dataIndex" : "settleTime",
		"cls" : null,
		"width" : "15%",
		render:function(data, type, row){
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
			}
			
		}
	},{
		"title":locale.get({lang:"trade_receive_amount_all"}),//总应给款
		"dataIndex" : "",
		"cls" : null,
		"width" : "10%",
		 render: function(data, type, row) {
	            var display = (row.alipayReceivableAmount + row.wechatReceivableAmount).toFixed(2);
	            return display;
	     }
	},{
	     "title": locale.get({lang:"trade_pay_style"}),
	     "field": "",
	     "width": "15%",
	     "dataIndex" : "",
	     render: function(data, type, row) {
	    	    var display = "";
	    		display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td width='25px'>微信</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td>支付宝</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    		 return display;
	     }
	 },{
			"title":locale.get({lang:"trade_income_amount"}),//净收入
			"dataIndex" : "",
			"cls" : null,
			"width" : "10%",
			render: function(data, type, row) {
		    	    var display = "";
		    		display += new Template(
		    	             "<table width='100%' height='100%' border='1px'>"+
		    			       "<tr style='border-bottom:0px;border-top:0px;'><td width='25px'>"+row.wechatIncomeAmount+"</td></tr>"+
		    			       "<tr style='border-bottom:0px;border-top:0px;'><td>"+row.alipayIncomeAmount+"</td></tr>"+
		    			     "</table>")
		    	             .evaluate({
		    	                 status : ''
		    	             });
		    		 return display;
		     }
	 },{
			"title":locale.get({lang:"trade_counter_fee"}),//手续费
			"dataIndex" : "",
			"cls" : null,
			"width" : "10%",
			render: function(data, type, row) {
	    	    var display = "";
	    		display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td width='25px'>"+row.wechatCounterFee+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td>"+row.alipayCounterFee+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    		 return display;
	     }
	 },{
			"title":locale.get({lang:"trade_receive_amount"}),//应给款
			"dataIndex" : "",
			"cls" : null,
			"width" : "10%",
			render: function(data, type, row) {
	    	    var display = "";
	    		display += new Template(
	    	             "<table width='100%' height='100%' border='1px'>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td width='25px'>"+row.wechatReceivableAmount+"</td></tr>"+
	    			       "<tr style='border-bottom:0px;border-top:0px;'><td>"+row.alipayReceivableAmount+"</td></tr>"+
	    			     "</table>")
	    	             .evaluate({
	    	                 status : ''
	    	             });
	    		 return display;
	     }
	 }];

    
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);

            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
        		bar: {
                    id: "settle_list_bar",
                    "class": null
                },
                table: {
                    id: "settle_list_table",
                    "class": null
                },
                paging: {
                    id: "settle_list_paging",
                    "class": null
                }
            };

            this._render();
            
   
        },
        _render: function() {
		    
		    $("#settles_list").css("width",$(".wrap").width());
			$("#settle_list_paging").css("width",$(".wrap").width());
			
			$("#settles_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			
		    var listHeight = $("#settles_list").height();
	        var barHeight = $("#settle_list_bar").height()*2;
		    var tableHeight=listHeight - barHeight - 5;
		    $("#settle_list_table").css("height",tableHeight);
		    $("#settle_list_table").css("width",$(".wrap").width());
		    
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
                selector: "#settle_list_table",
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
            var height = $("#settle_list_table").height()+"px";
	        $("#settle_list_table-table").freezeHeader({ 'height': height });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        }, 
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#settle_list_table");
            var self = this;

            var areaId = "";
            
            if($("#areas").attr("multiple") != undefined){
            	areaId = $("#areas").multiselect("getChecked").map(function() {//用户
                    return this.value;
                }).get();
            }

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
			var roleType = permission.getInfo().roleType;
			Service.getAreaByUserId(userId,function(areadata){
				var areaIds=[];
                if(areadata && areadata.result && areadata.result.area && areadata.result.area.length>0){
                	areaIds = areadata.result.area;
                }
                if(roleType == 51){
                	areaIds = [];
                }
                self.areaIds = areaIds;
                if(areaId.length != 0){
                	areaIds = areaId;
                }
                
                if(roleType != 51 && areaIds.length == 0){
                	areaIds = ["000000000000000000000000"];
                }
                
                var startTime = null;
                var endTime = null;
                var startDate = $("#times_start").val();
                var endDate = $("#times_end").val();
                
                if(startDate != null && startDate != '' && endDate != null && endDate != ''){
               	 startTime = (new Date(startDate + " 00:00:00")).getTime() / 1000;
                    endTime = (new Date(endDate + " 23:59:59")).getTime() / 1000;
                }
                
                 Service.getSettlelist(areaIds,null,startTime,endTime, limit, cursor,1,function(data) {
               	  
               	  if(data.error!=null){
	                	   if(data.error_code == "70038"){
							   dialog.render({lang:"please_set_rate"});
							   return;
						   }else if(data.error_code == "70039"){
							   dialog.render({lang:"please_set_correct_rate"});
							   return;
						   }
	                	   
	                  }else{
	                	  var total = data.result.length;
	                      self.pageRecordTotal = total;
	                      self.totalCount = data.result.length;
	                     
	                      self.listTable.render(data.result);
	                      self._renderpage(data, 1);
	                      cloud.util.unmask("#settle_list_table");
	                  }
                     
                 }, self); 
            });
            
        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#settle_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                    	cloud.util.mask("#settle_list_table");

                    	var startTime = null;
                        var endTime = null;
                        var startDate = $("#times_start").val();
                        var endDate = $("#times_end").val();
                        if(startDate != null && startDate != '' && endDate != null && endDate != ''){
                       	    startTime = (new Date(startDate + " 00:00:00")).getTime() / 1000;
                            endTime = (new Date(endDate + " 23:59:59")).getTime() / 1000;
                            
                       	if(startTime>=endTime){
                            	
                            	dialog.render({lang:"start_gte_end"});
                      			return;
                            }
                        }
                        var roleType = permission.getInfo().roleType;
                        var areaIds = self.areaIds;
                        
                        var areaId = $("#areas").multiselect("getChecked").map(function() {//用户
                            return this.value;
                        }).get();
                        
                        if(areaId.length != 0){
                        	areaIds = areaId;
                        }
                        
                        if(roleType != 51 && areaIds.length == 0){
                        	areaIds = ["000000000000000000000000"];
                        }
                        Service.getSettlelist(areaIds,null,startTime,endTime, options.limit, options.cursor,1, function(data) {
                        	
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            cloud.util.unmask("#settle_list_table");
                        });
                    },
                    turn: function(data, nowPage) {
                    	
                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
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
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#settle_list_bar",
                events: {
                    query: function() {
                    	cloud.util.mask("#settle_list_table");
                    	 var pageDisplay =  self.display;
                    	 var startTime = null;
                         var endTime = null;
                         var startDate = $("#times_start").val();
                         var endDate = $("#times_end").val();
                         if(startDate != null && startDate != '' && endDate != null && endDate != ''){
                        	 startTime = (new Date(startDate + " 00:00:00")).getTime() / 1000;
                             endTime = (new Date(endDate + " 23:59:59")).getTime() / 1000;
                             
                        	 if(startTime>=endTime){
                             	
                             	dialog.render({lang:"start_gte_end"});
                       			return;
                             }
                         }
                         var roleType = permission.getInfo().roleType;
                         var areaIds = self.areaIds;
                         
                         var areaId = $("#areas").multiselect("getChecked").map(function() {//用户
                             return this.value;
                         }).get();
                         
                         if(areaId.length != 0){
                         	areaIds = areaId;
                         }
                         
                         if(roleType != 51 && areaIds.length == 0){
                         	areaIds = ["000000000000000000000000"];
                         }
                    	 Service.getSettlelist(areaIds,null,startTime,endTime, pageDisplay,0,1, function(data) {
                             var total = data.result.length;

                             self.pageRecordTotal = total;
                             self.totalCount = data.result.length;
                             self.listTable.render(data.result);
                             self._renderpage(data, 1);
                             cloud.util.unmask("#settle_list_table");
                         }, self);  

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