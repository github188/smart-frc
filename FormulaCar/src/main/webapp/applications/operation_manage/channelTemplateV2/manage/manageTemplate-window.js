define(function(require){    
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
	var winHtml = require("text!./manageTemplate.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	require("./css/default.css");
	require("./css/style.css");
	require("./js/scrollable");
	var RelateAutomatInfo = require("../config/selectAutomat");	
	
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
	
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.templateId = options.templateId;
			this.data = options.data;
            this.goodsWinWidth = 458;
            this.goodsWinHeight = 378;
            this.roadId_selectAll = [];
            this.roadId_All = [];
            this.relateAutomatArray=[];
            this._renderWindow();
			locale.render({element:this.element});
		},

		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"channel_template"}),
				top: "center",
				left: "center",
				height:620,
				width: 1050,
				mask: true,
				drag:true,
				content: winHtml,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
            
			$("#nextBase").val(locale.get({lang: "next_step"}));
			this.window.show();	
			this.render();
	   		
		},
		render:function(){
			this.renderVender();//厂家
			this.renderType();//货柜类型
			this.renderModel();//型号
			this.renderShelfConfig();//货道配置
			this.renderBtn();//全选 与 取消
		    if(this.data){
				this.getTemplateInfoById();
			}
		},
		getTemplateInfoById:function(){
			if(this.data){
				var data = this.data;
				$("#template_name").val(data.result.name==null?"":data.result.name);
				$("#machineType_0 option[value='"+data.result.machineType+"']").attr("selected","selected");
				$("#vender_0").append("<option value='" +data.result.vender + "'>" +data.result.vender+"</option>");
				$("#vender_0 option[value='"+data.result.vender+"']").attr("selected","selected");
				$("#modelname_0").append("<option value='" + data.result.modelId +"'>" + data.result.modelName + "</option>");
				$("#modelname_0 option[value='"+data.result.modelId+"']").attr("selected","selected");
				
				$("#vender_0").attr("disabled",true);
				$("#machineType_0").attr("disabled",true);
				$("#modelname_0").attr("disabled",true);
				var shelves = data.result.shelves;
				this.setChannelConfig(shelves,data.result.machineType);	
				
			}
		},
		renderVender:function(){
			var language = locale._getStorageLang();
            if(language =='en'){
           	    this.renderVender_en();
            }else{
             	this.renderVender_zh_cn();
            }
		},
		renderVender_en:function(){
			var self = this;
        	$("#vender_0").html("");
			$("#vender_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList(eurl,0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender_0").append("<option value='" +data.result[i].name + "'>" +data.result[i].name+"</option>");
					}
				}
			});
		},
		renderVender_zh_cn:function(){
			$("#vender_0").html("");
        	var currentHost=window.location.hostname;
        	/*if(currentHost == "longyuniot.com"){
        		$("#vender_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		$("#vender_0").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            }else if(currentHost == "www.dfbs-vm.com"){
            	$("#vender_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender_0").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            }else {
            	$("#vender_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender_0").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            	$("#vender_0").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            	$("#vender_0").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
            	$("#vender_0").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
            	$("#vender_0").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
            	$("#vender_0").append("<option value='leiyunfeng'>雷云峰</option>"); 
            }*/
        	$("#vender_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#vender_0").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
        	$("#vender_0").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
        	$("#vender_0").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
        	$("#vender_0").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
        	$("#vender_0").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
        	$("#vender_0").append("<option value='leiyunfeng'>雷云峰</option>"); 
		},
		renderType:function(){
			var language = locale._getStorageLang();
			//国外Beverage machine就相当于1，Snack machine机型相当于2
            if(language =='en'){
            	$("#machineType_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#machineType_0").append("<option value='1'>Beverage machine</option>");
            	$("#machineType_0").append("<option value='2'>Snack machine</option>");
            	//$("#machineType_0").append("<option value='6'>Combo Vending Machine</option>");
            }else{
            	$("#machineType_0").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#machineType_0").append("<option value='1'>" +locale.get({lang: "drink_machine"})+"</option>");
            	$("#machineType_0").append("<option value='2'>" +locale.get({lang: "spring_machine"})+"</option>");
            	$("#machineType_0").append("<option value='3'>" +locale.get({lang: "grid_machine"})+"</option>");
            	$("#machineType_0").append("<option value='4'>" +locale.get({lang: "coffee_machine"})+"</option>");
            	$("#machineType_0").append("<option value='5'>" +locale.get({lang: "wine_machine"})+"</option>");
            }
		},
		renderModel:function(){
			var self = this;
			$("#modelname_0").append("<option value='0'>"+locale.get({lang: "please_select"})+"</option>");
			$("#vender_0").bind('change',function(){
				self.renderModelBy();
            });
			$("#machineType_0").bind('change',function(){
				self.renderModelBy();
            });
			$("#modelname_0").bind('change',function(){
				self.roadId_All=[];
			});
		},
		renderModelBy:function(){
			 $("#modelname_0").children().remove(); 
			 $("#modelname_0").append("<option value='0'>"+locale.get({lang: "please_select"})+"</option>");
			 var vender_value = $('#vender_0 option:selected').val();
			 var vender_text = $('#vender_0 option:selected').text();
			 var machineType_value = $('#machineType_0 option:selected').val();
			 machineType_value = parseInt(machineType_value);
			 if(vender_value && machineType_value){
				 var parameters={
						 machineType: machineType_value,
			             vender: vender_text
				 };
				 Service.getModelByVenderAndType(parameters,function(data){
					 if(data.result&&data.result.length>0){
						 for(var i=0;i<data.result.length;i++){
							 $("#modelname_0").append("<option value='" + data.result[i]._id +"'>" + data.result[i].name + "</option>");
						 }
					 }
				 });
			 }
		},
		renderShelfConfig:function(){
			var self = this;
			$("#modelname_0").bind('change',function(){
				self.renderSetChannelConfig();
            });
		},
		renderBtn:function(){
			var self = this;
			
			$("#nextBase").bind("click", function() {
            	self.renderDevice();
            });
			
			$("#selectAll").bind('click',function(){
				if(self.roadId_All.length>0){
					 for(var i=0;i<self.roadId_All.length;i++){
						 if(self.roadId_selectAll.indexOf(self.roadId_All[i])>-1){
						 }else{
							 self.roadId_selectAll.push(self.roadId_All[i]);
						 }
                     	$("#markShelf_"+self.roadId_All[i]).attr("checked",true);
                     }
				}
			});
           
			$("#cancelAll").bind('click',function(){
				if(self.roadId_selectAll.length > 0){
            		for(var i=0;i<self.roadId_selectAll.length;i++){
            			$("#markShelf_"+self.roadId_selectAll[i]).attr("checked",false);
            		}
            		self.roadId_selectAll = [];
            	}
			});
			
			$("#selectAll").mouseover(function (){
		    	$("#selectAll").css("opacity","1");
			}).mouseout(function (){
				$("#selectAll").css("opacity","0.8");
			});
            $("#cancelAll").mouseover(function (){
		    	$("#cancelAll").css("opacity","1");
			}).mouseout(function (){
				$("#cancelAll").css("opacity","0.8");
			});
		},
		renderDevice:function(){
			//对页面进行校验
			var template_name = $("#template_name").val();
			var machineType = $("#machineType_0").val();
			var vender = $("#vender_0").val();
			var modelId = $("#modelname_0").val();
			var modelName = $('#modelname_0 option:selected').text();
			
			if(template_name == null||template_name.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"template_name_not_exists"});
				return;
			};
			if(vender == null || vender == "select"){
				dialog.render({lang:"please_select_vender"});
				return;
			};
			if(machineType == null || machineType == "select"){
				dialog.render({lang:"please_select_machineType"});
				return;
			};
		
			if(modelId == null || modelId == "select"){
				dialog.render({lang:"please_select_machineNum"});
				return;
			};
			this.getNowChannelConfig(template_name,vender,machineType,modelName,modelId);
		},
		getNowChannelConfig:function(template_name,vender,machineType,modelName,modelId){
			var self = this;
			var channelConfig = {};
        	channelConfig.name = template_name;
        	channelConfig.vender = vender;
        	channelConfig.machineType = machineType;
        	channelConfig.modelName = modelName;
        	channelConfig.modelId = modelId;
        	channelConfig.shelves = [];
        	if(self.roadId_All.length>0){
        		for(var i=0;i<self.roadId_All.length;i++){
        			var roadId = self.roadId_All[i];
    				var goodsId = $("#" + roadId ).find("span").text();
    				var price = $("#" + roadId + "_price_content").val();
    				var goodsName = $("#" + roadId + "_name_content").text();
    				var image = $("#" + roadId ).find("input").val();
    				var imagepath = "";
    				var imagemd5 = "";
    				if(image != null && image != undefined){
    					imagepath = image.split("_")[0];
        				imagemd5 = image.split("_")[1];
    				}
    				
    				var capacity = $("#"+roadId+"_capacity_content").val();
    				var valve = $("#"+roadId+"_valve_content").val();
    				var goodsConfig = {};
    				goodsConfig.shelvesId = roadId;
    				goodsConfig.price = price;
    				goodsConfig.goodsId = goodsId;
    				goodsConfig.goodsName = goodsName;
    				goodsConfig.imagepath = imagepath;
    				goodsConfig.imagemd5 = imagemd5;
    				goodsConfig.capacity = capacity;
    				goodsConfig.valve = valve;
    				channelConfig.shelves.push(goodsConfig);
            	}
        		
        		self.roadId_selectAll = [];
        		
        		$("#tab1").removeClass("active");
                $("#tab2").addClass("active");
        		$("#relateAutomatConfig").css("display", "block");
                $("#baseInfo").css("display", "none");
                
                var deatil=null;
                if(self.data && self.data.result.relateAutomat){
                	deatil = self.data.result.relateAutomat;
                }
                this.relateAutomat = new RelateAutomatInfo({
	                    selector: "#relateAutomatInfo",
	                    automatWindow: self.window,
	                    nowConfig:channelConfig,
	                    relateAutomat:deatil,
	                    templateId:self.templateId,
	                    events: {
	                        "rendTableData": function() {
	                            self.fire("getTemplateList");
	                        }
	                    }
	            });
        	}
        	
		},
		setChannelConfig: function(shelves,machineType){
        	var self = this;       	
        	var row = 0;
        	var roadInfoHtml = "<table id='road_table' style='width:930px;margin-top: 10px;'>";
        	for(var i = 0;i<shelves.length;i++){
        		
        		if(i%8==0){
        			row = row + 1;
        			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
        		}
        		var total = (shelves.length)/8;
        		var sp = (shelves.length)%8;
        		var width=0;
        		if(total<1){
        			width = sp*12.5;
        			
        		}else{
        			width = 100;
        			
        		}
        		var capacity = '';
                var valve = '';
                if(shelves[i].valve != undefined){
                	valve = shelves[i].valve;
                }
                if(shelves[i].capacity != undefined){
                	capacity = shelves[i].capacity;
                }
                var capinput = "";
                var valveinput = "";

                if(machineType == 3){
                	capacity = 1;
                	valve = 0;
                	
                	capinput = "<input type='text' style='width:40px;height: 10px;margin-left: 12px;text-align:center;line-height:16px;' readonly='readonly' value='"+capacity+"' id='" + shelves[i].shelvesId + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/>";
                	valveinput = "<input type='text' style='width:40px;height: 10px;margin-left: -48px;text-align:center;line-height:16px;' readonly='readonly' value='" + valve + "' id='" + shelves[i].shelvesId + "_valve_content' placeholder='"+locale.get({lang:"shelf_threshold"})+"'/>";
                }else{
                	capinput = "<input type='text' style='width:40px;height: 10px;margin-left: 12px;text-align:center;line-height:16px;' value='"+capacity+"' id='" + shelves[i].shelvesId + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/>";
                	valveinput = "<input type='text' style='width:40px;height: 10px;margin-left: -48px;text-align:center;line-height:16px;' value='" + valve + "' id='" + shelves[i].shelvesId + "_valve_content' placeholder='"+locale.get({lang:"shelf_threshold"})+"'/>";
                }
                
        		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
        										"<table style='width:"+width+"%;margin-top: -25px;'>"+
        										"<tr><div style='position: relative;z-index: 9999;width: 25px;height: 25px; margin-top: -5px;margin-left: 85px;text-align: center;'><input id='markShelf_"+shelves[i].shelvesId+"' style='width:15px;height:15px;margin-top: 6px;' type='checkbox' /></div></tr>"+	
        										"<tr style='height:82px;width:100%'><td id='"+shelves[i].shelvesId+"' class='road_td_image' style='font-size:20px;'><div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+shelves[i].shelvesId+"</div>+</td></tr>"+
        											"<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='"+shelves[i].shelvesId+"_goods_name'><td><span style='font-weight:600' id='"+shelves[i].shelvesId+"_name_content'>&nbsp;"+"</span></td></tr>"+       											
        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + shelves[i].shelvesId + "_goods_price'><td><input type='text' value='0' style='width:40px;height: 10px;'  id='" + shelves[i].shelvesId+ "_price_content' />&nbsp;" + "<span>"+locale.get({lang: "china_yuan"})+"</span><span id='" + shelves[i].shelvesId + "_del'></span></td></tr>" +
        											"<tr style='width:100%;font-size:10px;line-height: 30px;' id='" + shelves[i].shelvesId + "_capacity_threshold'><td>"+capinput+"</td><td>"+valveinput+"</td></tr>"+
        											"</table>"+
        									  "</td>";
        		self.roadId_All.push(shelves[i].shelvesId);
        		if(i%8==7 || i == shelves.length-1){
        			
        			roadInfoHtml = roadInfoHtml +"</tr>";
        			
        		}
        		$("#markShelf_"+shelves[i].shelvesId).live('click',{roadId:shelves[i].shelvesId},function(e){
        			var check = $(this).is(':checked');
        			if(check){
        				self.roadId_selectAll.push(e.data.roadId);
        			}else{
        				var index = $.inArray(e.data.roadId,self.roadId_selectAll);
        				
						self.roadId_selectAll.splice(index, 1);
        			}
    			});
        		$("#"+shelves[i].shelvesId + "_capacity_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_capacity_content").val();
        			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
						for(var j=0;j<self.roadId_selectAll.length;j++){
							$("#"+self.roadId_selectAll[j] + "_capacity_content").val(text);
							
						}
        			}
        			
        		});
                $("#"+shelves[i].shelvesId + "_valve_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_valve_content").val();
        			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
						for(var j=0;j<self.roadId_selectAll.length;j++){
							$("#"+self.roadId_selectAll[j] + "_valve_content").val(text);
							
						}
        			}
        			
        		});
                $("#"+shelves[i].shelvesId + "_price_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_price_content").val();
        			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
						for(var j=0;j<self.roadId_selectAll.length;j++){
							$("#"+self.roadId_selectAll[j] + "_price_content").val(text);
							
						}
        			}
        			
        		});
        	};
        	$("#cargo_road_info").html(roadInfoHtml);
 	   	    
        	for(var i = 0;i<shelves.length;i++){
        		var roadId = shelves[i].shelvesId;
        		var price = shelves[i].price;
    			var goodsId = shelves[i].goodsId;
    			var name = shelves[i].goodsName;
    			var imagepath = shelves[i].imagepath;  	
    			var imagemd5 = "";
    			if(shelves[i].imagemd5){
    				imagemd5 = shelves[i].imagemd5;
    			}
        		if(goodsId!="" && goodsId!=null){
        				        				
	        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();                      
	        			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+imagemd5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
	        			//$("#"+roadId+"_name_content").html(name);
	        			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
	        				$("#"+roadId+"_name_content").html(name);
                        }else{
                        	var shortName = name.substring(0, 8);
                        	$("#"+roadId+"_name_content").html(shortName);
                        }
	        			$("#" + roadId + "_price_content").val(price);
	                    $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	        			$("#remove_road_"+roadId).bind("click" ,{id:roadId}, function(ent){

	        				$("#"+ent.data.id).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+ent.data.id+"</div>+");
	    	    			$("#"+ent.data.id+"_name_content").html("&nbsp");
	    	    			$("#"+ent.data.id+"_del").html("&nbsp");
	        				$("#" + ent.data.id + "_price_content").val("0");
	        				
	        			});	        			
        		       			      			       		        		        		        		       		
        	    }   
        		       		
           };
           $("#road_table").css({"height":"auto"});
	   	   $(".road_td_image").bind("click" , function(){
	
	       		self.showGoodsInfoWindow(this.id);
	       });
                             	
        },
		renderSetChannelConfig:function(){
			var self = this;
			var vender = $('#vender_0 option:selected').text();
        	var machineType = $('#machineType_0 option:selected').val();
        	machineType = parseInt(machineType);
        	var modelId = $('#modelname_0 option:selected').val();
        	//根据选择的厂家 货柜类型及型号查询货道配置 并 绘制在页面中
        	Service.getAllModelList(eurl,modelId,machineType,vender,function(data){
        		if(data.result&&data.result.length>0){
        			var shelves = [];//货道数及货道号
        			var row = 0;
        			for(var i=0;i<data.result[0].shelves.length;i++){
        				if(data.result[0].shelves[i].length>0){
        					for(var j=0;j<data.result[0].shelves[i].length;j++){
        						shelves.push(data.result[0].shelves[i][j]);
        					}
        				}
        			}
        			if(shelves.length>0){
        				var total = (shelves.length)/8;
                		var sp = (shelves.length)%8;
                		var width=0;
                		if(total<1){
                			width = sp*12.5;
                		}else{
                			width = 100;
                		}
        				var roadInfoHtml = "<table id='road_table' style='width:920px;margin-top: 10px;'>";
        				for(var i = 0;i<shelves.length;i++){
        					if(i%8==0){
                    			row = row + 1;
                    			roadInfoHtml = roadInfoHtml + "<tr style='width:100%;height:100px'>";
                    		}
        					
        					var capinput = "";
                            var valveinput = "";
        					if(machineType == 3){
                            	capinput = "<input type='text' style='width:40px;height: 10px;margin-left: 12px;text-align:center;line-height:16px;' readonly='readonly' value='1' id='" + shelves[i].shelvesId + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/>";
                            	valveinput = "<input type='text' style='width:40px;height: 10px;margin-left: -48px;text-align:center;line-height:16px;' readonly='readonly' value='0' id='" + shelves[i].shelvesId + "_valve_content' placeholder='"+locale.get({lang:"shelf_threshold"})+"'/>";
                            }else{
                            	capinput = "<input type='text' style='width:40px;height: 10px;margin-left: 12px;text-align:center;line-height:16px;' value='' id='" + shelves[i].shelvesId + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/>";
                            	valveinput = "<input type='text' style='width:40px;height: 10px;margin-left: -48px;text-align:center;line-height:16px;' value='' id='" + shelves[i].shelvesId + "_valve_content' placeholder='"+locale.get({lang:"shelf_threshold"})+"'/>";
                            }
        					
        					roadInfoHtml = roadInfoHtml + 
        					"<td style='width:12.5%;'>"+
        					  "<table style='width:"+width+"%;margin-top: -25px;'>"+
							    "<tr><div style='position: relative;z-index: 9999;width: 25px;height: 25px; margin-top: -5px;margin-left: 85px;text-align: center;'><input id='markShelf_"+shelves[i].shelvesId+"' style='width:15px;height:15px;margin-top: 6px;' type='checkbox' /></div></tr>"+	
							    "<tr style='height:82px;width:100%'><td id='"+shelves[i].shelvesId+"' class='road_td_image' style='font-size:20px;'><div style='width: 23px;height: 30px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+shelves[i].shelvesId+"</div>+</td></tr>"+
								"<tr style='height:30px;width:100%;text-align:center;font-size:10px;'  id='"+shelves[i].shelvesId+"_goods_name'><td><span style='font-weight:600' id='"+shelves[i].shelvesId+"_name_content'>&nbsp;"+"</span></td></tr>"+       											
								"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + shelves[i].shelvesId + "_goods_price'><td><input type='text' value='0' style='width:40px;height: 10px;'  id='" + shelves[i].shelvesId+ "_price_content' />&nbsp;" + "<span>"+locale.get({lang: "china_yuan"})+"</span><span id='" + shelves[i].shelvesId + "_del'></span></td></tr>" +
								"<tr style='width:100%;font-size:10px;line-height: 30px;' id='" + shelves[i].shelvesId + "_capacity_threshold'><td>"+capinput+"</td><td>"+valveinput+"</td></tr>"+
							 "</table>"+
						   "</td>";
        					
        					self.roadId_All.push(shelves[i].shelvesId);
        					
        					if(i%8==7 || i == shelves.length-1){
                    			roadInfoHtml = roadInfoHtml +"</tr>";
                    		}
        					$("#markShelf_"+shelves[i].shelvesId).live('click',{roadId:shelves[i].shelvesId},function(e){
                    			var check = $(this).is(':checked');
                    			if(check){
                    				self.roadId_selectAll.push(e.data.roadId);
                    			}else{
                    				var index = $.inArray(e.data.roadId,self.roadId_selectAll);
            						self.roadId_selectAll.splice(index, 1);
                    			}
                			});
        					$("#"+shelves[i].shelvesId + "_capacity_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
                    			
                    			var text = $("#"+e.data.shelvesId + "_capacity_content").val();
                    			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
            						for(var j=0;j<self.roadId_selectAll.length;j++){
            							$("#"+self.roadId_selectAll[j] + "_capacity_content").val(text);
            						}
                    			}
                    		});
                            $("#"+shelves[i].shelvesId + "_valve_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
                    			
                    			var text = $("#"+e.data.shelvesId + "_valve_content").val();
                    			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
            						for(var j=0;j<self.roadId_selectAll.length;j++){
            							$("#"+self.roadId_selectAll[j] + "_valve_content").val(text);
            						}
                    			}
                    		});
                            $("#"+shelves[i].shelvesId + "_price_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
                    			
                    			var text = $("#"+e.data.shelvesId + "_price_content").val();
                    			if($.inArray(e.data.shelvesId,self.roadId_selectAll) > -1){
            						for(var j=0;j<self.roadId_selectAll.length;j++){
            							$("#"+self.roadId_selectAll[j] + "_price_content").val(text);
            						}
                    			}
                    		});
        				}
        				
        				$("#cargo_road_info").html(roadInfoHtml);
         	    		$("#road_table").css({"height":"auto"});
         	    		$(".road_td_image").bind("click" , function(){
         	        		self.showGoodsInfoWindow(this.id);//选择商品
         	        	});       			
        			}
        		}
        	});
		},
		showGoodsInfoWindow: function(roadId){
			var self = this;
			if(self.goodsWindow){
				self.goodsWindow.destroy();
			}
            self.goodsWindow =  new _Window({
            	container : "body",
                title : locale.get("automat_road_goods_choice",[roadId]),
                top: "center",
                left: "center",
                height: self.goodsWinHeight,
                width: self.goodsWinWidth,
                events : {
                    "onClose": function() {
                        self.goodsWindow = null;
                    },
                    scope : this
                }
            });
            self.goodsWindow.show();
            self.setGoodsContent(roadId);
		},
		setGoodsContent:function(roadId){
			cloud.util.mask(".ui-window-content:last");
			var self = this;
			var html = "<div id='automat_cargo_road_config'>"+
						"<div style='margin:5px;'>"+
			              '<input id="goods_search_name_input" type="text" style="border-radius: 4px;width: 230px;height: 25px;" class="search-input-name input-search c666 module-input-row-el">'+
						  '&nbsp;&nbsp;<a id="goods_search_btn" class="btn btn-primary submit search-btn" style="margin-top: 0px;width:20px;min-width:30px;" lang="text:query">'+locale.get("query")+'</a><br>'+
						  "</div>"+
					   	   "<div id='goods_image'>";
			var row = 0;
			
			Service.getGoodslist(name,0,24,function(data){
				if(data.result.length<=4){
					html =html+"<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
				}else{
					html =html+"<table id='goods_table'>";
				}
	    		for(var i=0;i<data.result.length;i++){
	        		if(i%4==0){
	        			row = row + 1;
	        			html = html + "<tr style='width:100%;'>";
	        				        				        			
	        		}
	        		var imagepath = data.result[i].imagepath;
        			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        			html = html + "<td class='good_image_hover'width='20%' id="+data.result[i]._id+">"
        			            +"<span style='display:none'>0</span>"
        						+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
        						+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
	        		if(i%4==3){
	        			html = html + "</tr>";
	        		}
	    		}
	    		html = html+"</table></div><a id='load' style='margin-left:44%;position:relative;font-size:15px;line-height:50px;'>加载更多商品</a></div>";
	    		
	    		this.goodsContentContainer =$(html)
	            .height(this.goodsWinHeight-50).width(this.goodsWinWidth-20);
		        this.goodsWindow.setContents(this.goodsContentContainer);
	    		
		        
		        $(".good_image_hover").click(function(event){
	    			var imagepath = event.target.id;
	    			var price = event.srcElement.attributes.price.value;
	    			var goodsId = this.id;
	    			var name = event.srcElement.attributes.name.value;
	    			var type = event.srcElement.attributes.type.value;
	    			var typeName = event.srcElement.attributes.typeName.value;
	    			var image_md5 = event.srcElement.attributes.md5.value;
	    			var chooseCount = 0;
	    			if(event.srcElement.attributes.chooseCount){
	    				chooseCount = event.srcElement.attributes.chooseCount.value;
	    			}
	    			var goods = {
	    					"chooseCount":parseInt(chooseCount)+1
	    			};
	    			Service.updateGoods(goodsId,goods,function(data){
	    				
	    			});	    				    				    						    					
					self.goodsWindow.hiden();
					if($.inArray(roadId,self.roadId_selectAll) > -1){
						for(var j=0;j<self.roadId_selectAll.length;j++){
							var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
			    			$("#"+self.roadId_selectAll[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadId_selectAll[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
			    			//$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
			    			
			    			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
			    				$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
	                        }else{
	                        	var shortName = name.substring(0, 8);
	                        	$("#"+self.roadId_selectAll[j]+"_name_content").html(shortName);
	                        }
			    			
			    			$("#" + self.roadId_selectAll[j] + "_price_content").val(price);
		                    $("#" + self.roadId_selectAll[j] + "_del").html("        <a id='remove_road_"+self.roadId_selectAll[j]+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
			    			
			    			$("#remove_road_"+self.roadId_selectAll[j]).bind('click',{roadId:self.roadId_selectAll[j]},function(e){
			    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
				    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
				    			$("#"+e.data.roadId+"_del").html("&nbsp");
			    				$("#" + e.data.roadId + "_price_content").val("0");
			    			});
						}
					}else{
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			//$("#"+roadId+"_name_content").html(name);
		    			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
		    				$("#"+roadId+"_name_content").html(name);
                        }else{
                        	var shortName = name.substring(0, 8);
                        	$("#"+roadId+"_name_content").html(shortName);
                        }
		    			$("#" + roadId + "_price_content").val(price);
	                    $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			$("#remove_road_"+roadId).click(function(){
		    				$("#"+roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+roadId+"</div>+");
			    			$("#"+roadId+"_name_content").html("&nbsp");
			    			$("#"+roadId+"_del").html("&nbsp");
		    				$("#" + roadId + "_price_content").val("0");
		    			});
					}
	    			self.goodsWindow.destroy();			    			
	        	});
		        $("#load").click(function(){
		        	var temp = $("#goods_table").find("td");
		        	var cousor = temp.length;
                	cloud.util.mask(".ui-window-content:last");
                	Service.getGoodslist(name,cousor,24,function(data){
            			self.loadGoods(data,roadId);
            			cloud.util.unmask(".ui-window-content:last");
                	},self);
		        });
     	        $("#goods_search_name_input").keydown(function(e){
    	        	  var key = e.which;
    	        	  if(key== 13){
    	        		  $(".search-btn").click();
    	        	  }
         	        });
		        $(".search-btn").click(function(){
		        	var name = $(".search-input-name").val();
                	cloud.util.mask(".ui-window-content:last");
                	Service.getGoodslist(name,0,1000,function(data){
                		
            			$("#goods_image").html("");
            			$("#load").css("display","none");
            			self.initGoodsView(data,roadId);
            			cloud.util.unmask(".ui-window-content:last");
                	},self);
		        });
		        $("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
	    		cloud.util.unmask(".ui-window-content:last");
	         },self);
		},
		loadGoods:function(data,roadId){
			var self = this;
			if(data.result.length<24){
				$("#load").css("display","none");
			}
    		for(var i=0;i<data.result.length;i++){
        		if(i%4==0){

        			$("#goods_table").append("<tr style='width:100%;'>");
        		}
        		var imagepath = data.result[i].imagepath;
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			$("#goods_table").find("tbody").append("<td class='good_image_hover' width='20%' id="+data.result[i]._id+">"
				+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>");
        		if(i%4==3){
        			$("#goods_table").append("</tr>");
        		}
    		}
    		
    		$(".good_image_hover").click(function(event){
    			var imagepath = event.target.id;
    			var price = event.srcElement.attributes.price.value;
    			var goodsId = this.id;
    			var name = event.srcElement.attributes.name.value;
    			var type = event.srcElement.attributes.type.value;
    			var typeName = event.srcElement.attributes.typeName.value;
    			var image_md5 = event.srcElement.attributes.md5.value;
    			var chooseCount = 0;
    			if(event.srcElement.attributes.chooseCount){
    				chooseCount = event.srcElement.attributes.chooseCount.value;
    			}
    			var goods = {
    					"chooseCount":parseInt(chooseCount)+1
    			};
    			Service.updateGoods(goodsId,goods,function(data){
    				
    			});	    				    				    						    					
				self.goodsWindow.hiden();
				if($.inArray(roadId,self.roadId_selectAll) > -1){
					for(var j=0;j<self.roadId_selectAll.length;j++){
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+self.roadId_selectAll[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadId_selectAll[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			//$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
		    			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
		    				$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
                        }else{
                        	var shortName = name.substring(0, 8);
                        	$("#"+self.roadId_selectAll[j]+"_name_content").html(shortName);
                        }
		    			
		    			$("#" + self.roadId_selectAll[j] + "_price_content").val(price);
	                    $("#" + self.roadId_selectAll[j] + "_del").html("        <a id='remove_road_"+self.roadId_selectAll[j]+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			
		    			$("#remove_road_"+self.roadId_selectAll[j]).bind('click',{roadId:self.roadId_selectAll[j]},function(e){
		    				
		    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
			    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
			    			$("#"+e.data.roadId+"_del").html("&nbsp");
		    				$("#" + e.data.roadId + "_price_content").val("0");
		    				
		    			});
					}
				}else{
					var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
	    			//$("#"+roadId+"_name_content").html(name);
	    			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
	    				$("#"+roadId+"_name_content").html(name);
                    }else{
                    	var shortName = name.substring(0, 8);
                    	$("#"+roadId+"_name_content").html(shortName);
                    }
	    			
	    			$("#" + roadId + "_price_content").val(price);
                    $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	    			
	    			$("#remove_road_"+roadId).click(function(){
	    				
	    				$("#"+roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+roadId+"</div>+");
		    			$("#"+roadId+"_name_content").html("&nbsp");
		    			$("#"+roadId+"_del").html("&nbsp");
	    				$("#" + roadId + "_price_content").val("0");
	    				
	    			});
				}    					
    			self.goodsWindow.destroy();
        	});   			        
	       
		},
		initGoodsView:function(data,roadId){
			var self = this;
			$("#goods_image").html("");
			var goodsInfoHtml = "<table id='goods_table'>";
			if(data.result.length<=4){
				goodsInfoHtml = "<table id='goods_table' width='"+(self.goodsWinWidth/4)*(data.result.length)+"'>";
			}
        	var row = 0;
    		for(var i=0;i<data.result.length;i++){
        		if(i%4==0){
        			row = row + 1;
        			goodsInfoHtml = goodsInfoHtml + "<tr style='width:100%;'>";
        		}
        		var imagepath = data.result[i].imagepath;
    			var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
    			goodsInfoHtml = goodsInfoHtml + "<td class='good_image_hover' width='20%' id="+data.result[i]._id+">"
				+"<img name='"+data.result[i].name+"' md5='"+data.result[i].imagemd5+"' chooseCount='"+data.result[i].chooseCount+"' typeName='"+data.result[i].typeName+"' type='"+data.result[i].type+"' price='"+data.result[i].price+"' id='"+imagepath+"' src='"+src+"' style='width: 50%;height: 120px;margin-left: 25%;'/>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_name' style='font-weight:600;'>"+data.result[i].name+"</span></div>"
				+"<div style='text-align:center;'><span id='"+i+"_goods_list_price'  style='font-weight:600;'>"+data.result[i].price+"</span>"+locale.get("china_yuan")+"</div></td>";
        		if(i%4==3){
        			goodsInfoHtml = goodsInfoHtml + "</tr>";
        		}
    		}
    		goodsInfoHtml = goodsInfoHtml+"</table>"
    		$("#goods_image").html(goodsInfoHtml);
    		$("#goods_table").css({"height":$("#cargo_road_info").height()*row/3.5});
    		$(".good_image_hover").click(function(event){
    			var imagepath = event.target.id;
    			var price = event.srcElement.attributes.price.value;
    			var goodsId = this.id;
    			var name = event.srcElement.attributes.name.value;
    			var type = event.srcElement.attributes.type.value;
    			var typeName = event.srcElement.attributes.typeName.value;
    			var image_md5 = event.srcElement.attributes.md5.value;
    			var chooseCount = 0;
    			if(event.srcElement.attributes.chooseCount){
    				chooseCount = event.srcElement.attributes.chooseCount.value;
    			}
    			var goods = {
    					"chooseCount":parseInt(chooseCount)+1
    			};
    			Service.updateGoods(goodsId,goods,function(data){
    				
    			});
    			/*if(self.realRoadsData == null||self.realRoadsData.goodsConfigs == null){
    				self.realRoadsData = new Object();
    				self.realRoadsData.goodsConfigs = new Array();
    			}*/
    			if($.inArray(roadId,self.roadId_selectAll) > -1){
					for(var j=0;j<self.roadId_selectAll.length;j++){
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+self.roadId_selectAll[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadId_selectAll[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			//$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
		    			if (name <= 8) {  //返回中文的个数 小于8个汉字
		    				$("#"+self.roadId_selectAll[j]+"_name_content").html(name);
	                    }else{
	                    	var shortName = name.substring(0, 8);
	                    	$("#"+self.roadId_selectAll[j]+"_name_content").html(shortName);
	                    }
		    			
		    			$("#" + self.roadId_selectAll[j] + "_price_content").val(price);
	                    $("#" + self.roadId_selectAll[j] + "_del").html("        <a id='remove_road_"+self.roadId_selectAll[j]+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			
		    			$("#remove_road_"+self.roadId_selectAll[j]).bind('click',{roadId:self.roadId_selectAll[j]},function(e){
		    				
		    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
			    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
			    			$("#"+e.data.roadId+"_del").html("&nbsp");
		    				$("#" + e.data.roadId + "_price_content").val("0");
		    				
		    			});
					}
				}else{
					var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
	    			//$("#"+roadId+"_name_content").html(name);
	    			if (name.length <= 8) {  //返回中文的个数 小于8个汉字
	    				$("#"+roadId+"_name_content").html(name);
                    }else{
                    	var shortName = name.substring(0, 8);
                    	$("#"+roadId+"_name_content").html(shortName);
                    }
	    			
	    			$("#" + roadId + "_price_content").val(price);
                    $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
	    			
	    			$("#remove_road_"+roadId).click(function(){
	    				
	    				$("#"+roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+roadId+"</div>+");
		    			$("#"+roadId+"_name_content").html("&nbsp");
		    			$("#"+roadId+"_del").html("&nbsp");
	    				$("#" + roadId + "_price_content").val("0");
	    				
	    			});
				}
    			self.goodsWindow.destroy();
        	});
		},
		destroy:function(){
			if(this.window){
				this.window.destroy();
			}else{
				this.window = null;
			}
		}
	});
	return Window;
});

