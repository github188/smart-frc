require(["./platform", "cloud/base/cloud", "cloud/components/permission", "cloud/lib/plugin/jquery.datetimepicker"], function(Platform, cloud, Permission) {
    $(function() {

        window.permission = new Permission({
            events: {
                afterLoad: function() {
                    require([CONFIG.appConfig], function(appConfig) {
                        // console.log( "cloud.appModules, before,", cloud.appModules, ",appConfig,",appConfig);
                        cloud.appModules = appConfig;
                        // console.log( "cloud.appModules,", cloud.appModules);
                        cloud.platform = new Platform();
                        var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                        if (oid == '0000000000000000000abcde') {
                            $("#nav-main-left-app-rainbow_system").click();
                        }
                        /*var languge = localStorage.getItem("language");
                        if (languge == "en") {
                        	$("#title").html(locale.get("formula_g_raching_car"));
                        }else{
                        	$("#title").html(locale.get("formula_g_raching_car"));
                        }
						 */
                        //$("#menu").append("<div class='tds' style='position: fixed;right: 200px;width: 100px;height: 40px;cursor: pointer;display:none'><span class='salert' style='margin-top:10px'></span><a style='margin-top: 5px;position: absolute;margin-left: 20px;color: #9ACD32;' id='salert'></a></div>");
                        //$("#nav-main-left-app-products").css("width","190px");
                    })
                }
            }
        });
        // var language = locale._getStorageLang();
        // $("#titles").html(locale.get("formula_g_raching_car"));
    });
});