define(function(require) {
    require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/lib/plugin/jquery.watermark");
    require("cloud/lib/plugin/jquery.qtip");
    require("cloud/lib/plugin/jquery.layout");
    var Box = require("./notice/alarm/table/box");
    var service = require("./notice/alarm/table/service");
    var appConfig = require("./appConfig");
    var billTipWin = require("./billTip-Win");
    cloud.Ajax.checkLogin();
    var Platform = Class.create({
        initialize: function() {
            this.navs = [];
            this.render();
            this._getUserInfo();
            this._openUserInfoEvents();
        },
        render: function() {
            var self = this;
            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
            var appConfig = cloud.appModules.modules;
            var config = {};


            cloud.Ajax.request({
                url: "api/organization/" + oid,
                type: "get",
                parameters: {
                    verbose: 100
                },
                success: function(data) {
                    var flag = false; //判断机构账号是否在有效期内 true是停用
                    var validTime = "";
                    var time = (new Date()).getTime() / 1000;
                    if (data.result.validTime) {
                        validTime = data.result.validTime; //账号有效期
                        if (time > data.result.validTime) {
                            flag = true;
                        }
                    }

                    if (appConfig && appConfig.length > 0) {
                        var nomal_appConfig = [];
                        for (var i = 0; i < appConfig.length; i++) {
                            if (oid == '0000000000000000000abcde') {
                                if (appConfig[i].id == 'smartvm-admin' || appConfig[i].id == 'client-admin' || appConfig[i].id == 'common-admin' || appConfig[i].id == 'more-admin') {
                                    nomal_appConfig.push(appConfig[i]);
                                }
                            } else {
                                if (flag) { //账号停用
                                    if (appConfig[i].id == 'smartvm-system_vm') {
                                        nomal_appConfig.push(appConfig[i]);
                                    }
                                } else {
                                    if (appConfig[i].id == 'smartvm-admin' || appConfig[i].id == 'client-admin' || appConfig[i].id == 'common-admin' || appConfig[i].id == 'more-admin') {} else {
                                        nomal_appConfig.push(appConfig[i]);
                                    }
                                }

                            }

                        }
                        var appModules = nomal_appConfig;
                        config.modules = appModules;

                        self.loadMenu(config, flag);

                        // self.renderUnPayOrder(validTime); //判断该机构是否有未付款的账单  账单缴费提醒
                    }

                }
            });
        },
        renderUnPayOrder: function(validTime) {
            var state = [0];
            var organName = $("#user-panel-oidName").val();
            var date = new Date();
            var byYear = date.getFullYear();
            var startTime = (new Date(byYear + "/01/01" + " 00:00:00")).getTime() / 1000;
            var endTime = (new Date(byYear + "/12/31" + " 23:59:59")).getTime() / 1000;

            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
            cloud.Ajax.request({
                url: "api/organization/" + oid,
                type: "get",
                parameters: {
                    verbose: 100
                },
                success: function(datas) {
                    var searchData = {
                        org: datas.result.name,
                        state: state,
                        limit: 100,
                        cursor: 0
                    };
                    if (datas.payStyle == 1) { //后付费
                        searchData.startTime = startTime;
                        searchData.endTime = endTime;
                    }

                    //未付账单提示
                    cloud.Ajax.request({
                        url: "api/bill/list",
                        type: "GET",
                        parameters: searchData,
                        success: function(data) {
                            if (data.result && data.result.length > 0) {
                                var unpayCount = data.result.length;

                                $("#system_vm_one_c").after(
                                    "<div style='color: rgba(255, 159, 0, 0.99);margin-left: 35px;margin-top: -35px;font-size: 14px;'>" + unpayCount + "</div>"
                                );

                                var zhangdText = $("#billManage_two").children("a").children("span").html();
                                $("#billManage_two").children("a").children("span").html(zhangdText + "<label style='color: rgba(255, 159, 0, 0.99);display: inline;margin-left: 5px;'>" + unpayCount + "</label>");

                                var text = $("#unpay_bill_manage_three").children("a").children("span").html();
                                $("#unpay_bill_manage_three").children("a").children("span").html(text + "<label style='color: rgba(255, 159, 0, 0.99);display: inline;margin-left: 5px;'>" + unpayCount + "</label>");


                                var tip = document.cookie.split(";")[0].split("=")[1];
                                if (tip == 1) {

                                } else {
                                    //弹出框提示
                                    if (this.billTip) {
                                        this.billTip.destroy();
                                    }
                                    this.billTip = new billTipWin({
                                        selector: "body",
                                        unpayCount: unpayCount,
                                        validTime: validTime
                                    });
                                }
                            }
                        }
                    });
                }
            });

        },
        loadMenu: function(config, flag) {
            var self = this;
            var appModules = config;

            appModules.modules.each(function(m) {
                if (m.subNavs[0].defaultShow) {
                    self.navs.push(m);
                }
            });
            var loadArray = [];
            for (var index = 0; index < self.navs.length; index++) {
                var one = self.navs[index];
                if (one.subNavs && one.subNavs.length > 0) {
                    if (one.subNavs[0].subModule && one.subNavs[0].subModule.length > 0) { //有二级菜单
                        var $htmls_two = '';
                        one.subNavs[0].subModule.each(function(two_child) {
                            if (two_child.subApp && two_child.subApp.length > 0) { //有三级菜单 class='parent'
                                if (two_child.defaultShow) {
                                    var threeHtml = '';
                                    threeHtml += "<li id='" + two_child.name + "_two' class='twoHasThree'><a href='#' class='parent'><span style='font-size: 14px;'>" + locale.get({
                                        lang: two_child.name
                                    }) + "</span></a><ul id='" + two_child.name + "'>";
                                    var flag = false;
                                    two_child.subApp.each(function(three_child) {
                                        if (three_child.defaultShow && permission.app(three_child.name).show) {

                                            threeHtml += "<li id='" + three_child.name + "_three' class='loadApp'><a href='#'><span style='font-size: 14px;'>" + locale.get({
                                                lang: three_child.name
                                            }) + "</span></a></li>";

                                            var obj = {
                                                loadObj: three_child,
                                                id: three_child.name + "_three"
                                            };
                                            loadArray.push(obj);
                                            flag = true;
                                        }
                                    });
                                    threeHtml += "</ul></li>";
                                    if (flag) {
                                        $htmls_two += threeHtml;
                                    }
                                }

                            } else {
                                if (two_child.defaultShow && permission.app(two_child.name).show) {
                                    $htmls_two += "<li id='" + two_child.name + "_two'  class='loadApp'><a href='#'><span style='font-size: 14px;' class='twoChild'>" + locale.get({
                                        lang: two_child.name
                                    }) + "</span></a></li>";
                                    var obj = {
                                        loadObj: two_child,
                                        id: two_child.name + "_two"
                                    };
                                    loadArray.push(obj);

                                }

                            }
                        });
                        if ($htmls_two) {

                            $("ul.menu").append("<li id='" + one.name + "_one' class='oneMenu'>" +
                                "<a href='#' class='parent'><span style='font-size: 16px;' id='" + one.name + "_one_c' class='childColor'>" + locale.get({
                                    lang: one.name
                                }) + "</span></a>" +
                                "<ul id='" + one.name + "'></ul>" +
                                "</li>");

                            $("#" + one.name).append($htmls_two);
                        }


                    } else { //没有二级菜单  首页
                        var $htmls = "<li id='" + one.name + "_one' class='oneMenu'><a href='#'><span style='font-size: 16px;' id='" + one.name + "_one_c' class='childColor'>" + locale.get({
                            lang: one.name
                        }) + "</span></a></li>";

                        if (one.subNavs[0].defaultShow && permission.app(one.subNavs[0].name).show) {
                            $("ul.menu").append($htmls);
                            if (one.subNavs[0].url) {
                                $("#monitor_one").css("border-bottom", "2px solid #09c");
                                this.loadApplication(one.subNavs[0]);
                                var homeObj = one.subNavs[0];
                                $("#monitor_one").click(function() {
                                    $("#monitor_one").css("border-bottom", "2px solid #09c");
                                    $(".oneMenu").removeClass("current");
                                    $("#monitor_one").addClass("current");
                                    self.loadApplication(homeObj);
                                });
                            }
                        }
                    }
                }
            }

            if (flag) { //账号停用
                $("#permission_assignment_two").css("display", "none");
                $("#payment_allocation_two").css("display", "none");
                $("#parameter_config_two").css("display", "none");
                $("#secure_login_two").css("display", "none");
                $("#operation_log_two").css("display", "none");
                $("#help_document_two").css("display", "none");
                $("#update_desc_two").css("display", "none");

                var obj = {
                    name: "unpay_bill_manage",
                    order: 0,
                    defaultOpen: true,
                    defaultShow: true,
                    url: "./bill_manage/unpay/unpayOrderMain.js"
                };
                self.loadApplication(obj);
            }

            $('.loadApp').hover(function() {
                $("#" + $(this)[0].id).css("background-color", "#00a2ca");
            }, function() {
                $("#" + $(this)[0].id).css("background-color", "");
            });

            $('.twoHasThree').hover(function() {
                /* var childId = $("#"+$(this)[0].id).children('ul')[0].id;
                       var marginTop = -$("#"+$(this)[0].id).offset().top;
                       
                       if($("#"+$(this)[0].id).offset().top>45){
                         $("#"+childId).css("margin-top", marginTop+12);
                       }else{
                         $("#"+childId).css("margin-top", marginTop);
                       }
                       
                      //resources/css/default.css line180
                      
                       $("#"+childId).css("margin-right", "0px");
                       $("#"+childId).css("margin-bottom", "0px");
                       $("#"+childId).css("margin-left", "163px");*/

                /* var len = $("#"+childId).children('li').length-1;
                     $("#"+$("#"+childId).children('li')[0].id).css("margin-top","12px");
                     $("#"+$("#"+childId).children('li')[len].id).css("margin-bottom","12px");
                         
                       var childH = $("#"+childId).height();
                       var pH = $("#"+$(this)[0].id).parent().height();
                       if(childH < pH || childH == pH){
                         if(childId == "settlement"){
                           $("#"+childId).css("height", pH+30);
                         }else if(childId == "permission_assignment"){
                         }else{
                           if($("#"+childId).children('li').length >2){
                               $("#"+childId).css("height", pH);
                               }else{
                               $("#"+childId).css("height", pH-20);
                               }
                         }
                        
                       }else{
                           $("#"+childId).css("height", childH);
                       }*/

                $("#" + $(this)[0].id).css("background-color", "#00a2ca");
            }, function() {
                $("#" + $(this)[0].id).css("background-color", "");
            });

            $('.oneMenu').hover(function() {
                var el = document.getElementsByClassName('oneMenu current');
                $("#" + el[0].id).css("border-bottom", "0px");

                $("#" + $(this)[0].id).css("border-bottom", "2px solid #09c");
            }, function() {
                var el = document.getElementsByClassName('oneMenu current');
                $("#" + el[0].id).css("border-bottom", "2px solid #09c");

                $("#" + $(this)[0].id).css("border-bottom", "0px");
            });

            $('.menu').hover(function() {

            }, function() {
                var el = document.getElementsByClassName('oneMenu current');
                $("#" + el[0].id).css("border-bottom", "2px solid #09c");
            });

            $(".loadApp").click(function() {
                if (cloud.interval) {
                    clearInterval(cloud.interval);
                }
                cloud.style = "";

                if ($(this).parent().parent()[0].className == 'oneMenu') {
                    $(".oneMenu").removeClass("current");
                    $(".childColor").css("color", "white");
                    $("#" + $(this).parent().parent()[0].id).css("border-bottom", "2px solid #09c");
                    $("#" + $(this).parent().parent()[0].id).addClass("current");

                } else if ($(this).parent().parent().parent().parent()[0].className == 'oneMenu') {
                    $(".oneMenu").removeClass("current");
                    $(".childColor").css("color", "white");
                    $("#" + $(this).parent().parent().parent().parent()[0].id).css("border-bottom", "2px solid #09c");
                    $("#" + $(this).parent().parent().parent().parent()[0].id).addClass("current");
                }
                if (loadArray.length > 0) {
                    for (var i = 0; i < loadArray.length; i++) {
                        if ($(this)[0].id == loadArray[i].id) {
                            self.loadApplication(loadArray[i].loadObj);
                        }
                    }
                }

            });
            require(["./menu"], function(Account) { //设置默认打开页面
                $(".menu").children("li").first().addClass("current");
                var current = document.getElementsByClassName("current");
                var liId = '';
                var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                if (current[0]) {
                    $("#" + current[0].id).css("border-bottom", "2px solid #09c");
                    if (current[0].id && current[0].id == 'monitor_one') {
                        liId = 'monitor_one';
                    } else if (oid == '0000000000000000000abcde') {
                        liId = current[0].childNodes[1].childNodes[0].id;
                    } else {
                        liId = current[0].childNodes[1].childNodes[0].id;
                    }
                }


                for (var i = 0; i < loadArray.length; i++) {
                    if (liId == loadArray[i].id) {
                        self.loadApplication(loadArray[i].loadObj);
                    }
                }
            });
        },
        //加载具体应用的函数，这是核心方法
        loadApplication: function(application) {
            var msg = this.msgToSend;
            this.msgToSend = null;
            var appUrl = application.url;
            cloud.util.setCurrentApp(application);
            if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
                this.currentApplication.destroy();
                this.currentApplication = null;
            }
            if (appUrl.endsWith(".html")) {
                $("#user-content").load(appUrl);
                this.appNow = application;
                msg && this.sendMsg(application.name, msg);
            } else {
                cloud.util.mask("#user-content");
                this.requestingApplication = appUrl;
                require([appUrl], function(Application) {
                    //judge if the previous requesting application is canceled.
                    if (this.requestingApplication === appUrl) {
                        if (this.currentApplication && Object.isFunction(this.currentApplication.destroy)) {
                            this.currentApplication.destroy();
                            this.currentApplication = null;
                        }
                        $("#user-content").empty();
                        cloud.util.unmask("#user-content");
                        if (Application) {
                            this.currentApplication = new Application({
                                container: "#user-content"
                            });
                            this.appNow = application;
                            msg && this.sendMsg(application.name, msg);
                        }
                    } else {
                        console.log("app ignored: " + appUrl)
                    }
                }.bind(this));
            }
        },
        sendMsg: function(appName, msg) {
            cloud.message.post("cloud.platform.apps." + appName, "onLoad", msg);
        },
        _getUserInfo: function() {
            cloud.Ajax.request({
                url: "/api2/users/this",
                type: "GET",
                dataType: "json",
                parameters: {
                    verbose: 3
                },
                success: function(data) {
                    var result = data.result;
                    cloud.platform.loginedUser = {
                        "_id": result._id
                    };
                    if (result.name.length > 8) {
                        result.name = result.name.substr(0, 8) + "...";
                    }
                    $("#welcome").text(locale.get({
                        lang: "welcome"
                    }) + ",");
                    $("#nav-main-right-account-name").text(result.name);
                }
            });
        },
        _openUserInfoEvents: function() {
            var self = this;
            $("#nav-main-right-account-name").qtip({
                content: {
                    text: $("#nav-account-panel")
                },
                position: {
                    my: "top right",
                    at: "bottom middle",
                    of: "#nav-main-right-account-name"
                },
                show: {
                    event: "click"
                },
                hide: {
                    event: "click unfocus"
                },
                style: {
                    classes: "qtip-shadow cloud-qtip",
                    width: 318,
                    def: false
                },
                events: {
                    hide: function() {
                        self.account.initbuttonstatus();
                    },
                    show: function() {
                        self._renderAccount();
                    }
                }
            });
            var resizeTimer = null;

            function doResize() {
                self._setAccountPosition();
                $(window).resize(function() {
                    if (resizeTimer) {
                        clearTimeout(resizeTimer);
                    }
                    resizeTimer = setTimeout(function() {
                        doResize();
                    }, 300);
                });
            }
            doResize();
        },
        //展示用户信息面板
        _renderAccount: function() {
            var self = this;
            if (self.account) {
                self.account.destroy();
            }
            require(["./navigator/account"], function(Account) {
                self.account = new Account({
                    container: "#nav-account-panel"
                });
            });
        },
        //在页面上设置用户帐户信息的位置
        _setAccountPosition: function() {
            $("#nav-main-right").hide();
            var offsetWidth = parseFloat(document.body.offsetWidth);

            var left = Math.round((offsetWidth * 6) / 7);

            if (offsetWidth > 1030) {
                $("#nav-main-right").css({
                    left: offsetWidth - 200
                });
            } else {
                $("#nav-main-right").css({
                    left: 1030
                });
            }
            $("#nav-main-right").show();

        }
    });
    return Platform;
});