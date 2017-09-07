define(function(require) {
    require("cloud/base/cloud");
    var configHtml = require("text!./config.html");
    require("cloud/lib/plugin/jquery.multiselect");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery.multiselect.css");
    require("cloud/base/fixTableHeader");
    var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var Service = require("../service");
	var NoticeBar = require("./notice-bar");
	var setChargeWin = require("./setCharge-win");
   
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
		"width": "10%"
	},{
		"title":"是否收费",
		"dataIndex":"charge",
		"cls": null,
		"width": "7%",
		 render: function(data, type, row) {
			 var display="";
			 if(data == 1){
				 display += new Template(
                 "<div  style='line-height: 25px;'><span style='color: orange;'>免费</span></div>")
                 .evaluate({ 
                   status: ''
                });
			 }else{
				 display += new Template(
                         "<div  style='line-height: 25px;'><span style='color: rgb(69, 139, 0);'>正常收费</span></div>")
                         .evaluate({ 
                           status: ''
                        });
			 }
			 return display;
		 }
	},{
		"title":"付费方式",
		"dataIndex":"payStyle",
		"cls": null,
		"width": "7%",
		 render: function(data, type, row) {
			 var display = "";
	       	 if(data && data == 2){
	       		display = new Template(
		                "<div><span  style='color: orange;'>预付费</span></div>")
		                .evaluate({ 
		                  status: ''
		               });
	       	 }else if(data && data==1){
	       		display = new Template(
                     "<div><span  style='color: rgb(69, 139, 0);'>后付费</span></div>")
                     .evaluate({ 
                        status: ''
                      });
	       	 }else{
	       		display="未知";
	       	 }
			 return display;
		 }
	},{
		"title":"折扣",
		"dataIndex":"discount",
		"cls": null,
		"width": "5%",
		 render: function(data, type, row) {
			 var display = "";
			 if(data){
				 display = data;
			 }else{
				 display="无";
			 }
			 return display;
		 }
	},
	{
		"title":"账号有效期",
		"dataIndex":"validTime",
		"cls": null,
		"width": "8%",
		 render: function (data) {
			if(data){
				return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd");
			}else{
				return data;
			}
		 }
	},{
		"title":"用户名",
		"dataIndex":"creator",
		"cls": null,
		"width": "8%"
	},
	{
		"title":"邮箱",
		"dataIndex":"email",
		"cls": null,
		"width": "12%"
	},
	{
		"title":"账单接收邮箱",
		"dataIndex":"billEmail",
		"cls": null,
		"width": "12%"
	},{
		"title":"联系人",
		"dataIndex": "address",
		"cls": null,
		"width": "6%"
	},{
		"title":"联系电话",
		"dataIndex": "phone",
		"cls": null,
		"width": "9%",
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
		"width": "6%",
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
		"width": "6%",
		render: function (data) {
			if(data){
				return data.split("***")[1];
			}else{
				return data;
			}
		 }
	}];
	
	
    var Profil = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.render();
        },
        render: function() {
            this.renderHtml();
            this._renderTable();
            this._renderNoticeBar();
            
            $("#oid_list").css("width",$(".wrap").width());
			$("#oid_list_paging").css("width",$(".wrap").width());
			
			$("#oid_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height()-50);
			
			var listHeight = $("#oid_list").height();
		    var barHeight = $("#oid_list_bar").height()*2;
			var tableHeight=listHeight - barHeight - 5;
			$("#oid_list_table").css("height",tableHeight);
			
			 var height = $("#oid_list_table").height()+"px";
		     $("#oid_list_table-table").freezeHeader({ 'height': height });
        },
        renderHtml: function() {
            var self = this;
            self.element.html(configHtml);
            
            $("#chargeSet").css("width",$(".container-bd").width());
            $("#chargeSet").css("height",$(".container-bd").height()-80);
            
            var div2=document.getElementById("div2");
            var div1=document.getElementById("div1");
            div2.onclick=function(){
              div1.className=(div1.className=="close1")?"open1":"close1";
              div2.className=(div2.className=="close2")?"open2":"close2";
              
              if(div1.className == "close1" && div2.className=="close2"){
            	 $("#oid_list").css("display","none");
  				 var option={
  					  charge:1
  				 };
  				 var oid="0000000000000000000abcde";
            	 Service.updateOidById(oid,option,function(data){
            		 console.log(data);
  				 });
              }else{
            	  $("#oid_list").css("display","block");
   				  var option={
   					  charge:0
   				  };
   				  var oid="0000000000000000000abcde";
             	  Service.updateOidById(oid,option,function(data){
             		 console.log(data);
   				  });
              }
            }
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
        	var email = $("#email").val();
        	var payStyle = $("#payStyles").find("option:selected").val();
        	if(payStyle == "0"){
        		payStyle="";
        	}
            self.searchData={
        				name:name,
        				email:email,
        				payStyle:payStyle
            };
			
			Service.getAllOid(self.searchData,limit,cursor,function(data){
				var total = data.total;
				this.totalCount = data.result.length;
		        data.total = total;
		        self.listTable.render(data.result);
		        self._renderpage(data, 1);
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
						  modify:function(){
							  var selectedResouces = self.getSelectedResources();
		                        if (selectedResouces.length == 0) {
		                            dialog.render({lang: "please_select_at_least_one_config_item"});
		                        } else if (selectedResouces.length >= 2) {
		                            dialog.render({lang: "select_one_gateway"});
		                        } else {
		                        	 var _id = selectedResouces[0]._id;
		                        	 if (this.setCharge) {
				                            this.setCharge.destroy();
				                     }
		                        	 this.setCharge = new setChargeWin({
				                            selector: "body",
				                            id:_id,
				                            events: {
				                                "getOidList": function() {
				                                	self.loadTableData($(".paging-limit-select").val(),0);
				                                }
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
    return Profil;
});