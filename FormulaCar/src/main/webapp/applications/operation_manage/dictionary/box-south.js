define(function(require){
	var cloud = require("cloud/base/cloud");
	var html = require("text!./box-south.html");
	var GoodsTypeList = require("./south-right/goodsType-south-right");
	var SiteTypeList = require("./south-right/siteType-south-right");
	//var rightCss = require("../css/online-noticebar.css");
	var Table = require("cloud/components/table");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var Button = require("cloud/components/button");
	//var ContentChart = require("./box-south-right");

	var ContentSouth = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.elements = {
					box:{
						id:"box-south",
						"class":null
					},
					left:{
						id:"box-south-left",
						"class":null
					},
					right:{
						id:"box-south-right",
						"class":null
					}
			};
			this._render();
		},
		
		_render:function(){
			this._renderHtml();
			this._renderLayout();
			this._renderLeft();
			this._renderRight();
		},
		
		_renderHtml:function(){
			this.element.html(html);
		},
		
		_renderLayout:function(){
			var self = this;
			this.layout = this.element.layout({
                defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 1,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                },
                west: {
                    paneSelector: "#" + this.elements.left.id,
                    size: 250
                },
                center: {
                    paneSelector: "#" + this.elements.right.id
                }
            });
			this.leftlayout = this.element.find("#" +this.elements.left.id).layout({
				defaults: {
                    paneClass: "pane",
                    togglerLength_open: 50,
                    togglerClass: "cloud-layout-toggler",
                    resizerClass: "cloud-layout-resizer",
                    spacing_open: 0,
                    spacing_closed: 1,
                    togglerLength_closed: 50,
                    resizable: false,
                    slidable: false,
                    closable: false
                }
			});
			var height = this.element.find("#" + this.elements.left.id).height();
			this.display = Math.ceil((height-60)/34-1);
        },

		_renderLeft:function(){
			$("#editTable").append("<tr id='name'>"
					+"<td class='dictionary'>"
					+  "<label >"+locale.get({lang: "name1"})+"</label>"
					+"</td>"
					+"</tr>"
					+"<tr id='siteType' style='background-color: white; cursor: pointer;'>"
					+"<td class='dictionaryTable'>"
					+  "<label>"+locale.get({lang: "site_type"})+"</label>"
					+"</td>"
					+"</tr>"
					+"<tr id='goodsType'style='background-color: white; cursor: pointer;'>"
					+"<td class='dictionaryTable'>"
					+  "<label >"+locale.get({lang: "automat_goods_type_name"})+"</label>"
					+"</td>"
					+"</tr>");
			 $("#siteType").mouseover(function(){
			        $(this).css("background-color","#F4F5F9");
			        });
			 $("#siteType").mouseout(function(){
			        $(this).css("background","white");
			        });
			 $("#goodsType").mouseover(function(){
				 	$(this).css("background-color","#F4F5F9");
			        });
			 $("#goodsType").mouseout(function(){
			        $(this).css("background","white");
			        });
		},
		_renderRight:function(){
			$("#box-south-right").css("overflow","hidden");
		 	 var self = this;
			 var siteTypeList = new SiteTypeList({
				container: $("#box-south-right")
			});
			$("#siteType").bind('click',function() {
				 $("#box-south-right").empty();
			 	 var self = this;
				 var siteTypeList = new SiteTypeList({
					container: $("#box-south-right")
				});
			 });
		   $("#goodsType").bind('click',function() {
				 $("#box-south-right").empty();
			 	 var self = this;
				 var goodsTypeList = new GoodsTypeList({
					container: $("#box-south-right")
				});
			 });
		},
	});
	
	return ContentSouth;
	
});