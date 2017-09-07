define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./itemNumber.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	require("cloud/lib/plugin/jquery.uploadify");
	require("cloud/lib/plugin/jquery.form");
	require("../css/table.css");
	require("../css/style.css");
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
			this.ids = options.id;
			this.data = options.data;
			this.itemNumberConfig = options.itemNumberConfig;
			this.render();
			this.automatWindow = options.automatWindow;
		},
		render:function(){
			this.bindEvent();
			//if(this.ids){
             	this.loadData();
          //  }
		},
		loadData:function(){
			if(this.data.shelves && this.data.shelves.length>0){
				$('#editSelf2').html('');
				var flag = 3000000;
				for(var i=0;i<this.data.shelves.length;i++){
					$('#editSelf2').append("<table id='"+flag+"_table' class='editelfClass'><tr id='"+flag+"_tr'></tr></table>");
					for(var j=0;j<this.data.shelves[i].length;j++){
						$("#"+flag+"_tr").append("<td><div id='"+j+"_"+flag+"' class='selfTableOther'>"+this.data.shelves[i][j].shelvesId+"</div></td>");
					}
					flag = flag+1;
				}
			}
		
		},
		bindEvent:function(){
			var self = this;
			var flag = 200000;
			var num = 0;
		/*	$(".iteminput").blur(function () {
	            var newText = $(this).val();  
	            $("#editItemNumber").html('');
	            var flag = 200000;
	            if(newText){*/
	            	for(var i=0;i<self.data.shelves.length;i++){
	            		$("#editItemNumber").append("<table id='"+flag+"_table' class='itemselfClass'><tr id='"+flag+"_tr'></tr></table>");
	            		for(var j=0;j<self.data.shelves[i].length;j++){
	            			$("#"+flag+"_tr").append("<td><div id='"+j+"_"+flag+"' class='selfTableOther'></div></td>");
	            			num++
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
						        inputObj.trigger("focus").trigger("select");  
						        if(  tdObj.eq(0).attr('id') == "0_200000")  {
						        	 inputObj.blur(function () {
								            var newText = $(this).val(); 
								            var flag = 200000;
								            if(!isNaN(newText)){
								            	   for(var i=0;i<self.data.shelves.length;i++){
										            	for(var j=0;j<self.data.shelves[i].length;j++){
										            		 $('#'+j+'_'+flag).html(newText);
										            		newText++;
										            	}
										            	flag++;
										            }
								            }else{
										            tdObj.html(newText);  
								            }
								         
								                     
								        }); 
						        }else {
						            inputObj.blur(function () {
							            var newText = $(this).val();  
							            tdObj.html(newText);          
							        });  
								}
						          
						    }); 
	            		}
	            		flag = flag+1;
	            	}
	            	if(this.ids){
	    				if(self.itemNumberConfig&&self.itemNumberConfig.length>0){
	    					   var flag = 200000;
	    					   var itemList= [];
	    					   for(var i=0;i<self.itemNumberConfig.length;i++){
	    						   itemList.push(self.itemNumberConfig[i][1]);
	    						   
	    					   }
	    					   var n =0;
	    					for(var i=0;i<self.data.shelves.length;i++){
				            	for(var j=0;j<self.data.shelves[i].length;j++){
				            		 $('#'+j+'_'+flag).html(itemList[n]);
				            		n++;
				            	}
				            	flag++;
				            }
	    				}
	    			}
	          //  }
	       // });  
			//上一步
			$("#item_last_step").click(function(){
				$("#selfConfig").css("display", "none");//货道信息
                $("#baseInfo").css("display", "none");//基本信息
                $("#keyConfig").css("display", "block");//键盘信息
                $("#itemNumberConfig").css("display", "none");//itemnumber对应信息
                $("#tab1").removeClass("active");
                $("#tab3").addClass("active");
                $("#tab2").removeClass("active");
                $("#tab4").removeClass("active");
			});
			//完成
            $("#item_submit").click(function(){
            	
            	var selfList= [];
            	var rowstr=[];
            	var rowselfList = [];
            	var itemNumberConfig = [];
            	var repeatflag = false;
            	var num = false;
            	$(".itemselfClass").each(function() {
            		var rowList=[];
            		//var rowstr=[];
            		var tableId = $(this)[0].attributes[0].value;
            		var tableObj = document.getElementById(tableId); 
            		for(var i=0;i<(tableObj.rows[0].cells.length);i++){
            			var cell = tableObj.rows[0].cells[i].children[0].innerText;
            			if(rowstr.indexOf(cell)>-1||cell==""){
            				 repeatflag = true;
            			}
            			if(isNaN(cell)){
            				num = true;          			
            			}
            				rowstr.push(cell);
                			rowList.push(cell);
            			if(cell!=""){
            				rowselfList.push(cell);
            			}
            		}
            		
            	 		selfList.push(rowList);
            		
				});
            	if(rowselfList.length==0){
            		self.data.itemNumberConfig = undefined; 
            	}else if (rowselfList.length<num||(rowselfList.length==num&&repeatflag)) {
            		 dialog.render({lang: "tunnel_number_repeat"});
            		 return false;
				}else if(num){
					 dialog.render({lang: "must_is_mumber"});
    				 return false;
				}else{
            	 	for(var i=0;i<self.data.shelves.length;i++){
                		for(var j=0;j<self.data.shelves[i].length;j++){
                			var item=[];
                			item.push(self.data.shelves[i][j].shelvesId);
                			item.push(selfList[i][j]);
                			itemNumberConfig.push(item);
                		
                		}
                		
                	}
                	//console.log(itemNumberConfig);
                	self.data.itemNumberConfig=itemNumberConfig;
            	}
           
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
		}
		
	});
	return config;
	
});