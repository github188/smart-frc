define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./share.html");
	var StaffList = require("./staffList/staffList");
	var ShareList = require("./shareList/shareList");
	var share = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(html);
			this.elements = {
				staff:{
					id : "dispatching_share_staff"
				},
				share:{
					id : "dispatching_share_share"
				}
			};
			this._render();
		},
		_render:function(){
			this._renderLayout();
			this._renderStaffList();
			this._renderShareList();
		},
		_renderLayout:function(){
			if (this.layout) {
				this.layout.destory();
			}
			$("#dispatching_share").css({"position":"relative"});
			$("#dispatching_share").css({"height":$(".col-slide-menu").height()+"px"});
			this.layout = $("#dispatching_share").layout({
				defaults : {
					paneClass : "pane",
					togglerClass : "cloud-layout-toggler",
					resizerClass : "cloud-layout-resizer",
					"spacing_open" : 1,
					"spacing_closed" : 1,
					"togglerLength_closed" : 50,
					resizable : false,
					slidable : false,
					closable : false
				},
				west : {
					paneSelector : "#" + this.elements.staff.id,
					size : $("#col_slide_main").width()*0.2
				},
				center : {
					paneSelector : "#" + this.elements.share.id
				}
			});
		},
		_renderStaffList:function(){
			var self = this;
			this.staffList = new StaffList({
				container:"#"+self.elements.staff.id
			});
		},
		_renderShareList:function(){
			var self = this;
			this.shareList = new ShareList({
				container:"#"+self.elements.share.id
			});
		}
	});
	return share;
});