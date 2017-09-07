define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./goodsConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("../css/table.css");
	require("../css/style.css");
	var KeyConfigInfo = require("../keyConfig/keyInfoconfig");
	var Service = require("../../../service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.fixrow = 1;
			this.machineType = options.machineType;//货柜类型
			this.vender= options.vender;//厂家
			this.modelName= options.modelName;//型号
			this.number = options.number;
			
			this.startNumber= options.startNumber;
            this.allNumber= options.allNumber;
            this.exd = options.exd;
			this.ids = options.id;
			this.shelves = options.shelves;
	        this.keyConfig = options.keyConfig;
	        this.itemNumberConfig = options.itemNumberConfig;
			this.render();
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.renderSelf();
			this.bindEvent();
			if(this.exd){
				this.getData();
			}
			
		},
		getData:function(){
			var self = this;
			var shelves = self.shelves;
			$(".shelfTable").each(function(){
				$(this).css("background","white");
			});
			self.fixrow = shelves.length + 1;
			for(var i=0;i<shelves.length;i++){
				var tableObj = shelves[i];
				$("#editSelf").append("<table style='border: 1px solid;margin-top: 10px;' id='table_"+i+"' class='selfClass'><tr id='tr_"+i+"'><td id='td_"+i+"'><table style='margin: 0 10px;'><tr style='line-height: 22px;'><td><span id='shelfRemove_"+i+"' class='shelfTable_remove' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>删除</span></td></tr><tr style='line-height: 22px;'><td><span class='shelfTable_confirm' id='shelfConfirm_"+i+"' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>确定</span></td></tr><tr style='line-height: 22px;'><td><span class='shelfTable_copy' id='shelfCopy_"+i+"' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>复制</span></td></tr></table></td></tr></table>");
                for(var j=0;j<tableObj.length;j++){
					var location_id = tableObj[j].shelvesId;
					var type = tableObj[j].goodstype;
					var sugar = tableObj[j].sugar;
					var sugarText = "";
					if(sugar == "true"){
						sugarText = "加糖";
					}
					var milk = tableObj[j].milk;
					var milkText = "";
					if(milk == "true"){
						milkText = "加奶";
					}
					var measurement = tableObj[j].measurement;
					var measurementText = "";
					if(measurement == "1"){
						measurementText = "小杯";
					}else if (measurement == "2"){
						measurementText = "大杯";
					}
					var tempmode = tableObj[j].tempmode;
					var tempmodeText = "";
					if(tempmode == "0"){
						tempmodeText = "常温";
					}else if(tempmode == "1"){
						tempmodeText = "冷";
					}else if(tempmode == "2"){
						tempmodeText = "热";
					}
					var ice = tableObj[j].ice;
					var iceText = "";
					if(ice == "true"){
						iceText = "加冰";
					}
					
					var sv = type+"-"+tempmode+"-"+sugar+"-"+milk+"-"+measurement+"-"+ice;
					$("#td_"+i).before("<td><div id='div_"+location_id+"' class='selfTableCoffee'><span class='shelfNum' id='"+sv+"'>"+location_id+"</span><span class='shelft'>"+type+"</span><span class='modify'></span><span class='shelfb'>"+measurementText+"</span><span class='shelfb'>"+sugarText+"</span><span class='shelfb' >"+tempmodeText+"</span><span class='shelfb' >"+milkText+"</span><span class='shelfb' >"+iceText+"</span></div><div style='display:none' id='edit_"+location_id+"' class='selfTableCoffee'><span></span><span class='confirm'></span></div></td>");
					$(".shelfTable_remove").unbind();
					$(".shelfTable_remove").bind("click",function(){
						
						var n = $(this).attr("id").split("_")[1];
						var len = $("#tr_"+n).find("td").length;
						for(var i=0;i<len-4;i++){
							var shelfid = $("#tr_"+n).find("td").eq(i).find("div").attr("id").split("_")[1];
							
						    $("#gd_"+parseInt(shelfid)).css("background","black");
						}
						$("#table_"+n).remove();
					});
					$(".shelfTable_confirm").unbind();
					$(".shelfTable_confirm").bind("click",function(){
						var n = $(this).attr("id").split("_")[1];
						var temp = $("#tr_"+n).find(".shelft").eq(0).html();
						$("#tr_"+n).find(".shelft").each(function(){
							var t = $(this).html();
							if(temp != t){
								dialog.render({lang: "please_config_same_shelves"});
		                        return;
							}
						});
						self.fixrow ++;
						
					});
					
					$(".shelfTable_copy").unbind();
					$(".shelfTable_copy").bind("click",function(){
						
						var n = $(this).attr("id").split("_")[1];
						var temp = $("#tr_"+n).find(".shelft").eq(0).html();
						var fg = true;
						$("#tr_"+n).find(".shelft").each(function(){
							var t = $(this).html();
							if(temp != t){
								fg = false;
								dialog.render({lang: "please_config_same_shelves"});
		                        return;
							}
						});
						if(fg){
							self.fixrow ++;
							
							var len = $("#tr_"+n).find(".shelft").length;
							var count = 0;
							
							var sl = $("#shelves-group").find("div").length;
							for(var m=0;m<sl;m++){
                                var bg = $("#shelves-group").find("div").eq(m).css("background-color");
								
								if(bg == "rgb(0, 0, 0)" && count < len){
									$("#shelves-group").find("div").eq(m).click();
									
									var nm = $("#shelves-group").find("div").eq(m).attr("id").split("_")[1];
									var t = $("#tr_"+n).find("td").eq(count).find(".shelft").eq(0).html();
									var mea = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(0).html();
									var sug = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(1).html();
									var tem = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(2).html();
									var milk = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(3).html();
									var ice = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(4).html();
									$("#div_"+nm).find(".shelft").eq(0).html(t);
									$("#div_"+nm).find(".shelfb").eq(0).html(mea);
									$("#div_"+nm).find(".shelfb").eq(1).html(sug);
									$("#div_"+nm).find(".shelfb").eq(2).html(tem);
									$("#div_"+nm).find(".shelfb").eq(3).html(milk);
									$("#div_"+nm).find(".shelfb").eq(4).html(ice);
									var tid = $("#tr_"+n).find("td").eq(count).find(".shelfNum").eq(0).attr("id");
									$("#div_"+nm).find(".shelfNum").eq(0).attr("id",tid);
									count ++;
								}
							}
							
						}
						
					});
					$(".modify").bind("click",function(){
						
						var type = $(this).parent().parent().parent().find("td").eq(0).find("span").eq(1).html();
						
						var id = $(this).parent().attr("id").split("_")[1];
						
						self.openConfigWindow(id,type);
						
					});
					
				}
				
			}
			
		},
		renderSelf:function(){
			var self = this;
			$('#editSelf').html('');
			var roadNumber_new;
			if(this.startNumber == 0){
				roadNumber_new = parseInt(this.startNumber);
			}else{
				roadNumber_new = parseInt(this.allNumber) + parseInt(this.startNumber);
			}
			
			$("#shelves-group").html("");
			var shelfInfoHtml = "";
			var len = parseInt(this.allNumber);
			for(var i=0;i<len;i++){
				if(i%28 == 0){
					shelfInfoHtml += "<tr>";
				}
				shelfInfoHtml += "<td><div class='shelfTable' id='gd_"+(parseInt(this.startNumber)+i)+"'>"+(parseInt(this.startNumber)+i)+"</div></td>";
				if(i%28 == 27){
					shelfInfoHtml += "</tr>";
				}
			}
			$("#shelves-group").html(shelfInfoHtml);
			
			$(".shelfTable").unbind();
			$(".shelfTable").bind("click",function(){
				
				var bg = $(this).css("background-color");
				
				if(bg == "rgb(0, 0, 0)"){
					$(this).css("background-color","white");
					var location_id = $(this).html();
					
					if($("#table_"+self.fixrow).length > 0){
						
						$("#td_"+self.fixrow).before("<td><div id='div_"+location_id+"' class='selfTableCoffee'><span class='shelfNum'>"+location_id+"</span><span class='shelft' ></span><span class='modify'></span><span class='shelfb'></span><span class='shelfb'></span><span class='shelfb' ></span><span class='shelfb' ></span><span class='shelfb' ></span></div><div style='display:none' id='edit_"+location_id+"' class='selfTableCoffee'><span>" +
								"<select id='select_"+location_id+"'><option value='1'>现磨咖啡</option><option value='2'>速溶咖啡</option><option value='3'>花式饮品</option><option value='4'>碳酸饮品</option></select>" +
								"<span></span>" +
								"</span><span class='confirm'></span></div></td>");
					}else{
						$("#editSelf").append("<table style='border: 1px solid;margin-top: 10px;' id='table_"+self.fixrow+"' class='selfClass'><tr id='tr_"+self.fixrow+"'></tr></table>");
						$("#tr_"+self.fixrow).append("<td><div id='div_"+location_id+"' class='selfTableCoffee'><span class='shelfNum'>"+location_id+"</span><span class='shelft'></span><span class='modify'></span><span class='shelfb'></span><span class='shelfb'></span><span class='shelfb' ></span><span class='shelfb' ></span><span class='shelfb' ></span></div><div style='display:none' id='edit_"+location_id+"' class='selfTableCoffee'><span></span><span class='confirm'></span></div></td><td id='td_"+self.fixrow+"'><table style='margin: 0 10px;'><tr style='line-height: 22px;'><td><span class='shelfTable_remove' id='shelfRemove_"+self.fixrow+"' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>删除</span></td></tr><tr style='line-height: 22px;'><td><span id='shelfConfirm_"+self.fixrow+"' class='shelfTable_confirm' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>确定</span></td></tr><tr style='line-height: 22px;'><td><span id='shelfCopy_"+self.fixrow+"' class='shelfTable_copy' style='color: #28b5d6;cursor: pointer;text-decoration: underline;'>复制</span></td></tr></table></td>");
						$(".shelfTable_remove").unbind();
						$(".shelfTable_remove").bind("click",function(){
							var n = $(this).attr("id").split("_")[1];
							var len = $("#tr_"+n).find("td").length;
							
							for(var i=0;i<len-4;i++){
								var shelfid = $("#tr_"+n).find("td").eq(i).find("div").attr("id").split("_")[1];
								
							    $("#gd_"+parseInt(shelfid)).css("background-color","black");
							}
							$("#table_"+n).remove();
						});
						$(".shelfTable_confirm").unbind();
						$(".shelfTable_confirm").bind("click",function(){
							var n = $(this).attr("id").split("_")[1];
							var temp = $("#tr_"+n).find(".shelft").eq(0).html();
							$("#tr_"+n).find(".shelft").each(function(){
								var t = $(this).html();
								if(temp != t){
									dialog.render({lang: "please_config_same_shelves"});
			                        return;
								}
							});
							self.fixrow ++;
						});
					}
					
					$(".shelfTable_copy").unbind();
					$(".shelfTable_copy").bind("click",function(){
						
						var n = $(this).attr("id").split("_")[1];
						var temp = $("#tr_"+n).find(".shelft").eq(0).html();
						var fg = true;
						$("#tr_"+n).find(".shelft").each(function(){
							var t = $(this).html();
							if(temp != t){
								fg = false;
								dialog.render({lang: "please_config_same_shelves"});
		                        return;
							}
						});
						if(fg){
							self.fixrow ++;
							
							var len = $("#tr_"+n).find(".shelft").length;
							var count = 0;
							
							var sl = $("#shelves-group").find("div").length;
							for(var m=0;m<sl;m++){
                                var bg = $("#shelves-group").find("div").eq(m).css("background-color");
								
								if(bg == "rgb(0, 0, 0)" && count < len){
									$("#shelves-group").find("div").eq(m).click();
									
									
									var nm = $("#shelves-group").find("div").eq(m).attr("id").split("_")[1];
									var t = $("#tr_"+n).find("td").eq(count).find(".shelft").eq(0).html();
									var mea = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(0).html();
									var sug = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(1).html();
									var tem = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(2).html();
									var milk = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(3).html();
									var ice = $("#tr_"+n).find("td").eq(count).find(".shelfb").eq(4).html();
									$("#div_"+nm).find(".shelft").eq(0).html(t);
									$("#div_"+nm).find(".shelfb").eq(0).html(mea);
									$("#div_"+nm).find(".shelfb").eq(1).html(sug);
									$("#div_"+nm).find(".shelfb").eq(2).html(tem);
									$("#div_"+nm).find(".shelfb").eq(3).html(milk);
									$("#div_"+nm).find(".shelfb").eq(4).html(ice);
									var tid = $("#tr_"+n).find("td").eq(count).find(".shelfNum").eq(0).attr("id");
									$("#div_"+nm).find(".shelfNum").eq(0).attr("id",tid);
									
									count ++;
								}
							}
							
						}
						
					});
					$(".modify").bind("click",function(){
						var type = $(this).parent().parent().parent().find("td").eq(0).find("span").eq(1).html();
						var id = $(this).parent().attr("id").split("_")[1];
						
						self.openConfigWindow(id,type);
						
					});
				}
				
				
			});
		},
		openConfigWindow:function(roadId,type){
			var self = this;
			if(this.configWindow){
				this.configWindow.destroy();
			}
            this.configWindow =  new _Window({
            	container : "#ui-window-body",
                title : locale.get("coffee_shelf_config_choice",[roadId]),
                top: "center",
                left: "center",
                height: 280,
                width: 350,
                mask: true,
                drag: true,
                events : {
                    "onClose": function() {
                        self.configWindow = null;
                    },
                    scope : this
                }
            });
            this.configWindow.show();
            
            var html = "<table id='table_edit' style='margin:5px;'>"+
            
	               "<tr>"+
	                    "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:product_type'>类型:</span></label></td>"+
	                    "<td>"+
	                     "<select id='types' name='types' style='width:160px;height: 30px;'><option value='1'>现磨咖啡</option><option value='2'>速溶咖啡</option><option value='3'>花式饮品</option><option value='4'>碳酸饮品</option></select>"+
	                    "</td>"+
	                "</tr>"+
                    "<tr>"+
                    "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:temperature_mode'>温度:</span></label></td>"+
                    "<td>&nbsp;<input type='radio' class='cinput' name='tempmode' value='1'/><label class='label'>冷</label>"+
                    "<span id='temp_2'><input type='radio' style='margin-left: 10px;' class='cinput' name='tempmode' value='2'/><label class='label'>热</label></span>"+
                    "</td>"+
                "</tr>"+
                 "<tr id='sugar'>"+
                    "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:sugar_or_not'>加糖:</span></label></td>"+
                    "<td>&nbsp;<input type='radio' class='cinput' name='sugar' value='false' /><label class='label'>否</label>"+
                    "<input type='radio' style='margin-left: 10px;' class='cinput' name='sugar' value='true'/><label class='label'>是</label>"+
                    "</td>"+
                "</tr>"+
                 "<tr id='milk'>"+
                    "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:milk_or_not'>加奶:</span></label></td>"+
                    "<td>&nbsp;<input type='radio' class='cinput' name='milk' value='false' /><label class='label'>否</label>"+
                    "<input type='radio' style='margin-left: 10px;' class='cinput' name='milk' value='true'/><label class='label'>是</label></td>"+
                "</tr>"+
                "<tr id='ice'>"+
                "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:ice_or_not'>加冰:</span></label></td>"+
                "<td>&nbsp;<input type='radio' class='cinput' name='ice' value='false' /><label class='label'>否</label>"+
                "<input type='radio' style='margin-left: 10px;' class='cinput' name='ice' value='true'/><label class='label'>是</label></td>"+
                "</tr>"+
                 "<tr>"+
                    "<td width='20%'><label style='color:red;'>&nbsp;</label><label><span lang='text:measurement_glass'>尺寸:</span></label></td>"+
                    "<td>&nbsp;<input type='radio' class='cinput' name='measurement' value='1' /><label class='label'>小</label>"+
                   "<span id='measurement_2' style='display:none'><input type='radio' style='margin-left: 10px;' class='cinput' name='measurement' value='2'/><label class='label'>大</label></span></td>"+
                "</tr><tr><td></td><td><input style='position: absolute;right: 5px;bottom: 2px;height: 26px;line-height: 26px;' type='button' class='btn btn-primary submit' id='saveConfig' value='确定'/></td></tr></table>";
            
            this.configWindow.setContents(html);
			
            $("#table_edit").parent().css("overflow","inherit");
            $("#types").bind("change",function(){
            	
            	var val = $("#types").val();
            	if(val == 1){
            		$("#measurement_2").show();
            		$("#temp_2").show();
            		$("#milk").show();
            		$("#sugar").show();
            		$("#ice").hide();
            	}else if(val == 2){
            		$("#measurement_2").show();
            		$("#milk").show();
            		$("#sugar").show();
            		$("#temp_2").show();
            		$("#ice").hide();
            	}else if(val == 3){
            		$("#measurement_2").show();
            		$("#milk").hide();
            		$("#sugar").hide();
            		$("#temp_2").show();
            		$("#ice").hide();
            	}else if(val == 4){
            		$("#measurement_2").show();
            		$("#milk").hide();
            		$("#sugar").hide();
            		$("#temp_2").hide();
            		$("#ice").show();
            	}
            	
            });
            $("#types").val(1);
        	$("#types").change();
            if(type == locale.get("instant_coffee")){
            	$("#types").val(2);
            	$("#types").change();
            }else if(type == locale.get("fancy_drinks")){
            	$("#types").val(3);
            	$("#types").change();
            }else if(type == locale.get("carbonated_drinks")){
            	$("#types").val(4);
            	$("#types").change();
            }
            
            $("#saveConfig").bind("click",{roadId:roadId},function(e){
            	
            	var str = "";
            	var type = $("#types").val();
            	var typev = $("#types").find("option:selected").text();
            	
            	var temv = $('input[name="tempmode"]:checked').val();
            	if(temv == undefined || temv == 'undefined'){
            		dialog.render({lang: "please_choose_tempmode"});
                    return;
            		//temv = "0";
            	}
            	var sugarv = $('input[name="sugar"]:checked').val();
            	if(sugarv == undefined || sugarv == 'undefined'){
            		sugarv = "false";
            	}
            	var milkv = $('input[name="milk"]:checked').val();
            	if(milkv == undefined || milkv == 'undefined'){
            		milkv = "false";
            	}
            	var measurementv = $('input[name="measurement"]:checked').val();
            	if(measurementv == undefined || measurementv == 'undefined'){
            		dialog.render({lang: "please_choose_measurement"});
                    return;
            		//measurementv = "0";
            	}
            	var icev = $('input[name="ice"]:checked').val();
            	if(icev == undefined || icev == 'undefined'){
            		icev = "false";
            	}
            	var sv = typev+"-"+temv+"-"+sugarv+"-"+milkv+"-"+measurementv+"-"+icev;
            	
            	if(temv == 0 || temv == "0"){
            		temv = "常温";
            	}else if(temv == 1 || temv == "1"){
            		temv = "冷";
            	}else if(temv == 2 || temv == "2"){
            		temv = "热";
            	}
            	
            	if(sugarv == 'false'){
            		sugarv = "";
            	}else if(sugarv == 'true'){
            		sugarv = "加糖";
            	}
            	
            	if(milkv == 'false'){
            		milkv = "";
            	}else if(milkv == 'true'){
            		milkv = "加奶";
            	}
            	if(measurementv == 1){
            		measurementv = "小杯";
            	}else if (measurementv == 2){
            		measurementv = "大杯";
            	}else{
            		measurementv = "";
            	}
            	if(icev == 'false'){
            		icev = "";
            	}else if(icev == 'true'){
            		icev = "加冰";
            	}
            	$("#div_"+e.data.roadId).find("span").eq(0).attr("id",sv);
            	$("#div_"+e.data.roadId).find("span").eq(1).html(typev);
            	$("#div_"+e.data.roadId).find("span").eq(3).html(measurementv);
            	$("#div_"+e.data.roadId).find("span").eq(4).html(sugarv);
            	$("#div_"+e.data.roadId).find("span").eq(5).html(temv);
            	$("#div_"+e.data.roadId).find("span").eq(6).html(milkv);
            	$("#div_"+e.data.roadId).find("span").eq(7).html(icev);
            	self.configWindow.destroy();
            	
            	
            });
		},
		bindEvent:function(){
			var self = this;
			//上一步
			$("#model_last_step").click(function(){
				$("#selfConfig").css("display", "none");//货道信息
                $("#baseInfo").css("display", "block");//基本信息
                $("#keyConfig").css("display", "none");//键盘信息
                $("#tab2").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab1").addClass("active");
			});
			//完成
            $("#model_submit").click(function(){
            	var selfList=[];
            	var len = $("#editSelf").find(".selfClass").length;
            	var count = 0;
            	
            	if(len >　0){
            		for(var i=0;i<len;i++){
            			var id = $("#editSelf").find(".selfClass").eq(i).attr("id");
            			var tableObj = document.getElementById(id);
            			
            			if(tableObj){
                    		if(tableObj.rows.length>0){
                    				var columnList=[];
                    				var temp =  $(tableObj.rows[0].cells[0].children[0].children[1]).html();
                    				
                    				if(temp == ""){
                    					dialog.render({lang: "please_config_shelves"});
        		                        return;
                    				}
                            		for(var k=0;k<tableObj.rows[0].cells.length-1;k++){
                            			var obj={};
                            			var cell = tableObj.rows[0].cells[k].children[0].children[0];
                            			var t = $(tableObj.rows[0].cells[k].children[0].children[1]).html();
                            			if(t != temp){
                            				dialog.render({lang: "please_config_same_shelves"});
            		                        return;
                            			}
                            			obj.shelvesId = $(cell).html();
                            			var config = $(cell).attr("id");
                            			if(config && config.indexOf("-") > -1){
                            				obj.goodstype = config.split("-")[0];
                                			obj.tempmode = config.split("-")[1];
                                			obj.sugar = config.split("-")[2];
                                			obj.milk = config.split("-")[3];
                                			obj.measurement = config.split("-")[4];
                                			obj.ice = config.split("-")[5];
                                			obj.group = (i+1);
                            			}
                            			count ++;
                            			columnList.push(obj);
                            		}
                            		selfList.push(columnList);
                    		}
                    	}
            			
            		}
            	}

            	if(count != self.allNumber){
            		dialog.render({lang: "please_config_all_shelves"});
                    return;
            	}
            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	
            	if(self.ids){
            		Service.updateModel(eurl,self.ids,finalData,function(data) {
            			if(data.error && data.error_code == 70011){
            				dialog.render({lang: "model_name_exists"});
                            return;
            			}else{
            				self.automatWindow.destroy();
                    		self.fire("rendTableData");
            			}
                	});
            	}else{
            		Service.addModel(eurl,finalData,function(data) {
            			if(data.error && data.error_code == 70011){
            				dialog.render({lang: "model_name_exists"});
                            return;
            			}else{
            				self.automatWindow.destroy();
                    		self.fire("rendTableData");
            			}
                		
                	});
            	}
            	
			});
            //下一步
            $("#model_next_step").click(function(){
            	var selfList=[];
            	var len = $("#editSelf").find(".selfClass").length;
            	var count = 0;
            	
            	if(len >　0){
            		for(var i=0;i<len;i++){
            			var id = $("#editSelf").find(".selfClass").eq(i).attr("id");
            			var tableObj = document.getElementById(id);
            			if(tableObj){
            				if(tableObj.rows.length>0){
                				var columnList=[];
                				var temp =  $(tableObj.rows[0].cells[0].children[0].children[1]).html();
                				
                				if(temp == ""){
                					dialog.render({lang: "please_config_shelves"});
    		                        return;
                				}
                        		for(var k=0;k<tableObj.rows[0].cells.length-1;k++){
                        			var obj={};
                        			var cell = tableObj.rows[0].cells[k].children[0].children[0];
                        			var t = $(tableObj.rows[0].cells[k].children[0].children[1]).html();
                        			if(t != temp){
                        				dialog.render({lang: "please_config_same_shelves"});
        		                        return;
                        			}
                        			obj.shelvesId = $(cell).html();
                        			var config = $(cell).attr("id");
                        			if(config && config.indexOf("-") > -1){
                        				obj.goodstype = config.split("-")[0];
                            			obj.tempmode = config.split("-")[1];
                            			obj.sugar = config.split("-")[2];
                            			obj.milk = config.split("-")[3];
                            			obj.measurement = config.split("-")[4];
                            			obj.ice = config.split("-")[5];
                            			obj.group = (i+1);
                        			}
                        			count ++;
                        			columnList.push(obj);
                        		}
                        		selfList.push(columnList);
                		 }
                    	}
            			
            		}
            	}
            	
            	if(count != self.allNumber){
            		dialog.render({lang: "please_config_all_shelves"});
                    return;
            	}
            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	 this.KeyConfig = new KeyConfigInfo({
   	                 selector: "#keyConfig",
   	                 automatWindow: self.automatWindow,
   	                 id:self.ids,
   	                 data:finalData,
   	                 keyConfig:self.keyConfig,
   	                itemNumberConfig:self.itemNumberConfig,
   	                 events: {
   	                      "rendTableData": function() {
   	                           self.fire("rendTableData");
   	                       }
   	                  }
   	             });
            	
				$("#selfConfig").css("display", "none");//货道信息
                $("#baseInfo").css("display", "none");//基本信息
                $("#keyConfig").css("display", "block");//键盘信息
                $("#tab2").removeClass("active");
                $("#tab1").removeClass("active");
                $("#tab3").addClass("active");
			});
		}
		
	});
	return config;
});