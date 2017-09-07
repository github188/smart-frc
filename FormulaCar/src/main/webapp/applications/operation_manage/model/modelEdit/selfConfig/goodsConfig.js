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
			
			this.machineType = options.machineType;//货柜类型
			this.vender= options.vender;//厂家
			this.modelName= options.modelName;//型号
			this.number = options.number;
			
			this.ids = options.id;
			this.shelves = options.shelves;
	        this.keyConfig = options.keyConfig;
			this.itemNumberConfig = options.itemNumberConfig;
			this.existstag = options.existstag;
			this.render();
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.bindEvent();
			$('.selfTable').attr('title',locale.get({lang: "add_new_line"}));
			if(this.ids){
             	this.loadData();
            }
		},
		loadData:function(){
		
			if(this.shelves && this.shelves.length>0){
				$('#editSelf').html('');
				var flag = 1000000;
				for(var i=0;i<this.shelves.length;i++){
					$('#editSelf').append("<table id='"+flag+"_table' class='selfClass'><tr id='"+flag+"_tr'></tr></table>");
					for(var j=0;j<this.shelves[i].length;j++){
						$("#"+flag+"_tr").append("<td><div id='"+j+"_"+flag+"' class='selfTableOther' title='"+locale.get({lang: "edit_self_number"})+"'>"+this.shelves[i][j].shelvesId+"</div></td>");
				
						if(!this.existstag){
							  $('#'+j+'_'+flag).click(function () {
							        var tdObj = $(this);  
							        var oldText = $(this).text();  
							        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
							        inputObj.css("border-width", '1px');  
							        inputObj.click(function () {  
							            return false;  
							        });  
							        inputObj.width(tdObj.width());  
							        inputObj.height(tdObj.height());  
							        inputObj.css("line-height", '15px'); 
							        inputObj.css("margin", 0);  
							        inputObj.css("padding", 0);  
							        inputObj.css("text-align", "center");  
							        inputObj.css("color", "black");  
							        inputObj.css("font-size", "12px");  
							        inputObj.css("background-color",'white');  
							        inputObj.css("border",'1px solid #d3d3d3');  
							        tdObj.html(inputObj);  
							        inputObj.blur(function () {
							            var newText = $(this).val();  
							            tdObj.html(newText);          
							        });  
							          inputObj.trigger("focus").trigger("select");  
							    });  
						}	
		
					}
					if(!this.existstag){
						$("#"+flag+"_tr").append("<td><div class='selfTable_red' title='"+locale.get({lang: "delete_the_line"})+"'>×</div></td>");
						$("#"+flag+"_tr").append("<td><div class='selfTable_grey' title='"+locale.get({lang: "each_licensed_channel_numbe"})+"'>"+this.shelves[i].length+"</div></td>");
						
						$('.selfTable_red').click(function(){
							 var file = $(this).parent().parent()[0].attributes[0].value;
							 var fileId =file.split('_')[0]; 
		         			 $('#'+fileId+'_table').remove();
					   	});
					}
    			
		            	
					flag = flag+1;
				 }
		     }			
		},
		bindEvent:function(){
			var self = this;
			var flag = 1;
			var defaultVal=0;
		   	var language = locale._getStorageLang();
			$(".selfTable").click(function(){
				var column = $(this).text();
				$('#editSelf').append("<table id='"+flag+"_table' class='selfClass'><tr id='"+flag+"_tr'></tr></table>");
				for(var i=0;i<column;i++){
					defaultVal = defaultVal+1;
					if(self.machineType == '1'&&language!="en"){
						$("#"+flag+"_tr").append("<td><div id='"+i+"_"+flag+"' class='selfTableOther' title='"+locale.get({lang: "edit_self_number"})+"'>"+defaultVal+"</div></td>");
					}else{
						$("#"+flag+"_tr").append("<td><div id='"+i+"_"+flag+"' class='selfTableOther' title='"+locale.get({lang: "edit_self_number"})+"'></div></td>");
					}
					
					$('#'+i+'_'+flag).click(function () {
				        var tdObj = $(this);  
				        var oldText = $(this).text();  
				        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
				        inputObj.css("border-width", '1px');  
				        inputObj.click(function () {  
				            return false;  
				        });  
				        inputObj.width(tdObj.width());  
				        inputObj.height(tdObj.height());  
				        inputObj.css("line-height", '15px'); 
				        inputObj.css("margin", 0);  
				        inputObj.css("padding", 0);  
				        inputObj.css("text-align", "center");  
				        inputObj.css("color", "black");  
				        inputObj.css("font-size", "12px");  
				        inputObj.css("background-color",'white');  
				        inputObj.css("border",'1px solid #d3d3d3');  
				        tdObj.html(inputObj);  
				        inputObj.blur(function () {
				            var newText = $(this).val();  
				            tdObj.html(newText);          
				        });  
				          inputObj.trigger("focus").trigger("select");  
				    });  
				}
				$("#"+flag+"_tr").append("<td><div class='selfTable_red'  title='"+locale.get({lang: "delete_the_line"})+"'>×</div></td>");
				$("#"+flag+"_tr").append("<td><div class='selfTable_grey' title='"+locale.get({lang: "each_licensed_channel_numbe"})+"'>"+column+"</div></td>");
				
				$('.selfTable_red').click(function(){
					 var file = $(this).parent().parent()[0].attributes[0].value;
					 var fileId =file.split('_')[0]; 
         			 $('#'+fileId+'_table').remove();
				});
				flag = flag+1;
			});
			

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
            	var selfList= [];
            	var rowstr=[];
            	var repeatflag = false;
            	var tableLength = $('.selfClass').length;
            	if(tableLength > 0){
            	}else{
            		 dialog.render({lang: "please_add_at_least_one_licensed_Road"});
                     return;
            	}
            	$('.selfClass').each(function () {
            		var rowList=[];
            		//var rowstr=[];
            		var tableId = $(this)[0].attributes[0].value;
            		var tableObj = document.getElementById(tableId); 
            		for(var i=0;i<(tableObj.rows[0].cells.length - 2);i++){
            			var cell = tableObj.rows[0].cells[i].children[0].innerText;
            			var rowObj = {};
            			rowObj.shelvesId = cell;
            			if(rowstr.indexOf(cell)>-1||cell==""){
            				 repeatflag = true;
            			}
            			rowstr.push(cell);
            			rowList.push(rowObj);
            		}
            		selfList.push(rowList);
            	});

            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	console.log(finalData);
            	if(repeatflag){
            
				 dialog.render({lang: "tunnel_number_repeat",buttons: [{
        			 lang: "affirm",
        			 click:function(){
        				 dialog.close();
        	             if(self.ids){
        	            		Service.updateModel(eurl,self.ids,finalData,function(data) {
        	                		self.automatWindow.destroy();
        	                		self.fire("rendTableData");
        	                	});
        	            	}else{
        	            		Service.addModel(eurl,finalData,function(data) {
        	                		console.log(data);
        	                		self.automatWindow.destroy();
        	                		self.fire("rendTableData");
        	                	});
        	            	}
        			 }
        		 	},
        		 	{
   					 lang: "cancel",
                     click: function() {
                               dialog.close();
                           }
        		 	}],
        		 	height:170
				 	}
        		 );
            	}else{
            		if(self.ids){
            		Service.updateModel(eurl,self.ids,finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                		});
            		}else{
            		Service.addModel(eurl,finalData,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                		});
            		}
            	}	

            	
            	
			});
            //下一步
            $("#model_next_step").click(function(){
            	var selfList= [];
            	var rowstr=[];
            	var repeatflag = false;
            	var tableLength = $('.selfClass').length;
            	if(tableLength > 0){
            	}else{
            		 dialog.render({lang: "please_add_at_least_one_licensed_Road"});
                     return;
            	}
            	$('.selfClass').each(function () {
            		var rowList=[];
            	//	var rowstr=[];
            		var tableId = $(this)[0].attributes[0].value;
            		var tableObj = document.getElementById(tableId); 
            		if(self.existstag){
             			for(var i=0;i<(tableObj.rows[0].cells.length);i++){
                			var cell = tableObj.rows[0].cells[i].children[0].innerText;
                			var rowObj = {};
                			rowObj.shelvesId = cell;
                			if(rowstr.indexOf(cell)>-1||cell==""){
               				 repeatflag = true;
                			}
                				rowstr.push(cell);
    							rowList.push(rowObj);
    						
                		}
                		selfList.push(rowList);
            		}else{
            			for(var i=0;i<(tableObj.rows[0].cells.length - 2);i++){
                			var cell = tableObj.rows[0].cells[i].children[0].innerText;
                			var rowObj = {};
                			rowObj.shelvesId = cell;
                			if(rowstr.indexOf(cell)>-1||cell==""){
               				 repeatflag = true;
                			}
                				rowstr.push(cell);
    							rowList.push(rowObj);
    						
                		}
                		selfList.push(rowList);
            		}
            	
            	});
            	var finalData={
            			name:self.modelName,
            			vender:self.vender,
            			number:self.number,
            			machineType:self.machineType,
            			shelves:selfList
            	};
            	if(repeatflag){
           		 dialog.render({lang: "tunnel_number_repeat",buttons: [{
        			 lang: "affirm",
        			 click:function(){
        				 dialog.close();
                    	 self.KeyConfig = new KeyConfigInfo({
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
        			 }
        		 	},
        		 	{
   					 lang: "cancel",
                     click: function() {
                               dialog.close();
                           }
        		 	}],
        		 		height:170
           		 	});
            	}else{
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
            	}
        
			});
            
		}
		
	});
	return config;
});