define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("./service");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this.getSalses();
        	this._renderBtn();
        	this._renderSelect();
        	this._renderBillState();
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<table>"+
                "<tr>"+
                 "<td>"+
                   "<select id='reportType'  name='reportType' style='width:100px;height: 28px;'>" +
                    "<option value='0' selected = 'selected'>月账单</option>" +
                    "<option value='1'>年账单</option>" +
                   "</select>&nbsp;" +
                 "</td>"+
                 "<td>"+
                   "<input style='width:120px;' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='times_month'/>&nbsp;&nbsp;" +
                   "<select id='year'  name='year' style='width:120px;height: 28px;display:none;'>" +
                   "</select>" +
                 "</td>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_organization_name"})+" </label>" +
                   "<input style='width:100px;margin-right: -2px;' type='text'  id='organName' />"  +
                 "</td>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_salesman"})+" </label>" +
                   "<select id='salesman'  name='salesman' multiple='multiple' style='width:100px;height: 28px;'>" +
                   "</select>" +
                 "</td>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_no"})+" </label>" +
                   "<input style='width:100px;' type='text'  id='billNo' />"  +
                 "</td>"+
                 "<td>"+
                   "<label style='margin:auto 10px auto 10px;margin-right: 6px;'>"+locale.get({lang:"bill_state"})+" </label>" +
                   "<select id='state'  name='state' multiple='multiple' style='width:100px;height: 28px;'>" +
                   "</select>" +
                 "</td>"+
                 "<td>"+
                    "<div id='btn-bar'></div>"+
                 "</td>"+
                 "</tr>"+
              "</table>"+
              "</div>");
              this.element.append($htmls);
              
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#salesman").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: locale.get({lang: "bill_please_select_sales"}),
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 150,
	                    height: 120
	                });
	          });
              
              require(["cloud/lib/plugin/jquery.multiselect"], function() {
	                $("#state").multiselect({
	                    header: true,
	                    checkAllText: locale.get({lang: "check_all"}),
	                    uncheckAllText: locale.get({lang: "uncheck_all"}),
	                    noneSelectedText: locale.get({lang: "bill_please_select_billstate"}),
	                    selectedText: "# " + locale.get({lang: "is_selected"}),
	                    minWidth: 150,
	                    height: 120
	                });
	         });
              
              //处理年账单的年份
              var date = new Date();
              var year = date.getFullYear();
              var len = parseInt(year) - 2017;
              if(len == 0){
            	  $("#year").html("");
            	  $("#year").append(
                      "<option value='2017'>2017</option>"
                  );
              }else{
            	  $("#year").html("");
            	  var start = 2017;
            	  for(var i=0;i<len+1;i++){
            		  if(year == start){
            			  $("#year").append(
                                  "<option value='"+year+"'>"+year+"</option>"
                          );
            		  }else{
            			  $("#year").append(
                                  "<option value='"+start+"'>"+start+"</option>"
                          );
            			  start = start + 1;
            		  }
            	  }
              }
		},
		_renderBillState:function(){
			
			 $("#state").append(
                     "<option value='0'>"+locale.get({lang:"bill_not_paying"})+"</option>"
             );
			 $("#state").append(
                     "<option value='1'>"+locale.get({lang:"bill_paying"})+"</option>"
             );
			 
		},
		getSalses:function(){
			 var searchData = {
		     };
			 Service.getAllsales(searchData,10000,0,function(data){
				 
				 if(data.result.length>0){
					 for(var i=0;i<data.result.length;i++){
						 $("#salesman").append(
			                      "<option value='"+data.result[i]._id+"'>"+data.result[i].name+"</option>"
			              );
					 }
				 }
			 });
		},
	    _renderSelect: function() {
	    	 $(function() {
	    		 $("#times_month").val(cloud.util.dateFormat(new Date(((new Date()).getTime())/1000),"yyyy/MM")).datetimepicker({
	                    timepicker: false,
	                    format: 'Y/m',
	                    onShow: function() {
	                        $(".xdsoft_calendar").hide();
	                    },
	                    onChangeMonth: function(a, b) {
	                        var date = new Date(new Date(a).getTime() / 1000);
	                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
	                    },
	                    onClose: function(a, b) {
	                        var date = new Date(new Date(a).getTime() / 1000);
	                        b.val(cloud.util.dateFormat(date, "yyyy/MM"));
	                    },
	                    lang: locale.current() === 1 ? "en" : "ch"
	              });
	    		 var date  = new Date();
			     var months = date.getMonth();
			     var year=date.getFullYear(); 
			     if(months<10){
			    	 months = "0"+months;
			     }
			     var byMonth = year +"/"+months;
	    		 $("#times_month").val(byMonth);
	    	 });
	    	 
		},
        _renderBtn: function(){
            var self = this;
            $("#reportType").bind('change', function() {
            	 var selectedId = $("#reportType").find("option:selected").val();
                 if (selectedId == "0") {
                	 $('#times_month').css('display','inline');
                	 $('#year').css('display','none');
                 }else if(selectedId == "1"){
                	 $('#times_month').css('display','none');
                	 $('#year').css('display','inline');
                 }
            });
            //查询
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#btn-bar"),
                events: {
                    click: function(){
                        self.fire("query");
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            
            var seeBtn = new Button({
                text: locale.get({lang:"view"}),
                container: $("#btn-bar"),
                events: {
                    click: function(){
                        self.fire("see");
                    }
                }
            });
            $("#"+seeBtn.id).addClass("readClass");

            $("#search-bar a").css({
                margin: "-3px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
