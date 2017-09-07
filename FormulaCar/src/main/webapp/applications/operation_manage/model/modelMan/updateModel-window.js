define(function(require) {
    var cloud = require("cloud/base/cloud");
    var Common = require("../../../../common/js/common");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateModel.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../../service");
    var SelfConfigInfo = require("./goodsConfig");
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            this.data = null;
            this.config = null;
            locale.render({element: this.element});
        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.automatWindow = new _Window({
                container: "body",
                title: locale.get({lang: "model_list"}),
                top: "center",
                left: "center",
                height: 620,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.automatWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
            this.automatWindow.show();
            this.init();
            this.bindEvent();
            if(this.id){
            	this.getData();
            }
        },
        getData:function(){
        	var self = this;
        	cloud.util.mask("#deviceForm");
        	Service.getModelById(self.id, function(data) {
        		 cloud.util.unmask("#deviceForm");
        		 $("#vender option[value='"+data.result.vender+"']").attr("selected","selected");
        		 $("#vender").change();
        		 $("#machineType option[value='"+data.result.machineType+"']").attr("selected","selected");
        		 $("#modelName").val(data.result.name==null?"":data.result.name);
        		 
        		 if(data.result.machineType == 1){
         			$("#startNumber").val(data.result.config[0].row);
         			$("#allNumber").val(data.result.config[0].number);
         			$("#fugui").css("display","none");
         			$("#zhugui").css("display","block");
         		 }else if(data.result.machineType == 2 || data.result.machineType == 3){
         			$("#zhugui").css("display","none");
         			$("#fugui").css("display","block");
         			$("#okText").val(locale.get({lang: "okText"}));
         			$("#rowNumber").val(data.result.config.length);
         			
         			var tabList = data.result.config;
    				if(tabList && tabList.length > 0){
        				for(var i=0;i<tabList.length;i++){
        					$("#editConfig").append("<tr id='autoTr'>"
                					+"<td class='channelTable'>"
                					+  "<label id='"+(i+1)+"'  name='"+(i+1)+"'>"+tabList[i].row+"</label>"
                					+"</td>"
                					+"<td class='channelTable'>"
                					+  "<input style='width:100px;' type='text'  id='number_'+'"+i+"' value='"+tabList[i].number+"'/>&nbsp;&nbsp;"
                					+"</td>"
                					+"</tr>");
        				}
    				}
    				self.data = data.result.shelves;
    				self.config = data.result.config;
         		 }
        		 
        		 
        	});
        },
        init:function(){
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){
        		$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            }else if(currentHost == "www.dfbs-vm.com"){
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            }else {
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
            	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
            	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
            }
        	$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#nextBase").val(locale.get({lang: "next_step"}));
        	
        },
        bindEvent:function(){
        	var self =this;
        	$("#vender").change(function(){
        		var vender = $(this).children('option:selected').val();
        		if(vender == 0){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			
        		}else if(vender == 'aucma'){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
                	$("#machineType").append("<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>");
                	$("#machineType").append("<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>");
        		}else if(vender == 'fuji'){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
        		}else if(vender == 'easy_touch'){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
        		}else if(vender == 'junpeng'){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			$("#machineType").append("<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>");
        		}else if(vender == 'baixue'){
        			$("#machineType").html("");
        			$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        			$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
                	$("#machineType").append("<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>");
                	$("#machineType").append("<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>");
        		}
        	});
        	
        	$("#machineType").change(function(){
        		var type = $(this).children('option:selected').val();
        		if(type == 1){
        			$("#startNumber").val("1");
        			$("#fugui").css("display","none");
        			$("#zhugui").css("display","block");
        		}else if(type == 2 || type == 3){
        			$("#zhugui").css("display","none");
        			$("#fugui").css("display","block");
        			$("#okText").val(locale.get({lang: "okText"}));
        		}
        	});
        	
        	$("#okText").bind("click", function() {
        		var rowNumber = $("#rowNumber").val();
        		if(rowNumber==null|| rowNumber.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"enter_rowNumber_name"});
          			return;
          	    }
        		if(rowNumber == 0 || rowNumber <0 || rowNumber.replace(/(^\s*)|(\s*$)/g,"")==""){
          			dialog.render({lang:"line_number_must_be_greater_than_0"});
          			return;
          	    }
        		$("#editConfig").empty();
        		for(var i=0;i<rowNumber;i++){
        			$("#editConfig").append("<tr id='autoTr'>"
        					+"<td class='channelTable'>"
        					+  "<label id='"+(i+1)+"'  name='"+(i+1)+"'>"+(i+1)+"</label>"
        					+"</td>"
        					+"<td class='channelTable'>"
        					+  "<input style='width:100px;' type='text'  id='number_'+'"+i+"' />&nbsp;&nbsp;"
        					+"</td>"
        					+"</tr>");
        		}
        	});
        	$("#nextBase").bind("click", function() {
        		var vender = $("#vender").find("option:selected").val();//厂家
        		var machineType = $("#machineType").find("option:selected").val();
        		var modelName = $("#modelName").val();//型号
        		if(vender == null || vender == 0){
        			 dialog.render({lang: "please_select_vender"});
                     return;
        		}
        		if(machineType == null || machineType == 0){
       			    dialog.render({lang: "please_select_machineType"});
                    return;
       		    }
        		if(modelName == null  || modelName.replace(/(^\s*)|(\s*$)/g,"")==""){
       			    dialog.render({lang: "please_enter_modelName"});
                    return;
       		    }
        		
                if(machineType == 1){//饮料机
        			var roadStartingNumber = $("#startNumber").val();
        			var allNumber = $("#allNumber").val();
        			var a = /^(\d*|\-?[1-9]{1}\d*)$/;
        			if (!roadStartingNumber.match(a) || roadStartingNumber == null || roadStartingNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || roadStartingNumber < 0) {
                        dialog.render({lang: "automat_enter_roadStartingNumber"});
                        return;
                    }
        			if (!allNumber.match(a) || allNumber == 0 || allNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || allNumber < 0) {
                        dialog.render({lang: "automat_enter_buttonNumber"});
                        return;
                    }
        			
        			this.SelfConfig = new SelfConfigInfo({
        	             selector: "#selfConfigInfo",
        	             automatWindow: self.automatWindow,
        	             roadStartingNumber:roadStartingNumber,
        	             allNumber:allNumber,
        	             machineType:1,
        	             vender:vender,
        	             modelName:modelName,
        	             id:self.id,
        	             events: {
        	                    "rendTableData": function() {
        	                        self.fire("getModelList");
        	                    }
        	              }
        	        });
        			$("#selfConfig").css("display", "block");
                    $("#baseInfo").css("display", "none");
                    $("#tab1").removeClass("active");
                    $("#tab2").addClass("active");
        		}else if(machineType == 2 || machineType == 3){//弹簧机  格子柜
        			var rowNumber = $("#rowNumber").val();//行数
        			if(rowNumber==null|| rowNumber.replace(/(^\s*)|(\s*$)/g,"")==""){
              			dialog.render({lang:"enter_rowNumber_name"});
              			return;
              	    }
        			var tableObj = document.getElementById("editConfig"); 
        			var tableList = [];
        			if(tableObj && tableObj.rows.length >0 ){
        				for(var i=0;i<tableObj.rows.length;i++){//行
        					if(tableObj.rows[i].cells[1].children[0].value){
        						var row    = i+1;//第几行
								var number = tableObj.rows[i].cells[1].children[0].value;//货道个数
								var configObj ={
										row:row,
										number:number
								};
								tableList.push(configObj);
							}else{
								dialog.render({lang:"automat_enter_buttonNumber"});
								return;
							}
        				}
        				if(self.id){
        					if(tableList.length>0 && self.config.length >0){
            					if(tableList.length == self.config.length){
            						var counts = tableList.length;
            						for(var m=0;m<counts;m++){
            							if(self.config[m].number == tableList[m].number){
        								}else{
        									self.data = null;
        									break;
        								}
            						}
            					}else{
            						self.data = null;
            					}
            				}
        				}
        				
        				this.SelfConfig = new SelfConfigInfo({
           	                selector: "#selfConfigInfo",
           	                automatWindow: self.automatWindow,
           	                machineType:machineType,
           	                vender:vender,
           	                modelName:modelName,
           	                rowList:tableList,
           	                rowData:self.data,
           	                id:self.id,
           	                events: {
           	                    "rendTableData": function() {
           	                        self.fire("getModelList");
           	                    }
           	                }
           	            });
        				$("#selfConfig").css("display", "block");
                        $("#baseInfo").css("display", "none");
                        $("#tab1").removeClass("active");
                        $("#tab2").addClass("active");
        			}else{
    					dialog.render({lang:"please_add_a_row"});
               			return;
    				}
        		}
        	});
        },
        destroy: function() {
            if (this.window) {
                this.window.destroy();
            } else {
                this.window = null;
            }
        }
    });
    return updateWindow;
});
