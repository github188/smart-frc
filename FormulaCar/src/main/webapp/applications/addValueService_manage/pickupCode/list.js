define(function(require){
	require("cloud/base/cloud");
	require("cloud/base/fixTableHeader");
	var layout = require("cloud/lib/plugin/jquery.layout");
	var html = require("text!./list.html");
	var Service = require("./service");
	var NoticeBar = require("./notice-bar");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var pickupCodeMan = require("./pickupCodeMan-window");
	var batchNumberDetail_window = require("./detail/batchNumberDetail_window");
	var list = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
	        this.element.html(html);
			this.elements = {
				bar : {
					id : "code_list_bar",
					"class" : null
				},
				table : {
					id : "code_list_content",
					"class" : null
				}
			};
		    this._render();
		},
		_render:function(){
			this.renderContent();
			this._renderNoticeBar();
		},
		renderContent:function(){
			var self = this;
			var batchNumber = $("#number").val();
			if(batchNumber){
				self.searchData={
					 batchNumber:batchNumber
			    };
			}else{
				self.searchData={
			    };
			}
			
			$("#code_list").css("height",$("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());
			var listHeight = $("#code_list").height();
		    var barHeight = $("#code_list_bar").height();
			var tableHeight=listHeight - barHeight;
			$("#code_content").css("height",tableHeight);
			
			$("#code_list_content").html("");
		    Service.getAllCode(self.searchData,0,30,function(data){
				 console.log(data);
				 if(data.result.length>0){
					 var html="";
					 for(var i=0;i<data.result.length;i++){
						 var batchNumber = data.result[i].batchNumber;
						 var endTime = data.result[i].endTime;
						 endTime = cloud.util.dateFormat(new Date(endTime), "yyyy-MM-dd hh:mm");
						 
						 var startTime= data.result[i].startTime;
						 startTime = cloud.util.dateFormat(new Date(startTime), "yyyy-MM-dd hh:mm");
						 
						 var total= data.result[i].total;
						 var type= data.result[i].type;
						 var condition ="";
						 if(type == 1){
							 type="基于价格";
							 if(data.result[i].price){
								 condition ="≤&nbsp;"+data.result[i].price/100;
						     }
							  
						 }else if(type == 2){
							 type="基于商品";
							 if(data.result[i].goodsName){
								 condition =data.result[i].goodsName; 
							 }
						 }
						 var used=0;
						 if(data.result[i].used){
							 used = data.result[i].used;
						 }
						 var content_class = "contentclass";
						 if(total == used){
							 content_class="contentclass_";
						 }
						 
						 
						 
						 
						 if(i%4==0){
							 html = html + "<tr style='width:100%;'><td>"+
									 "<div class='external'>"+
						              "<div class='topclass'>"+
						               "<div class='topclass1'>"+
						               "<input id='s_"+batchNumber+"'  class='invending_checkbox' style='width:15px;height:15px;' type='checkbox'>&nbsp;"+
						                "<label>批次号:</label>"+
						                "<label>"+batchNumber+"</label>"+
						                "</div>"+
						               "<div class='topclass2'>"+ 
						               "<a href='javascript:;' class='detail' id="+batchNumber+">详情</a>"+
						                "</div>"+
						              "</div>"+
						              "<div class='"+content_class+"'>"+
						               "<div class='contentclass1'>"+
						                 "<div style='float: left;'><label>"+type+"</label></div>"+
						                 "<div style='text-align: right;'><label>"+condition+"</label></div>"+
						                 "</div>"+
						               "<div class='contentclass2'>"+
						                "<label>共"+total+"个</label>"+
						                "</div>"+
						               "<div class='contentclass3'>"+
						                "<label>已使用"+used+"个</label>"+
						               "</div>"+
						               "<div class='contentclass3'>"+
						               "<label>有效期："+startTime+"至"+endTime+"</label>"+
						               "</div>"+
						               "</div>"+
						               "</div></td>";
						 }else if(i%4==3){
							 html = html + "<td><div class='external'>"+
				              "<div class='topclass'>"+
				               "<div class='topclass1'>"+
				                "<input id='s_"+batchNumber+"'  class='invending_checkbox' style='width:15px;height:15px;' type='checkbox'>&nbsp;"+
				                "<label>批次号:</label>"+
				                "<label>"+batchNumber+"</label>"+
				                "</div>"+
				               "<div class='topclass2'>"+
				               "<a href='javascript:;' class='detail' id="+batchNumber+">详情</a>"+
				                "</div>"+
				              "</div>"+
				              "<div class='"+content_class+"'>"+
				               "<div class='contentclass1'>"+
				                 "<div style='float: left;'><label>"+type+"</label></div>"+
				                 "<div style='text-align: right;'><label>"+condition+"</label></div>"+
				                 "</div>"+
				               "<div class='contentclass2'>"+
				                "<label>共"+total+"个</label>"+
				                "</div>"+
				               "<div class='contentclass3'>"+
				                "<label>已使用"+used+"个</label>"+
				               "</div>"+
				               "<div class='contentclass3'>"+
				               "<label>有效期："+startTime+"至"+endTime+"</label>"+
				               "</div>"+
				               "</div>"+
				               "</div></td></tr>";
						 }else{
							 html = html  +"<td><div class='external' style='float:left;'>"+
						              "<div class='topclass'>"+
						               "<div class='topclass1'>"+
						               "<input id='s_"+batchNumber+"' class='invending_checkbox'  style='width:15px;height:15px;' type='checkbox'>&nbsp;"+
						                "<label>批次号:</label>"+
						                "<label>"+batchNumber+"</label>"+
						                "</div>"+
						               "<div class='topclass2'>"+
						               "<a href='javascript:;' class='detail' id="+batchNumber+">详情</a>"+
						                "</div>"+
						              "</div>"+
						              "<div class='"+content_class+"'>"+
						               "<div class='contentclass1'>"+
						                 "<div style='float: left;'><label>"+type+"</label></div>"+
						                 "<div style='text-align: right;'><label>"+condition+"</label></div>"+
						                 "</div>"+
						               "<div class='contentclass2'>"+
						                "<label>共"+total+"个</label>"+
						                "</div>"+
						               "<div class='contentclass3'>"+
						                "<label>已使用"+used+"个</label>"+
						               "</div>"+
						               "<div class='contentclass3'>"+
						               "<label>有效期："+startTime+"至"+endTime+"</label>"+
						               "</div>"+
						               "</div>"+
						               "</div></td>";
						 }
						 
					 }
					 $("#code_list_content").append(html);
					 
					 $(".detail").bind('click', function() {
			        	  var batchNumber = $(this)[0].id;
			        	  if (this.batchNumberDetail) {
	                            this.batchNumberDetail.destroy();
	                      }
	                      this.batchNumberDetail = new batchNumberDetail_window({
	                            selector: "body",
	                            batchNumber:batchNumber
	                      });
			         });
					 
					
				 }
			});
		},
        _renderNoticeBar:function(){
			var self = this;
			this.noticeBar = new NoticeBar({
				selector : "#code_list_bar",
				events : {
					  query: function(){
						  self.renderContent();
					  },
					  
					  add:function(){
						    if (this.addCode) {
	                            this.addCode.destroy();
	                        }
	                        this.addCode = new pickupCodeMan({
	                            selector: "body",
	                            events: {
	                                "getcodeList": function() {
	                                	self.renderContent();
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
	                        	 if (this.updateCode) {
	 	                            this.updateCode.destroy();
	 	                        }
	 	                        this.updateCode = new pickupCodeMan({
	 	                            selector: "body",
	 	                            id:_id,
	 	                            events: {
	 	                                "getcodeList": function() {
	 	                                	self.renderContent();
	 	                                }
	 	                            }
	 	                        });
	                        }
					  },
					  drop:function(){
						  self.codeChecked = [];
						  $(".invending_checkbox").each(function() {
							 if($(this)[0].checked){//选中
								 self.codeChecked.push($(this)[0].id.split("_")[1]);
							 }
						  });
						  console.log(self.codeChecked);
						  var ids = "";
						  if(self.codeChecked.length>0){
							  for (var i = 0; i < self.codeChecked.length; i++) {
	                               if (i == self.codeChecked.length - 1) {
	                                   ids = ids + self.codeChecked[i];
	                               } else {
	                                   ids = ids + self.codeChecked[i] + ",";
	                               }
	                           }
						  }
                         
						  if(self.codeChecked.length === 0){
							  dialog.render({lang: "please_select_at_least_one_config_item"});
						  }else{
							  dialog.render({
	                                lang: "affirm_delete",
	                                buttons: [{
	                                        lang: "affirm",
	                                        click: function() {
	                                            Service.deleteCode(ids, function(data) {
	                                            	   self.renderContent();
	                                            });
	                                            dialog.render({lang: "deletesuccessful"});
	                                            dialog.close();
	                                        }
	                                    },
	                                    {
	                                        lang: "cancel",
	                                        click: function() {
	                                            dialog.close();
	                                        }
	                                    }]
	                            });
	                      }
					  },
				}
			});
		},
		
	});
	return list;
});