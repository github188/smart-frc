define(function(require){
	var cloud = require("cloud/base/cloud");
	var _Window = require("cloud/components/window");
	var winHtml = require("text!./productManage.html");
	var winHtml_en = require("text!./productManage_en.html");
	var Table = require("cloud/components/table");
	var Button = require("cloud/components/button");
	var Uploader = require("cloud/components/uploader");
	var productType = require("../../../product_type/list/list");
	require("cloud/lib/plugin/jquery.uploadify");
	var Service = require("../../../service");
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var eurl;
    if(oid == '0000000000000000000abcde'){
    	eurl = "gapi";
    }else{
    	eurl = "api";
    }
	var Window = Class.create(cloud.Component,{
		initialize:function($super,options){
			$super(options);
			this.goodId = options.goodId;
			this._renderWindow();
			locale.render({element:this.element});
		},
		_renderWindow:function(){
			var bo = $("body");
			var self = this;
			var html_="";
			var language = locale._getStorageLang();
	        if(language =='en'){
	        	html_=winHtml_en;
	        }else{
	        	html_=winHtml;
	        }
			this.window = new _Window({
				container: "body",
				title: locale.get({lang:"product_manage"}),
				top: "center",
				left: "center",
				height:600,
				width: 900,
				mask: true,
				drag:true,
				content: html_,
				events: {
					"onClose": function() {
							this.window.destroy();
							cloud.util.unmask();
					},
					scope: this
				}
			});
			
			$("#nextBase").val(locale.get({lang: "next_step"}));
			$("#saveBase2").val(locale.get({lang: "save"}));
			$("#save1").val(locale.get({lang: "save"}));
			$("#laststep").val(locale.get({lang: "price_step"}));
			$("#remark1").text(locale.get({lang: "remark"})+"1");
			$("#remark2").text(locale.get({lang: "remark"})+"2");
			$("#remark3").text(locale.get({lang: "remark"})+"3");
			$("#imageLimit").text(locale.get({lang: "imageLimit"}));
			$("#product_netContent").text(locale.get({lang: "product_netContent"}));
			$("#product_status").text(locale.get({lang: "replenishments"}));
			$("#everyRong").attr("placeholder",locale.get({lang: "tip_fomat"}));
			$("#add").val(locale.get({lang: "add_a_line"}));
			
			$("#goods_state").css("display","none");
			
			$("#goodState").append("<option value='0'>" +locale.get({lang: "the_goods_shelves"})+"</option>");
    		$("#goodState").append("<option value='1'>"+locale.get({lang: "off_the_shelf"})+"</option>");
    		
    		
			
			this.window.show();	
			
			this._renderPackingForm();
			this._renderGetGoodsType();	
			this._renderBtn();
			this._renderNutritionalTable();
			
			if(this.goodId){
				this.getDataByGoodsId();
			}
		},
		_renderNutritionalTable:function(){
			var self = this;
			$('#nutritionalTable').append("<table id='nutriTable' style='border: 1px solid #e7e7eb;'>"+
				   "<tr class='trClass'>"+
				    "<td  class='TDClass'>"+
				       "<div class='tdclass' style='color:blue;width:130px;'>项目</div>"+
				     "</td>"+
				     "<td class='TDClass'>"+
				       "<div class='tdclass' style='color:blue;width:130px;'>每100ml</div>"+
				     "</td>"+
				     "<td class='TDClass'>"+
				       "<div class='tdclass' style='color:blue;width:130px;'>NRV%</div>"+
				     "</td>"+
				     "<td class='TDClass'>"+
				       "<div>操作</div>"+
				     "</td>"+
				   "</tr>"+
				"</table>"
			);
			
			self.tdEdit();
		},
		tdEdit:function(){
			$('.tdclass').click(function () {
		        var tdObj = $(this);  
		        var oldText = $(this).context.innerText; 
		        if(oldText){
		        }else{
		        	oldText="请输入";
		        }
		        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
		        inputObj.css("border-width", '1px');  
		        inputObj.click(function () {  
		            return false;  
		        });  
		        inputObj.width(tdObj.width());  
		        inputObj.height("30");  
		        inputObj.css("line-height", '30px'); 
		        inputObj.css("margin", 0);  
		        inputObj.css("padding", 0);  
		        inputObj.css("text-align", "center");  
		        inputObj.css("color", "black");  
		        inputObj.css("font-size", "12px");  
		        inputObj.css("background-color",'white');  
		        //inputObj.css("border",'1px solid #d3d3d3');  
		        tdObj.html(inputObj);  
		        inputObj.blur(function () {
		            var newText = $(this).val();  
		            tdObj.html(newText);          
		        });  
		        inputObj.trigger("focus").trigger("select");  
		 });  
		},
		getDataByGoodsId:function(){
			cloud.util.mask("#baseInfo");
			Service.getGoodsById(eurl,this.goodId,function(data){
				 $("#number").val(data.result.number==null?"":data.result.number);
	     		 $("#fullName").val(data.result.fullName==null?"":data.result.fullName);
	     		 $("#name").val(data.result.name==null?"":data.result.name);
	  		     $("#manufacturer").val(data.result.manufacturer==null?"":data.result.manufacturer);
	  		     $("#types option[value='"+data.result.type+"']").attr("selected","selected");
	  		     
	  		     /*if(data.result.state || data.result.state == 0){
	  		    	 $("#goodState option[value='"+data.result.state+"']").attr("selected","selected");
	  		     }else{
	  		    	 $("#goodState option[value='0']").attr("selected","selected");
	  		     }*/
	  		    
	  		     
	  		     $("#packingForm option[value='"+data.result.packingForm+"']").attr("selected","selected");
	  		     $("#price").val(data.result.price==null?"":data.result.price);	
	  		     
	  		     if(data.result.subTypeName != null){
	  		    	 $("#subTypeName").val(data.result.subTypeName);
	  		    	 $("#subtype").show();
	  		     }
	  		     if(data.result.extendParameters != null && data.result.extendParameters.tempmode != null){
	  		    	$("input[name='tempmode'][value="+data.result.extendParameters.tempmode+"]").attr("checked",true); 
	  		     }
	  		     if(data.result.extendParameters != null && data.result.extendParameters.sugar != null){
	  		    	$("input[name='sugar'][value="+data.result.extendParameters.sugar+"]").attr("checked",true); 
	  		     }
	  		     if(data.result.extendParameters != null && data.result.extendParameters.milk != null){
	  		    	$("input[name='milk'][value="+data.result.extendParameters.milk+"]").attr("checked",true); 
	  		     }
	  		     if(data.result.extendParameters != null && data.result.extendParameters.measurement != null){
  		    	    $("input[name='measurement'][value="+data.result.extendParameters.measurement+"]").attr("checked",true); 
  		         }
	  		     $("#descript1").val(data.result.descript1==null?"":data.result.descript1.content);
	  		     $("#descript2").val(data.result.descript2==null?"":data.result.descript2.content);
	  		     //描述3
	  		     $("#imagepath3").val(data.result.descript3==null?"":data.result.descript3.imagepath);
	  		     $("#imageMd53").val(data.result.descript3==null?"":data.result.descript3.imageMd5);
	  		     $("#picture3").text(data.result.descript3==null?"":data.result.descript3.imagename);
	  		     
	  		     $("#netContent").val(data.result.netContent==null?"":data.result.netContent);
	  		     $("#imageMd5").val(data.result.imagemd5==null?"":data.result.imagemd5);
	  		     $("#everyRong").val(data.result.everyRong==null?"":data.result.everyRong);
	  		
	  		     if(data.result.imagepath){
	  		    	var src= cloud.config.FILE_SERVER_URL + "/"+eurl+"/file/" +data.result.imagepath+ "?access_token=" + cloud.Ajax.getAccessToken();
	  	            $("#photoFileId").attr("src", src);
	  	            $("#imagepath").val(data.result.imagepath);
	  		     }
	  		     
	  		   var picture3_name = $("#picture3").text();
	           if(picture3_name){
	        	   $("#picture3").after("");
	          	   $("#picture3").after("<label id='delete_picture3' style='color:red;cursor: pointer;font-size: 20px;' title='删除'> × </label>");
	   			   $("#delete_picture3").bind("click",function(){
	   			  	  var url= cloud.config.FILE_SERVER_URL + "/"+eurl+"/file/";
	   				  var id=$("#imagepath3").val();
	   				  if(id){
	   					Service.deleteImageById(url,id,function(data) {
		   					 $("#imagepath3").val("");
		                     $("#imageMd53").val("");
		                     
		                     $("#picture3").text("");
			   				 $("#delete_picture3").remove();
		   				});
	   				   }
	   		    });
	           }
	            var language = locale._getStorageLang();
		        if(language =='en'){
		        	 $("#nutritional").val(data.result.nutritional==null?"":data.result.nutritional);
		        }else{
			           if(data.result.nutritional && data.result.nutritional.indexOf(";") > -1){
			        	   var array = data.result.nutritional.split(";");
			        	   if(array.length>0){
			        		   $("#nutriTable").html("");
			        		   for(var i=0;i<array.length-1;i++){
			        			   var tds = array[i].split(",");
			        			   var op="<div style='cursor: pointer;' class='delcls'>删除</div>";
			        			   if(i == 0){
			        				   op="<div>操作</div>";
			        			   }
			        			 
			        			   $("#nutriTable").append(
			        						 "<tr class='trClass' id="+i+">"+
			        							"<td  class='TDClass'>"+
			        							   "<div class='"+i+"_tdclass'  style='color:blue;width:130px;'>"+tds[0]+"</div>"+
			        						    "</td>"+
			        							"<td  class='TDClass'>"+
			        							       "<div class='"+i+"_tdclass' style='color:blue;width:130px;'>"+tds[1]+"</div>"+
			        							"</td>"+
			        						    "<td  class='TDClass'>"+
			        							       "<div class='"+i+"_tdclass'  style='color:blue;width:130px;'>"+tds[2]+"</div>"+
			        							"</td>"+
			        							"<td  class='TDClass'>"+
			        						       op+
			        						    "</td>"+
			        						 "</tr>"
			        				  );
			        			   $(".delcls").bind('click',{id:i},function(e){
			               			 var file = $(this).parent().parent('#'+e.data.id);
			               			 file.remove();
			       			       });
			        			   $('.'+i+'_tdclass').bind('click',function(){
			   				        var tdObj = $(this);
			   				        var oldText = $(this).context.innerText;  
			   				        if(oldText){
			   				        }else{
			   				        	oldText="请输入";
			   				        }
			   				        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
			   				        inputObj.css("border-width", '1px');  
			   				        inputObj.click(function () {  
			   				            return false;  
			   				        });  
			   				        inputObj.width(tdObj.width());  
			   				        inputObj.height("30");  
			   				        inputObj.css("line-height", '30px'); 
			   				        inputObj.css("margin", 0);  
			   				        inputObj.css("padding", 0);  
			   				        inputObj.css("text-align", "center");  
			   				        inputObj.css("color", "black");  
			   				        inputObj.css("font-size", "12px");  
			   				        inputObj.css("background-color",'white');  
			   				        //inputObj.css("border",'1px solid #d3d3d3');  
			   				        tdObj.html(inputObj);  
			   				        inputObj.blur(function () {
			   				            var newText = $(this).val();  
			   				            tdObj.html(newText);   
			   				        });  
			   				        inputObj.trigger("focus").trigger("select"); 
			   				    });  
			        		   }
			        	   }
			           }
		        }
	         
	           cloud.util.unmask("#baseInfo");
			});
		},
		_renderBtn:function(){
			var self = this;
			var i=1000000;
			$("#add").click(function () {
				var tableObj =document.getElementById("nutriTable");
	     	    if(tableObj.rows.length >6 ){
	     	    	dialog.render({lang:"items_can_not_exceed_6"});
	     	    	return;
	     	    }
				$("#nutriTable").append(
					 "<tr class='trClass' id="+i+">"+
						"<td  class='TDClass'>"+
						   "<div class='"+i+"_tdclass'  style='color:blue;width:130px;'>能量</div>"+
					    "</td>"+
						"<td  class='TDClass'>"+
						       "<div class='"+i+"_tdclass' style='color:blue;width:130px;'>10g</div>"+
						"</td>"+
					    "<td  class='TDClass'>"+
						       "<div class='"+i+"_tdclass'  style='color:blue;width:130px;'>2%</div>"+
						"</td>"+
						"<td  class='TDClass'>"+
					       "<div style='cursor: pointer;' class='delcls'>删除</div>"+
					    "</td>"+
					 "</tr>"
			    );
				 $(".delcls").bind('click',{id:i},function(e){
         			 var file = $(this).parent().parent('#'+e.data.id);
         			 file.remove();
 			     });
				 $('.'+i+'_tdclass').bind('click',function(){
				        var tdObj = $(this);
				        var oldText = $(this).context.innerText;  
				        if(oldText){
				        }else{
				        	oldText="请输入";
				        }
				        var inputObj = $("<input type='text' value='" + oldText + "'/>");  
				        inputObj.css("border-width", '1px');  
				        inputObj.click(function () {  
				            return false;  
				        });  
				        inputObj.width(tdObj.width());  
				        inputObj.height("30"); 
				        inputObj.css("line-height", '30px'); 
				        inputObj.css("margin", 0);  
				        inputObj.css("padding", 0);  
				        inputObj.css("text-align", "center");  
				        inputObj.css("color", "black");  
				        inputObj.css("font-size", "12px");  
				        inputObj.css("background-color",'white');  
				        //inputObj.css("border",'1px solid #d3d3d3');  
				        tdObj.html(inputObj);  
				        inputObj.blur(function () {
				            var newText = $(this).val();  
				            tdObj.html(newText);          
				        });  
				        inputObj.trigger("focus").trigger("select"); 
				 });  
				i = i +1;
			});
			
		    self.uploadButton=new Button({
	                container:$("#select_file_button"),
	                text:locale.get("upload_files"),
	                lang : "{title:select_file,text:select_file}"
	        });
		    self.uploadButton3=new Button({
                container:$("#select_file_button3"),
                text:locale.get("upload_files"),
                lang : "{title:select_file,text:select_file}"
             });
		    
		    
		    self.initUploader();
		    
		    self.typeBtn = new Button({
                text: locale.get({lang: "edit"}),
                container: $("#select_type_button"),
                events: {
                    click: function() {                    
                    	if (self.productType_listPage) {
                    		self.productType_listPage.destroy();
                        }
                        this.productType_listPage = new productType({
                            selector: "body",
                            events: {
                                "getGoodsTypeList": function() { 
                                	self._renderGetGoodsType();
                                }
                            }
                        });     
                    }
                }
            }); 
		    $("#nextBase").bind("click",function(){
		    	 var result = self._renderPagecheck();
		    	 if(result){
		    		 $("#tab1").removeClass("active");
				     $("#tab2").addClass("active");
			         $("#otherConfig").css("display", "block");
		             $("#baseInfo").css("display", "none");
		    	}
		    	 if (self.uploader3) {
		    		 self.uploader3.destroy();
		         }
		    	 self.uploader3 = new Uploader({
		                browseElement: $("#select_file_button3"),
		                url: "/"+eurl+"/file",
		                autoUpload: true,
		                filters: [{
		                    title: "Image files",
		                    extensions: "jpg,gif,png"
		                }],
		                maxFileSize: "1mb",
		                events: {
		                	"onError": function(err){
								cloud.util.unmask("#winContent");
							},
							"onFilesAdded" : function(file){
								var name=file[0].name;
								$("#picture3").text(name);
								$("#picture3").after("");
								$("#picture3").after("<label id='delete_picture3' style='color:red;cursor: pointer;font-size: 20px;' title='删除'> × </label>");
								$("#delete_picture3").bind("click",function(){
									
									var url= cloud.config.FILE_SERVER_URL + "/"+eurl+"/file/";
					   				var id=$("#imagepath3").val();
					   				if(id){
					   					Service.deleteImageById(url,id,function(data) {
						   					$("#picture3").text("");
						   					$("#delete_picture3").remove();
						   					$("#imagepath3").val("");
						                    $("#imageMd53").val("");
						   				});
					   				}
							    });
							},
		                    "onFileUploaded": function(response, file){
		                    	if ($.isPlainObject(response)){
		                    		if(response.error){
		                    			dialog.render({lang:"upload_files_failed"});
									}else{
										//dialog.render({lang:"uploadcomplete"});
										var src= cloud.config.FILE_SERVER_URL + "/"+eurl+"/file/" +response.result._id+ "?access_token=" + cloud.Ajax.getAccessToken();
										
				                        $("#imagepath3").val(response.result._id);
				                        $("#imageMd53").val(response.result.md5);
									}
		                    	}
		                    	
		                    	cloud.util.unmask("#winContent");
		                    },
		                    "beforeFileUpload":function(){
								cloud.util.mask(
				                	"#winContent",
				                	locale.get("uploading_files")
				                );
							}
		                }
		            }); 
		    });
		    $("#laststep").bind("click",function(){
		    	$("#tab2").removeClass("active");
		    	$("#tab1").addClass("active");
		    	$("#baseInfo").css("display", "block");
		        $("#otherConfig").css("display", "none");
		    });
		    //取消
		    $("#product-config-cancel").bind("click",function(){
		    	self.window.destroy();
		    });
		    $("#save1").bind("click",function(){
		    	 var result = self._renderPagecheck();
		    	 if(result){
		    	   var number=$("#number").val();//商品编码
	        	   var name=$("#name").val();//商品简称
	        	   var fullName = $("#fullName").val();//商品全称
	     		   var type=$("#types").val();//分类
	     		   var typeName = $("#types").find("option:selected").text();
	     		   var subTypeName = $("#subTypeName").val();
	     		   var packingForm=$("#packingForm").val();//包装形式
	     		   var price=$("#price").val();		//零售价
	     		   var netContent= $("#netContent").val();//净含量
	     		   var imagepath=$("#imagepath").val();	
	     		   var imageMd5= $("#imageMd5").val();
	     		   
	     		   //var goodState = $("#goodState").find("option:selected").val();
	     		   
	     		   var goodsData={
	 	             		number:number,
	 	             		name:name,
	 	             		fullName:fullName,
	 	             		type:type,
	 	             		typeName:typeName,
	 	             		packingForm:packingForm,
	 	             		price:price,
	 	             		netContent:netContent,
	 	             		imagepath:imagepath,
	 	             		imagemd5:imageMd5
	 	             		//state:goodState
	 	           };
	     		  if($("#subTypeName").css("display") != "none"){
	     			 goodsData.subTypeName = subTypeName;
	     			}
	     		   if(self.goodId){
	     			  Service.updateGoods(eurl,self.goodId,goodsData,function(data){
	                	  if(data.error!=null){
		                	   if(data.error_code == "70010"){
								   dialog.render({lang:"goods_number_exists"});
								   return;
							   }
		                	}else{
								self.window.destroy();
			 	             	self.fire("getGoodsList");
							}
				      });
	     		   }else{
	     			  Service.addGoods(eurl,goodsData,function(data){
		                	if(data.error!=null){
		                	   if(data.error_code == "70010"){
								   dialog.render({lang:"goods_number_exists"});
								   return;
							   }
		                	}else{
								self.window.destroy();
			 	             	self.fire("getGoodsList");
							}
		             	  
					   });
	     		   }
		       }
		    });
            //保存
 		    $("#saveBase2").bind("click",function(){
		           var number=$("#number").val();//商品编码
	        	   var name=$("#name").val();//商品简称
	        	   var fullName = $("#fullName").val();//商品全称
	     		   var manufacturer=$("#manufacturer").val();
	     		   var type=$("#types").val();
	     		   var typeName = $("#types").find("option:selected").text();
	     		   var packingForm=$("#packingForm").val();
	     		   var price=$("#price").val();		
	     		   
	     		   var descript1 = {};
	     		   descript1.content = $("#descript1").val();
	     		   var descript2 = {};
	     		   descript2.content = $("#descript2").val();
	     		   
	     		   
	     		   var netContent= $("#netContent").val();
	     		   var everyRong= $("#everyRong").val();
	     		   
	     		   var imagepath=$("#imagepath").val();	
	     		   var imageMd5= $("#imageMd5").val();
	     		   
	     		   var imagepath3=$("#imagepath3").val();
	     		   var imageMd53= $("#imageMd53").val();
	     		   var imagename = $("#picture3").text();
	     		   //var goodState = $("#goodState").find("option:selected").val();
	     		   
	     		   
	     		   var descript3 = {};//描述3
	     		   descript3.imagepath = imagepath3;
	     		   descript3.imageMd5 = imageMd53;
	     		   descript3.imagename = imagename;
	     		  
	     		   var nutritionalStr = "";
	     		  
	     		   var language = locale._getStorageLang();
			        if(language =='en'){
			        	nutritionalStr = $("#nutritional").val();
			        }else{
			        	var tableObj =document.getElementById("nutriTable");
			     		  
			     	    if(tableObj && tableObj.rows.length >0 ){
			     	    	if(tableObj.rows.length == 1){
			     	    		nutritionalStr = "";
			     	    	}else{
			     	    		for(var i=0;i<tableObj.rows.length;i++){
							    	for(var j=0;j<tableObj.rows[i].cells.length-1;j++){
		                    			var cell = tableObj.rows[i].cells[j].children[0].innerText;
									    if(j == 2){
										    nutritionalStr += cell+";";
										}else{
										    nutritionalStr += cell+",";
										}
							    	}
								}
			     	    	}
							    
			     		}
			     		
			        }
	     		   
	     		   var nutritional = nutritionalStr;
	     		   var goodsData={
	 	             		number:number,
	 	             		name:name,
	 	             		fullName:fullName,
	 	             		manufacturer:manufacturer,
	 	             		type:type,
	 	             		typeName:typeName,
	 	             		packingForm:packingForm,
	 	             		price:price,
	 	             		nutritional:nutritional,
	 	             		descript1:descript1,
	 	             		descript2:descript2,
	 	             		
	 	             		descript3:descript3,
	 	             		
	 	             		netContent:netContent,
	 	             		imagepath:imagepath,
	 	             		imagemd5:imageMd5,
	 	             		everyRong:everyRong
	 	             		//state:goodState
	 	           };
	     		  if(self.goodId){
		     			  Service.updateGoods(eurl,self.goodId,goodsData,function(data){
		                	  if(data.error!=null){
			                	   if(data.error_code == "70010"){
									   dialog.render({lang:"goods_number_exists"});
									   return;
								   }
			                	}else{
									self.window.destroy();
				 	             	self.fire("getGoodsList");
								}
					      });
		     		   }else{
		     			  Service.addGoods(eurl,goodsData,function(data){
			                	if(data.error!=null){
			                	   if(data.error_code == "70010"){
									   dialog.render({lang:"goods_number_exists"});
									   return;
								   }
			                	}else{
									self.window.destroy();
				 	             	self.fire("getGoodsList");
								}
			             	  
						   });
		     	  }
	        });
 		    
		},
		_renderPackingForm:function(){
			$("#packingForm").append("<option value='0'>" +locale.get({lang: "bottled"})+"</option>");
    		$("#packingForm").append("<option value='1'>"+locale.get({lang: "canning"})+"</option>");
    		$("#packingForm").append("<option value='2'>"+locale.get({lang: "in_bags"})+"</option>");
    		$("#packingForm").append("<option value='3'>"+locale.get({lang: "in_box"})+"</option>");
    		$("#packingForm").append("<option value='4'>"+locale.get({lang: "in_glass"})+"</option>");
		},
		_renderGetGoodsType:function(){
			Service.getGoodsTypeInfo(eurl,function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#types").append("<option value='" +data.result[i]._id + "'>" +data.result[i].name+"</option>");
					}
				}
			});
		},
        _renderPagecheck:function(){
        	
			 var number=$("#number").val();
       	     var name=$("#name").val();
       	     var fullName = $("#fullName").val();
    		 var type=$("#types").val();
    		 var typeName = $("#types").find("option:selected").text();
    		 var packingForm=$("#packingForm").val();
    		 var price=$("#price").val();		
    		 var netContent= $("#netContent").val();
    		 var imagepath=$("#imagepath").val();	
    		 var imageMd5= $("#imageMd5").val();
	    	
    		 if(number==null||number==""){
     			   dialog.render({lang:"automat_product_number"});
     			   return;
     		  }
    		 if(fullName==null||fullName==""){
         		dialog.render({lang:"automat_product_fullname"});
         		return;
         	 }
    		 if(name==null||name==""){
         			dialog.render({lang:"automat_product_name"});
         			return;
         	 }
    		    		 
   		     if(price==null||price==""){
    			dialog.render({lang:"automat_product_price"});
    			return;
    		 }else if(price <= 0){
    			dialog.render({lang:"goods_price_must_greater_than_zero"});
    			return; 
    		  }
   		     var strP=/^\d+(\.\d+)?$/; 
   	         if(!strP.test(price)){
   	    	     dialog.render({lang:"automat_product_price_isNubmer"});
   	    	    return; 
   	          }
   	         if(netContent==null||netContent==""){
   			      dialog.render({lang:"automat_product_netContent_isNot_null"});
   			      return;
   		     }else if(netContent <= 0){
      			  dialog.render({lang:"automat_product_netContent_greater_than_zero"});
        		  return; 
        	 }
   	         if(!localStorage.getItem("language")=="en"){
   		        if(!strP.test(netContent)){
        	    	dialog.render({lang:"automat_product_netContent_isNubmer"});
    	    	    return; 
        	     }
   	         }
   	      
    		 if(imagepath==null||imagepath==""){
    			dialog.render({lang:"automat_product_imagepath"});
    			return;
    		 }
    		 
    		 return true;
		},
		
		initUploader:function(){
            var self=this;
            if (this.uploader) {
                this.uploader.destroy();
            }
           
            this.uploader = new Uploader({
                browseElement: $("#select_file_button"),
                url: "/"+eurl+"/file",
                autoUpload: true,
                filters: [{
                    title: "Image files",
                    extensions: "jpg,gif,png"
                }],
                maxFileSize: "1mb",
                events: {
                	"onError": function(err){
						cloud.util.unmask("#winContent");
					},
					"onFilesAdded" : function(file){
						var name=file[0].name;
					},
                    "onFileUploaded": function(response, file){
                    	console.log(response);
                    	if ($.isPlainObject(response)){
                    		if(response.error){
                    			dialog.render({lang:"upload_files_failed"});
							}else{
								//dialog.render({lang:"uploadcomplete"});
								var src= cloud.config.FILE_SERVER_URL + "/"+eurl+"/file/" +response.result._id+ "?access_token=" + cloud.Ajax.getAccessToken();
		                        $("#photoFileId").attr("src", src);
		                        $("#imagepath").val(response.result._id);
		                        $("#imageMd5").val(response.result.md5);
							}
                    	}
                    	
                    	cloud.util.unmask("#winContent");
                    },
                    "beforeFileUpload":function(){
						cloud.util.mask(
		                	"#winContent",
		                	locale.get("uploading_files")
		                );
					}
                }
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