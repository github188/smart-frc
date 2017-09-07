define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery.datetimepicker");
    var _Window = require("cloud/components/window");
    var winHtml = require("text!./updateAdvertise.html");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Uploader = require("cloud/components/uploader");
    require("cloud/lib/plugin/jquery.uploadify");
    require("cloud/lib/plugin/jquery.form");
    var Service = require("../service");
    var DeviceList = require("./deviceList/list");
   // var UploadFile  = require("./uploadFile/uploadFile-window");
    var UploadFile = require("./addFile/fileList");
	require("./css/default.css");
    
    var updateWindow = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.adId = options.adId;
            this.deviceArr = options.deviceList;
           
            this.data = null;
            this.policyList = [];
            this.configArray = [];
            this.deviceLists = [];
            this.count = 0;
            this.policyCount = 0;
            this.showhomecount = 0;
            this.showsvmcount = 0;
            this._renderWindow();
            locale.render({element: this.element});

        },
        _renderWindow: function() {
            var bo = $("body");
            var self = this;
            this.adWindow = new _Window({
                container: "body",
                title: locale.get({lang: "ad_manage"}),
                top: "center",
                left: "center",
                height: 600,
                width: 1000,
                mask: true,
                drag: true,
                content: winHtml,
                events: {
                    "onClose": function() {
                        this.adWindow.destroy();
                        cloud.util.unmask();
                    },
                    scope: this
                }
            });
      //      $("#adsForm").css( "overflow", "");
            this.adWindow.show();
            $("#ui-window-content").css("overflow", "hidden");
            $("#deviceList").css("display", "none");
            $(".addpolicy").val(locale.get({lang: "add_menu"}));
            $("#nextBase").val(locale.get({lang: "next_step"}));
            $("#lastBase").val(locale.get({lang: "price_step"}));
            $("#saveBase").val(locale.get({lang: "temporary_storage"}));
            $("#nowBase").val(locale.get({lang: "immediate_delivery"}));
            
            this.renderDeviceList();
        
             
            this._renderBtn();
              //首页子广告位
            this.editHomeChildAds();
           //销售广告位
            this.editSaleChildAds();
            if(this.adId){
            	this.getData();
            }else {
               
                this.showTab1Ads();
            }
        },
        getData:function(){
        	var self = this;
        	Service.getAdById(self.adId,function(data){
    			$("#adName").val(data.result.adName==null?"":data.result.adName);
                 var policyArray = data.result.policyList;
             
               // $("#tab1_addpolicy").click();
                //$("#policy_"+self.policyCount+"_type")
                for (var i = 0; i < policyArray.length; i++) {
                         var startime = policyArray[i].startTime;
                         var endtime =policyArray[i].endTime;
                         if (policyArray[i].adIndex==0) {
                             
                              if (policyArray[i].type) {                          
                               // $("#tab1_addpolicy").click();
                            
                                 self.addAdsPlicy("policyInfo");

                                $("#policy_"+self.policyCount+"_type").val(policyArray[i].type);
                                $("#policy_"+self.policyCount+"_type").change();
                                $("#"+self.policyCount+"_startTime").val(startime.substring(0,startime.length-3));
                                $("#"+self.policyCount+"_endTime").val(endtime.substring(0,endtime.length-3 ));
                              }else {
                                 self.showTab1Ads();
                                  $("#policy_"+self.policyCount+"_type").val("2");
                              }
                            
                             // $("#material"+self.policyCount).click(function(){
                              	var index =   $("#material"+self.policyCount).parent().parent().parent().find('tbody').attr('id');
                                	self.initMedia(index,policyArray[i].mediaList);
                           //   });
                         //     $("#material"+self.policyCount)
                         }
                         if(policyArray[i].adIndex && policyArray[i].adIndex.indexOf("_") >= 0){
                            
                            var location = policyArray[i].adIndex.split("_")[0];
                            var index = policyArray[i].adIndex.split("_")[1];
                            if (location=="1") {
                                var id = "home_"+index;                          
                                var html="<div style='overflow: auto;' id='"+id+"_adver_content' class='homesub'>"+
                                       "<table width='100%'>"+
                                       "<tr>" +
                                         "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                          "<td><input type='button' class='btn btn-primary submit addpolicy' id='"+id+"_addpolicy' /></td>"+
                                       " </tr>"+
                                       "</table>"+
                                        "<div style='width: 100%;;overflow: auto;' id='"+id+"policyInfo1'   class='policyInfo'>" +
                                       "</div>"  +
                                    "</div>" ;
                                 if (index!="0") {
                                    $("#adver_content").append(html);
                                    $(".addpolicy").val(locale.get({lang: "add_menu"}));
                                    $(".homesub").hide();
                                 }
                                    $("#home_"+index).show();
                    
                                    $("#adver_content").show();
                                    $("#home_0_adver_content").show();  
                                    $(".adheader").css({ "border-bottom": '1px solid #ddd'});
                               if (policyArray[i].type) {
                                 self.addAdsPlicy( $("#"+id+"policyInfo1").attr("id"));
                                 $("#policy_"+self.policyCount+"_type").val(policyArray[i].type);
                                 $("#"+self.policyCount+"_startTime").val(startime.substring(0,startime.length-3));
                                 $("#"+self.policyCount+"_endTime").val(endtime.substring(0,endtime.length-3));
                                 }else{
                               
                                     self.renderAdsPlicy(id+"policyInfo1");
                                     $("#policy_"+self.policyCount+"_type").val("2");
                                 }
                                 self.showhomecount = parseInt(index)+1;
                                 var index1 =   $("#material"+self.policyCount).parent().parent().parent().find('tbody').attr('id');
                                  self.initMedia(index1,policyArray[i].mediaList);
                            }else if(location=="2"){
                              var id = "svm_"+index;  
                              var html = "<div style='overflow: auto;' id='"+id+"_adver_content' class='svmsub'>"+
                                            "<table width='100%;'>"+
                                             "<tr>" +
                                               "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                               "<td><input type='button' class='btn btn-primary submit addpolicy' id='"+id+"_addpolicy' /></td>"+
                                              " </tr>"+
                                            "</table>"+
                                            "<div style='width: 100%;;overflow: auto;' id='"+id+"policyInfo1' class='policyInfo'>" +
                                            "</div>"  +
                                         "</div>";
                                if (index!="0") {
                                    $("#svm_content").append(html);
                                    $(".addpolicy").val(locale.get({lang: "add_menu"}));
                                    $(".svmsub").hide();
                                }
                                 $("#svm_"+index).show();
                                 $("#svm_content").show();
                                 $("#svm_0_adver_content").show();
                                 $(".adheader").css({
                                       "border-bottom": '1px solid #ddd'
                                 });
                              if (policyArray[i].type) {
                                 self.addAdsPlicy( $("#"+id+"policyInfo1").attr("id"));
                                 $("#policy_"+self.policyCount+"_type").val(policyArray[i].type);
                                 $("#"+self.policyCount+"_startTime").val(startime.substring(0,startime.length-3));
                                 $("#"+self.policyCount+"_endTime").val(endtime.substring(0,endtime.length-3));
                                }else {
                                  
                                     self.renderAdsPlicy(id+"policyInfo1");
                                     $("#policy_"+self.policyCount+"_type").val("2");
                                 }
                                  self.showsvmcount = parseInt(index)+1;
                                 var index2 =   $("#material"+self.policyCount).parent().parent().parent().find('tbody').attr('id');
                                  self.initMedia(index2,policyArray[i].mediaList);
                            }
                    
                              
                         }
                }
             
                       
    			//self.deviceArr = data.result.deviceList;
    		})
    		
        },
        initMedia:function(configIndex,mediaList){

		//	var mediaList = data.result.mediaList;
			
			if(mediaList && mediaList.length > 0){
				for(var i=0;i<mediaList.length;i++){
					 var mediaName = mediaList[i].mediaName;
					 var mediaId = mediaList[i].mediaId;
					 var md5 = mediaList[i].md5;
					 var mediaType = mediaList[i].mediaType;
					 var fileName = mediaList[i].fileName;
					 var length = mediaList[i].length;
					 var fileSource = mediaList[i].fileSource;
            		
					 var adIndex = mediaList[i].adIndex;
					 
            		 if(mediaType == 1 || mediaType==3){
    					 var src = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
            		 }else if(mediaType == 2 ){//视频{
            			 var src ="../applications/advertisement/adStatistics/PVUV_Statistics/img/play-button.jpg";
            		 }
            		 
					 var mediaTypeName ='';
            		 if(mediaType == 1){//图片
            			 mediaTypeName = locale.get({lang:"product_image"}); 
            		 }else if(mediaType == 2){//视频
            			 mediaTypeName = locale.get({lang:"material_video"}); 
            		 }else if(mediaType == 3){//文本
            			 mediaTypeName = locale.get({lang:"ad_txt"});
            		 }
            		 
            	/*	var configIndex = "editConfig";
                    if(adIndex && adIndex.indexOf("_") >= 0){
         				
         				var location = adIndex.split("_")[0];
         				var index = adIndex.split("_")[1];
         				if(location == "1"){
         					configIndex = "editConfig" +index;
         				}else if(location == "2"){
         					configIndex = "editConfig1" +index;
         				}
         				
         			}
            		*/
             		if(mediaId ==null ||　mediaId == ""　){
             		
         			
           			$("#"+configIndex).append("<tr id='"+mediaName+"'>"
         						+"<td class='channelTable'>"
         						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
         						+"</td>"
         						+"<td class='channelTable'>"
         						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
         						+"</td>"
         						+"<td class='channelTable'>"
         						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
         						+"</td>"
         						+"<td class='channelTable' id='imgTd'>"
         						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'></label>"
         						+"</td>"
         						+"<td class='channelTable'  style='display: none;'>"
         						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
         						+"</td>"
         						+"<td class='channelTable'  style='display: none;'>"
         						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
         						+"</td>"
         						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
         						+"</tr>");
               	   }else{
               		 $("#"+configIndex).append("<tr id='"+mediaName+"'>"
    						+"<td class='channelTable'>"
    						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
    						+"</td>"
    						+"<td class='channelTable'>"
    						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
    						+"</td>"
    						+"<td class='channelTable'>"
    						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
    						+"</td>"
    						+"<td class='channelTable' id='imgTd'>"
    						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'><img id='img_"+mediaId+"_"+i+"' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/></label>"
    						+"</td>"
    						+"<td class='channelTable'  style='display: none;'>"
    						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
    						+"</td>"
    						+"<td class='channelTable'  style='display: none;'>"
    						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
    						+"</td>"
    						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
    						+"</tr>");
           		  }
             		
					 if(mediaType == 3){//文本
            			 $("#img_"+mediaId+"_"+i).hide();
            		 }
	        		 if(mediaType == 1){//图片
	        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
    					 $("#img_"+mediaId+"_"+i).bind('click',{src:src2},function(e){
	        			 var bh = $("body").height(); 
		        		 var bw = $("body").width(); 
	        			 $("#fullbg").css({ 
		        			height:"425px", 
 			        		width:"100%", 
			        		display:"block" 
			        		}); 
	        			 $("#img_preview").attr("src",e.data.src);
		        		 $("#img_preview").show();
    					  });
	        		 }else if(mediaType == 2){//视频
	        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
    					 $("#img_"+mediaId+"_"+i).bind('click',{src:src2},function(e){
    						 
	        			 var bh = $("body").height(); 
		        		 var bw = $("body").width(); 
	        			 $("#checkimg").css({ 
		        			height:"460px", 
 			        		width:"100%", 
			        		display:"block" 
			        		}); 
	        			 $("#vi_preview").attr("src",e.data.src);
		        		 $("#vi_preview").show();
    					  });
            		 }
				    $(".delcls").bind('click',{mediaName:mediaName},function(e) {
            			 $(this).parent().parent().remove();
            			 //media.remove(); 
            			 //$("#"+mediaName).remove();
        			 });
				}
			}
        },
        
        _renderBtn: function() {
        	var self = this;
         
        	//暂存
        	$("#saveBase").bind("click", function() {
        		var adName = $("#adName").val();//广告名称
        		var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                        var configObj ={};
                		configObj.deviceName =  idsArr[i].name;
                		configObj.gwId = idsArr[i].gwId;
                		configObj.deviceId = id;
                		self.deviceLists.push(configObj);
                    }
                }
        		var status = 2;  
         
        		var finalData = {
        				adName:adName,
                        policyList:self.policyList,
        				mediaList:self.configArray,
        				deviceList:self.deviceLists,
        				status:status              //投放状态 1 投放 2 暂存
        		};
        		if(self.adId){
        			Service.updateAd(finalData,self.adId,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addAd(finalData,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}
        		
        	});
        	//立即投放
        	$("#nowBase").bind("click", function() {
        		var adName = $("#adName").val();//广告名称
        		var idsArr = self.deviceList.getSelectedResources();
        		if (idsArr.length == 0) {
                    dialog.render({lang: "please_select_at_least_one_config_item"});
                    return;
                }else{
                	for (var i = 0; i < idsArr.length; i++) {
                        var id = idsArr[i]._id;
                        var configObj ={};
                		configObj.deviceName =  idsArr[i].name;
                		configObj.gwId = idsArr[i].gwId;
                		configObj.deviceId = id;
                		self.deviceLists.push(configObj);
                    }
                }
        
        		var status = 1;
        		var finalData = {
        				adName:adName,
                        policyList:self.policyList,
        				mediaList:self.configArray,
        				deviceList:self.deviceLists,
        				status:status              //投放状态 1 投放 2 暂存
        		};
        		if(self.adId){
        			Service.updateAd(finalData,self.adId,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}else{
        			Service.addAd(finalData,function(data){
            			self.fire("getAdvertiseList");
            			self.adWindow.destroy();
            		});
        		}
        	});
        	//下一步
            $("#nextBase").bind("click", function() {
            	var adName = $("#adName").val();
                if(adName==null||adName.replace(/(^\s*)|(\s*$)/g,"")==""){
           			dialog.render({lang:"please_enter_ad_name"});
           			return;
           		}
                 //首页主广告位
            self.policyList = [];
            self.configArray = [];
            $("#policyInfo").children(".policy").each(function(index, el) {
                self.getAdsPolicy( $(this),0);
          
            });

                //self.configArray = [];
                //首页主广告位
/*				var tableObj = document.getElementById("editConfig"); 
				if(tableObj && tableObj.rows.length >0 ){
					for(var i=0;i<tableObj.rows.length;i++){//行 
						var configObj ={};
						for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
							
							configObj.mediaName = tableObj.rows[i].cells[0].children[0].id.split(":")[0];
						    configObj.mediaId = tableObj.rows[i].cells[0].children[0].id.split(":")[1];
						    configObj.md5 = tableObj.rows[i].cells[1].children[0].id.split(":")[0];
						    configObj.mediaType = tableObj.rows[i].cells[1].children[0].id.split(":")[1];
						    configObj.fileName = tableObj.rows[i].cells[2].children[0].id.split(":")[1];
						    configObj.length = tableObj.rows[i].cells[4].children[0].id.split(":")[1];
						    configObj.fileSource = tableObj.rows[i].cells[5].children[0].id.split(":")[1];
						    configObj.adIndex = 0;
						}
						self.configArray.push(configObj);
					}
				}*/
				//首页子广告位
                for(var m=0;m<10;m++){
                    var policyInfoDivId = "home_"+m+"policyInfo1";
                    $("#"+policyInfoDivId).children(".policy").each(function(index, el) {
                        self.getAdsPolicy( $(this),"1_"+m);
                    });

                }

                //销售页面广告位
                for(var m=0;m<10;m++){
                    var policyInfoDivId = "svm_"+m+"policyInfo1";
                    $("#"+policyInfoDivId).children(".policy").each(function(index, el) {
                        self.getAdsPolicy( $(this),"2_"+m);
                    });

                }




                //首页子广告位
	/*			for(var m=0;m<10;m++){
					var tableId = "editConfig"+m;
					
					var homeObj = document.getElementById(tableId); 
					if(homeObj.rows.length >0){
						
						for(var i=0;i<homeObj.rows.length;i++){//行 
							var configObj ={};
							for(var j=0;j<homeObj.rows[i].cells.length-1;j++){//列   
								
								configObj.mediaName = homeObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.mediaId = homeObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = homeObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.mediaType = homeObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.fileName = homeObj.rows[i].cells[2].children[0].id.split(":")[1];
							    configObj.length = homeObj.rows[i].cells[4].children[0].id.split(":")[1];
							    configObj.fileSource = homeObj.rows[i].cells[5].children[0].id.split(":")[1];
							    configObj.adIndex = "1_"+m;
							}
							self.configArray.push(configObj);
						}
						
					}
					
				}
		*/
				//销售页面广告位

/*				for(var n=0;n<10;n++){
					var tableId = "editConfig1"+n;
					var vmObj = document.getElementById(tableId); 
					if(vmObj.rows.length >0){
						
						for(var i=0;i<vmObj.rows.length;i++){//行 
							var configObj ={};
							for(var j=0;j<vmObj.rows[i].cells.length-1;j++){//列   
								
								configObj.mediaName = vmObj.rows[i].cells[0].children[0].id.split(":")[0];
							    configObj.mediaId = vmObj.rows[i].cells[0].children[0].id.split(":")[1];
							    configObj.md5 = vmObj.rows[i].cells[1].children[0].id.split(":")[0];
							    configObj.mediaType = vmObj.rows[i].cells[1].children[0].id.split(":")[1];
							    configObj.fileName = vmObj.rows[i].cells[2].children[0].id.split(":")[1];
							    configObj.length = vmObj.rows[i].cells[4].children[0].id.split(":")[1];
							    configObj.fileSource = vmObj.rows[i].cells[5].children[0].id.split(":")[1];
							    configObj.adIndex = "2_"+n;
							}
							self.configArray.push(configObj);
						}
						
					}
					
				}*/


				for (var i = 0; i <  self.policyList.length; i++) {
                    if (self.policyList[i].mediaList.length<=0) {
                         dialog.render({lang:"please_add_material"});
                         return;
                     } 
                }
				if(self.configArray.length <= 0){
					dialog.render({lang:"please_add_material"});
           			return;
				}

                //以下是校验策略时间
                self.policyTypeList = {};
                self.homeChildList = {};
                self.svmChildList = {};
               
               
                for (var i = 0; i < self.policyList.length; i++) {
                    //首页主广告位
                    if (self.policyList[i].adIndex==0) {
                         if( self.policyTypeList[self.policyList[i].type]){
                            self.policyTypeList[self.policyList[i].type].push(self.policyList[i]);
                         }else {
                             var temp = [];
                             temp.push(self.policyList[i]);
                             self.policyTypeList[self.policyList[i].type]=temp;
                         }
                           
                    }
                    if(self.policyList[i].adIndex && self.policyList[i].adIndex.indexOf("_") >= 0){
                        var  location = self.policyList[i].adIndex.split("_")[0];
                        var  index = self.policyList[i].adIndex.split("_")[1];
                       //首页子广告位
                        if (location == "1") {
                           if (self.homeChildList[index]) {
                                 self.homeChildList[index].push( self.policyList[i]);
                            }else {
                                 var temp = [];
                                temp.push(self.policyList[i]);
                                self.homeChildList[index] = temp;
                            }
                            //销售子广告位
                         }else if(location=="2"){
                              if (self.svmChildList[index]) {
                                 self.svmChildList[index].push( self.policyList[i]);
                            }else {
                                  var temp = [];
                                   temp.push(self.policyList[i]);
                                self.svmChildList[index] = temp;
                            }
                         }
                     }
                    
                }

                if (self.policyTypeList[undefined]&&(self.policyTypeList[1]||self.policyTypeList[0])) {
                        dialog.render({lang:"exist_none_type"});
                        return;
                }
                //校验首页子广告位时间
                for (var i = 0; i < 10; i++) {
                    //一个子广告位
                    if (self.homeChildList[i]) {
                         self.homeChildPolicyTypeList = {};
                         for (var j = 0; j <   self.homeChildList[i].length; j++) {
                          
                           if (  self.homeChildPolicyTypeList[self.homeChildList[i][j].type]) {
                             self.homeChildPolicyTypeList[self.homeChildList[i][j].type].push( self.homeChildList[i][j]);
                           }else {
                              var temp = [];
                              temp.push(self.homeChildList[i][j]);
                              self.homeChildPolicyTypeList[self.homeChildList[i][j].type]=temp;
                          }
                         }
                         //校验默认策略时间
                         if (self.chekDefaultPolicyTime(self.homeChildPolicyTypeList[0],1,i)) {
                             return;
                         }
                         
                          //校验特定策略时间
                          if ( self.checkSpecificPolicyTime(self.homeChildPolicyTypeList[1],1,i)) {
                              return;
                          }
                        
                     }  
                    
                 }
                 //校验销售子广告位时间
                for (var i = 0; i < 10; i++) {
                    if (self.svmChildList[i]) {
                         self.svmChildPolicyTypeList = {};
                         for (var j = 0; j <   self.svmChildList[i].length; j++) {
                        
                           if (  self.svmChildPolicyTypeList[self.svmChildList[i][j].type]) {
                             self.svmChildPolicyTypeList[self.svmChildList[i][j].type].push( self.svmChildList[i  ][j]);
                           }else {
                              var temp = [];
                              temp.push(self.svmChildList[i][j]);
                              self.svmChildPolicyTypeList[self.svmChildList[i][j].type]=temp;
                         }
                       }
                       //校验默认策略时间
                       if (self.chekDefaultPolicyTime(self.svmChildPolicyTypeList[0],2,i)) {
                           return;
                       }
                        
                       //校验特定策略时间
                       if (self.checkSpecificPolicyTime(self.svmChildPolicyTypeList[1],2,i)) {
                           return;
                       }
                        
                     }  
                    
                 }
                //校验默认策略时间
                if (self.chekDefaultPolicyTime(self.policyTypeList[0],0)) {
                    return;
                }
                
        
                //校验特定策略时间
                if(self.checkSpecificPolicyTime(self.policyTypeList[1],0)){
                    return;
                }
               
             
    /*            if (self.policyTypeList[0]) {
                  for (var i = 0; i < self.policyTypeList[0].length; i++) {
                    var  dateStart1 = new Date("2016/12/22 "+self.policyTypeList[0][i].startTime+":00");
                    var  dateEnd1 = new Date("2016/12/22 "+self.policyTypeList[0][i].endTime+":00");
                    self.checkTime(dateStart1,dateEnd1);
                    for (var j = 0;j < self.policyTypeList[0].length;j ++) {
                        var  dateStart2 = new Date("2016/12/22 "+self.policyTypeList[0][j].startTime+":00");
                        var  dateEnd2 = new Date("2016/12/22 "+self.policyTypeList[0][j].endTime+":00");
                        if (i!=j&&dateStart1<dateStart2&&dateStart2<dateEnd1) {

                            return;
                        }
                        if(i!=j&&dateStart1<dateEnd2&&dateEnd2<dateEnd1){
                            return;
                        }
                        if (i!=j&&dateStart1>dateStart2&&dateEnd1<dateEnd2) {
                            return;
                        }
                     }

                   }
                }
         
                //特定策略
                if(self.policyTypeList[1]){
                 for (var i = 0; i < self.policyTypeList[1].length; i++) {
                     var startDateTemp = self.policyTypeList[1][i].startTime.split(" ");   
                     var endDateTemp = self.policyTypeList[1][i].endTime.split(" "); 
                     var reg = new RegExp(':','g');
                     var  dateStart1 = new Date( startDateTemp[0].replace(reg,"/")+" "+startDateTemp[1]+":00");
                     var  dateEnd1 = new Date( endDateTemp[0].replace(reg,"/")+" "+endDateTemp[1]+":00");
                    self.checkTime(dateStart1,dateEnd1);
                    for (var j = 0;j < self.policyTypeList[1].length;j ++) {
                       var startDateTemp = self.policyTypeList[1][j].startTime.split(" ");   
                       var endDateTemp = self.policyTypeList[1][j].endTime.split(" "); 
              
                       var  dateStart2 = new Date( startDateTemp[0].replace(reg,"/")+" "+startDateTemp[1]+":00");
                       var  dateEnd2 = new Date( endDateTemp[0].replace(reg,"/")+" "+endDateTemp[1]+":00");
      
                        if (i!=j&&dateStart1<dateStart2&&dateStart2<dateEnd1) {

                            return;
                        }
                        if(i!=j&&dateStart1<dateEnd2&&dateEnd2<dateEnd1){
                            return;
                        }
                        if (i!=j&&dateStart1>dateStart2&&dateEnd1<dateEnd2) {
                            return;
                        }
                    }

                }
            }*/


				$("#deviceList").css("display", "block");
                $("#baseInfo").css("display", "none");
                $("#tab1").removeClass("active");
                $("#tab2").addClass("active");
				
            });
            //上一步
            $("#lastBase").bind("click", function() {
            	$("#deviceList").css("display", "none");
                $("#baseInfo").css("display", "block");
                $("#tab1").addClass("active");
                $("#tab2").removeClass("active");
            });
       /*     $(".upload").click(function(){
            	var index = $(this).parent().parent().parent().find('tbody').attr('id');
            	
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    events: {
                    	 "uploadSuccess":function(mediaId,mediaName,mediaType,md5,fileName,length,fileSource) {
                    		 typeArr=mediaType.split("_");
                    		 mediaType = typeArr[0];
                    		 if(mediaType == 1 || mediaType==3){
                    			 var src = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
                    		 }else if(mediaType == 2){//视频{
                    			 var src ="../applications/advertisement/adStatistics/PVUV_Statistics/img/play-button.jpg";
                    		 }
                    		 
                    		 var mediaTypeName ='';
                    		 if(mediaType == 1){//图片
                    			 mediaTypeName = locale.get({lang:"product_image"}); 
                    		 }else if(mediaType == 2){//视频
                    			 mediaTypeName = locale.get({lang:"material_video"}); 
                    		 }else if(mediaType == 3){//文本
                    			 mediaTypeName = locale.get({lang:"ad_txt"}); 
                    		 }
                    		if(mediaId ==null ||　mediaId == ""　){
                    			 $("#"+index).append("<tr id='"+mediaName+"'>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable' id='imgTd'>"
                  						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'></label>"
                  						+"</td>"
                  						+"<td class='channelTable'  style='display: none;'>"
                  						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'  style='display: none;'>"
                  						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                 						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_startTime' />&nbsp;-&nbsp;" 
                 						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_endTime' />" 
                 						+"</td>"
                  						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
                  						+"</tr>");
                    		}else{
                    		 $("#"+index).append("<tr id='"+mediaName+"'>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
             						+"</td>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
             						+"</td>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
             						+"</td>"
             						+"<td class='channelTable' id='imgTd'>"
             						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'><img id='img_"+mediaId+"_"+self.count+"' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/></label>"
             						+"</td>"
             						+"<td class='channelTable'  style='display: none;'>"
             						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
             						+"</td>"
             						+"<td class='channelTable'  style='display: none;'>"
             						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
             						+"</td>"
             						+"<td class='channelTable'>"
             						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_startTime' />&nbsp;-&nbsp;" 
             						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_endTime' />" 
             						+"</td>"
             						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
             						+"</tr>");
                    		}
                    		
                    		
                    		 $("#"+mediaId+"_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 + (1 * 24 * 60 * 

                    				60)), "yyyy/MM/dd")).datetimepicker({
                    									format:'Y/m/d',
                    									step:1,
                    									startDate:'-1970/01/08',
                    									timepicker: false,
                    									lang:locale.current() === 1 ? "en" : "ch"
                    		 });
                    		 $("#"+mediaId+"_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

                    				"yyyy/MM/dd")).datetimepicker({
                    									format:'Y/m/d',
                    									step:1,
                    									startDate:'-1970/01/08',
                    									timepicker: false,
                    									lang:locale.current() === 1 ? "en" : "ch"
                    		 });
                    		
                    		 if(mediaType == 3){//文本
                    			 $("#img_"+mediaId+"_"+self.count).hide();
                    		 }
                    		 if(mediaType == 1){//图片
 			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
 		    					 $("#img_"+mediaId+"_"+self.count).bind('click',{src:src2},function(e){
 		    						 
 			        			 var bh = $("body").height(); 
     			        		 var bw = $("body").width(); 
 			        			 $("#fullbg").css({ 
 				        			height:"425px", 
 	     			        		width:"100%", 
 	    			        		display:"block" 
 	    			        		}); 
 			        			 $("#img_preview").attr("src",e.data.src);
     			        		 $("#img_preview").show();
 		    					  });
 			        		 }else if(mediaType == 2){//视频
 			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
 		    					 $("#img_"+mediaId+"_"+self.count).bind('click',{src:src2},function(e){
 		    						
 			        			 var bh = $("body").height(); 
     			        		 var bw = $("body").width(); 
 			        			 $("#checkimg").css({ 
 				        			height:"460px", 
 	     			        		width:"100%", 
 	    			        		display:"block" 
 	    			        		}); 
 			        			 $("#vi_preview").attr("src",e.data.src);
     			        		 $("#vi_preview").show();
 		    					  });
 	                		 }
                    		 $(".delcls").bind('click',{mediaName:mediaName},function(e) {
     					    	
                     			 $(this).parent().parent().remove();
                     			 //media.remove(); 
                     			 //$("#"+mediaName).remove();
                 			 });
                    		 self.count ++;
                    	 }
                    }
                });
        	});*/
      //  self.showTab1Ads();

                //添加首页主广告策略
            $("#tab1_addpolicy").click(function(){
                 var policy = {};
                var tableObj =   $("#policyInfo").children(".policy").children('table').eq(0).find('tbody')[0];
                if(tableObj && tableObj.rows.length >0 ){
                    for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                              //  policy.adIndex=m;
                            }
                    }
                }

                 if (policy.type=="2") {
                    dialog.render({lang:"can_not_add_policy"});
                    return;
                 }else {
                    var index = $(this).parent().parent().parent().parent().parent().parent().find($(".policyInfo")).attr('id');
                    self.addAdsPlicy(index);
                 }
         
            });
           
        },
        showTab1Ads:function(){
            var self = this;
            self.renderAdsPlicy("policyInfo");
        },
        getAdsNonePolicy:function(obj,m){
                var self = this;
                var tableObj =  obj.children('table').eq(0).find('tbody')[0];
                var policy = {};
                policy.mediaList = [];
               // var medialist = [];
                if(tableObj && tableObj.rows.length >0 ){
                    for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                                policy.adIndex=m;
                            }
                    }
                }
                 var  tableMediaObj =  obj.children('table').eq(1).find('tbody')[0].rows[1].cells[1].children[0].children[1];
                if(tableMediaObj && tableMediaObj.rows.length >0 ){
                    for(var i=0;i<tableMediaObj.rows.length;i++){//行 
                        var configObj ={};
                        for(var j=0;j<tableMediaObj.rows[i].cells.length-1;j++){//列   
                            
                            configObj.mediaName = tableMediaObj.rows[i].cells[0].children[0].id.split(":")[0];
                            configObj.mediaId = tableMediaObj.rows[i].cells[0].children[0].id.split(":")[1];
                            configObj.md5 = tableMediaObj.rows[i].cells[1].children[0].id.split(":")[0];
                            configObj.mediaType = tableMediaObj.rows[i].cells[1].children[0].id.split(":")[1];
                            configObj.fileName = tableMediaObj.rows[i].cells[2].children[0].id.split(":")[1];
                            configObj.length = tableMediaObj.rows[i].cells[4].children[0].id.split(":")[1];
                            configObj.fileSource = tableMediaObj.rows[i].cells[5].children[0].id.split(":")[1];
                            configObj.adIndex = m;
                        }
                         policy.mediaList.push(configObj);
                        self.configArray.push(configObj);
                    }
                }
                 self.policyList.push(policy);
        },
        //获取广告策略数据函数
        getAdsPolicy:function(obj,m){
                var self = this;
                var tableObj =  obj.children('table').eq(0).find('tbody')[0];
                var policy = {};
                policy.mediaList = [];
               // var medialist = [];
                if(tableObj && tableObj.rows.length >0 ){
                    for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                
                                //策略类型为无时,不设置type，和时间值
                                if ( tableObj.rows[i].cells[1].children[0].value!="2") {
                                  policy.type = tableObj.rows[i].cells[1].children[0].value;
                                  policy.startTime = tableObj.rows[i].cells[3].children[0].value+":00";
                                  policy.endTime = tableObj.rows[i].cells[3].children[1].value+":00";
                                }
                           
                                policy.adIndex=m;
                            }
                    }
                }
               // var tableMedia =  $(this).children('table').eq(1);
               
                var  tableMediaObj =  obj.children('table').eq(1).find('tbody')[0].rows[1].cells[1].children[0].children[1];
                if(tableMediaObj && tableMediaObj.rows.length >0 ){
                    for(var i=0;i<tableMediaObj.rows.length;i++){//行 
                        var configObj ={};
                        for(var j=0;j<tableMediaObj.rows[i].cells.length-1;j++){//列   
                            
                            configObj.mediaName = tableMediaObj.rows[i].cells[0].children[0].id.split(":")[0];
                            configObj.mediaId = tableMediaObj.rows[i].cells[0].children[0].id.split(":")[1];
                            configObj.md5 = tableMediaObj.rows[i].cells[1].children[0].id.split(":")[0];
                            configObj.mediaType = tableMediaObj.rows[i].cells[1].children[0].id.split(":")[1];
                            configObj.fileName = tableMediaObj.rows[i].cells[2].children[0].id.split(":")[1];
                            configObj.length = tableMediaObj.rows[i].cells[4].children[0].id.split(":")[1];
                            configObj.fileSource = tableMediaObj.rows[i].cells[5].children[0].id.split(":")[1];
                            configObj.adIndex = m;
                        }
                         policy.mediaList.push(configObj);
                        self.configArray.push(configObj);
                    }
                }
                
                     self.policyList.push(policy);
               
                

        },
        //默认展示包含无广告策略函数
        renderAdsPlicy:function(obj){
            var self = this;
            self.policyCount++;
        /*  var index = ob.parent().parent().parent().parent().parent().parent().find($(".policyInfo")).attr('id');*/
            $("#"+obj).append("<div id='policy"+self.policyCount+"' class='policy' width='100%'>" +
                    "<table width='100%;'>" +
                    "            <tr width='100%;'>"+
                    "            <td width='8%'><label style='color:red;'></label><label><span lang='text:policyType'>"+locale.get({lang: "policyType"})+"</span></label></td>"+
                    "            <td width='20%'>" +
                                    "<select class='policy-type-select' id='policy_"+self.policyCount+"_type' style='border-radius: 4px;height: 30px;width:200px;margin-bottom: 5px;'>" +
                    "                   <option value='2'>"+locale.get({lang: "policyType3"})+"</option>"+
                    "                   <option value='0'>"+locale.get({lang: "policyType1"})+"</option>"+
                    "                   <option value='1'>"+locale.get({lang: "policyType2"})+"</option>"+
               
                    "                </select>"+
                    "            </td>"+
                    "            <td width='8%'></td>"+
                        "        <td width='30%'>"+
                        "         </td>"+
                    "            </tr>"+
                    "            <table width='100%;'>" +
                    "                <tr>"+
                     "                   <td width='12%'><label style='color:red;'></label><label><span>"+locale.get({lang:"material_all"})+"</span></label></td>"+
                     "                   <td><input type='button' class='btn btn-primary submit upload' id='material"+self.policyCount+"'/></td>"+
                     "               </tr>"+
                     "               <tr>"+
                     "                   <td></td>"+
                     "                   <td>"+
                     "                       <table style='width:80%;border: 1px solid rgba(115, 120, 126, 0.32);margin-top: 5px;table-layout:fixed;word-wrap:break-word;' id='configTable'>"+
                     "                           <thead class='configtable'>"+
                     "                                <tr class='configtable'>"+
                     "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"material_name"})+"</span></th>"+
                     "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"type"})+"</span></th>"+
                     "                                  <th width='200' class='configtable'><span>"+locale.get({lang:"ad_filename"})+"</span></th>"+
                     "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"ad_preview"})+"</span></th>"+
/*                       "                                  <th width='220' class='configtable'><span>"+locale.get({lang:"ad_play_time"})+"</span></th>"+*/
                     "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"operate"})+"</span></th>"+
                     "                                  <th width='100' class='configtable' style='display: none;'></th>"+
                     "                                  <th width='100' class='configtable' style='display: none;'></th>"+
                     "                                </tr>"+
                     "                             </thead>"+
                     "                             <tbody id='editConfig"+self.policyCount+"' class='editConfig' >"+
                     "                             </tbody>"+
                     "                       </table>"+
        /*           "                     <tbody id='editConfig'>" +
                     "                      </tbody>"+*/
                     "                   </td>"+
                     "               </tr>"+
                     "              </table>" +
                    "</table>" +
                    "</div>");
             $(".upload").val(locale.get({lang: "add_menu"}));
             var tableObj =   $("#"+obj).children(".policy").children('table').eq(0).find('tbody')[0];
             var td=tableObj.rows[0].cells[2];
                td.innerHTML = "<label style='color:red;'></label><label><span lang='text:loop_play'>"+locale.get({lang: "loop_play"})+"</span></label>";

             $("#policy_"+self.policyCount+"_type").bind("change",{count:self.policyCount},function(e){
                var type = $(this).children('option:selected').val();
                if (type=="1") {
                    var tableObj =   $("#"+obj).children(".policy").children('table').eq(0).find('tbody')[0];
                    var td1=tableObj.rows[0].cells[2];
                    var td2=tableObj.rows[0].cells[3];
                       td1.innerHTML = "<label style='color:red;'></label><label><span lang='text:ad_play_time'>"+locale.get({lang: "ad_play_time"})+"</span></label>";
                        td2.innerHTML=  /* " <td width='30%'>"+*/
                      "      <input style='width:100px;text-align: center;margin-right: 5px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+e.data.count+"_startTime' />&nbsp;" +
                        "                 <input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+e.data.count+"_endTime' />";
                    $("#"+e.data.count+"_startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy:MM:dd") + " 00:00").datetimepicker({
                        datepicker:true,
                        format:'Y:m:d H:i',
                        step:1,
                        startDate:'-1970/01/08',
                        lang:locale.current() === 1 ? "en" : "ch"
                    })
                    
                    $("#"+e.data.count+"_endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy:MM:dd") + " 23:59").datetimepicker({
                        datepicker:true,
                        format:'Y:m:d H:i',
                        step:1,
                        lang:locale.current() === 1 ? "en" : "ch"
                    })
                }else if(type=="0"){
                    var tableObj =   $("#"+obj).children(".policy").children('table').eq(0)[0];
                    var td1=tableObj.rows[0].cells[2];
                    var td2=tableObj.rows[0].cells[3];
                        td1.innerHTML = "<label style='color:red;'></label><label><span lang='text:ad_play_time'>"+locale.get({lang: "ad_play_time"})+"</span></label>";
                        td2.innerHTML=  /* " <td width='30%'>"+*/
                      "      <input style='width:100px;text-align: center;margin-right: 5px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+e.data.count+"_startTime' />&nbsp;" +
                        "                 <input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+e.data.count+"_endTime' />";
                   //   tableObj.rows[0].append(html);
                     $("#"+e.data.count+"_startTime").val("00:00").datetimepicker({
                          datepicker:false,
                         format:'H:i',
                         startDate:'-1970/01/08',
                         step:1,
                         lang:locale.current() === 1 ? "en" : "ch"
                     });
                     $("#"+e.data.count+"_endTime").val("23:59").datetimepicker({
                         datepicker:false,
                         format:'H:i',
                         startDate:'-1970/01/08',
                         step:1,
                         lang:locale.current() === 1 ? "en" : "ch"

                     });
                }else if (type=="2") {
                   var tableObj =   $("#"+obj).children(".policy").children('table').eq(0).find('tbody')[0];
                   var td1=tableObj.rows[0].cells[2];
                   var td2=tableObj.rows[0].cells[3];
                    td2.innerHTML = "";
                    td1.innerHTML = "<label style='color:red;'></label><label><span lang='text:xunhuan_play'>"+locale.get({lang: "loop_play"})+"</span></label>";
                }
             });
                
             //素材总览
            self.addmaterial();

        },
        //添加广告策略函数
        addAdsPlicy:function(ob) {
        	var self = this;
        	self.policyCount++;
        /*	var index = ob.parent().parent().parent().parent().parent().parent().find($(".policyInfo")).attr('id');*/
			$("#"+ob).append("<div id='policy"+self.policyCount+"' class='policy' width='100%'>" +
					"<table width='100%;'>" +
					"            <tr width='100%;'>"+
					"            <td width='8%'><label style='color:red;'></label><label><span lang='text:policyType'>"+locale.get({lang: "policyType"})+"</span></label></td>"+
                    "            <td width='20%'>" +
                                    "<select class='policy-type-select' id='policy_"+self.policyCount+"_type' style='border-radius: 4px;height: 30px;width:200px;margin-bottom: 5px;'>" +
                    "                   <option value='0'>"+locale.get({lang: "policyType1"})+"</option>"+
                    "                   <option value='1'>"+locale.get({lang: "policyType2"})+"</option>"+
                    "                </select>"+
                    "            </td>"+
                    "            <td width='8%'><label style='color:red;'></label><label><span lang='text:ad_play_time'>"+locale.get({lang: "ad_play_time"})+"</span></label></td>"+
            		"            <td width='30%'>"+
            		"                 <input style='width:100px;margin-right: 5px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+self.policyCount+"_startTime' />&nbsp;" +
					    "                 <input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+self.policyCount+"_endTime' />"+
						"            </td>"+
					"            </tr>"+
					"            <table width='100%;'>" +
					"                <tr>"+
					 "	                 <td width='12%'><label style='color:red;'></label><label><span>"+locale.get({lang:"material_all"})+"</span></label></td>"+
					 "	                 <td><input type='button' class='btn btn-primary submit upload' id='material"+self.policyCount+"'/></td>"+
					 "	             </tr>"+
					 "	             <tr>"+
					 "	                 <td></td>"+
					 "	                 <td>"+
					 "	                     <table style='width:80%;border: 1px solid rgba(115, 120, 126, 0.32);margin-top: 5px;table-layout:fixed;word-wrap:break-word;' id='configTable'>"+
					 "	                         <thead class='configtable'>"+
					 "                                <tr class='configtable'>"+
					 "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"material_name"})+"</span></th>"+
					 "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"type"})+"</span></th>"+
					 "                                  <th width='200' class='configtable'><span>"+locale.get({lang:"ad_filename"})+"</span></th>"+
					 "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"ad_preview"})+"</span></th>"+
/*						 "                                  <th width='220' class='configtable'><span>"+locale.get({lang:"ad_play_time"})+"</span></th>"+*/
					 "                                  <th width='100' class='configtable'><span>"+locale.get({lang:"operate"})+"</span></th>"+
					 "                                  <th width='100' class='configtable' style='display: none;'></th>"+
					 "                                  <th width='100' class='configtable' style='display: none;'></th>"+
					 "                                </tr>"+
					 "                             </thead>"+
					 "                             <tbody id='editConfig"+self.policyCount+"' class='editConfig' >"+
					 "                             </tbody>"+
					 "	                     </table>"+
		/*			 "                     <tbody id='editConfig'>" +
                     "                      </tbody>"+*/
					 "	                 </td>"+
					 "	             </tr>"+
					 "              </table>" +
					   "<tr>"+
	                    "<span class='delspan"+self.policyCount+" delete_ad'></span>"+
	                    "</tr>"+
					"</table>" +
					"</div>");


          $("#"+self.policyCount+"_endTime").datetimepicker({
                                   datepicker:false,
                                   format:'H:i',
                                   step:1,
                                   startDate:'-1970/01/08',
                                   lang:locale.current() === 1 ? "en" : "ch"
           }).val("23:59");

 		  $("#"+self.policyCount+"_startTime").datetimepicker({
 			    datepicker:false,
                format:'H:i',
                step:1,
                startDate:'-1970/01/08',
                lang:locale.current() === 1 ? "en" : "ch"
 		   }).val("00:00");

		    $(".upload").val(locale.get({lang: "add_menu"}));
	      		//删除一个广告策略
     		$(".delspan"+self.policyCount).bind("click",{count:self.policyCount},function(e){
     			
         		$("#policy"+e.data.count).remove();
         		
         	});
     		//鼠标经过事件
             $(".delspan"+self.policyCount).bind("mouseover",{count:self.policyCount},function(e){
     			
             	$(".delspan"+e.data.count).removeClass("delete_ad");
 		    	$(".delspan"+e.data.count).addClass("delete_ad_tp");
         		
         	});
             $(".delspan"+self.policyCount).bind("mouseout",{count:self.policyCount},function(e){
     			
             	$(".delspan"+e.data.count).removeClass("delete_ad_tp");
 		    	$(".delspan"+e.data.count).addClass("delete_ad");
         		
         	});
             
             $("#policy_"+self.policyCount+"_type").bind("change",{count:self.policyCount},function(e){
            	var type = $(this).children('option:selected').val();
                if (type=="1") {
                  console.log(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy:MM:dd") + " 00:00");
                    $("#"+e.data.count+"_startTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy:MM:dd") + " 00:00").datetimepicker({
                        datepicker:true,
         				format:'Y:m:d H:i',
         				step:1,
         				startDate:'-1970/01/08',
         				lang:locale.current() === 1 ? "en" : "ch"
         			})
         			
         			$("#"+e.data.count+"_endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy:MM:dd") + " 23:59").datetimepicker({
                        datepicker:true,
         				format:'Y:m:d H:i',
         				step:1,
         				lang:locale.current() === 1 ? "en" : "ch"
         			})
                }else{
                	 $("#"+e.data.count+"_startTime").val("00:00").datetimepicker({
            			  datepicker:false,
                         format:'H:i',
                         startDate:'-1970/01/08',
                         step:1,
                         lang:locale.current() === 1 ? "en" : "ch"
            		 });
                     $("#"+e.data.count+"_endTime").val("23:59").datetimepicker({
                         datepicker:false,
                         format:'H:i',
                         startDate:'-1970/01/08',
                         step:1,
                         lang:locale.current() === 1 ? "en" : "ch"

                     });
                }
             });
     			
			 //素材总览
			self.addmaterial();
		},
        checkTime:function(startTime,endTime){
    
            if (startTime>endTime) {
                //给出提示
                dialog.render({lang:"dateStart_gt_dateEnd"});
                return true;
            }
                 
        },
        //校验默认策略index为0，1，2
        chekDefaultPolicyTime:function(obj,index,m){
            var self = this;
            var error = false;
             if(index == "0"){
                  var adssolt=locale.get({lang:"home_page"});
                }else if (index == "1"){
                  var adssolt=locale.get({lang:"home_sub_ad"})+" "+(m+1);
                                
                }else {
                 var adssolt=locale.get({lang:"sales_sub_ad"})+" "+(m+1);
             }
            if (obj) {
                  if(obj.adIndex && obj.adIndex.indexOf("_") >= 0){
                        var  location = obj.adIndex.split("_")[0];
                        var  index = obj.adIndex.split("_")[1];
                    }
                  for (var i = 0; i < obj.length; i++) {
                    var  dateStart1 = new Date("2016/12/22 "+obj[i].startTime);
                    var  dateEnd1 = new Date("2016/12/22 "+obj[i].endTime);
                    if (self.checkTime(dateStart1,dateEnd1)) {
                         return true;
                     }
                    for (var j = 0;j < obj.length;j ++) {
                        var  dateStart2 = new Date("2016/12/22 "+obj[j].startTime);
                        var  dateEnd2 = new Date("2016/12/22 "+obj[j].endTime);
                        if (i!=j&&dateStart1<=dateStart2&&dateStart2<=dateEnd1) {
                            dialog.render({text:locale.get({lang:"defaultpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                            error = true;
                            return error;
                        }
                        if(i!=j&&dateStart1<=dateEnd2&&dateEnd2<=dateEnd1){
                             dialog.render({text:locale.get({lang:"defaultpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                              error = true;
                           return error;
                        }
                        if (i!=j&&dateStart1>=dateStart2&&dateEnd1<=dateEnd2) {
                            dialog.render({text:locale.get({lang:"defaultpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                             error = true;
                            return error;
                        }
                     }

                   }
                }
        },
        checkSpecificPolicyTime:function(obj,index,m){
                               //特定策略
            var self = this;
            var error = false;
            if(index == "0"){
                  var adssolt=locale.get({lang:"home_page"});
                }else if (index == "1"){
                  var adssolt=locale.get({lang:"home_sub_ad"})+" "+(m+1);
                                
                }else {
                 var adssolt=locale.get({lang:"sales_sub_ad"})+" "+(m+1);
             }
            if(obj){
                 for (var i = 0; i < obj.length; i++) {
                     var startDateTemp = obj[i].startTime.split(" ");   
                     var endDateTemp = obj[i].endTime.split(" "); 
                     var reg = new RegExp(':','g');
                     var  dateStart1 = new Date( startDateTemp[0].replace(reg,"/")+" "+startDateTemp[1]);
                     var  dateEnd1 = new Date( endDateTemp[0].replace(reg,"/")+" "+endDateTemp[1]);
                     if (self.checkTime(dateStart1,dateEnd1)) {
                         return true;
                     }
                    
                    for (var j = 0;j < obj.length;j ++) {
                       var startDateTemp = obj[j].startTime.split(" ");   
                       var endDateTemp = obj[j].endTime.split(" "); 
              
                       var  dateStart2 = new Date( startDateTemp[0].replace(reg,"/")+" "+startDateTemp[1]);
                       var  dateEnd2 = new Date( endDateTemp[0].replace(reg,"/")+" "+endDateTemp[1]);
      
                        if (i!=j&&dateStart1<=dateStart2&&dateStart2<=dateEnd1) {
                            dialog.render({text:locale.get({lang:"specificpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                            error = true;
                            return error;
                        }
                        if(i!=j&&dateStart1<=dateEnd2&&dateEnd2<=dateEnd1){
                            dialog.render({text:locale.get({lang:"specificpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                            error = true;
                            return error;
                        }
                        if (i!=j&&dateStart1>=dateStart2&&dateEnd1<=dateEnd2) {
                            dialog.render({text:locale.get({lang:"specificpolicy_playtime_duplicated"}).replace("{0}", adssolt)});
                            error = true;
                            return error;
                        }
                    }

                }
            }
        },

        //首页子广告位
        editHomeChildAds:function(){
        	var self = this;
            
            $(".adver-header").hide();
            $("#adver_content").hide();
            $("#addAds").click(function() {
                $(".adheader").css({
                        "border-bottom": '1px solid #ddd'
                });
                $("#home_"+self.showhomecount).show();
                $("#adver_content").show();
              if ( self.showhomecount=="0") {
                    self.renderAdsPlicy("home_0policyInfo1");
                }
                self.showhomecount++;
                
                
            });
            $("#addAds").val(locale.get({lang: "add_childAds"}));
            $("#adver_content").empty();
            var home_0="   <div style='overflow: auto;' id='home_0_adver_content' class='homesub'>"+
                             "<table width='100%;'>"+
                              "<tr>" +
                                  "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                   "<td><input type='button' class='btn btn-primary submit addpolicy' id='home_0_addpolicy' /></td>"+
                                " </tr>"+
                               "</table>"+
                               "<div style='width: 100%;;overflow: auto;' id='home_0policyInfo1' class='policyInfo'>" +
                              "</div>"  +
                          "</div>" ;
             $("#adver_content").append(home_0);
             $(".addpolicy").val(locale.get({lang: "add_menu"}));
             $("#home_0_addpolicy").unbind("click").click(function() {
                   var policy = {};
                   var tableObj =   $("#home_0policyInfo1").children(".policy").children('table').eq(0).find('tbody')[0];
                   if(tableObj && tableObj.rows.length >0 ){
                      for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                     
                             }
                       }
                    }
                   if (policy.type=="2") {
                    dialog.render({lang:"can_not_add_policy"});
                    return;
                   }else {
                     var index = $(this).parent().parent().parent().parent().parent().parent().find($("#home_0policyInfo1")).attr("id");
                     self.addAdsPlicy(index);
                    
                  }
              });
             
            $("#home_adver_header li").unbind("click").click(function(event) {
                 //$("#adver_content").empty();
                $(".adver-header-box li").removeClass('active');
               var id = $(this).attr("id");
               $(this).addClass('active');
               $(".homesub").hide();
                var html="   <div style='overflow: auto;' id='"+id+"_adver_content'    class='homesub'>"+
                             "<table width='100%'>"+
                              "<tr>" +
                                  "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                   "<td><input type='button' class='btn btn-primary submit addpolicy' id='"+id+"_addpolicy' /></td>"+
                                " </tr>"+
                               "</table>"+
                               "<div style='width: 100%;;overflow: auto;' id='"+id+"policyInfo1' class='policyInfo'>" +
                              "</div>"  +
                          "</div>" ;
                if ($(".homesub").size()>0) {
                    var idshow = false;
                    $(".homesub").each(function() {
                        var adverid =  $(this).attr("id");
                        if (adverid==(""+id+"_adver_content")) {
                            idshow = true;
                            $("#"+id+"_adver_content").show();
                        }
                    });
                    if (!idshow) {
                         $("#adver_content").append(html);
                         self.renderAdsPlicy(id+"policyInfo1");
                    
                    }
                }else {
                      $("#adver_content").append(html);
                      self.renderAdsPlicy(id+"policyInfo1");
                      
                }  
               $("#"+id+"_addpolicy").unbind("click").click(function() {

                   var policy = {};
                   var tableObj =   $("#"+id+"policyInfo1").children(".policy").children('table').eq(0).find('tbody')[0];
                   if(tableObj && tableObj.rows.length >0 ){
                      for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                     
                             }
                       }
                    }
                   if (policy.type=="2") {
                    dialog.render({lang:"can_not_add_policy"});
                    return;
                   }else {
                    var index = $(this).parent().parent().parent().parent().parent().parent().find($("#"+id+"policyInfo1")).attr("id");;
                    self.addAdsPlicy(index);
                  }
              });
              $(".addpolicy").val(locale.get({lang: "add_menu"}));
            });
           
           //  $("#home_adver_header li").eq(0).click();

        	
        },
        //销售广告位
        editSaleChildAds:function(){
            var self = this;
            $(".adver-header").hide();
            $("#svm_content").hide();
            $("#addSvmAds").click(function() {
                $(".adheader").css({
                        "border-bottom": '1px solid #ddd'
                });
                $("#svm_"+self.showsvmcount).show();
                $("#svm_content").show();
               if ( self.showsvmcount=="0") {
                   self.renderAdsPlicy("svm_0policyInfo1");
                }
                
                self.showsvmcount++;

            });
            $("#addSvmAds").val(locale.get({lang: "add_childAds"}));
            $("#svm_content").empty();
            var svm_0="   <div style='overflow: auto;' id='svm_0_adver_content' class='svmsub'>"+
                             "<table width='100%;'>"+
                              "<tr>" +
                                  "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                   "<td><input type='button' class='btn btn-primary submit addpolicy' id='svm_0_addpolicy' /></td>"+
                                " </tr>"+
                               "</table>"+
                               "<div style='width: 100%;;overflow: auto;' id='svm_0policyInfo1' class='policyInfo'>" +
                              "</div>"  +
                          "</div>" ;
            $("#svm_content").append(svm_0);
            $(".addpolicy").val(locale.get({lang: "add_menu"}));
             $("#svm_0_addpolicy").unbind("click").click(function() {
                   var policy = {};
                   var tableObj =   $("#svm_0policyInfo1").children(".policy").children('table').eq(0).find('tbody')[0];
                   if(tableObj && tableObj.rows.length >0 ){
                      for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                     
                             }
                       }
                    }
                   if (policy.type=="2") {
                      dialog.render({lang:"can_not_add_policy"});
                      return;
                   }else {
                      var index = $(this).parent().parent().parent().parent().parent().parent().find($(" #svm_0policyInfo1")).attr("id");;
                      self.addAdsPlicy(index);
                    }
              });
            
            $("#svm_adver_header li").unbind("click").click(function(event) {
                 //$("#adver_content").empty();
                $(".svm-header-box li").removeClass('active');
               var id = $(this).attr("id");
               $(this).addClass('active');
               $(".svmsub").hide();
                var html="   <div style='overflow: auto;' id='"+id+"_adver_content'    class='svmsub'>"+
                             "<table width='100%'>"+
                              "<tr>" +
                                  "<td width='12%'><label style='color:red;'></label><label><span lang='text:addpolicy'>"+locale.get({lang:"addpolicy"})+"</span></label></td>"+
                                   "<td><input type='button' class='btn btn-primary submit addpolicy' id='"+id+"_addpolicy' /></td>"+
                                " </tr>"+
                               "</table>"+
                               "<div style='width: 100%;;overflow: auto;' id='"+id+"policyInfo1' class='policyInfo'>" +
                              "</div>"  +
                          "</div>" ;
                if ($(".svmsub").size()>0) {
                    var idshow = false;
                    $(".svmsub").each(function() {
                        var adverid =  $(this).attr("id");
                        if (adverid==(""+id+"_adver_content")) {
                            idshow = true;
                            $("#"+id+"_adver_content").show();
                        }
                    });
                    if (!idshow) {
                         $("#svm_content").append(html);
                          self.renderAdsPlicy(id+"policyInfo1"); 
                    }
                }else {
                      $("#svm_content").append(html);
                     self.renderAdsPlicy(id+"policyInfo1");  
                }  
               $("#"+id+"_addpolicy").unbind("click").click(function() {
                   var policy = {};
                   var tableObj =   $("#"+id+"policyInfo1").children(".policy").children('table').eq(0).find('tbody')[0];
                   if(tableObj && tableObj.rows.length >0 ){
                      for(var i=0;i<tableObj.rows.length;i++){//行
                            for(var j=0;j<tableObj.rows[i].cells.length-1;j++){//列   
                                policy.type = tableObj.rows[i].cells[1].children[0].value;
                     
                             }
                       }
                    }
                   if (policy.type=="2") {
                      dialog.render({lang:"can_not_add_policy"});
                      return;
                   }else {
                     var index = $(this).parent().parent().parent().parent().parent().parent().find($("#"+id+"policyInfo1")).attr("id");;
                    self.addAdsPlicy(index);
                    }
              });
              $(".addpolicy").val(locale.get({lang: "add_menu"}));
            });

        },
        //素材总览
        addmaterial:function(){
        	var self = this;
            $("#material"+self.policyCount).click(function(){
            	var index = $(this).parent().parent().parent().find('tbody').attr('id');
            	
        		if (this.uploadPro) {
                    this.uploadPro.destroy();
                }
                this.uploadPro = new UploadFile({
                    selector: "body",
                    events: {
                    	 "uploadSuccess":function(mediaId,mediaName,mediaType,md5,fileName,length,fileSource) {
                    		 typeArr=mediaType.split("_");
                    		 mediaType = typeArr[0];
                    		 if(mediaType == 1 || mediaType==3){
                    			 var src = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
                    		 }else if(mediaType == 2){//视频{
                    			 var src ="../applications/advertisement/adStatistics/PVUV_Statistics/img/play-button.jpg";
                    		 }
                    		 
                    		 var mediaTypeName ='';
                    		 if(mediaType == 1){//图片
                    			 mediaTypeName = locale.get({lang:"product_image"}); 
                    		 }else if(mediaType == 2){//视频
                    			 mediaTypeName = locale.get({lang:"material_video"}); 
                    		 }else if(mediaType == 3){//文本
                    			 mediaTypeName = locale.get({lang:"ad_txt"}); 
                    		 }
                    		if(mediaId ==null ||　mediaId == ""　){
                    			 $("#"+index).append("<tr id='"+mediaName+"'>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'>"
                  						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable' id='imgTd'>"
                  						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'></label>"
                  						+"</td>"
                  						+"<td class='channelTable'  style='display: none;'>"
                  						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
                  						+"</td>"
                  						+"<td class='channelTable'  style='display: none;'>"
                  						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
                  						+"</td>"
                  	/*					+"<td class='channelTable'>"
                 						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_startTime' />&nbsp;-&nbsp;" 
                 						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_endTime' />" 
                 						+"</td>"*/
                  						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
                  						+"</tr>");
                    		}else{
                    		 $("#"+index).append("<tr id='"+mediaName+"'>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+mediaName+":"+mediaId+"'  name='"+mediaName+":"+mediaId+"'>"+mediaName+"</label>"
             						+"</td>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+md5+":"+mediaType+"'  name='"+md5+":"+mediaType+"'>"+mediaTypeName+"</label>"
             						+"</td>"
             						+"<td class='channelTable'>"
             						+  "<label id='"+md5+":"+fileName+"'  name='"+md5+":"+fileName+"'>"+fileName+"</label>"
             						+"</td>"
             						+"<td class='channelTable' id='imgTd'>"
             						+  "<label id='"+md5+":"+mediaId+"' class='imgLable' name='"+md5+":"+mediaId+"'><img id='img_"+mediaId+"_"+self.count+"' src='" + src + "' style='width:40px;height:40px;cursor: pointer;'/></label>"
             						+"</td>"
             						+"<td class='channelTable'  style='display: none;'>"
             						+  "<label id='"+md5+":"+length+"'  name='"+md5+":"+length+"'>"+length+"</label>"
             						+"</td>"
             						+"<td class='channelTable'  style='display: none;'>"
             						+  "<label id='"+md5+":"+fileSource+"'  name='"+md5+":"+fileSource+"'>"+fileSource+"</label>"
             						+"</td>"
/*             						+"<td class='channelTable'>"
             						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_startTime' />&nbsp;-&nbsp;" 
             						+  "<input style='width:100px;text-align: center;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='"+mediaId+"_endTime' />" 
             						+"</td>"*/
             						+"<td class='channelTable'><span id='delete:"+mediaId+"' name='"+mediaId+"' class='delcls' style='cursor: pointer;'>"+locale.get({lang:"deleteText"})+"</span></td>"
             						+"</tr>");
                    		}
                    		
/*                    		
                    		 $("#"+mediaId+"_endTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000 + (1 * 24 * 60 * 

                    				60)), "yyyy/MM/dd")).datetimepicker({
                    									format:'Y/m/d',
                    									step:1,
                    									startDate:'-1970/01/08',
                    									timepicker: false,
                    									lang:locale.current() === 1 ? "en" : "ch"
                    		 });
                    		 $("#"+mediaId+"_startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime()) / 1000), 

                    				"yyyy/MM/dd")).datetimepicker({
                    									format:'Y/m/d',
                    									step:1,
                    									startDate:'-1970/01/08',
                    									timepicker: false,
                    									lang:locale.current() === 1 ? "en" : "ch"
                    		 });*/
                    		
                    		 if(mediaType == 3){//文本
                    			 $("#img_"+mediaId+"_"+self.count).hide();
                    		 }
                    		 if(mediaType == 1){//图片
 			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
 		    					 $("#img_"+mediaId+"_"+self.count).bind('click',{src:src2},function(e){
 		    						 
 			        			 var bh = $("body").height(); 
     			        		 var bw = $("body").width(); 
 			        			 $("#fullbg").css({ 
 				        			height:"425px", 
 	     			        		width:"100%", 
 	    			        		display:"block" 
 	    			        		}); 
 			        			 $("#img_preview").attr("src",e.data.src);
     			        		 $("#img_preview").show();
 		    					  });
 			        		 }else if(mediaType == 2){//视频
 			        			 var src2 = cloud.config.FILE_SERVER_URL + "/api/file/" + mediaId + "?access_token=" + cloud.Ajax.getAccessToken();
 		    					 $("#img_"+mediaId+"_"+self.count).bind('click',{src:src2},function(e){
 		    						
 			        			 var bh = $("body").height(); 
     			        		 var bw = $("body").width(); 
 			        			 $("#checkimg").css({ 
 				        			height:"460px", 
 	     			        		width:"100%", 
 	    			        		display:"block" 
 	    			        		}); 
 			        			 $("#vi_preview").attr("src",e.data.src);
     			        		 $("#vi_preview").show();
 		    					  });
 	                		 }
                    		 $(".delcls").bind('click',{mediaName:mediaName},function(e) {
     					    	
                     			 $(this).parent().parent().remove();
                     			 //media.remove(); 
                     			 //$("#"+mediaName).remove();
                 			 });
                    		 self.count ++;
                    	 }
                    }
                });
        	});
        },
        renderDeviceList:function(){
        	 var self = this;
             this.deviceList = new DeviceList({
                 selector: "#list",
                 adWindow: self.adWindow,
                 deviceList:self.deviceArr,
                 events: {
                     "rendTableData": function() {
                         
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