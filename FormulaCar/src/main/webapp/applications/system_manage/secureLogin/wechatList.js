define(function(require) {
	var cloud = require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var html = require("text!./wechatList.html");
	require("cloud/lib/plugin/jquery-ui");
	var _Window = require("cloud/components/window");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Paging = require("cloud/components/paging");
	var Button = require("cloud/components/button");
	var Table = require("cloud/components/table");
	var validator = require("cloud/components/validator");
	var Service = require("./service");
	var NoticeBar= require("./notice-bar");
	var columns = [
	   {
	     "title":locale.get({lang:"headimgurl"}),//头像
	     "dataIndex": "headimgurl",
	     "cls": null,
	     "width": "25%",
	     render:function(data, type, row){
			    var  display = "";
			    if(data){
	                display += new Template(
	                    "<img src='"+data+"' style='width: 40px;height: 40px;'/>")
	                    .evaluate({
	                        status : data
	                    });
			    }
             return display;
         }
	   },
	  {
		"title":locale.get({lang:"nickname"}),//昵称
		"dataIndex": "nickname",
		"cls": null,
		"width": "25%",
	 }, {
		"title":locale.get({lang:"product_status"}),//状态
		"dataIndex": "status",
		"cls": null,
		"width": "25%",
		 render:function(data,type,row){
	            return "已绑定";
	        }
	}, {
		"title":locale.get({lang:"operate"}),//操作
		"dataIndex": "",
		"cls": null,
		"width": "25%",
		 render:function(data,type,row){
	            return "<a id='"+row._id+"\' class=\"cloud-button cloud-button-body cloud-button-text-only\" title=\"解除绑定\" lang=\"text:config\"><span class=\" cloud-button-text\" >解除绑定</span></a>"
	            	
	        }
	}];
	var list = Class.create(cloud.Component, {
		initialize: function($super, options) {
			$super(options);
			this.display = null;
			this.pageDisplay = 30;
			this.elements = {
				bar : {
						id : "wechatUser_list_bar",
						"class" : null
			    },
				table : {
					id : "wechatUser_list_table",
					"class" : null
				}
			};
			this.render();
		},
		render:function(){
			this._renderHtml();
			$("#wechatUser_list").css("width",$(".wrap").width()*0.945);
			this._renderTable();
			this._renderNoticeBar();
		},
		_renderHtml : function() {
			this.element.html(html);
		},
		_renderTable : function() {
			this.listTable = new Table({
				selector : "#wechatUser_list_table",
				columns : columns,
				datas : [],
				pageSize : 100,
				autoWidth : false,
				pageToolBar : false,
				//checkbox : "full",
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
			var height = $("#wechatUser_list_table").height()+"px";
	        $("#wechatUser_list_table-table").freezeHeader({ 'height': height });
			this.setDataTable();
		},
		setDataTable:function() {
			this.loadData();
		},
		loadData:function() {
			cloud.util.mask("#wechatUser_list_table");
			var self = this;
			var pageDisplay = this.pageDisplay;
			Service.getWechatUser(function(data) {
				self.datas = data.result;
		        self.listTable.render(data.result);
		        self._bindBtnEvent();
		        cloud.util.unmask("#wechatUser_list_table");
			});
		},
		_bindBtnEvent:function(){
            var self = this;    
            self.datas.each(function(one){      
            	 $("#"+one._id).unbind('click');
                 $("#"+one._id).bind('click',function(e){
                	 dialog.render({
		    				lang:"affirm_unbind",
		    				buttons: [{
		    					lang:"affirm",
		    					click:function(){
		    						Service.deleteWechatUser(one.openId,function(){
		    	                		 self.loadData();
		    	                	 });
		    						dialog.close();
		    					}
		    				},
		    				{
		    					lang:"cancel",
		    					click:function(){
		    						dialog.close();
		    					}
		    				}]
		    			});
                	 
            	 });
            });
		},
		_renderNoticeBar : function() {
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#wechatUser_list_bar",
				events : {
					  query: function(){
						  self.loadData();
					  }
					}
			});
		},
		getSelectedResources:function(){
        	var self = this;
        	var selectedRes = $A();
        	self.listTable && self.listTable.getSelectedRows().each(function(row){
        		selectedRes.push(self.listTable.getData(row));
        	});
        	return selectedRes;
        }
	});
	return list;
});