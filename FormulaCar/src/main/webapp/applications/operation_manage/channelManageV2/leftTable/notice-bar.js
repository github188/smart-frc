define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("../service");

    var NoticeBar = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this._render();
        },
        _render: function() {
            this.drawV2();
        },
        drawV2: function() {
            var self = this;
            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            Service.getLinesByUserId(userId,function(linedata){
           	 if(linedata && linedata.result){
           		    self._renderForm(linedata);
                    self._renderBtn();
           	 }else{
           		 var searchData = {
           		 };
           	     Service.getAllLines(searchData,-1,0,function(datas){
           	    	    self._renderForm(datas);
                        self._renderBtn();
           	     });
           	 }
           });
        },
        _renderForm: function(lineData) {
            var self = this;
            var $htmls = $(+"<div></div>" +
                    "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                    "<div style='float:left;margin-left: 2px;'>" +
                    "<select id='search'  name='search' style='width:80px;height: 28px; margin-left: -3px;'>" +
                    "<option value='0'>" + locale.get({lang: "numbers"}) + "</option>" +
                    "<option value='1'>" + locale.get({lang: "organization"}) + "</option>" +
                    "<option value='2'>" + locale.get({lang: "automat_line"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;margin-left:8px;'>" +
                    "<input style='width:140px; margin-left: -9px;' type='text'  id='searchValue' />" +
                    "</div>" +
                    "<div style='float:left;display:none;' id='line'>"+
                    "<select id='userline'  name='userline' multiple='multiple  style='width:80px;height: 28px;margin-top: 0px;'>"+
                    "</select>"+
                    "</div>"+
                    "<div id='buttonDiv' style='float:left;'></div>" +
                    "</div>");

            this.element.append($htmls);
            
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#userline").multiselect({
                    header: true,
                    checkAllText: locale.get({lang: "check_all"}),
                    uncheckAllText: locale.get({lang: "uncheck_all"}),
                    noneSelectedText: locale.get({lang: "automat_line"}),
                    selectedText: "# " + locale.get({lang: "is_selected"}),
                    minWidth: 80,
                    height: 120
                });
                $("#line Button[type='button']").css("width","140px");
            });
            if (lineData && lineData.result.length > 0) {
                for (var i = 0; i < lineData.result.length; i++) {
                    $("#userline").append("<option value='" + lineData.result[i]._id + "'>" + lineData.result[i].name + "</option>");
                }
            }
            
            var shelf_manage_assetId = localStorage.getItem("shelf_manage_assetId");
            console.log(shelf_manage_assetId);
            if(shelf_manage_assetId){
            	assetId = shelf_manage_assetId;
                $("#searchValue").val(shelf_manage_assetId);
            }
        },
       
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderBtn: function() {
            var self = this;
            $("#search").bind('change',function(){
            	var search_value = $('#search option:selected').val();
            	if(search_value == 2){
            		$("#line").css("display","block");
            		$("#searchValue").css("display","none");
            	}else{
            		$("#searchValue").css("display","block");
            		$("#line").css("display","none");
            	}
            });
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                    	self.fire("query");
                    }
                }
            });

           
            $("#"+queryBtn.id).addClass("readClass");

            $("#search-bar a").css({
                margin: "auto 0px auto 6px"
            });

        },
        destroy: function() {
            $("#search-bar").html("");
        }
    });

    return NoticeBar;

});

