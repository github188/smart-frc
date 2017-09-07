define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var tgpickupCodeMan =  require("./codeMan-win");
	var TDCodeList = require("./codeList/list");
	var ImportCode = require("./importCode/importCode-window");
	var tgCodeSeeMan = require("./seecodeList/list");
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
			this.elements = {
				bar : {
					id : "tgcode_list_bar",
					"class" : null
				},
				table : {
					id : "tgcode_list_content",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			this.renderContent();
			this._renderNoticeBar();
			this.renderGetData();
			this.renderCodeList();
		},
		renderContent:function(){
			var self = this;
			
			$("#tgcode_list").css("width",$(".container-bd").width());
			$("#tgcode_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#tgcode_list").height();
		    var barHeight = $("#tgcode_list_bar").height();
			var tableHeight=listHeight - barHeight;
			$("#tgcode_content").css("height",tableHeight);
			
		},
		renderCodeList:function(){
			var self = this;
			this.codeList = new TDCodeList({
                selector: "#codeList"
            });
		},
		renderGetData:function(){
			var self = this;
			$("#tgcode_list_content").html('');
			Service.getCode(function(data){
				console.log(data);
				if(data.result && data.result.tgcode){
					var parDay = data.result.tgcode[2];
					var parWeek = data.result.tgcode[3];
					
					var startTime = cloud.util.dateFormat(new Date(parseInt(data.result.tgcode[0])), "yyyy-MM-dd")
					var endTime = cloud.util.dateFormat(new Date(parseInt(data.result.tgcode[1])), "yyyy-MM-dd");
					
					var total=0;
					var searchData={
							cardId:'',
		            		code:''
					};
					Service.getAllCode(searchData,-1,0,function(data_){
						console.log(data_);
						total = data_.total;
						$("#tgcode_list_content").append(
								"<tr style='width:100%;'><td>"+
								 "<div class='external'>"+
					              "<div class='topclass'>"+
					               "<div class='topclass1'>"+
					                   "<div class='edit' style='color:#28b5d6;cursor: pointer;'>编辑</div>"+
					                "</div>"+
					               "<div class='topclass2'>"+ 
					                   "<div class='detail' style='color:#28b5d6;cursor: pointer;'>取货码明细</div>"+
					                "</div>"+
					              "</div>"+
					              "<div class='contentclass'>"+
					               "<div class='contentclass1'>"+
					                 "<div style='float: left;'><label>"+parDay+" 次/人/天</label></div>"+
					                 "<div style='text-align: right;'><label>"+parWeek+" 次/人/周</label></div>"+
					               "</div>"+
					               "<div class='contentclass2'>"+
					                 "<label>取货码数："+total+"个</label>"+
					               "</div>"+
					               "<div class='contentclass3'>"+
					               "<label>有效期："+startTime+"至"+endTime+"</label>"+
					               "</div>"+
					               "</div>"+
					               "</div></td></tr>"
						);
						$(".edit").bind('click', function() {
			            	  if (this.updateCode) {
			                     this.updateCode.destroy();
			                  }
			                  this.updateCode = new tgpickupCodeMan({
			                     selector: "body",
			                     id:'update',
			                     events: {
			                         "getcodeList": function() {
			                         	self.renderGetData();
			                         }
			                     }
			                 });
						 });
						 $(".detail").bind('click', function() {
							 if (this.seeCode) {
			                     this.seeCode.destroy();
			                  }
			                  this.seeCode = new tgCodeSeeMan({
			                     selector: "body",
			                     events: {
			                         "getcodeList": function() {
			                         	self.renderGetData();
			                         }
			                     }
			                 });
						 });
					});
				}
			});
		},
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#tgcode_list_bar",
				events : {
					  add: function(){
						    if (this.addCode) {
	                            this.addCode.destroy();
	                        }
	                        this.addCode = new tgpickupCodeMan({
	                            selector: "body",
	                            events: {
	                                "getcodeList": function() {
	                                	self.renderGetData();
	                                }
	                            }
	                        });
					  },
					  importExcel: function(){
						    if (this.imPro) {
	                            this.imPro.destroy();
	                        }
	                        this.imPro = new ImportCode({
	                            selector: "body",
	                            events: {
	                                "getcodeList": function() {
	                                	self.renderGetData();
	                                }
	                            }
	                        });
					  }
				}
			});
		},
		
	});
	return list;
});