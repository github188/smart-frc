define(function(require){
	require("cloud/base/cloud");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./group.html");
	var GroupList = require("./groupList/groupList");
	var AutomatList = require("./automatList/automatList");
	var groupInfo = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.element.html(html);
			this.elements = {
				groupList : {
					id : "automat_group_group"
				},
				automatList : {
					id : "automat_group_automat"
				}
			};
			this._render();
		},
		_render:function(){
			this._renderLayout();
			this._renderGroupList();
			this._renderAutomatList();
		},
		_renderLayout:function(){
			if (this.layout) {
				this.layout.destory();
			}
			$("#automat_group").css({"position":"relative"});
			$("#automat_group").css({"height":$(".col-slide-menu").height()*0.8+"px"});
			this.layout = $("#automat_group").layout({
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
					paneSelector : "#" + this.elements.groupList.id,
					size : $("#col_slide_main").width()*0.2
				},
				center : {
					paneSelector : "#" + this.elements.automatList.id
				}
			});
		},
		_renderGroupList:function(){
			this.groupList = new GroupList({
				container:"#automat_group_group"
			});
		},
		_renderAutomatList:function(){
			this.automatList = new AutomatList({
				container:"#automat_group_automat"
			});
		}
	});
	return groupInfo;
});