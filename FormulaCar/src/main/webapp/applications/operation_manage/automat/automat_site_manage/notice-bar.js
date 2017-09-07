define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    require("cloud/lib/plugin/jquery.datetimepicker");
    require("cloud/resources/css/jquery.multiselect.css");
    var Button = require("cloud/components/button");
    var Service = require("./service");
    // require("/");
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
            Service.getLinesByUserId(userId, function(linedata) {
                if (linedata && linedata.result) {
                    self._renderForm(linedata);
                    self._renderSelect();
                    self._renderGetData();
                } else {
                    var searchData = {};
                    Service.getAllLines(searchData, -1, 0, function(datas) {
                        self._renderForm(datas);
                        self._renderSelect();
                        self._renderGetData();
                    });
                }
            });
        },
        _renderForm: function(lineData) {
            var self = this;
            var $htmls = $(+"<div></div>" +
                            "<div id='search-bar' style='width:auto;margin-top:5px;margin-left:5px;'>" +
                                "<div style='float:left;'>" +
                                    "<select  id='lineIds'  multiple='multiple'  style='width:130px;height:28px;'></select>&nbsp;&nbsp;" + //线路
                                "</div>" +
                                "<div style='float:left;'>" +
                                    "<select id='search'  name='search' style='width:129px;height: 28px;'>" +
                                        "<option value='0'>" + locale.get({lang: "automat_site_no"}) + "</option>" +
                                        "<option value='1'>" + locale.get({lang: "automat_site_name"}) + "</option>" +
                                   "</select>&nbsp;&nbsp;" +
                                "</div>" +
                                "<div style='float:left;margin-left:5px;'>" +
                                    "<input style='width:120px;margin-left:-7px;' type='text'  id='searchValue' />" +
                                "</div>" +
                                "<div id='buttonDiv' style='float:left;'></div>" +
                            "</div>");

            this.element.append($htmls);
            require(["cloud/lib/plugin/jquery.multiselect"], function() {
                $("#lineIds").multiselect({
                    header: true,
                    checkAllText: locale.get({
                        lang: "check_all"
                    }),
                    uncheckAllText: locale.get({
                        lang: "uncheck_all"
                    }),
                    noneSelectedText: locale.get({
                        lang: "automat_line"
                    }),
                    selectedText: "# " + locale.get({
                        lang: "is_selected"
                    }),
                    minWidth: 200,
                    height: 120
                });
            });
            if (lineData && lineData.result.length > 0) {
                for (var i = 0; i < lineData.result.length; i++) {
                    $("#lineIds").append("<option value='" + lineData.result[i]._id + "'>" + lineData.result[i].name + "</option>");
                }
            }
        },
        _renderSelect: function() {
            $(function() {
                $("#startTime").val(cloud.util.dateFormat(new Date(((new Date()).getTime() - 1000 * 60 * 60 * 24 * 7) / 1000), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    startDate: '-1970/01/08',
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                $("#endTime").val(cloud.util.dateFormat(new Date((new Date()).getTime() / 1000), "yyyy/MM/dd")).datetimepicker({
                    format: 'Y/m/d',
                    step: 1,
                    lang: locale.current() === 1 ? "en" : "ch"
                });
                $("#startTime").val("");
                $("#endTime").val("");
            });
        },
        _renderGetData: function() {
            var self = this;
            self._renderBtn(null);
        },
        _renderBtn: function(area) {
            var self = this;

            var queryBtn = new Button({
                text: locale.get({
                    lang: "query"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("query", "");
                    }
                }
            });
            $("#" + queryBtn.id).addClass("readClass");

            var catBtn = new Button({
                text: locale.get({
                    lang: "price_see"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("see");
                    }
                }
            });
            $("#" + catBtn.id).addClass("readClass");


            var addBtn = new Button({
                text: locale.get({
                    lang: "add"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("add");
                    }
                }
            });
            var updateBtn = new Button({
                text: locale.get({
                    lang: "modify"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("update");
                    }
                }
            });
            var deleteBtn = new Button({
                text: locale.get({
                    lang: "delete"
                }),
                container: $("#buttonDiv"),
                events: {
                    click: function() {
                        self.fire("del");
                    }
                }
            });
            if (permission.app("site_manage").read) {
                if (queryBtn) queryBtn.show();
                if (catBtn) catBtn.show();
            } else {
                if (queryBtn) queryBtn.hide();
                if (catBtn) catBtn.hide();
            }
            if (permission.app("site_manage").write) {
                if (addBtn) addBtn.show();
                if (updateBtn) updateBtn.show();
                if (deleteBtn) deleteBtn.show();
            } else {
                if (addBtn) addBtn.hide();
                if (updateBtn) updateBtn.hide();
                if (deleteBtn) deleteBtn.hide();
            }
            $("#search-bar a").css({
                margin: "auto 0px auto 6px"
            });
            $("#buttonDiv a").show();
        },
        destroy: function() {
            $("#search-bar").html("");
        }

    });

    return NoticeBar;

});