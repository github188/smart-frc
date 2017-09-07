define(function(require){    
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
	var winHtml = require("text!./updateTemplate.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../service");
	require("./css/default.css");
	require("./css/style.css");
	require("./js/scrollable");
	var RelateAutomatInfo = require("../config/relateAutomat");		
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
			this._renderWindow();
			this._renderTable();
            this.goodsWinWidth = 458;
            this.goodsWinHeight = 378;  
            this.roadIdMutil = [];
            this.roadIdMarkA = [];
            this.tempData = {};
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			self.window = new _Window({
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
			this.window.show();	
									
			this._renderBtn();
		},		
		_renderTable:function(){
			var self = this;

			Service.getTemplateInfoById(self.templateId,function(data){

				if(data.result){
					var templatename = data.result.name;
					var vender = data.result.vender;
					var machineType = data.result.machineType;
					var modelname = data.result.modelName;	
					//vender = Common.getLangVender(vender);
					var modelId = data.result.modelId;
					self.tempData = data.result;
					
					if(vender == "aucma"){
						$("#vender").val(locale.get({lang: "vender_name_aucma"}));
					}else if(vender == "fuji"){
						$("#vender").val(locale.get({lang: "vender_name_fuji"}));
					}else if(vender == "baixue"){
						$("#vender").val(locale.get({lang: "vender_name_baixue"}));
					}else if(vender == "easy_touch"){
						$("#vender").val(locale.get({lang: "vender_name_easy_touch"}));
					}else if(vender == "junpeng"){
						$("#vender").val(locale.get({lang: "vender_name_junpeng"}));
					}else if(vender == "leiyunfeng"){
						$("#vender").val("雷云峰");
					}else{
						$("#vender").val(vender);
					}
					$("#vendernum").val(vender);
					$("#template_name").val(templatename);
					if(machineType==1){
						$("#machineType").val(locale.get({lang: "drink_machine"}));
					}else if(machineType==2){
						
						$("#machineType").val(locale.get({lang: "spring_machine"}));
					}else if(machineType==3){
						
						$("#machineType").val(locale.get({lang: "grid_machine"}));
					}/*else if (machineType==4) {
						$("#machineType").val("Beverage machine");
					}else if(machineType==5){
						$("#machineType").val("Snack machine");
					}else if(machineType==6){
						$("#machineType").val("Combo Vending Machine");
					}*/
						
					//$("#machineType").val(machineType);
					$("#modelname").val(modelname);
					$("#modelid").val(modelId);
					var shelves = data.result.shelves;
					self.setChannelConfig(shelves,machineType);														
				}
	
	        });
			 				 
		},
		_renderBtn: function() {
	            var self = this;
	            
                //下一步
	            
	            $("#nextBase").bind("click", function() {
	            	
	            	self.renderUpdateMachine();
	            	
	            });
	            
	            //全选,取消
	            $("#mutilmark").mouseover(function (){
			    	$("#mutilmark").css("opacity","1");
				}).mouseout(function (){
					$("#mutilmark").css("opacity","0.8");
				});
	            $("#cancelmark").mouseover(function (){
			    	$("#cancelmark").css("opacity","1");
				}).mouseout(function (){
					$("#cancelmark").css("opacity","0.8");
				});
	            
	            $("#mutilmark").bind('click',function(){
	            	
	            	if(self.roadIdMarkA.length > 0){
	            		
	            		self.roadIdMutil = [];
                        self.roadIdMutil = self.roadIdMarkA;
                        for(var i=0;i<self.roadIdMutil.length;i++){
                        	$("#markShelf_"+self.roadIdMutil[i]).attr("checked",true);
                        }
	            	}
	            	
	            });
                $("#cancelmark").bind('click',function(){
	            	
	            	if(self.roadIdMutil.length > 0){
	            		
	            		for(var i=0;i<self.roadIdMutil.length;i++){
	            			$("#markShelf_"+self.roadIdMutil[i]).attr("checked",false);
	            		}
	            		self.roadIdMutil = [];
	            		
	            	}
	            	
	            });
	            
	                       	            
	    },	
        renderUpdateMachine: function() {
            var self = this;
            //对页面进行校验
			var temName = $("#template_name").val();
			var marchinet = $("#machineType").val();
			var ve = $("#vender").val();
			var modeln = $("#modelname").val();
			
			if(temName == null||temName.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"template_name_not_exists"});
				return;
			};
			if(ve == null||ve.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"vender_name_not_exists"});
				return;
			};
			if(marchinet == null||marchinet.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"machinetype_name_not_exists"});
				return;
			};			
			if(modeln == null||modeln.replace(/(^\s*)|(\s*$)/g,"")==""){
				dialog.render({lang:"model_name_not_exists"});
				return;
			};
			self.getDateChannelConfig();	            
	    },
	    getDateChannelConfig: function() {
        	var self = this;        	
        	var vt = $('#vender').val();
        	var mact = $('#machineType').val();
      
        	if(mact == locale.get({lang: "drink_machine"})){
        		mact = 1;
			}else if(mact==locale.get({lang: "spring_machine"})){
				
				mact = 2;
			}else if(mact==locale.get({lang: "grid_machine"})){
				
				mact = 3;
			}else if (mact=="Beverage machine") {
				mact = 1;
			}else if (mact=="Snack machine") {
				mact = 2;
			} /*else if(mact=="Combo Vending Machine"){
				mact = 6;
			}*/

        	//vt = Common.getRealVender(vt);
        	var number = $("#vendernum").val();
        	var modelName = $('#modelname').val();
        	var modelId = $('#modelid').val();
        	var name = $("#template_name").val();
        	var channelConfig = {};
        	channelConfig.name = name;
        	channelConfig.vender = number;
        	channelConfig.machineType = mact;
        	channelConfig.modelName = modelName;
        	channelConfig.modelId = modelId;
        	channelConfig.shelves = new Array();
        	Service.getAllModelList(eurl,modelId,mact,vt,function(data){
        		
        		if(data.result&&data.result.length>0){ 
        			
                    for(var i=0;i<data.result[0].shelves.length;i++){
        				
        				var sves = data.result[0].shelves[i];
        				for(var j=0;j<sves.length;j++){
        					
        					var roadId = sves[j].shelvesId;
            				
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
            				
            				//var imagemd5 = $("#" + roadId ).find("input").val();
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
        				
        			}
        			//channelConfig.config = data.result[0].config;
        			$("#relateAutomatConfig").css("display", "block");
	                $("#baseInfo").css("display", "none");
	                $("#tab1").removeClass("active");
	                $("#tab2").addClass("active");
	                	
	                	this.relateAutomat = new RelateAutomatInfo({
		                    selector: "#relateAutomatInfo",
		                    automatWindow: self.window,
		                    subData:channelConfig,
		                    templateId:self.templateId,
		                    tempData:self.tempData,
		                    events: {
		                        "rendTableData": function() {
		                            self.fire("getTemplateList");
		                        }
		                    }
		                });
	                	
        			//self.updateChannelConfig(channelConfig); 
        		}
        	});
     		       	                  	
        },
        updateChannelConfig: function(subData){
        	var self = this;
        	Service.updateTemplateInfo(self.templateId,subData, function(data) {
                if (data.error_code == null) {
                    cloud.util.unmask("#deviceForm");
                    self.window.destroy();
                    self.fire("getTemplateList");
                } else if (data.error_code == "70024") {//模板名称已存在
                    dialog.render({lang: "automat_name_exists"});
                    return;
                }
            }, self);
        	
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
                //capinput = "<input type='text' style='width:40px;height: 10px;margin-left: 12px;text-align:center;line-height:16px;' value='"+capacity+"' id='" + shelves[i].shelvesId + "_capacity_content' placeholder='"+locale.get({lang:"shelf_rong"})+"'/>";
                
        		roadInfoHtml = roadInfoHtml + "<td style='width:12.5%;'>"+
        										"<table style='width:"+width+"%;margin-top: -25px;'>"+
        										"<tr><div style='position: relative;z-index: 9999;width: 25px;height: 25px; margin-top: -5px;margin-left: 85px;text-align: center;'><input id='markShelf_"+shelves[i].shelvesId+"' style='width:15px;height:15px;margin-top: 6px;' type='checkbox' /></div></tr>"+	
        										"<tr style='height:82px;width:100%'><td id='"+shelves[i].shelvesId+"' class='road_td_image' style='font-size:20px;'><div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+shelves[i].shelvesId+"</div>+</td></tr>"+
        											"<tr style='height:40px;width:100%;text-align:center;font-size:10px;'  id='"+shelves[i].shelvesId+"_goods_name'><td><span style='font-weight:600' id='"+shelves[i].shelvesId+"_name_content'>&nbsp;"+"</span></td></tr>"+       											
        											"<tr style='width:100%;text-align:center;font-size:10px;'  id='" + shelves[i].shelvesId + "_goods_price'><td><input type='text' value='0' style='width:40px;height: 10px;'  id='" + shelves[i].shelvesId+ "_price_content' />&nbsp;" + "<span>"+locale.get({lang: "china_yuan"})+"</span><span id='" + shelves[i].shelvesId + "_del'></span></td></tr>" +
        											"<tr style='width:100%;font-size:10px;line-height: 30px;' id='" + shelves[i].shelvesId + "_capacity_threshold'><td>"+capinput+"</td><td>"+valveinput+"</td></tr>"+
        											"</table>"+
        									  "</td>";
        		self.roadIdMarkA.push(shelves[i].shelvesId);
        		if(i%8==7 || i == shelves.length-1){
        			
        			roadInfoHtml = roadInfoHtml +"</tr>";
        			
        		}
        		$("#markShelf_"+shelves[i].shelvesId).live('click',{roadId:shelves[i].shelvesId},function(e){
    				
        			var check = $(this).is(':checked');
        			if(check){
        				self.roadIdMutil.push(e.data.roadId);
        			}else{
        				var index = $.inArray(e.data.roadId,self.roadIdMutil);
        				
						self.roadIdMutil.splice(index, 1);
        			}
        			
    			});
        		$("#"+shelves[i].shelvesId + "_capacity_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_capacity_content").val();
        			if($.inArray(e.data.shelvesId,self.roadIdMutil) > -1){
						for(var j=0;j<self.roadIdMutil.length;j++){
							$("#"+self.roadIdMutil[j] + "_capacity_content").val(text);
							
						}
        			}
        			
        		});
                $("#"+shelves[i].shelvesId + "_valve_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_valve_content").val();
        			if($.inArray(e.data.shelvesId,self.roadIdMutil) > -1){
						for(var j=0;j<self.roadIdMutil.length;j++){
							$("#"+self.roadIdMutil[j] + "_valve_content").val(text);
							
						}
        			}
        			
        		});
                $("#"+shelves[i].shelvesId + "_price_content").live('change',{shelvesId:shelves[i].shelvesId},function(e){
        			
        			var text = $("#"+e.data.shelvesId + "_price_content").val();
        			if($.inArray(e.data.shelvesId,self.roadIdMutil) > -1){
						for(var j=0;j<self.roadIdMutil.length;j++){
							$("#"+self.roadIdMutil[j] + "_price_content").val(text);
							
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
	        			$("#"+roadId+"_name_content").html(name);	        			
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
      //打开选择商品窗口
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
		//加载商品信息
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
					if($.inArray(roadId,self.roadIdMutil) > -1){
						for(var j=0;j<self.roadIdMutil.length;j++){
							var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
			    			$("#"+self.roadIdMutil[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadIdMutil[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
			    			$("#"+self.roadIdMutil[j]+"_name_content").html(name);
			    			
			    			$("#" + self.roadIdMutil[j] + "_price_content").val(price);
		                    $("#" + self.roadIdMutil[j] + "_del").html("        <a id='remove_road_"+self.roadIdMutil[j]+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
			    			
			    			$("#remove_road_"+self.roadIdMutil[j]).bind('click',{roadId:self.roadIdMutil[j]},function(e){
			    				
			    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
				    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
				    			$("#"+e.data.roadId+"_del").html("&nbsp");
			    				$("#" + e.data.roadId + "_price_content").val("0");
			    				
			    			});
						}
					}else{
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			$("#"+roadId+"_name_content").html(name);
		    			
		    			$("#" + roadId + "_price_content").val(price);
	                    $("#" + roadId + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			
		    			$("#remove_road_"+roadId).click(function(){
		    				
		    				$("#"+roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+roadId+"</div>+");
			    			$("#"+roadId+"_name_content").html("&nbsp");
			    			$("#"+roadId+"_del").html("&nbsp");
		    				$("#" + roadId + "_price_content").val("0");
		    				
		    			});
					}
	    			
	    			/*$("#" + roadId + "_price_content").bind('input onchange', function() { 
	                    var price = $("#" + roadId + "_price_content").val()*100;
	                    self.realRoadsData.goodsConfigs[ii].price = price;
	                    self.renderContainerShelf();
	                });*/
	    					
	    			//self.renderGoodsShelf();
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
				if($.inArray(roadId,self.roadIdMutil) > -1){
					for(var j=0;j<self.roadIdMutil.length;j++){
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+self.roadIdMutil[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadIdMutil[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			$("#"+self.roadIdMutil[j]+"_name_content").html(name);
		    			
		    			$("#" + self.roadIdMutil[j] + "_price_content").val(price);
	                    $("#" + self.roadIdMutil[j] + "_del").html("        <a id='remove_road_"+self.roadIdMutil[j]+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			
		    			$("#remove_road_"+self.roadIdMutil[j]).bind('click',{roadId:self.roadIdMutil[j]},function(e){
		    				
		    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
			    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
			    			$("#"+e.data.roadId+"_del").html("&nbsp");
		    				$("#" + e.data.roadId + "_price_content").val("0");
		    				
		    			});
					}
				}else{
					var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
	    			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
	    			$("#"+roadId+"_name_content").html(name);
	    			
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
    			if($.inArray(roadId,self.roadIdMutil) > -1){
					for(var j=0;j<self.roadIdMutil.length;j++){
						var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
		    			$("#"+self.roadIdMutil[j]).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+self.roadIdMutil[j]+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
		    			$("#"+self.roadIdMutil[j]+"_name_content").html(name);
		    			
		    			$("#" + self.roadIdMutil[j] + "_price_content").val(price);
		                $("#" + self.roadIdMutil[j] + "_del").html("        <a id='remove_road_"+roadId+"' class='delete_road'>"+locale.get({lang:"delete"})+"</a>");
		    			
		    			$("#remove_road_"+self.roadIdMutil[j]).bind('click',{roadId:self.roadIdMutil[j]},function(e){
		    				
		    				$("#"+e.data.roadId).html("<div style='width: 30px;height: 23px;font-size: 12px;margin-top: -20%;padding-top: 13px;position: relative;'>"+e.data.roadId+"</div>+");
			    			$("#"+e.data.roadId+"_name_content").html("&nbsp");
			    			$("#"+e.data.roadId+"_del").html("&nbsp");
		    				$("#" + e.data.roadId + "_price_content").val("0");
		    				
		    			});
					}
					
    			}else{
    				var src= cloud.config.FILE_SERVER_URL + "/api/file/" +imagepath + "?access_token=" + cloud.Ajax.getAccessToken();
        			$("#"+roadId).html("<div style='width: 30px;height: 10px;font-size: 12px;'><input value='"+imagepath+"_"+image_md5+"' style='display:none' />"+roadId+"</div><span style='display:none'>"+goodsId+"</span><img src='"+src+"' style='height:60px;'/>");
        			$("#"+roadId+"_name_content").html(name);
        			
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
