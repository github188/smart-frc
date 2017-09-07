function loadSub(modelName) {
    var dls = [];
    var appModules = cloud.appModules;
    var models = [];
    var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
    var adminName = ["oid_manage"];
    var appVer = ["appVersions_man"];
    var faultName = ["appVersions_down"];
    var oidUserName = ["permission_settings"];
    var adCan = ["appVersions_down"];
    var roleType = permission.getInfo().roleType;
    var domain = window.location.host;
    var ro = 0;
    if (domain == "mall.inhand.com.cn") {
        ro = 1;
    } else if (domain == "121.42.28.70") {
        ro = 1;
    }

    appModules.modules.each(function(m) {

        if (m.name == modelName) {
            if (m.subNavs[0].defaultShow) {
                if (m.subNavs[0].subModule && m.subNavs[0].subModule.length > 0) {
                    for (var i = 0; i < m.subNavs[0].subModule.length; i++) {

                        if ($.inArray(m.subNavs[0].subModule[i].name, faultName) != -1) {
                            //if(oid != '0000000000000000000abcde'){
                            models.push(m.subNavs[0].subModule[i]);
                            //}

                        } else if ($.inArray(m.subNavs[0].subModule[i].name, adminName) != -1) {
                            if (oid == '0000000000000000000abcde') {
                                models.push(m.subNavs[0].subModule[i]);
                            }

                        } else if ($.inArray(m.subNavs[0].subModule[i].name, appVer) != -1) {
                            if (oid == '0000000000000000000abcde' && ro == 1) {
                                models.push(m.subNavs[0].subModule[i]);
                            }

                        } else if ($.inArray(m.subNavs[0].subModule[i].name, oidUserName) != -1) {
                            if (oid != '0000000000000000000abcde' && roleType == 51) {
                                models.push(m.subNavs[0].subModule[i]);
                            }
                        } else {
                            if (oid != '0000000000000000000abcde') {
                                if (m.subNavs[0].subModule[i].defaultShow) {
                                    models.push(m.subNavs[0].subModule[i]);
                                }
                            }
                        }

                    }
                    //排序

                    var navsByOrder = [];
                    models.each(function(one) {
                        navsByOrder.push(one.order);
                    });
                    for (var i = 0; i < navsByOrder.length - 1; i++) {
                        for (var j = 0; j < navsByOrder.length - i - 1; j++) {
                            if (navsByOrder[j] > navsByOrder[j + 1]) {
                                var temp = navsByOrder[j + 1];
                                navsByOrder[j + 1] = navsByOrder[j];
                                navsByOrder[j] = temp;
                            }
                        }
                    };
                    for (var k = 0; k < navsByOrder.length; k++) {
                        models.each(function(one) {
                            if (one.order == navsByOrder[k]) {
                                navsByOrder[k] = one;
                            }
                        });
                    };
                    for (var i = 0; i < navsByOrder.length; i++) {
                        var dl = {};
                        dl.dt = navsByOrder[i].name;
                        dl.dd = [];
                        if (navsByOrder[i].subApp && navsByOrder[i].subApp.length > 0) {
                            //排序
                            var appsByOrder = [];
                            navsByOrder[i].subApp.each(function(one) {
                                appsByOrder.push(one.order);
                            });
                            for (var m = 0; m < appsByOrder.length - 1; m++) {
                                for (var j = 0; j < appsByOrder.length - m - 1; j++) {
                                    if (appsByOrder[j] > appsByOrder[j + 1]) {
                                        var temp = appsByOrder[j + 1];
                                        appsByOrder[j + 1] = appsByOrder[j];
                                        appsByOrder[j] = temp;
                                    }
                                }
                            };
                            for (var k = 0; k < appsByOrder.length; k++) {
                                navsByOrder[i].subApp.each(function(one) {
                                    if (one.order == appsByOrder[k]) {
                                        appsByOrder[k] = one;
                                    }
                                });
                            };
                            var defaultTrue = ["not_settle_management", "oid_list", "versions_man", "version_distribution", "versions_down_list", "role_manage", "versions_share_list"];
                            for (var m = 0; m < appsByOrder.length; m++) {

                                if ($.inArray(appsByOrder[m].name, defaultTrue) > -1) {
                                    var app = [];
                                    app.push(appsByOrder[m].name);
                                    if (appsByOrder[m].name == "versions_share_list") {
                                        if (oid == '0000000000000000000abcde') {
                                            app.push(true);
                                            dl.dd.push(app);
                                        }


                                    } else if (appsByOrder[m].name == "not_settle_management") {
                                        if (oid != '0000000000000000000abcde' && roleType == 51) {
                                            app.push(true);
                                            dl.dd.push(app);
                                        }


                                    } else {
                                        app.push(true);
                                        dl.dd.push(app);
                                    }


                                } else {
                                    if (appsByOrder[m].defaultShow) {
                                        var app = [];
                                        if (permission.app(appsByOrder[m].name).show) {
                                            app.push(appsByOrder[m].name);
                                            app.push(true);
                                            dl.dd.push(app);
                                        }
                                    }
                                }

                            }
                        }
                        if (dl.dd.length > 0) {
                            dls.push(dl);
                        }
                    }
                }
            }
        }
    });
    return dls;
}