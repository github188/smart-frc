//兼容ie6的fixed代码 
//jQuery(function($j){
//	$j('#pop').positionFixed()
//})
(function($j){
    $j.positionFixed = function(el){
        $j(el).each(function(){
            new fixed(this)
        })
        return el;                  
    }
    $j.fn.positionFixed = function(){
        return $j.positionFixed(this)
    }
    var fixed = $j.positionFixed.impl = function(el){
        var o=this;
        o.sts={
            target : $j(el).css('position','fixed'),
            container : $j(window)
        }
        o.sts.currentCss = {
            top : o.sts.target.css('top'),              
            right : o.sts.target.css('right'),              
            bottom : o.sts.target.css('bottom'),                
            left : o.sts.target.css('left')             
        }
        if(!o.ie6)return;
        o.bindEvent();
    }
    $j.extend(fixed.prototype,{
        ie6 : $.browser.msie && $.browser.version < 7.0,
        bindEvent : function(){
            var o=this;
            o.sts.target.css('position','absolute')
            o.overRelative().initBasePos();
            o.sts.target.css(o.sts.basePos)
            o.sts.container.scroll(o.scrollEvent()).resize(o.resizeEvent());
            o.setPos();
        },
        overRelative : function(){
            var o=this;
            var relative = o.sts.target.parents().filter(function(){
                if($j(this).css('position')=='relative')return this;
            })
            if(relative.size()>0)relative.after(o.sts.target)
            return o;
        },
        initBasePos : function(){
            var o=this;
            o.sts.basePos = {
                top: o.sts.target.offset().top - (o.sts.currentCss.top=='auto'?o.sts.container.scrollTop():0),
                left: o.sts.target.offset().left - (o.sts.currentCss.left=='auto'?o.sts.container.scrollLeft():0)
            }
            return o;
        },
        setPos : function(){
            var o=this;
            o.sts.target.css({
                top: o.sts.container.scrollTop() + o.sts.basePos.top,
                left: o.sts.container.scrollLeft() + o.sts.basePos.left
            })
        },
        scrollEvent : function(){
            var o=this;
            return function(){
                o.setPos();
            }
        },
        resizeEvent : function(){
            var o=this;
            return function(){
                setTimeout(function(){
                    o.sts.target.css(o.sts.currentCss)      
                    o.initBasePos();
                    o.setPos()
                },1)    
            }           
        }
    })
})(jQuery)

jQuery(function($j){
	$j('#footer').positionFixed()
})

//pop右下角弹窗函数
function Pop(){
	//this.title=title;
	//this.url=url;
	//this.intro=intro;
	this.apearTime=1000;
	this.hideTime=500;
	this.delay=10000;
	this.soldMap = {};
	//添加信息
	this.addInfo();
	//全显示
	//this.showDiv();
	//关闭
    this.closeDiv();
    //隐藏
    this.hideDiv();
    //打开
    this.showSlideDiv();
}
Pop.prototype={
  addInfo:function(){
	 var self = this;

	 self.getData();
	 
	 var timer = setInterval(function(){

		 var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	     var roleType = permission.getInfo().roleType;
	     
		 cloud.Ajax.request({
   	      url:"api/smartUser/"+userId,
	    	  type : "GET",
	    	  success : function(data) {
	    		  
	    		  if(data && data.result || roleType == 51){
	    			  var areaid = "";
	    			  if(data && data.result && data.result.area){
	    				  areaid = data.result.area;
	    			  }else if(roleType != 51){
	    				  areaid = "000000000000000000000000";
	    			  }
	    			  
	    			  cloud.Ajax.request({
		   	    	      url:"api/automatline/list",
				    	  type : "GET",
				    	  parameters : {
				    		  areaId: areaid,
				    		  cursor:0,
				    		  limit:-1
		                  },
				    	  success : function(linedata) {
				    		  
				    		     var lineIds=[];
				                 if(linedata.result && linedata.result.length>0){
					    			  for(var i=0;i<linedata.result.length;i++){
					    				  lineIds.push(linedata.result[i]._id);
					    			  }
				                 }
				                 if(roleType != 51 && lineIds.length == 0){//赋值不存在线路id
					                    lineIds = ["000000000000000000000000"];
					             }
				                 if(roleType == 51){
				                	 lineIds = [];
				                 }
				                 var searchData = {};
				                 var currentHost=window.location.hostname;
				             	 if(currentHost == "longyuniot.com"){//澳柯玛longyuniot.com
				             		searchData.filter = 0;
				             	 }
				        	     searchData.limit = -1;
				        	     searchData.cursor = 0;
				        	     searchData.lineId = lineIds;
				        	     searchData.online = 0;
				        	     cloud.Ajax.request({
				        	         url: "api/automatv2/list_alarm",
				        	         type: "GET",
				        	         parameters: searchData,
				        	         success: function(data) {
				        	        	 
				        	         	self.operSalesData(data);
				        	             
				        	         }
				        	     });
				    	  }
	    			  });
	    		  }
	    	  }
        });	   		            
	   	//clearInterval(timer);
	 },60000);
    
  },
  getData:function(){
	  var self = this;
	  
	  require(["./platform","cloud/base/cloud","cloud/components/permission"], function(Platform,cloud,Permission) {
			 
			 $(function() {
					
					window.permission = new Permission({
						events:{
							afterLoad:function(){
								require([CONFIG.appConfig], function(appConfig){
									
									 var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
								     var roleType = permission.getInfo().roleType;
								     var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];

									 cloud.Ajax.request({
							   	      url:"api/smartUser/"+userId,
								    	  type : "GET",
								    	  success : function(data) {
								    		  
								    		  if(data && data.result || roleType == 51){
								    			  var areaid = "";
								    			  if(data && data.result && data.result.area){
								    				  areaid = data.result.area;
								    			  }else if(roleType != 51){
								    				  areaid = "000000000000000000000000";
								    			  }
								    			  
								    			  cloud.Ajax.request({
									   	    	      url:"api/automatline/list",
											    	  type : "GET",
											    	  parameters : {
											    		  areaId: areaid,
											    		  cursor:0,
											    		  limit:-1
									                  },
											    	  success : function(linedata) {
											    		  
											    		     var lineIds=[];
											                 if(linedata.result && linedata.result.length>0){
												    			  for(var i=0;i<linedata.result.length;i++){
												    				  lineIds.push(linedata.result[i]._id);
												    			  }
											                 }
											                 if(roleType != 51 && lineIds.length == 0){//赋值不存在线路id
												                    lineIds = ["000000000000000000000000"];
												             }
											                 if(roleType == 51){
											                	 lineIds = [];
											                 }
											                 var searchData = {};
											                 var currentHost=window.location.hostname;
											             	 if(currentHost == "longyuniot.com"){//澳柯玛longyuniot.com
											             		searchData.filter = 0;
											             	 }
											                 
											        	     searchData.limit = -1;
											        	     searchData.cursor = 0;
											        	     searchData.lineId = lineIds;
											        	     searchData.online = 0;
											        	     cloud.Ajax.request({
											        	         url: "api/automatv2/list_alarm",
											        	         type: "GET",
											        	         parameters: searchData,
											        	         success: function(data) {
											        	        	 
											        	         	self.operSalesData(data);
											        	             
											        	         }
											        	     });
											    	    }
								    			  });
								    		  }
								    	  }
							        });
									
								})
							}
						}				
					  
					});
					
				});		 

		 });  
	  
	  
	  
  },
  showDiv:function(time){
		if (!($.browser.msie && ($.browser.version == "6.0") && !$.support.style)) {
			
          $('#pop').slideDown(this.apearTime);//.delay(this.delay).fadeOut(400);;
	    } else{//调用jquery.fixed.js,解决ie6不能用fixed
	      $('#pop').show();
				jQuery(function($j){
				    $j('#pop').positionFixed()
				})
	    }
  },
  closeDiv:function(){
  	$("#popClose").click(function(){
  		  $('#pop').hide();
  		}
    );
  },
  hideDiv:function(){
	  $("#popHide").click(function(){
		  $('#sold_content').slideUp(this.apearTime);
  		}
    ); 
  },
  showSlideDiv:function(){
	  $("#popShow").click(function(){
		  $('#sold_content').slideDown(this.apearTime);
  		}
    ); 
  },
  operSalesData:function(data){
	  var self = this;
	  
	  var nMap = {};
	  $("#popUl").html("");
	  $("#popUlf").html("");
	  $("#popUlf").append("<dt style='font-weight:bold;border-bottom:1px solid #e7e7eb;line-height:30px;width: 240px;background-color:white;position: fixed;'><span >"+locale.get({lang: "numbers"})+"</span><span style='left:90px;position:absolute;'>"+locale.get({lang: "site"})+"</span><span style='left:150px;position:absolute;width: 5em;white-space: nowrap;text-overflow: ellipsis;-o-text-overflow: ellipsis;overflow: hidden;'>"+locale.get({lang: "automat_replenish_count"})+"</span></dt>");
	  
	  var fg = true;
	  var outflag = true;
	  var solddev = data.result.soldautomats;
	  var soldmap = data.result.soldmap;
	  var er = [];
	  for(var key in soldmap){//新缺货售货机
			
			if(!(key in self.soldMap)){
				fg = false;
				var ast = key.split("_")[0];
				if($.inArray(ast,er) == -1){
					er.push(ast);
				}
			}
			
	  }
	  
	  if(solddev.length > 0){//是否有缺货
			outflag = false;
			$("#salert").text(solddev.length);
	  }else{
		  $(".salert").css("display","none");
	  }

      var tempsold = [];
	  for(var i=0;i<solddev.length;i++){//新缺货售货机排前
		  
		   if($.inArray(solddev[i].assetId,er) > -1){
			     tempsold.push(solddev[i]);
				 solddev.splice(i,1);
				 i--;
		   }
		  
	  }

	  for(var j=0;j<solddev.length;j++){//未更改的缺货售货机
		  tempsold.push(solddev[j]);   
	  }

	  for(var n=0;n<tempsold.length;n++){
		  var color = "white";
		  if($.inArray(tempsold[n].assetId,er) > -1){
			  color = "rgb(204, 238, 193)";
		  }
		$("#popUl").append("<dd id='"+tempsold[n]._id+"' style='line-height:30px;border-bottom:1px solid #e7e7eb;width:240px;background-color:"+color+"'><span style='display:inline-block;width: 90px;'>" +
				tempsold[n].assetId+"</span><span style='display: inline-block;width: 100px;'>" +
				tempsold[n].siteName+"</span><span style='display: inline-block;width: 30px;color:red;text-align: center;'>" +
				tempsold[n].soldcount+"</span></dd>");
		  
		 $("#"+tempsold[n]._id).bind("click",{id:tempsold[n]._id,assetId:tempsold[n].assetId},function(e){
			 require(["./operation_manage/vendingMachine/seereplenish/seedevice-window"], function(SeeDevice) {
				 var automatIds = [];
				 automatIds.push(e.data.id);
				 this.seeDevice = new SeeDevice({
                   selector: "body",
                   deviceId: e.data.id,
                   automatNo:e.data.assetId,
                   deviceIdArr:automatIds,
                   events: {
                       
                   }
               });
			 
			 });
			 
		 });
	}
	self.soldMap = soldmap;
	var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
	
	if(oid != '0000000000000000000abcde'){
		
		$(".tds").css("display","block");
	}
	var tm = null;
	
	//点击元素之外的地方触发事件
	$(document).click(function(){
		$("#pop").hide();
	});
	$("#pop").click(function(event){
		event.stopPropagation();
	});
	
	if(!outflag && !fg){ 
		//全显示
		$(".tds").click(function(event){
			event.stopPropagation();//阻止冒泡
			$("#pop").show();
			if(tm != null){
				clearInterval(tm);
			}
			$(".salert").css("display","block");
		});
		var flag = 0;
	    tm = setInterval(function(){
	    	
			if(!flag){
				$(".salert").css("display","none");
				flag = 1;
			}else{
				$(".salert").css("display","block");
				flag = 0;
			}
	    },1000);
	}else if(!outflag){//有缺货，但与上次相比没有变化
		$(".tds").click(function(event){
			event.stopPropagation();//阻止冒泡
			$("#pop").show();
			if(tm != null){
				clearInterval(tm);
			}
			$(".salert").css("display","block");
		});
		//$('#sold_content').slideUp(this.apearTime);
	}else if(outflag){//没有缺货
		//$('#pop').hide();
		$(".tds").css("cursor","default");
		$("#salert").css("cursor","default");
		
	}
	
    
	
	
							

  }
}
