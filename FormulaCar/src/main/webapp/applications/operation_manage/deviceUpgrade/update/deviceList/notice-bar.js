define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("../../../service");
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
                    self._renderGetData();
           	 }else{
           		 var searchData = {
           		 };
           	     Service.getAllLine(searchData,-1,0,function(datas){
           	    	    self._renderForm(datas);
                        self._renderGetData();
           	     });
           	 }
           });
        },
        _renderForm: function(lineData) {
            var self = this;
            var $htmls = $(+"<div></div>" +
                    "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                    "<div style='margin-left:5px;float:left;'>" +
                    "<select  id='userline'  multiple='multiple'  style='width:130px;height: 30px;'></select>&nbsp;&nbsp;" + //线路
                    "</div>" +
                    "<div style='float:left;'>" +
                    "<select id='search'  name='search' style='width:120px;height: 28px;'>" +
                    "<option value='0'>" + locale.get({lang: "automat_no1"}) + "</option>" +
                    "<option value='1'>" + locale.get({lang: "automat_site_name"}) + "</option>" +
                    "</select>&nbsp;&nbsp;" +
                    "</div>" +
                    "<div style='float:left;margin-left:5px;'>" +
                    "<input style='width:120px' type='text'  id='searchValue' />" +
                    "</div>" +
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
                    minWidth: 200,
                    height: 120
                });
            });
            if (lineData && lineData.result.length > 0) {
                for (var i = 0; i < lineData.result.length; i++) {
                    $("#userline").append("<option value='" + lineData.result[i]._id + "'>" + lineData.result[i].name + "</option>");
                }
            } 
                  
        },
        _renderGetData: function() {
            var self = this;
            self._renderBtn();
        },
        _renderBtn: function() {
            var self = this;
            var queryBtn = new Button({
                text: locale.get({lang: "query"}),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("query");
                    }
                }
            });
           
            $("#search-bar a").css({
                margin: "auto 0px auto 10px"
            });
        },
        destroy: function() {
            $("#search-bar").html("");
        }

    });

    return NoticeBar;

});

