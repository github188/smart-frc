define(function(require){
	var cloud = require("cloud/base/cloud");
	require("cloud/lib/plugin/jquery-ui");
	require("cloud/resources/css/jquery-ui.css");
	require("cloud/lib/plugin/jquery.datetimepicker");
	require("cloud/resources/css/jquery.multiselect.css");
    var Service = require("./service");
	var Button = require("cloud/components/button");
    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options){
            $super(options);
			this._render();
        },
        _render: function(){
        	this.draw();
        	this._renderBtn();
        	var language = locale._getStorageLang();
            if(language =='en'){
           	    this.renderVender_en();
            }else{
             	this.renderVender_zh_cn();
            }
        },
    	draw:function(){
    		  var self = this;
              var $htmls = $(+"<div></div>" +
              "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
              "<div style='float:left;'>"+
              "<select id='search'  name='search' style='width:131px;height: 28px;'>" +
              "<option value='0'>" + locale.get({lang: "template_name"}) + "</option>" +
              "<option value='1'>" + locale.get({lang: "model_manufacturer"}) + "</option>" +
              "<option value='2'>" + locale.get({lang: "template_model_name"}) + "</option>" +
              "</select>&nbsp;&nbsp;" +
              "</div>"+
              "<div style='float:left;'>"+
              "<input style='width:200px' type='text'  id='searchValue' />" +
              "</div>"+
              "<div style='float:left;'>"+
              "<select id='vender'  name='vender'  style='width:131px;height: 28px;margin-top: 0px;display:none;'>"+
              "</select>"+
              "</div>"+
              "</div>");
              this.element.append($htmls);
		},
		renderVender_en:function(){
			var self = this;
        	$("#vender").html("");
			$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
			Service.getVenderList("api",0,0,'',function(data) {
				if(data.result){
					for(var i=0;i<data.result.length;i++){
						$("#vender").append("<option value='" +data.result[i].name + "'>" +data.result[i].name+"</option>");
					}
				}
			});
		},
		renderVender_zh_cn:function(){
			$("#vender").html("");
        	var currentHost=window.location.hostname;
        	if(currentHost == "longyuniot.com"){
        		$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
        		$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            }else if(currentHost == "www.dfbs-vm.com"){
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            }else {
            	$("#vender").append("<option value='0'>" +locale.get({lang: "please_select"})+"</option>");
            	$("#vender").append("<option value='aucma'>"+locale.get({lang: "vender_name_aucma"})+"</option>");
            	$("#vender").append("<option value='fuji'>"+locale.get({lang: "vender_name_fuji"})+"</option>");
            	$("#vender").append("<option value='easy_touch'>"+locale.get({lang: "vender_name_easy_touch"})+"</option>");
            	$("#vender").append("<option value='junpeng'>"+locale.get({lang: "vender_name_junpeng"})+"</option>");
            	$("#vender").append("<option value='baixue'>"+locale.get({lang: "vender_name_baixue"})+"</option>");
            	$("#vender").append("<option value='leiyunfeng'>雷云峰</option>"); 
            }
		},
        _renderBtn: function(){
            var self = this;
            $("#search").bind('change',function(){
            	var search_value = $('#search option:selected').val();
            	if(search_value == 1){
            		$("#vender").css("display","block");
            		$("#searchValue").css("display","none");
            	}else{
            		$("#searchValue").css("display","block");
            		$("#vender").css("display","none");
            	}
            });
            //查询
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#search-bar"),
                events: {
                    click: function() {

                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();

                        self.fire("query", search, searchValue);
                    }
                }
            });
            $("#"+queryBtn.id).addClass("readClass");
            var addBtn = new Button({
                text: locale.get({lang:"add"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("add");
                    }
                }
            });
            var updateBtn = new Button({
                text: locale.get({lang:"modify"}),
                container: $("#search-bar"),
                events: {
                    click: function(){
                    	self.fire("update");
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
            /*var exportXMLBtn = new Button({
                text: locale.get({lang:"goods_export_xml"}),
                container: $("#search-bar"),
                events: {
					click:function(){
						self.fire("exReportXML");
					}
				}
            });*/
            if(permission.app("channelTemplate_manage").read){
            	if(queryBtn) queryBtn.show();
            }else{
            	if(queryBtn) queryBtn.hide();
            }
            if(permission.app("channelTemplate_manage").write){
            	if(addBtn) addBtn.show();
            	if(updateBtn) updateBtn.show();
            	if(deleteBtn) deleteBtn.show();
            }else{
            	if(addBtn) addBtn.hide();
            	if(updateBtn) updateBtn.hide();
            	if(deleteBtn) deleteBtn.hide();
            }
            $("#search-bar a").css({
                margin: "0px 0px 0px 6px"
            });
        }
        
    });
    
    return NoticeBar;
    
});
