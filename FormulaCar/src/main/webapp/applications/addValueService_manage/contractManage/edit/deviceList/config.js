define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./config.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("cloud/lib/plugin/jquery.datetimepicker");
    var AddDevice = require("./addDevice/addDevice");
    var Service = require("../../service");
	
	var config = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
		    this.element.html(winHtml);
			locale.render({element:this.element});
			this.baseData = options.baseData;
			this.id = options.id;
			this.render();
	        this.adWindow = options.adWindow;
		},
		render:function(){
			$("#upload").val(locale.get({lang: "add_menu"}));
			this.bindEvent();
			if(this.id){
				this.loadData();
			}
		},
		loadData:function(){
			var self = this;
			Service.getContractById(this.id,function(data){
				self.deviceInfo = data.result.deviceInfo;
				if(self.deviceInfo && self.deviceInfo.length>0){
					for(var i=0;i<self.deviceInfo.length;i++){
						if(self.deviceInfo[i].rentAmount){
						}else{
							self.deviceInfo[i].rentAmount='-';
						}
						if(self.deviceInfo[i].serviceCharge){
						}else{
							self.deviceInfo[i].serviceCharge='-';
						}
						 $("#editConfig").append("<tr id='"+self.deviceInfo[i].assetId+"'>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].assetId+"' >"+self.deviceInfo[i].assetId+"</label>"
	        						+"</td>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].rentAmount+"'>"+self.deviceInfo[i].rentAmount+"</label>"
	        						+"</td>"
	        						+"<td class='channelTable'>"
	        						+  "<label id='"+self.deviceInfo[i].assetId+":"+self.deviceInfo[i].serviceCharge+"'>"+self.deviceInfo[i].serviceCharge+"</label>"
	        						+"</td>"
	        						+"<td class='channelTable'><span id='delete:"+self.deviceInfo[i].assetId+"' name='"+self.deviceInfo[i].assetId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
	        						+"</tr>");
	             		 $(".delcls").bind('click',function(e) {
	              			 $(this).parent().parent().remove();
	          			 });
					}
				}
				
        	});
			
		},
		bindEvent:function(){
			var self = this;
			//上一步
			$("#model_last_step").click(function(){
                $("#baseInfo").css("display", "block");
                $("#devicelist").css("display", "block");
                $("#tab2").removeClass("active");
                $("#tab1").addClass("active");
			});
            //完成
            $("#model_finish").click(function(){
            	var configArray=[];
				var tableObj = document.getElementById("editConfig"); 
				if(tableObj && tableObj.rows.length >0 ){
					for(var i=0;i<tableObj.rows.length;i++){//行 
						var configObj ={};
						for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
							
							configObj.assetId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
						   
						    if(tableObj.rows[i].cells[1].children[0].id.split(":")[1] && tableObj.rows[i].cells[1].children[0].id.split(":")[1]!='-'){
						    	 configObj.rentAmount = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
						    }else{
						    	 configObj.rentAmount = '';
						    }
						    if( tableObj.rows[i].cells[2].children[0].id.split(":")[1] &&  tableObj.rows[i].cells[2].children[0].id.split(":")[1]!='-'){
						    	 configObj.serviceCharge =  tableObj.rows[i].cells[2].children[0].id.split(":")[1];
						    }else{
						    	 configObj.serviceCharge = '';
						    }
						}
						configArray.push(configObj);
					}
					self.baseData.deviceInfo = configArray;
					console.log(self.baseData);
					if(self.id){
						Service.updateContract(self.baseData,self.id,function(data){
						    	if(data.error != null){
	    	                	   if(data.error_code == "70042"){
	    							   dialog.render({lang:"contract_number_exists"});
	    							   return;
	    						   } 
	    	                	}else{
	    	                		self.fire("rendTableData");
	    					        self.adWindow.destroy();    		 	             	
	    						}
						});
					}else{
						Service.addContract(self.baseData,function(data){
							    if(data.error != null){
	    	                	   if(data.error_code == "70042"){
	    							   dialog.render({lang:"contract_number_exists"});
	    							   return;
	    						   } 
	    	                	}else{
	    	                		self.fire("rendTableData");
	    					        self.adWindow.destroy();    		 	             	
	    						}
							
						});
					}
				
				}else{
					dialog.render({lang:"please_add_contract_device"});
	       			return;
				}
			});
            $("#upload").click(function(){
            	var flag='';
            	if(self.baseData.style == 2){
            		flag = 2;
            	}else{
            		flag = 1;
            	}
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new AddDevice({
                    selector: "body",
                    flag:flag,
                    events: {
                    	deviceData:function(deviceData){
                    		 $("#editConfig").append("<tr id='"+deviceData.assetId+"'>"
               						+"<td class='channelTable'>"
               						+  "<label id='"+deviceData.assetId+":"+deviceData.assetId+"' >"+deviceData.assetId+"</label>"
               						+"</td>"
               						+"<td class='channelTable'>"
               						+  "<label id='"+deviceData.assetId+":"+deviceData.rentAmount+"'>"+deviceData.rentAmount+"</label>"
               						+"</td>"
               						+"<td class='channelTable'>"
               						+  "<label id='"+deviceData.assetId+":"+deviceData.serviceCharge+"'>"+deviceData.serviceCharge+"</label>"
               						+"</td>"
               						+"<td class='channelTable'><span id='delete:"+deviceData.assetId+"' name='"+deviceData.assetId+"' class='delcls' style='cursor: pointer;'>删除</span></td>"
               						+"</tr>");
                    		 $(".delcls").bind('click',function(e) {
                     			 $(this).parent().parent().remove();
                 			 });
                    	}
                    }
                });
            });
		}
		
		
	});
	return config;
});