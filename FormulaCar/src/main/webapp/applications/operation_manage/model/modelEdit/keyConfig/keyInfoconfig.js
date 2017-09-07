define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./keyConfig.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("../css/table.css");
	require("../css/style.css");
	var Service = require("../../../service");
	var ItemNumberInfo = require("../itemNumberConfig/itemNumber");
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
			this.ids = options.id;
			this.data = options.data;
			this.keyConfig = options.keyConfig;
			this.itemNumberConfig = options.itemNumberConfig;
			this.render();
	        this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.renderSelect();
			this.bindEvent();
			if(this.ids){
             	this.loadData();
            }
		},
		loadData:function(){
			if(this.keyConfig){
				var row = this.keyConfig.row;
				var column = this.keyConfig.column;
				var content = this.keyConfig.content;
				$("#row option[value='"+row+"']").attr("selected","selected");
				$("#column option[value='"+column+"']").attr("selected","selected");
				
				var sth="<table id='keyTable' border='1'>";
   			    for(var i=0;i<row;i++){
   			        sth+="<tr>";
   			        for(var j=0;j<column;j++){
   			        	sth+="<td  style='text-align: center;height: 55px;width:50px;'><div class='tdclass' style='width: 90%;background: #BFCCCC;height: 40px;border-radius: 5px;line-height: 40px;'>"+content[i][j]+"</div></td>";   
   			        }
   			        sth+="</tr>";   
   			    }
   			    $('#editKeyTable').html(sth+"</table>");
			}
		},
		bindEvent:function(){
			var self = this;

			//上一步
			$("#key_last_step").click(function(){
				$("#selfConfig").css("display", "block");//货道信息
                $("#baseInfo").css("display", "none");//基本信息
                $("#keyConfig").css("display", "none");//键盘信息
                $("#tab1").removeClass("active");
                $("#tab3").removeClass("active");
                $("#tab2").addClass("active");
			});
			//完成
            $("#key_submit").click(function(){
            	var tableObj = document.getElementById("keyTable");
            	if(tableObj){
            		var contentList=[];
                	if(tableObj.rows.length>0){
                		for(var i=0;i<tableObj.rows.length;i++){
                    		var rowList=[];
                    		for(var j=0;j<tableObj.rows[i].cells.length;j++){
                    			var cell = tableObj.rows[i].cells[j].children[0].innerText;
                    			rowList.push(cell);
                    		}
                    		contentList.push(rowList);
                    	}
                		var keyConfig={
                    			row:tableObj.rows.length,
                    			column:tableObj.rows[0].cells.length,
                    			content:contentList
                    	};
                		self.data.keyConfig =keyConfig;
                	}
            	}else{
            		self.data.keyConfig =undefined;
            	}
            	
        		console.log(self.data);
        		if(self.ids){
            		Service.updateModel(eurl,self.ids,self.data,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                	});
            	}else{
            		Service.addModel(eurl,self.data,function(data) {
                		console.log(data);
                		self.automatWindow.destroy();
                		self.fire("rendTableData");
                	});
            	}
        		
        		
			});
            $('#key_next_step').click(function() {
             	var tableObj = document.getElementById("keyTable");
            	if(tableObj){
            		var contentList=[];
                	if(tableObj.rows.length>0){
                		for(var i=0;i<tableObj.rows.length;i++){
                    		var rowList=[];
                    		for(var j=0;j<tableObj.rows[i].cells.length;j++){
                    			var cell = tableObj.rows[i].cells[j].children[0].innerText;
                    			rowList.push(cell);
                    		}
                    		contentList.push(rowList);
                    	}
                		var keyConfig={
                    			row:tableObj.rows.length,
                    			column:tableObj.rows[0].cells.length,
                    			content:contentList
                    	};
                		self.data.keyConfig =keyConfig;
                	}
            	}else{
            		self.data.keyConfig =undefined;
            	}
            	
             	 this.ItemNumber = new ItemNumberInfo({
	                 selector: "#itemNumberConfig",
	                 automatWindow: self.automatWindow,
	                 id:self.ids,
	                 data:self.data,
	                 itemNumberConfig:self.itemNumberConfig,
	                 events: {
	                      "rendTableData": function() {
	                           self.fire("rendTableData");
	                       }
	                  }
	             });
           	 $("#selfConfig").css("display", "none");//货道信息
           	 $("#baseInfo").css("display", "none");//基本信息
           	 $("#keyConfig").css("display", "none");//键盘信息
           	 $("#itemNumberConfig").css("display", "block");//键盘信息
           	 $("#tab2").removeClass("active");
           	 $("#tab1").removeClass("active");
           	 $("#tab3").removeClass("active");
           	 $("#tab4").addClass("active");
			});
            $('#column').change(function(){ 
            	 var row_val = $('#row option:selected') .val();
            	 var column_val = $('#column option:selected') .val();
            	 if(row_val){
            		 if(column_val){
            			 var sth="<table id='keyTable' border='1'>";
            			 for(var i=0;i<row_val;i++){
            			        sth+="<tr>";
            			        for(var j=1;j<=column_val;j++){
            			        	sth+="<td  style='text-align: center;height: 55px;width:50px;'><div class='tdclass' style='width: 90%;background: #BFCCCC;height: 40px;border-radius: 5px;line-height: 40px;'>"+((i*column_val)+j)+"</div></td>";   
            			        }
            			        sth+="</tr>";   
            			    }
            			    $('#editKeyTable').html(sth+"</table>");
                	 }else{
                		 dialog.render({lang: "please_select_column"});
                         return;
                	 }
            	 }else{
            		 dialog.render({lang: "please_select_row"});
                     return;
            	 }
            	 
            	 $('.tdclass').click(function () {
				        var tdObj = $(this);  
				        var oldText = $(this).text();  
				        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
				        inputObj.css("border-width", '1px');  
				        inputObj.click(function () {  
				            return false;  
				        });  
				        inputObj.width(tdObj.width());  
				        inputObj.height(tdObj.height());  
				        inputObj.css("line-height", '40px'); 
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
            });
            $('#row').change(function(){ 
	           	 var row_val = $('#row option:selected') .val();
	           	 var column_val = $('#column option:selected') .val();
		         if(row_val){
		       		 if(column_val){
		       			 var sth="<table border='1' >";
		       			 for(var i=0;i<row_val;i++){
		       			        sth+="<tr>";
		       			        for(var j=1;j<=column_val;j++){
		       			        	sth+="<td class='tdclass' style='text-align: center;height: 55px;width:50px;'><div style='width: 90%;background: #BFCCCC;height: 40px;border-radius: 5px;line-height: 40px;'>"+((i*column_val)+j)+"</div></td>";   
		       			        }
		       			        sth+="</tr>";   
		       			    }
		       			    $('#editKeyTable').html(sth+"</table>");
		           	 }else{
		           		    dialog.render({lang: "please_select_column"});
		                    return;
		           	 }
		       	 }else{
		       		    dialog.render({lang: "please_select_row"});
		                return;
		       	 }
		         
		         $('.tdclass').click(function () {
				        var tdObj = $(this);  
				        var oldText = $(this).text();  
				        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
				        inputObj.css("border-width", '1px');  
				        inputObj.click(function () {  
				            return false;  
				        });  
				        inputObj.width(tdObj.width());  
				        inputObj.height(tdObj.height()); 
				        inputObj.css("line-height", '40px'); 
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
		         
           });
            
		},
		renderSelect:function(){
			$("#row").html("");
			$("#row").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			$("#row").append("<option value='1'>1</option>");
			$("#row").append("<option value='2'>2</option>");
			$("#row").append("<option value='3'>3</option>");
			$("#row").append("<option value='4'>4</option>");
			$("#row").append("<option value='5'>5</option>");
			$("#row").append("<option value='6'>6</option>");
			$("#row").append("<option value='7'>7</option>");
			$("#row").append("<option value='8'>8</option>");
			$("#row").append("<option value='9'>9</option>");
			
			$("#column").html("");
			$("#column").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			$("#column").append("<option value='1'>1</option>");
			$("#column").append("<option value='2'>2</option>");
			$("#column").append("<option value='3'>3</option>");
			$("#column").append("<option value='4'>4</option>");
			$("#column").append("<option value='5'>5</option>");
			$("#column").append("<option value='6'>6</option>");
			$("#column").append("<option value='7'>7</option>");
			$("#column").append("<option value='8'>8</option>");
			$("#column").append("<option value='9'>9</option>");
		}
		
	});
	return config;
});