/**
 * notice bar
 */
define(function(require){
	var cloud = require("cloud/base/cloud");
	var Button = require("cloud/components/button");
	var Service = require("../service");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this._renderSearchInput();
        	this._renderGetData();
        },
        _renderSearchInput:function(){
  		    var self = this;
            var $htmls = $(
                "<div id='search-bar1' style='width:auto;margin-top:4px;margin-bottom:4px;margin-left:13px;'>" +
                   "<span>"+locale.get({lang:"automat_area"}) +"&nbsp;&nbsp;</span>"+
                   "<select id='sitescity'  name='city' style='width:250px;border-radius: 4px;width: 100px;height: 32px;'>"+
                       "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
			       "</select>&nbsp;&nbsp;"+
			       "<select id='sitescode'  name='code' style='width:250px;border-radius: 4px;width: 100px;height: 32px;'>"+
			           "<option value='all'>"+locale.get({lang:"all"})+"</option>"+
			       "</select>"+
			       "<input type='hidden'  id='citysValue' />"+
			       "<input type='hidden'  id='zonesValue' />"+
                   "&nbsp;&nbsp;<input style='width:150px;' placeholder='"+locale.get({lang:"please_enter_site_name"})+"' type='text'  id='search-input' />"+
                   "<span id='search-bar'></span>"+
  		           "<span id='add-bar'></span>"+
			       "<span id='modify-bar'></span>"+
			       "<span id='delete-bar'></span>" +
			    "</div>");
               this.element.append($htmls);
		},
        _renderGetData:function(){
        	var self = this;
        	Service.getAreaInfo(0, 0,function(data) {
				var area={};
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#sitescity").append("<option value='" +data.result[i].code + "'>" +data.result[i].city+"</option>");
						area[data.result[i].code] = data.result[i].zone;
					}
				}
				self._renderBtn(area);
        	});
        },
        _renderBtn: function(area){
            var self = this;
            $("#sitescity").bind('change', function () {
            	$("#sitescode").empty();
            	$("#zonesValue").val('');
				var selectedId = $("#sitescity").find("option:selected").val();
				if(selectedId == "all"){
					$("#sitescode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
					 $("#citysValue").val("");
				}else{
					 for(var item in area){  
					      if(item==selectedId){  
					           var value=area[item];
					           if(value){
					        	   $("#sitescode").append("<option value='all'>" +locale.get({lang:"all"})+"</option>");
									for(var i=0;i<value.length;i++){
										$("#sitescode").append("<option value='" +value[i].code + "'>" +value[i].name+"</option>");
									}
								}
					      }  
					 }
					 $("#citysValue").val(selectedId);
				}
				 
            });
          
           $("#sitescode").bind('change', function () {
	        	var codeId = $("#sitescode").find("option:selected").val();
	        	if(codeId == "all"){
	        		$("#zonesValue").val('');
	        	}else{
	        		$("#zonesValue").val(codeId);
	        	}
	       });
           $(".cloud-button-text-only").remove();
            var queryBtn = new Button({
                text: locale.get({lang:"query"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	var areaVal = $("#citysValue").val() + "." + $("#zonesValue").val();
                    	self.fire("query",areaVal);
                    }
                }
            });
            var addBtn = new Button({
            	text: locale.get({lang:"add"}),
            	container: $("#add-bar"),
            	events: {
            		click: function(){
            			self.fire("addView");
            		}
            	}
            });
           /* if(this.modifyBtn){
            	this.addBtn.destroy();
            }
            this.addBtn = new Button({
            	text: locale.get({lang:"modify"}),
            	container: $("#modify-bar"),
            	events: {
            		click: function(){
            			self.fire("modifyView");
            		}
            	}
            });*/
            var deleteBtn = new Button({
            	text: locale.get({lang:"delete"}),
            	container: $("#delete-bar"),
            	events: {
            		click: function(){
            			self.fire("delete");
            		}
            	}
            });
            $("#search-bar a").css({
                margin: "auto 10px auto 10px",
                "line-height":"25px"
            });
            $("#add-bar a").css({
            	margin: "auto 10px auto 10px",
            	"line-height":"25px"
            });
            $("#modify-bar a").css({
            	margin: "auto 10px auto 10px",
            	"line-height":"25px"
            });
            $("#delete-bar a").css({
            	margin: "auto 10px auto 10px",
            	"line-height":"25px"
            });
        }  
    });
    
    return NoticeBar;
    
});
