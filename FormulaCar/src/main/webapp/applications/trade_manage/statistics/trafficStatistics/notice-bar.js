define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	
	var Button = require("cloud/components/button");
	var Service = require("../service");
	var NoticeBar = Class.create(cloud.Component, {
		   initialize: function($super, options){
	            $super(options);
	            this.Service = new Service();
				this._render();
	        },
	       _render: function(){
	    	   	this.draw();
	    	  // 	this.initTimeDiv();
	        	this._renderBtn();
	        	this.renderSelect();
	        	this.renderEvent();
		      //  $("#searchNo").append("<label id='trade_automatNo'>"+locale.get('traffic_automat_number')+"</label>"+
   				//	 "<input style='width:367px;margin-left: 5px;' type='text' id='assetId'/>&nbsp;&nbsp;");
	       // 	this.loadData();
	        },
	        draw: function() {
	            var self = this;
	            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
	            self.Service.getLinesByUserId(userId,function(linedata){
	            	 if(linedata && linedata.result){
	            		 self._renderForm(linedata);
	                  //   self._renderSelect();
	                    /// self._renderGetData();
	            	 }else{
	            		 var searchData = {
	            		 };
	            		 self.Service.getAllLine(searchData,-1,0,function(datas){
	            	    	 self._renderForm(datas);
	                     //    self._renderSelect();
	                        // self._renderGetData();
	            	     });
	            	 }
	            });
	        },
	        _renderForm:function(linedata){
	    		  var self = this;
		        	this.initTimeDiv();
		            var $htmls = $(+"<div></div>" +
		                      "<div id='line_div' style='margin-left:5px;float:left;'>" +
		                      "<select  id='userline'  multiple='multiple'  style='width:130px;height: 28px;'></select>&nbsp;&nbsp;" + //线路
		                      "</div>" +
		                      "<div style='float:left;'>" +
		                      "<select id='search'  name='search' style='width:129px;height: 28px;margin-left: -3px;'>" +
		                      "<option value='0'>" + locale.get({lang: "automat_no1"}) + "</option>" +
		                      "<option value='1'>" + locale.get({lang: "automat_site_name"}) + "</option>" +
		                      "<option value='2'>" + locale.get({lang: "automat_name"}) + "</option>" +
		                      "</select>&nbsp;&nbsp;" +
		                      "</div>" +
		                      "<div style='float:left;margin-left:5px;'>" +
		                      "<input style='width:120px; margin-left: -9px;' type='text'  id='searchValue' />" +
		                      "</div>");
		            //  this.element.append($htmls);
		              $("#searchNo").append($htmls);
		              require(["cloud/lib/plugin/jquery.multiselect"], function() {
		                  $("#userline").multiselect({
		                      header: true,
		                      checkAllText: locale.get({lang: "check_all"}),
		                      uncheckAllText: locale.get({lang: "uncheck_all"}),
		                      noneSelectedText: locale.get({lang: "automat_line"}),
		                      selectedText: "# " + locale.get({lang: "is_selected"}),
		                      minWidth: 180,
		                      height: 120
		                  });
		              });
	              if(linedata&&linedata.result.length>0){
	            	  for (var i = 0; i < linedata.result.length; i++) {
	            		  $("#userline").append("<option value='"+linedata.result[i]._id+"'>"+linedata.result[i].name+"</option>");
	            	  }
	              }
			},
			_renderBtn: function(){
	            var self = this;
	            //查询
	            var queryBtn = new Button({
	                text: locale.get({lang:"query"}),
	                container: $("#buttonDiv"),
	                events: {
	                	click: function(){
	                        self.fire("query");
	                    }
	   
	                }
	            });
	            $("#"+queryBtn.id).addClass("readClass");
			},
			
			loadData:function(){
				var myDate=new Date();
				var full = myDate.getFullYear(); 
				var month = myDate.getMonth() +1;
				var day = myDate.getDate();
				var date =  full+"/"+month+"/"+day;
				var startTime = (new Date(date+" 00:00:00")).getTime()/1000; 
				var endTime =(new Date(date+" 23:59:59")).getTime()/1000;
				this.initTrafficStatisticDayChart(startTime,endTime,null);
				
			},
			
			initTimeDiv:function(){
				$("#reportType").append("<option value='1' >"+locale.get({lang:"daily_chart"})+"</option>");
				$("#reportType").append("<option value='2' selected='selected'>"+locale.get({lang:"monthly_report"})+"</option>");
				$("#reportType").append("<option value='3'>"+locale.get({lang:"year_report"})+"</option>");
				
				$("#reportType").find("option[value='2']").attr("selected",true); 
				
				$("#summary_date").css("display","none");
				$("#summary_year").css("display","none");
			    $("#summary_date").val("");
	            $("#summary_year").val("");
	            
	            $("#summary_month").css("display","block");
	            $("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM"));
			},
			renderEvent:function(){
				var self = this;
				$("#reportType").bind('change', function () {
					var selectedId = $("#reportType").find("option:selected").val();
					if(selectedId == "1"){
						$("#summary_month").css("display","none");
						$("#summary_year").css("display","none");
						$("#summary_date").css("display","block");
						$("#summary_year").val("");
						$("#summary_month").val("");
						$("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd"));
					}else if(selectedId == "2"){
						$("#summary_date").css("display","none");
						$("#summary_year").css("display","none");
						$("#summary_month").css("display","block");
						$("#summary_date").val("");
						$("#summary_year").val("");
						$("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM"));
					}else if(selectedId == "3"){
						$("#summary_date").css("display","none");
						$("#summary_month").css("display","none");
						$("#summary_year").css("display","block");
						$("#summary_date").val("");
						$("#summary_month").val("");
					}
				});
			},
			renderSelect:function(){
				$(function(){
					$("#summary_date").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM/dd")).datetimepicker({
						format:'Y/m/d',
						step:1,
						startDate:'-1970/01/08',
						lang:locale.current() === 1 ? "en" : "ch",
						timepicker:false,
						onShow:function(){
							$(".xdsoft_calendar").show();
						},
						onChangeMonth:function(a,b){
							var date = new Date(new Date(a).getTime()/1000);
							b.val(cloud.util.dateFormat(date,"yyyy/MM/dd"));
						},
						onClose:function(a,b){
							var date = new Date(new Date(a).getTime()/1000);
							b.val(cloud.util.dateFormat(date,"yyyy/MM/dd"));
						},
					})
					
					$("#summary_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM")).datetimepicker({
						timepicker:false,
						format:'Y/m',
						onShow:function(){
							$(".xdsoft_calendar").hide();
						},
						onChangeMonth:function(a,b){
							var date = new Date(new Date(a).getTime()/1000);
							b.val(cloud.util.dateFormat(date,"yyyy/MM"));
						},
						onClose:function(a,b){
							var date = new Date(new Date(a).getTime()/1000);
							b.val(cloud.util.dateFormat(date,"yyyy/MM"));
						},
						lang:locale.current() === 1 ? "en" : "ch"
					})
				});
			}
			
	 });
	
	  return NoticeBar;
});