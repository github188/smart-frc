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
    var Vender = require("./vender/list/list");
    var SelfConfigInfo = require("./selfConfig/goodsConfig");
    var SelfConfigInfo_home = require("./homeSelfConfig/goodsConfig");
	var SelfConfigInfo_coffee = require("./coffee/goodsConfig");
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	var eurl;
	if(oid == '0000000000000000000abcde'){
	     eurl = "mapi";
	}else{
	     eurl = "api";
	}
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.id = options.id;
            this._renderWindow();
            this.shelves = null;
            this.keyConfig = null;
            this.existstag = false;
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
            $("#nextBase").val(locale.get({lang: "next_step"}));
            this.render();
        },
        render:function(){
        	var self = this;
        	this.renderMachineType();//获取货柜类型
        	
        	var language = locale._getStorageLang();
             if(language =='en'){
            	 this._renderGetVender();//获取厂家
             }else{
              	$("#vender_add_button").css("display","none");
              	this.init();
             }

             this.bindEvent();
	        if(this.id){
	        	//this.existstag = false;
	        	Service.existsAutomat(this.id,function(data){
            		if(data.error!=null){
            			 if(data.error_code == "70028"){
							  // dialog.render({lang:"model_can_not_modifid"});
							//   return;
            				 self.existstag = true;
                    $("#vender").attr('disabled', 'true');
                    $("#machineType").attr('disabled', 'true');
                    $("#modelName").attr('disabled', 'true');
            			 }
            		}
            	});
     
	           this.getData();
	        }      
	       
        },
        init:function(){
        	var currentHost=window.location.hostname;
        	/*if(currentHost == "longyuniot.com"){
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
            	$("#vender").append("<option value='leiyunfeng'>"+locale.get({lang: "leiyunfeng"})+"</option>");
            }*/
        	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
        	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
        	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
        	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
        	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
        	$("#vender").append("<option value='leiyunfeng'>"+locale.get({lang: "leiyunfeng"})+"</option>");
        },
        renderMachineType:function(){
        	$("#machineType").html("");
        	$("#machineType").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        	
        	var languge = localStorage.getItem("language");
            if (languge == "en") {
    			$("#machineType").append("<option value='1'>Beverage machine</option>");
            	$("#machineType").append("<option value='2'>Snack machine</option>");
            //	$("#machineType").append("<option value='6'>Combo Vending Machine</option>");
            }else{
            	$("#machineType").append("<option value='1'>"+locale.get({lang:"drink_machine"})+"</option>");
            	$("#machineType").append("<option value='2'>"+locale.get({lang:"spring_machine"})+"</option>");
            	$("#machineType").append("<option value='3'>"+locale.get({lang:"grid_machine"})+"</option>");
            }
            
			
        },
        getData:function(){
        	var self = this;
        	var language = locale._getStorageLang();
        	//cloud.util.mask("#deviceForm");
        	Service.getModelById(eurl,self.id, function(data) {
        		//cloud.util.unmask("#deviceForm");
        		console.log(data.result);
       		    $("#modelName").val(data.result.name==null?"":data.result.name);
       		    $("#vender option[value='"+data.result.number+"']").attr("selected","selected");
//       		    $("#vender option").each(function (){  
//       		       if($(this).text()== data.result.vender){   
//       		    	 $(this).attr("selected", true);
//       		       }
//       		    });  
       		    if(data.result.number == "fuji"){
       		    	$("#machineType").append("<option value='4'>"+locale.get({lang:"coffee_machine"})+"</option>");
       		    	$("#machineType").append("<option value='5'>"+locale.get({lang:"wine_machine"})+"</option>");
       		    }
       		    $("#machineType option[value='"+data.result.machineType+"']").attr("selected","selected");
       		    self.shelves = data.result.shelves;
				self.keyConfig = data.result.keyConfig;
				self.itemNumberConfig = data.result.itemNumberConfig;
				
				if(data.result.machineType == 1&&language!="en" || data.result.machineType == 4 || data.result.machineType == 5){
        			$("#zhugui").css("display","block");
        			if(data.result.shelves && data.result.shelves.length>0){
        			   var startNumber = data.result.shelves[0][0].shelvesId;
        			   var allNumber=0;
        			   for(var i=0;i<data.result.shelves.length;i++){
        				   allNumber = allNumber + data.result.shelves[i].length;
        			   }
        			   $("#startNumber").val(startNumber);
        			   $("#allNumber").val(allNumber);
        			   self.startN = startNumber;
        			   self.allN = allNumber;
        			}
        		}else{
        			$("#zhugui").css("display","none");
        		}
        	});
        },
        bindEvent:function(){
        	var self =this;
        	$("#vender").change(function(){
        		var vender = $(this).children('option:selected').val();
        		console.log(vender);
        		if(vender == 'fuji'){
        			$("#machineType").append("<option value='4'>"+locale.get({lang:"coffee_machine"})+"</option>");
        			$("#machineType").append("<option value='5'>"+locale.get({lang:"wine_machine"})+"</option>");
        		}else{
        			$("#machineType option[value=4]").remove();
        		}
        	});
        	
        	$("#machineType").change(function(){
        		var type = $(this).children('option:selected').val();
        		var machineText=$(this).find("option:selected").text();
        		if(type == 1&&machineText!="Beverage machine" || type == 4 || type == 5){
        			$("#startNumber").val("1");
        			$("#zhugui").css("display","block");
        		}else{
        			$("#zhugui").css("display","none");
        		}
        	});
        	//编辑厂家
        	if(self.venderBtn){
        	}else{
        		self.venderBtn = new Button({
                    text: locale.get({lang: "edit"}),
                    container: $("#vender_add_button"),
                    events: {
                        click: function() {                    
                       	 if (self.vender_listPage) {
                        		  self.vender_listPage.destroy();
                            }
                            this.vender_listPage = new Vender({
                                selector: "body",
                                events: {
                                    "getvenderList": function() { 
                                    	self._renderGetVender();
                                    }
                                }
                            });     
                        }
                    }
                }); 
        	}
        	 
        	 $("#nextBase").unbind("click");
        	 $("#nextBase").bind("click", function() {
        		 var vender = $("#vender").find("option:selected").text();//厂家
        		 var vender_val = $("#vender").find("option:selected").val();
         		 var machineType = $("#machineType").find("option:selected").val();
                 var machineText=$("#machineType").find("option:selected").text();
         		 var modelName = $("#modelName").val();//型号
         		 
         		 var startNumber = $("#startNumber").val();//货道起始 编号
         		 var allNumber = $("#allNumber").val();//货道总数
         		 
         		 if(vender_val == null || vender_val == 0){
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
         		
         		 if(machineType == 1 || machineType==5){//饮料机
         			var a = /^(\d*|\-?[1-9]{1}\d*)$/;
             		if (!startNumber.match(a) || startNumber == null || startNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || startNumber < 0 || startNumber == 0) {
                        dialog.render({lang: "automat_enter_roadStartingNumber"});
                        return;
                    }
        			if (!allNumber.match(a) || allNumber == 0 || allNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || allNumber < 0) {
                        dialog.render({lang: "automat_enter_buttonNumber"});
                        return;
                    }
         			 this.SelfConfig = new SelfConfigInfo_home({
       	                 selector: "#selfConfigInfo",
       	                 automatWindow: self.automatWindow,
       	                 machineType:machineType,
       	                 vender:vender,
       	                 number:vender_val,
       	                 modelName:modelName,
       	                 startNumber:startNumber,
       	                 allNumber:allNumber,
       	                 id:self.id,
       	                 shelves:self.shelves,
       	                 keyConfig:self.keyConfig,
       	                itemNumberConfig:self.itemNumberConfig,
       	                 events: {
       	                      "rendTableData": function() {
       	                           self.fire("getModelList");
       	                       }
       	                  }
       	             });
         		 }else if(machineType == 4){
         			var a = /^(\d*|\-?[1-9]{1}\d*)$/;
             		if (!startNumber.match(a) || startNumber == null || startNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || startNumber < 0) {
                        dialog.render({lang: "automat_enter_roadStartingNumber"});
                        return;
                    }
        			if (!allNumber.match(a) || allNumber == 0 || allNumber.replace(/(^\s*)|(\s*$)/g,"")=="" || allNumber < 0) {
                        dialog.render({lang: "automat_enter_buttonNumber"});
                        return;
                    }
        			var exd = false;
        			if(self.startN == startNumber && self.allN == allNumber){
        				exd = true;
        			}
        			
         			 this.SelfConfig = new SelfConfigInfo_coffee({
       	                 selector: "#selfConfigInfo",
       	                 automatWindow: self.automatWindow,
       	                 machineType:machineType,
       	                 vender:vender,
       	                 number:vender_val,
       	                 modelName:modelName,
       	                 startNumber:startNumber,
       	                 allNumber:allNumber,
       	                 id:self.id,
       	                 shelves:self.shelves,
       	                 keyConfig:self.keyConfig,
       	                 itemNumberConfig:self.itemNumberConfig,
       	                 exd:exd,
       	                 events: {
       	                      "rendTableData": function() {
       	                           self.fire("getModelList");
       	                       }
       	                  }
       	             });
         			 
         		 }else{
         			 this.SelfConfig = new SelfConfigInfo({
       	                 selector: "#selfConfigInfo",
       	                 automatWindow: self.automatWindow,
       	                 machineType:machineType,
       	                 vender:vender,
       	                 number:vender_val,
       	                 modelName:modelName,
       	                 id:self.id,
       	                 shelves:self.shelves,
       	                 keyConfig:self.keyConfig,
       	                 itemNumberConfig:self.itemNumberConfig,
       	                 existstag: self.existstag,
       	                 events: {
       	                      "rendTableData": function() {
       	                           self.fire("getModelList");
       	                       }
       	                  }
       	             });
         		 }
         		
         		 
   			      $("#selfConfig").css("display", "block");//货道信息
                  $("#baseInfo").css("display", "none");//基本信息
                  $("#keyConfig").css("display", "none");//键盘信息
                  $("#itemNumber").css("display", "none");//键盘信息
                  $("#tab1").removeClass("active");
                  $("#tab3").removeClass("active");
                  $("#tab2").addClass("active");
        	 });
        },
        _renderGetVender:function(){
        	var self = this;
        	$("#vender").html("");
			$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList(eurl,0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender").append("<option value='" +data.result[i].number + "'>" +data.result[i].name+"</option>");
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
