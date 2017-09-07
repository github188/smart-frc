define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Content = require("./content/content");
	var Service = require("./service");
	var Add = require("./add/add");
	var Edit = require("./edit/edit");
	var columns = [ {
		"title":locale.get({lang:"status"}),
		"dataIndex" : "online",
		"cls" : null,
		"width" : "12%",
		render:function(data, type, row){
             var display = "";
             if ("display" == type) {
                 switch (data) {
                     case 1:
                    	 var offlineStr = locale.get({lang:"offline"});
                         display += new Template(
                             "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                             .evaluate({
                                 status : offlineStr
                             });
                         break;
                     case 0:
                    	 var onlineStr = locale.get({lang:"online"});
                         display += new Template(
                             "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                             .evaluate({
                                 status : onlineStr
                             });
                         break;
                     default:
                         break;
                 }
                 return display;
             } else {
                 return data;
             }
         }
	}, {
		"title":locale.get({lang:"create_time"}),
		"dataIndex" : "createTime",
		"cls" : null,
		"width" : "17%",
		render:function(data, type, row){
			return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
		}
	}, {
		"title":locale.get({lang:"automat_no1"}),
		"dataIndex" : "assetId",
		"cls" : null,
		"width" : "15%"
	}, {
		"title":locale.get({lang:"automat_name"}),
		"dataIndex" : "name",
		"cls" : null,
		"width" : "25%"
	},{
		"title":locale.get({lang:"automat_site_name"}),
		"dataIndex" : "siteName",
		"cls" : null,
		"width" : "25%"
	}/* {
		"title":locale.get({lang:"automat_of_group"}),
		"dataIndex" : "automatGroupName",
		"cls" : null,
		"width" : "20%"
	}*/];
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
	        this.elements = {
				content : {
					id : "content-table"
				},
				info : {
					id : "info-table"
				}
			};
		    this._render();
		},
		_render:function(){
			this._renderLayout();
			this._renderContent();
			//this._renderEventListener();
		},
		/*_renderEventListener:function(){
			var self = this;
			this.rightSide.hover(function(){
                self._animate(true);
            },function(){
                self._animate(false);
            });
			this.rightbar.hover(function(){
                self._animate(true);
            });
		},*/
		_animate:function(flag){
			var self = this;
			if(flag == "right" || flag == false){
			    setTimeout(function(){
			        self.rightSide.stop().animate({
			            right:"-300px"
			        },300,"swing");
			        self.rightbar.stop().animate({
			            right:"0px",
			            opacity:"1"
			        },300,"swing");
			    },200);
			}
			if(flag == "left" || flag == true){
                self.rightSide.stop().animate({
                	right : "0px"
                },300,"swing");
                self.rightbar.stop().animate({
                	right:"300px",
                    opacity:"0"
                },300,"swing");
            }
		},
		_renderLayout:function(){
			var self = this;
            this.right = $('<div class="rightNav"></div>').appendTo($(".automatContent"));
            var height = document.body.scrollHeight - $("#user-header").height();
            var top = $("#user-header").height();
            this.rightSide = $("<div id='info-table'  class='automat-right' style='top:"+top+"px;height:"+height+"px;overflow: auto;'></div>").appendTo(this.right);
            this.rightbar = $("<div></div>").appendTo(this.right);
            // class='automat-bar' <img src='./operation_manage/automat/automat_manage/list/images/br_prev.png'>
			$("#content-table").css({"position":"relative"});
			self._animate(false);
			self._renderAddView();
		},
		_renderContent:function(){
			var self = this;
			if(this.content){
				this.content.destroy();
			}
			this.content = new Content({
				selector: "#"+this.elements.content.id,
				columns:columns,
				service:Service,
				events:{
					"click":function(data){
						self._renderEditView(data);
						self._animate(true);
					},
					"add":function(){
						self._renderAddView();
						self._animate(true);
					}
				}
			});
		},
		_renderAddView:function(){
			var self = this;
			this.addView = new Add({
				selector:"#"+this.elements.info.id,
				service:Service,
				events:{
					"refreshTable":function(data){
						self._renderEditView(data);
						self.content.loadTableData($(".paging-limit-select option:selected").val(),0);
					},
					"hide":function(){
						self._animate(false);
					},
					"roadConfig":function(data){
						self.addView.saveGoodsConfig = data;
					}
				}
			});
		},
		_renderEditView:function(data){
			var self = this;
			this.editView = new Edit({
				selector:"#"+self.elements.info.id,
				service:Service,
				id:data,
				events:{
					"refreshTable":function(){
						self.content.loadTableData($(".paging-limit-select option:selected").val(),0);
					},
					"hide":function(){
						self._animate(false);
					},"roadConfig":function(data){
						self.editView.realRoadsData = data;
					}
				}
			});
		}
	});
	return list;
});