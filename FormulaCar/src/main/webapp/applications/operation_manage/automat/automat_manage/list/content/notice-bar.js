define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
	var Button = require("cloud/components/button");
	var Service = require("../service");
	require("/");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderSelect();
        	this._renderGetData();
        },
    	draw:function(){
    		  var selectHtml1 = "&nbsp;&nbsp;&nbsp;&nbsp;<select id='automat-toolbar-package1' style='width:120px;height: 28px;'>";
              var data1 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"create_time"})},
                                    //{"optionsId":"1","optionsName":locale.get({lang:"automat_no_activate"})},
                                    {"optionsId":"1","optionsName":locale.get({lang:"activate_time"})},
                                    {"optionsId":"2","optionsName":locale.get({lang:"online"})},
                                    {"optionsId":"3","optionsName":locale.get({lang:"offline"})}
              					 ]};
              if(data1!=null&&data1.result!=null&&data1.result.length>0){
              	$.each(data1.result,function(n,item) {   
      				selectHtml1 = selectHtml1 + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
      			});
              }
              selectHtml1 = selectHtml1 + "</select>";
              
              var selectHtml2 = "<select id='automat-toolbar-package2' style='width:120px;height: 28px;'>";
              var data2 = {"result":[{"optionsId":"0","optionsName":locale.get({lang:"automat_site_name"})},
                                    {"optionsId":"1","optionsName":locale.get({lang:"automat_name"})},
                                    {"optionsId":"2","optionsName":locale.get({lang:"automat_of_group"})}
              					 ]};
              
              if(data2!=null&&data2.result!=null&&data2.result.length>0){
              	$.each(data2.result,function(n,item) {   
      				selectHtml2 = selectHtml2 + "<option value='" + item.optionsId + "' >" + item.optionsName + "</option>";
      			});
              }
              selectHtml2 = selectHtml2 + "</select>";
              
              var $htmls = $(
              "<div id='search-bar' style='width:auto;margin-bottom:4px;margin-left:0px;'>" +
              selectHtml1+
			  "&nbsp;&nbsp;<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_start_time"})+"</label>&nbsp;&nbsp;"+
			  "<input style='width:140px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='startTime' />&nbsp;&nbsp;"+
			  "<label class='notice-bar-calendar-text'>"+locale.get({lang:"automat_list_end_time"})+"</label>&nbsp;&nbsp;"+
			  "<input style='width:140px' class='notice-bar-calendar-input datepicker' type='text' readonly='readonly' id='endTime' />&nbsp;&nbsp;"+
			  selectHtml2+
			  "&nbsp;&nbsp;"+
              "<input style='width:140px' type='text'  id='search_input_name' />"  +
              "<br/>&nbsp;&nbsp;&nbsp;&nbsp;<span style='margin-top:10px'>"+locale.get({lang:"automat_area"}) +"&nbsp;&nbsp;</span>"+
              "<select id='devicecity'  name='city' style='width: 100px;height: 28px;margin-top:10px'>"+
                  "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
		       "</select>&nbsp;&nbsp;"+
		       "<select id='devicecode'  name='code' style='width: 100px;height: 28px;margin-top:10px'>"+
		           "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
		       "</select>"+
		       "<input type='hidden'  id='devicecitysValue' />"+
		       "<input type='hidden'  id='devicezonesValue' />"+
              "</div>"
              );
              
              
              this.element.append($htmls);
		},
		showAddView:function(){
			this.fire("click");
		},
		deleteAutomat:function(){
			this.fire("click","delete");
		},
		_renderSelect:function(){
			$(function(){
				$("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7)/1000),"yyyy/MM/dd") + " 00:00").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					startDate:'-1970/01/08',
					lang:locale.current() === 1 ? "en" : "ch"
				});
				$("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime()/1000),"yyyy/MM/dd") + " 23:59").datetimepicker({
					format:'Y/m/d H:i',
					step:1,
					lang:locale.current() === 1 ? "en" : "ch"
				});
				$("#startTime").val("");
				$("#endTime").val("");
			});
		},
		 _renderGetData:function(){
	        	var self = this;
	        	Service.getAreaInfo(0, 0,function(data) {
					var area={};
					if(data.result){
						for(var i=0;i<data.result.length;i++){
							$("#devicecity").append("<option value='" +data.result[i].code + "'>" +data.result[i].city+"</option>");
							area[data.result[i].code] = data.result[i].zone;
							if(i == data.result.length-1){
								self._renderBtn(area);
							}
						}
					}else{
						self._renderBtn(area);
					}
					
	        	});
	        },
        _renderBtn: function(area){
        	$("a[title=Search]").remove();
            $("a[title=Delete]").remove();
            $("a[title=Import]").remove();
            $("a[title=Add]").remove();
            var self = this;
            $("#devicecity").bind('change', function () {
            	$("#devicecode").empty();
            	$("#devicezonesValue").val('');
				var selectedId = $("#devicecity").find("option:selected").val();
				if(selectedId == "all"){
					$("#devicecode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
					 $("#devicecitysValue").val('');
				}else{
					 for(var item in area){  
					      if(item==selectedId){  
					           var value=area[item];
					           if(value){
					        	   $("#devicecode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
									for(var i=0;i<value.length;i++){
										$("#devicecode").append("<option value='" +value[i].code + "'>" +value[i].name+"</option>");
									}
								}
					      }  
					 }
					 $("#devicecitysValue").val(selectedId);
				}
				
				
            });
          
           $("#devicecode").bind('change', function () {
	        	var codeId = $("#devicecode").find("option:selected").val();
	        	if(codeId == "all"){
	        		$("#devicezonesValue").val('');
	        	}else{
	        		$("#devicezonesValue").val(codeId);
	        	}
	       });
           // $(".cloud-button").removeClass("cloud-button cloud-button-body cloud-button-text-only");
	        var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	var areaVal = $("#devicecitysValue").val() + "." + $("#devicezonesValue").val();
                        self.fire("query",areaVal);
                    }
                }
            });
	        var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({lang:"delete"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("del");
                    }
                }
            });
            var importBtn = new Button({
                 text: locale.get({lang:"import"}),
                 container: $("#search-bar"),
                 events: {
				    click:function(){
					   self.fire("imReport");
				     }
			     }
           });
            $("#search-bar a").css({
                margin: "auto 0px auto 10px"
            });
        },destroy:function(){
        	$("#search-bar").html("");
        }
        
    });
    
    return NoticeBar;
    
});

