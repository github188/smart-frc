define(function(require){
	var cloud = require("cloud/base/cloud");
	var Common = require("../../../../common/js/common");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./selfConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	var Service = require("../../service");
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.automatWindow = options.automatWindow;
			this.data = options.data;
			this.version = options.version;
			this.basedata = options.basedata;
			this.render();
			this.finalcontainers=[];
			this.amgridArr = [];
			this.jpgridArr = [];
			this.cidArr = [];

		},
		render:function(){
			this.getData();
			this.bindEvent();
		},
		getData:function(){
			var venderName = this.basedata.vendor;
            var vendor = this.basedata.vendor;
			var domain = window.location.host;

			venderName = Common.getLangVender(venderName);
			$("#vendor").val(venderName);
			$("#orgName").val(this.basedata.orgName);
			$("#editConfig").append("<tr id='autoTr'>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<label id='cabinetType_0'  name='cabinetType_0'>"+locale.get({lang:"the_main_cabinet"})+"</label>"
					+"</td>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<input style='width:80px;' type='hidden'  id='cid_0' />&nbsp;"
					+"</td>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<input id='vendor_0'  type='text' style='width:80px' disabled='disabled' value='"+venderName+"' name='vendor_0'/>"
					+"</td>"

					+"<td class='channelTable' style='line-height:0px'>"
					+  "<select id='machineType_0'  name='machineType_0' style='width:80px;height: 28px;border-radius: 4px;'>"
					+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
		            +     "<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>"
		            +     "<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>"
		            +     "<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>"
		            +  "</select>&nbsp;&nbsp;"
					+"</td>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<input style='width:80px;' disabled='disabled' type='text'  id='vmc_0' />&nbsp;&nbsp;"
					+"</td>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<select id='model_0'  name='model_0'  style='width:100px;height: 28px;border-radius: 4px;'>"
					+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
		            +  "</select>&nbsp;&nbsp;"
					+"</td>"
					+"<td class='channelTable' style='line-height:0px'>"
					+  "<select id='template_0'  name='template_0'  style='width:100px;height: 28px;border-radius: 4px;'>"
					+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
		            +  "</select>&nbsp;&nbsp;"
					+"</td>"

					+"<td class='channelTable' style='line-height:0px'>"
					+  "<input style='width:60px;' type='hidden'  id='ext_0' />&nbsp;&nbsp;"
					+"</td>"

					+"<td class='channelTable' style='line-height:0px'>"
					+  "<select id='serial_0'  name='serial_0' style='width:80px;height: 28px;border-radius: 4px;'>"
					+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
		            +     "<option value='ttyO2'>ttyO2</option>"
		            +     "<option value='ttyO3'>ttyO3</option>"
		            +     "<option value='ttyO4'>ttyO4</option>"
		            +     "<option value='ttyO5'>ttyO5</option>"
		            +     "<option value='ttyO6'>ttyO6</option>"
		            +     "<option value='ttyO7'>ttyO7</option>"
		            +  "</select>&nbsp;&nbsp;"
					+"</td>"
					+"<td class='channelTable'><span id='add' style='width:60px;cursor: pointer;'>添加</span></td>"
					+"</tr>");
			$("#serial_0").find("option[value='ttyO2']").attr("selected",true);
			if(domain == "longyuniot.com"){
				
			}else if(domain == "www.dfbs-vm.com"){
				$("#machineType_0").find("option[value='2']").remove();
				$("#machineType_0").find("option[value='3']").remove();
				$("#add").remove();
			}
			
			if(vendor == "fuji" || vendor == "easy_touch"){
				$("#machineType_0").find("option[value='2']").remove();
				$("#machineType_0").find("option[value='3']").remove();
			}else if(vendor == "junpeng"){
				$("#machineType_0").find("option[value='1']").remove();
				$("#machineType_0").find("option[value='2']").remove();
			}
			$("#machineType_0").bind('change', function(){
				var vendor = $("#vendor_0").val();//厂家
				
				var machineType = $('#machineType_0 option:selected').val();//货柜类型
				$("#vmc_0").val("");
                if(vendor == locale.get({lang: "vender_name_aucma"})){
                	if(machineType == 1 || machineType == "1"){
                		$("#vmc_0").val(0);
                	}else if(machineType == 2 || machineType == "2"){
                		$("#vmc_0").val(1);
                	}else if(machineType == 3 || machineType == "3"){
 
                		$("#vmc_0").val(2);
                		self.amgridArr.push(2);
                	}
					
					
				}else if(vendor == locale.get({lang: "vender_name_easy_touch"})){
					if(machineType == 1 || machineType == "1"){
						$("#vmc_0").val(11);
					}else if(machineType == 2 || machineType == "2"){

						$("#vmc_0").attr("placeholder","9-10");
					}else if(machineType == 3 || machineType == "3"){					

					}
					
				}else if(vendor == locale.get({lang: "vender_name_fuji"})){
					
                    if(machineType == 1 || machineType == "1"){
                    	$("#vmc_0").val(0);
					}else if(machineType == 2 || machineType == "2"){

					}else if(machineType == 3 || machineType == "3"){

					}
					
					
				}else if(vendor == locale.get({lang: "vender_name_baixue"})){
                    if(machineType == 1 || machineType == "1"){
						
					}else if(machineType == 2 || machineType == "2"){
						
					}else if(machineType == 3 || machineType == "3"){
						
					}
					
				}else if(vendor == locale.get({lang: "vender_name_junpeng"})){
                    if(machineType == 1 || machineType == "1"){

					}else if(machineType == 2 || machineType == "2"){

					}else if(machineType == 3 || machineType == "3"){
						$("#vmc_0").val(0);
                		self.jpgridArr.push(0);
					}
					
				}
				
				vendor = Common.getRealVender(vendor);
				
				var parametersObj = {
						machineType: machineType,
		                vender: vendor
				};
				$("#model_0").empty();
				$("#template_0").empty();
				$("#model_0").append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
				$("#template_0").append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
				if(machineType != "0"){
				Service.getTypeByMachineTypeAndVendor(parametersObj,function(data) {
					 if(data.result&&data.result.length>0){
						 for(var i=0;i<data.result.length;i++){
							 $("#model_0").append("<option value='" + data.result[i]._id +"' >" + data.result[i].name + "</option>");
		 				 }
					 }
				});
			   }
			});
			$("#model_0").bind('change', function(){
				var vendor = $("#vendor_0").val();//厂家
				vendor = Common.getRealVender(vendor);
				var machineType = $('#machineType_0 option:selected').val();//货柜类型
				var model = $('#model_0 option:selected').val();//型号
				var parametersObj = {
						machineType: machineType,
		                vender: vendor,
		                modelId:model
				};
				$("#template_0").empty();
				$("#template_0").append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
				if(machineType != "0" && model != "0"){
				Service.getTemplateByMachineTypeAndVendor(parametersObj,function(data) {
					 if(data.result&&data.result.length>0){
						 for(var i=0;i<data.result.length;i++){
							 $("#template_0").append("<option value='" + data.result[i]._id +"'>" + data.result[i].name + "</option>");
		 				 }
					 }
				});
			  }
			});
		},
		bindEvent:function(){
			var self = this;
			var tag = 1;
			//上一步
			$("#model_last_step").click(function(){
				$("#selfConfig").css("display","none");
				$("#baseInfo").css("display","block");
				$("#tab2").removeClass("active");
				$("#hint").text(locale.get({lang: "system_config_instruction"}));
				$("#tab1").addClass("active");
			});
			//完成
            $("#model_submit").click(function(){
            	self.containers = [];
            	var tableObj = document.getElementById("editConfig"); 
            	var row = 0;
            	var serialArr = new Array();
            	var fujiArr = new Array();
            	var aucmaArr = new Array();
            	var easytouchArr = new Array();
            	var junpengArr = new Array();
            	var baixueArr = new Array();
            	var cidArr = new Array();
            	self.row = 0;
            	self.templateIdm = 0;
				for(var i=0;i<tableObj.rows.length;i++){//行 
					var flag = 0;	
					var vmcCabinet = tableObj.rows[i].cells[4].children[0].value;
					var serial = tableObj.rows[i].cells[8].children[0].value;
					var vendor = tableObj.rows[i].cells[2].children[0].value;
					var external = tableObj.rows[i].cells[7].children[0].value;
					
					var cidm = tableObj.rows[i].cells[1].children[0].value;
					var machineTypem = tableObj.rows[i].cells[3].children[0].value;
					var modelIdm = tableObj.rows[i].cells[5].children[0].value;
					var templateIdm = tableObj.rows[i].cells[6].children[0].value;
					self.templateIdm = templateIdm;
					
					var mainSerial = $("#serial_0").val();
					var mainVmc = $("#vmc_0").val();
					
					if(i != 0){
						
						if(cidm == "" || cidm.replace(/(^\s*)|(\s*$)/g,"")==""){
							dialog.render({lang: "cid_not_null"});
							return ;
						}else{
							if(cidArr.length == 0){
								cidArr.push(cidm);
							}else{
								if($.inArray(cidm,cidArr) >= 0){
									dialog.render({lang: "cid_num_same"});
									return ;
								}else{
									cidArr.push(cidm);
								}
							}
						}
					}else{
						cidArr.push("master");
					}
					
					if(serial == 0 || serial == "0"){
						dialog.render({lang: "serial_not_null"});
						return ;
					}
					if(vmcCabinet == "" || vmcCabinet.replace(/(^\s*)|(\s*$)/g,"")==""){
						dialog.render({lang: "vmc_cabinat_not_null"});
						return ;
					}
					
					if(self.amgridArr.length > 5){
						dialog.render({lang: "vmc_cabinat_max"});
						return ;
					}
					
					if(vendor == "" || vendor.replace(/(^\s*)|(\s*$)/g,"")=="" || vendor == 0 || vendor == "0"){
						dialog.render({lang: "vendor_not_null"});
						return ;
					}
					
					if(vendor == locale.get({lang: "vender_name_fuji"}) || vendor == 3 || vendor == "3"){

						if(fujiArr.length == 0){
							fujiArr.push(vmcCabinet);
						}else{
							if($.inArray(vmcCabinet,fujiArr) >= 0){
								dialog.render({lang: "vmc_cabinat_num_same"});
								return ;
							}else{
								fujiArr.push(vmcCabinet);
							}
						}
						
						
		            }else if(vendor == locale.get({lang: "vender_name_aucma"}) || vendor == 1 || vendor == "1"){
		            	if(aucmaArr.length == 0){
		            		aucmaArr.push(vmcCabinet);
		            	}else{
		            		if($.inArray(vmcCabinet,aucmaArr) >= 0){
								dialog.render({lang: "vmc_cabinat_num_same"});
								return ;
							}else{
								aucmaArr.push(vmcCabinet);
							}
		            	}
		            	
		            }else if(vendor == locale.get({lang: "vender_name_easy_touch"}) || vendor == 2 || vendor == "2"){
		            	if(easytouchArr.length == 0){
		            		easytouchArr.push(vmcCabinet);
		            	}else{
		            		if($.inArray(vmcCabinet,easytouchArr) >= 0){
								dialog.render({lang: "vmc_cabinat_num_same"});
								return ;
							}else{
								easytouchArr.push(vmcCabinet);
							}
		            	}
		            	
		            }else if(vendor == locale.get({lang: "vender_name_junpeng"}) || vendor == 5 || vendor == "5"){
		            	if(junpengArr.length == 0){
		            		junpengArr.push(vmcCabinet);
		            	}else{
		            		if($.inArray(vmcCabinet,junpengArr) >= 0){
								dialog.render({lang: "vmc_cabinat_num_same"});
								return ;
							}else{
								junpengArr.push(vmcCabinet);
							}
		            	}
		            	
		            }else if(vendor == locale.get({lang: "vender_name_baixue"}) || vendor == 4 || vendor == "4"){
		            	if(baixueArr.length == 0){
		            		baixueArr.push(vmcCabinet);
		            	}else{
		            		if($.inArray(vmcCabinet,baixueArr) >= 0){
								dialog.render({lang: "vmc_cabinat_num_same"});
								return ;
							}else{
								baixueArr.push(vmcCabinet);
							}
		            	}
		            	
		            }
					
					
					if(external == 0 || external == "0"){
						if(serial != mainSerial){
							dialog.render({lang: "cabinat_serial_not_equals"});
							return ;
						}
						
					}else if(external == 1 || external == "1"){
						
						if($.inArray(serial,serialArr) >= 0){
							dialog.render({lang: "cabinat_serial_same"});
							return ;
							
						}else{
							serialArr.push(serial);
						}
						
					}
					
					
					
                    if(machineTypem == "0"){						
						dialog.render({lang: "please_choose_model_type"});
						return ;
					}					
					var cid = '';
					if(tableObj.rows[i].cells[5].children[0].value == 1){
					}else{
						cid = tableObj.rows[i].cells[1].children[0].value;
					}									
					
					if(self.templateIdm == 0){
						self.templateIdm = "000000000000000000000000";
					}

					Service.getTemplateById(self.templateIdm,function(data) {

						//self.row = flag;
						if(data && data.result){
							var config = data.result.config;
							var shelves = data.result.shelves;
							var machineType = data.result.machineType;
							var modelId = data.result.modelId;
							var templateId = data.result._id;
							if(self.row == 0){
								var channels =[];
								if(shelves && shelves.length>0){
									for(var m=0;m<shelves.length;m++){
										var channelsObj ={};
										channelsObj.rowId = 1;
										channelsObj.locationId = shelves[m].shelvesId;
										channelsObj.goodsId = shelves[m].goodsId;
										channelsObj.goodsName = shelves[m].goodsName;
										channelsObj.price = shelves[m].price;
										channels.push(channelsObj);
									}
								}
								
								if(machineType == 2){
									machineType = "spring_machine";
								}else if(machineType == 3){
									machineType = "grid_machine";
								}else if(machineType == 1){
									machineType = "drink_machine";
								}
								
								vmcCabinet = tableObj.rows[self.row].cells[4].children[0].value;
								serial = tableObj.rows[self.row].cells[8].children[0].value;
								vendor = tableObj.rows[self.row].cells[2].children[0].value;
								external = tableObj.rows[self.row].cells[7].children[0].value;
								
								if(vendor == locale.get({lang: "vender_name_fuji"})){
									vendor = "3";
					            }else if(vendor == locale.get({lang: "vender_name_aucma"})){
					            	vendor = "1";
					            }else if(vendor == locale.get({lang: "vender_name_easy_touch"})){
					            	vendor = "2";
					            }else if(vendor == locale.get({lang: "vender_name_junpeng"})){
					            	vendor = "5";
					            }else if(vendor == locale.get({lang: "vender_name_baixue"})){
					            	vendor = "4";
					            }
								var configObj ={
										cid:"master",
										machineType:machineType,
										channels:channels,
										modelId:modelId,
										templateId:templateId,
										vmcCabinet:vmcCabinet,
										serial:serial,
										vendor:vendor,
										external:external
								};
								self.containers.push(configObj);
							}else{
								var channels =[];
								if(config && config.length>0){
									var total =0;
									for(var m=0;m<config.length;m++){
										var number = parseInt(config[m].number);
										for(var n=total;n<(number+total);n++){
											var channelsObj ={};
											channelsObj.rowId = config[m].row;
											channelsObj.locationId = shelves[n].shelvesId;
											channelsObj.goodsId = shelves[n].goodsId;
											channelsObj.goodsName = shelves[n].goodsName;
											channelsObj.price = shelves[n].price;
											channels.push(channelsObj);
										}
										total += parseInt(number);
									}
								}
								if(machineType == 2){
									machineType = "spring_machine";
								}else if(machineType == 3){
									machineType = "grid_machine";
								}else if(machineType == 1){
									machineType = "drink_machine";
								}
								
								vmcCabinet = tableObj.rows[self.row].cells[4].children[0].value;
								serial = tableObj.rows[self.row].cells[8].children[0].value;
								vendor = tableObj.rows[self.row].cells[2].children[0].value;
								external = tableObj.rows[self.row].cells[7].children[0].value;
								
								var configObj ={
										cid:tableObj.rows[self.row].cells[1].children[0].value,
										machineType:machineType,
										channels:channels,
										modelId:modelId,
										templateId:templateId,
										vmcCabinet:vmcCabinet,
										serial:serial,
										vendor:vendor,
										external:external
								};
								self.containers.push(configObj);
							}
							
						}else{
																																														
							modelIdm = tableObj.rows[self.row].cells[5].children[0].value;
							templateIdm = tableObj.rows[self.row].cells[6].children[0].value;
							machineTypem = tableObj.rows[self.row].cells[3].children[0].value;
							
							vmcCabinet = tableObj.rows[self.row].cells[4].children[0].value;
							serial = tableObj.rows[self.row].cells[8].children[0].value;
							vendor = tableObj.rows[self.row].cells[2].children[0].value;
							external = tableObj.rows[self.row].cells[7].children[0].value;
							
							if(vendor == locale.get({lang: "vender_name_fuji"})){
								vendor = "3";
				            }else if(vendor == locale.get({lang: "vender_name_aucma"})){
				            	vendor = "1";
				            }else if(vendor == locale.get({lang: "vender_name_easy_touch"})){
				            	vendor = "2";
				            }else if(vendor == locale.get({lang: "vender_name_junpeng"})){
				            	vendor = "5";
				            }else if(vendor == locale.get({lang: "vender_name_baixue"})){
				            	vendor = "4";
				            }
							
							if(machineTypem == 2){
								machineTypem = "spring_machine";
							}else if(machineTypem == 3){
								machineTypem = "grid_machine";
							}else if(machineTypem == 1){
								machineTypem = "drink_machine";
							}
							var templateId = "0";
							var channels =[];

							if(self.row == 0){									
								var configObj ={
										cid:"master",
										machineType:machineTypem,
										channels:channels,
										modelId:modelIdm,
										templateId:templateId,
										vmcCabinet:vmcCabinet,
										serial:serial,
										vendor:vendor,
										external:external
								};
								self.containers.push(configObj);
							}else{
								var channels =[];	
								
								var configObj ={
										cid:tableObj.rows[self.row].cells[1].children[0].value,
										machineType:machineTypem,
										channels:channels,
										modelId:modelIdm,
										templateId:templateId,
										vmcCabinet:vmcCabinet,
										serial:serial,
										vendor:vendor,
										external:external
								};
								self.containers.push(configObj);
							}
								
							
						}
						
						if(self.row == (tableObj.rows.length-1)){
													
							var vendingConfig={
									vendor:self.basedata.vendor,
									orgName:self.basedata.orgName,
									containers:self.containers
							};
							var allconfig = {
									server:self.data.server,
									apps:self.data.apps,
									systemConfig:self.data.systemConfig,
									vendingConfig:vendingConfig
							}
							var finalData = {
									vender:self.basedata.vendor,
									version:self.version,
									desc:self.basedata.desc,
									config:allconfig									
							}
							Service.createInbox(finalData,function(data) {
									
								if (data.error_code == null && data.result) {						
									self.automatWindow.destroy();
									cloud.util.unmask();
									self.fire("rendTableData");
								}else{
									dialog.render({lang: "create_inbox_error"});

									return ;
									
								}
								
							});
							
						}
						self.row ++;
											
					});
					
				}
			});
            $("#add").click(function(){
            	
            	
            	var domain = window.location.host;

				$("#editConfig").append("<tr id='check_"+tag+"'>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<label id='cabinetType_"+tag+"'  name='cabinetType_"+tag+"'>"+locale.get({lang:"auxiliary_cabinet"})+"</label>"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<input style='width:80px;' type='text'  id='cid_"+tag+"' />&nbsp;&nbsp;"
						+"</td>"

						+"<td class='channelTable' style='line-height:0px'>"
						+  "<select id='vendor_"+tag+"'  name='vendor_"+tag+"' style='width:80px;height: 28px;'>"
						+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
			            +     "<option value='1'>"+locale.get({lang:"vender_name_aucma"})+"</option>"
			            +     "<option value='5'>"+locale.get({lang:"vender_name_junpeng"})+"</option>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<select id='machineType_"+tag+"'  name='machineType_"+tag+"' style='width:80px;height: 28px;'>"
						+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
			            +     "<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>"
			            +     "<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<input style='width:80px;' disabled='disabled' type='text'  id='vmc_"+tag+"' />&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<select id='model_"+tag+"'  name='model_"+tag+"' style='width:110px;height: 28px;'>"
						+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<select id='template_"+tag+"'  name='template_"+tag+"' style='width:110px;height: 28px;'>"
						+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<input style='width:60px; height: 18px;' type='checkbox' value='0' id='ext_"+tag+"' />&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable' style='line-height:0px'>"
						+  "<select id='serial_"+tag+"'  name='serial_"+tag+"' style='width:80px;height: 28px;'>"
						+     "<option value='0'>"+locale.get({lang:"please_select"})+"</option>"
						 +     "<option value='ttyO2'>ttyO2</option>"
				            +     "<option value='ttyO3'>ttyO3</option>"
				            +     "<option value='ttyO4'>ttyO4</option>"
				            +     "<option value='ttyO5'>ttyO5</option>"
				            +     "<option value='ttyO6'>ttyO6</option>"
				            +     "<option value='ttyO7'>ttyO7</option>"
			            +  "</select>&nbsp;&nbsp;"
						+"</td>"
						+"<td class='channelTable'><span id='delete_"+tag+"' name='"+tag+"' class='delcls' style='width:60px;cursor: pointer;'>删除</span></td>"
						+"</tr>");
				
				if(domain == "longyuniot.com"){
					$("#vendor_"+tag).find("option[value='5']").remove();
					$("#ext_"+tag).css("display","none");
				}
				var serial0 = $("#serial_0").val();
				$("#serial_"+tag).find("option[value='"+serial0+"']").attr("selected",true);
				
				$("#ext_"+tag).bind('click',{tag:tag},function(e){
					
					var serial_0 = $('#serial_0 option:selected').val();//选中的值
					var vendor = $("#vendor_"+e.data.tag).val();
		
					var extval = $(this).val();
					if(extval == '0' || extval == 0){
						$(this).val(1);
						
						$("#serial_"+e.data.tag).find("option[value='ttyO3']").attr("selected",true);
						
					}else{
						$(this).val(0);
						$("#serial_"+e.data.tag).find("option[value='"+serial_0+"']").attr("selected",true);
					}
					
					
				});
				$("#machineType_"+tag).find("option[value='2']").css("display","none");
				$("#machineType_"+tag).find("option[value='3']").css("display","none");
				$("#vendor_"+tag).bind('change',{tag:tag}, function(e){
					self.tag = e.data.tag;
					var vendor = $("#vendor_"+self.tag).val();//厂家
					$("#machineType_"+self.tag).find("option[value='2']").css("display","none");
					$("#machineType_"+self.tag).find("option[value='3']").css("display","none");
					$("#machineType_"+self.tag).val(0);
					$("#machineType_"+self.tag).change();
					$("#vmc_"+self.tag).val("");
					if(vendor == 5 || vendor == "5"){
						$("#machineType_"+self.tag).find("option[value='3']").css("display","block");
						
					}else if(vendor == 1 || vendor == "1"){
						$("#machineType_"+self.tag).find("option[value='2']").css("display","block");
						$("#machineType_"+self.tag).find("option[value='3']").css("display","block");
					}else{
						$("#machineType_"+self.tag).find("option[value='2']").css("display","none");
						$("#machineType_"+self.tag).find("option[value='3']").css("display","none");
						
					}
				});
				$("#machineType_"+tag).bind('change',{tag:tag}, function(e){
					self.tag = e.data.tag;
					
					var vendor = $("#vendor_"+self.tag).val();//厂家
					var machineType = $(this).val();//货柜类型

                    if(vendor == 1 || vendor == "1"){
                    	if(machineType == 1 || machineType == "1"){
                    		$("#vmc_"+self.tag).val(0);

                    	}else if(machineType == 2 || machineType == "2"){
                    		$("#vmc_"+self.tag).val(1);
                    	}else if(machineType == 3 || machineType == "3"){

                    		var le = self.amgridArr.length;/////////////////////////
                    		$("#vmc_"+self.tag).val(le+2);
                    		self.amgridArr.push(le+2);
                    	}
						
						
					}else if(vendor == 2 || vendor == "2"){
						if(machineType == 1 || machineType == "1"){
							$("#vmc_"+self.tag).val(11);

						}else if(machineType == 2 || machineType == "2"){

							$("#vmc_"+self.tag).attr("placeholder","9-10");
						}else if(machineType == 3 || machineType == "3"){                 		

						}
						
					}else if(vendor == 3 || vendor == "3"){
						
                        if(machineType == 1 || machineType == "1"){
                        	$("#vmc_"+self.tag).val(0);

						}else if(machineType == 2 || machineType == "2"){

						}else if(machineType == 3 || machineType == "3"){
 
						}
						
						
					}else if(vendor == 4 || vendor == "4"){
                        if(machineType == 1 || machineType == "1"){
							
						}else if(machineType == 2 || machineType == "2"){
							
						}else if(machineType == 3 || machineType == "3"){
							
						}
						
					}else if(vendor == 5 || vendor == "5"){
                        if(machineType == 1 || machineType == "1"){

						}else if(machineType == 2 || machineType == "2"){

						}else if(machineType == 3 || machineType == "3"){
							var le = self.jpgridArr.length;/////////////////////////
                    		$("#vmc_"+self.tag).val(le);
                    		self.jpgridArr.push(le);
						}
						
					}
					
					
					if(vendor == 3 || vendor == "3"){
						vendor = "fuji";
		            }else if(vendor == 1 || vendor == "1"){
		            	vendor = "aucma";
		            }else if(vendor == 2 || vendor == "2"){
		            	vendor = "easy_touch";
		            }else if(vendor == 5 || vendor == "5"){
		            	vendor = "junpeng";
	                }else if(vendor == 4 || vendor == "4"){
	                	vendor = "baixue";
	                }
					
					var parametersObj = {
							machineType: machineType,
			                vender: vendor
					};
					$("#model_"+self.tag).empty();
					$("#template_"+self.tag).empty();
					$("#model_"+self.tag).append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
					$("#template_"+self.tag).append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
					if(machineType != "0"){
					Service.getTypeByMachineTypeAndVendor(parametersObj,function(data) {
						 if(data.result&&data.result.length>0){
							 for(var i=0;i<data.result.length;i++){
								 $("#model_"+self.tag).append("<option value='" + data.result[i]._id +"'>" + data.result[i].name + "</option>");
			 				 }
						 }
					});
				   }
				});
				$("#model_"+tag).bind('change',{tag:tag}, function(e){
					self.tag = e.data.tag;
					var vendor = $("#vendor_"+self.tag).val();//厂家
					if(vendor == 3 || vendor == "3"){
						vendor = "fuji";
		            }else if(vendor == 1 || vendor == "1"){
		            	vendor = "aucma";
		            }else if(vendor == 2 || vendor == "2"){
		            	vendor = "easy_touch";
		            }else if(vendor == 5 || vendor == "5"){
		            	vendor = "junpeng";
	                }else if(vendor == 4 || vendor == "4"){
	                	vendor = "baixue";
	                }
					var machineType = $("#machineType_"+self.tag+" option:selected").val();//货柜类型
					var model = $(this).val();//型号
					var parametersObj = {
							machineType: machineType,
			                vender: vendor,
			                modelId:model
					};
					$("#template_"+self.tag).empty();
					$("#template_"+self.tag).append("<option value='0'>"+locale.get({lang:"please_select"})+"</option>");
					if(machineType != "0" && model != "0"){
					Service.getTemplateByMachineTypeAndVendor(parametersObj,function(data) {
						 if(data.result&&data.result.length>0){
							 for(var i=0;i<data.result.length;i++){
								 $("#template_"+self.tag).append("<option value='" + data.result[i]._id +"'>" + data.result[i].name + "</option>");
			 				 }
						 }
					});
				  }
				});
				tag ++;
			    $(".delcls").click(function(){
					 $("#check_"+this.getAttribute('name')).remove();
			    });
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
	return config;
});