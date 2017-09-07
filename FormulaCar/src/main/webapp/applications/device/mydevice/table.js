define(function(require) {
    require("cloud/base/cloud");
    var TableTemplate = require("../../template/table");
    var Button = require("cloud/components/button");
    var _Window = require("cloud/components/window");
    var Info = require("./info");
    var service = require("./service");
    var TagManager = require("../../components/tag-manager");
    var BatchImport = require("./batch-import");
    var MISIImport=require("./misi-import");
    var validator = require("cloud/components/validator");
//    require("cloud/lib/plugin/ZeroClipboard")
    require("./whiteblack.css");
    require("../resources/css/toolbar-search.css");
    var ZeroClipboard=require("cloud/lib/plugin/ZeroClipboard.min");
//    require("../../../zeroclipboard-master/dist/ZeroClipboard.swf");
    /*var onlineCss = {
     width: "14px";
     height: "14px";
     background-color: "rgb(178, 182, 178)";
     border-radius: "50%";
     };
     var offlineCss = {
     width: "14px";
     height: "14px";
     background-color: "rgb(0, 182, 0)";
     border-radius: "50%";
     }
     */
    var columns = [
        {
            "title": "状态",
            "lang":"{text:state}",
            "dataIndex": "online",
            "cls": null,
            "width": "5%",
            render:function(data, type, row){
                var display = "";
                //TODO
                if ("display" == type) {
                    switch (data) {
                        case 0:
                            var offlineStr = locale.get("offline");
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : offlineStr
                                });
//							display = "<font >" + offlineStr + "</font>";
                            break;
                        case 1:
                            var onlineStr = locale.get("online");
                            display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                                .evaluate({
                                    status : onlineStr
                                });
//							display = "<font >" + onlineStr + "</font>";
                            break;

                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        }, {
            "title": "网关名",
            "lang":"{text:device_name1}",
            "dataIndex": "name",
            // "cls": "cloud-table-row",
            "width": "10%"
        }, {
            "title": "IMSI",
//        "lang":"{text:device_name1}",
            "dataIndex": "info",
            // "cls": "cloud-table-row",
            "width": "10%",
            render: function(data, type, row) {
                var display = "";
                if ("display" == type) {
                    display = data.imsi || "";
                    return display;
                }
            }
        },{
            "title":"手机号",
            "lang":"{text:mobile_number}",
            "dataIndex":"mobileNumber",
            "width":"10%"
        },{
            "title":"IP地址",
            "lang":"{text:ip_address}",
            "dataIndex":"pubIp",
            "width":"10%"
        },{
            "title": "机型类型",
            "lang":"{text:model_type}",
            "dataIndex": "model",
            // "cls": "cloud-table-row",
            "width": "10%"/*,
             render: function(data) {
             var modelName = null;
             cloud.Ajax.request({
             url: "api/models/"+data,
             async: false,
             type: "GET",
             dataType: "JSON",
             success: function(data) {
             modelName = data.result.name;
             }
             });
             return modelName;
             }*/
        },
        {
            "title": "安装现场",
            "lang":"{text:installation_site}",
            "dataIndex": "siteName",
            "cls": null,
            "width": "15%"
        },
        /*{
         "title": "安装地址",
         "lang":"{text:installation_address}",
         "dataIndex": "address",
         "cls": null,
         "width": "10%"
         },*/
        {
            "title": "业务状态",
            "lang":"{text:business_state}",
            "dataIndex": "businessState",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
                var display = null;
                //TODO
                if ("display" == type) {
                    switch (data) {
                        case 0:
                            //display = "建设";
                            var str = locale.get("construction");
                            display = "<font >" + str + "</font>";
                            break;
                        case 1:
                            //display = "投运";
                            var str = locale.get("operation");
                            display = "<font >" + str + "</font>";
                            break;
                        case 2:
                            //display = "故障";
                            var str = locale.get("fault");
                            display = "<font >" + str + "</font>";
                            break;
                        case 3:
                            //display = "检修";
                            var str = locale.get("overhaul");
                            display = "<font >" + str + "</font>";
                            break;
                        default:
                            break;
                    }
                    return display;
                } else {
                    return data;
                }
            }
        }, {
            "title": "配置状态",
            "lang":"{text:configuration_state}",
            "dataIndex": "syncState",
            "cls": null,
            "width": "10%",
            render: function(data, type, row) {
                //TODO
                switch (parseInt(data)) {
                    case 0:
                        //未同步
                        return locale.get("not_sync");
                        break;
                    case 1:
                        //正在获取配置
                        return locale.get("getting_config");
                        break;
                    case 2:
                        //正在下发配置
                        return locale.get("applying_config");
                        break;
                    case 3:
                        //同步成功
                        return locale.get("sync_succeed");
                        break;
                    case 4:
                        //同步失败
                        return locale.get("sync_fail");
                        break;
                    default:
                        return "";
                        break;
                }
            }
        }, {
            "title": "当前版本",
            "lang":"{text:current_version}",
            "dataIndex": "info.swVersion",
            "cls": null,
            "width": "10%"
        }
        /*, {
         "title": "联系人姓名",
         "lang":"{text:contacter_name}",
         "dataIndex": "contact.name",
         "cls": null,
         "width": "10%"
         }, {
         "title": "联系人电话",
         "lang":"{text:contacter_phone}",
         "dataIndex": "contact.phone",
         "cls": null,
         "width": "10%"
         }, {
         "title": "邮件",
         "lang":"{text:email}",
         "dataIndex": "contact.email",
         "cls": null,
         "width": "10%"
         }*/
    ];

    var MyDeviceTable = Class.create(cloud.Component, {
        initialize: function($super, options) {
            var self=this;
            $super(options);
            this.countNumber=0;
            this.saveFlag=0;
            var getawayConfig = permission.app("_gateway");
            if(!getawayConfig.read) {
                return ;
            }
            var info = null;
            this.blackOrWhite=0;
            //如果更新ssid(ssid改变)，则需要添加这一句,oldSsid是改变之前的oldSsid
            this.templateStrUpdateSsid="no dot11 ssid #{oldSsid}\r\n";
            //这是必须添加的，提交时的ssid的信息
            this.templateStrWithoutPortal="dot11 ssid #{ssid}\r\n"+
            "!\r\n"+
            "interface dot11radio 1\r\n"+
            "ssid #{ssid}\r\n"+
            "!\r\n";
            //新设备版本，命令模板
            this.templateForAll="no dot11 ssid\r\n" +
            "no interface dot11radio 1.1\r\n" +
            "no interface dot11radio 1.2\r\n" +
            "no interface dot11radio 1.3\r\n" +
            "no interface dot11radio 1.4\r\n" +
            "no bridge 1\r\n" +
            "no bridge 2\r\n" +
            "no bridge 3\r\n" +
            "no bridge 4\r\n" +
            "interface dot11radio 1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tno ip dhcp-server range\r\n" +
            "\tno mbssid\r\n" +
            "\tno encryption mode ciphers\r\n" +
            "\tno encryption vlan 1 mode ciphers\r\n" +
            "\tno encryption vlan 2 mode ciphers\r\n" +
            "\tno encryption vlan 3 mode ciphers\r\n" +
            "\tno encryption vlan 4 mode ciphers\r\n" +
            "!\r\n" +
            "interface fastethernet 1/1\r\n" +
            "\tno switchport mode\r\n" +
            "\tno switchport trunk allowed vlan\r\n" +
            "\tno switchport trunk native vlan\r\n" +
            "\tno switchport access vlan\r\n" +
            "!\r\n" +
            "no interface vlan 4000\r\n" +
            "no interface vlan 11\r\n" +
            "no interface vlan 12\r\n" +
            "no interface vlan 13\r\n" +
            "no interface vlan 14\r\n" +
            "no remote-sync\r\n" +
            "no chromos rsync-tasks\r\n";
            //Dualwifi设备(更新的设备(ㄒoㄒ))，命令模板
            this.templateDualWifiForAll="no dot11 ssid\r\n" +
            "no interface dot11radio 1.1\r\n" +
            "no interface dot11radio 1.2\r\n" +
            "no interface dot11radio 1.3\r\n" +
            "no interface dot11radio 1.4\r\n" +
            "no interface dot11radio 2.1\r\n" +
            "no interface dot11radio 2.2\r\n" +
            "no interface dot11radio 2.3\r\n" +
            "no interface dot11radio 2.4\r\n" +
            "no bridge 1\r\n" +
            "no bridge 2\r\n" +
            "no bridge 3\r\n" +
            "no bridge 4\r\n" +
            "interface dot11radio 1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tno ip dhcp-server range\r\n" +
            "\tno mbssid\r\n" +
            "\tno encryption mode ciphers\r\n" +
            "\tno encryption vlan 1 mode ciphers\r\n" +
            "\tno encryption vlan 2 mode ciphers\r\n" +
            "\tno encryption vlan 3 mode ciphers\r\n" +
            "\tno encryption vlan 4 mode ciphers\r\n" +
            "!\r\n" +
            "interface dot11radio 2\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tno ip dhcp-server range\r\n" +
            "\tno mbssid\r\n" +
            "\tno encryption mode ciphers\r\n" +
            "\tno encryption vlan 1 mode ciphers\r\n" +
            "\tno encryption vlan 2 mode ciphers\r\n" +
            "\tno encryption vlan 3 mode ciphers\r\n" +
            "\tno encryption vlan 4 mode ciphers\r\n" +
            "!\r\n" +
            "interface fastethernet 1/1\r\n" +
            "\tno switchport mode\r\n" +
            "\tno switchport trunk allowed vlan\r\n" +
            "\tno switchport trunk native vlan\r\n" +
            "\tno switchport access vlan\r\n" +
            "!\r\n" +
            "no interface vlan 4000\r\n" +
            "no interface vlan 11\r\n" +
            "no interface vlan 12\r\n" +
            "no interface vlan 13\r\n" +
            "no interface vlan 14\r\n" +
            "no remote-sync\r\n" +
            "no chromos rsync-tasks\r\n";
            //第一种情况
            //多ssid和多ap均不开启
            this.templateNoMultiSsidNoMultiAp=
                "no satemgmt enable\r\n" +
                "!\r\n"+
                "portal interface dot11radio 1\r\n"+
                "!\r\n" +
                "dot11 ssid #{ssid}\r\n";

            this.templateDualWifiNoMultiSsidNoMultiAp="no satemgmt enable\r\n" +
            "!\r\n"+
            "portal interface bridge 1\r\n"+
            "!\r\n";
            this.templateDualWifiSsidAlone="dot11 ssid #{ssid}\r\n";
            //美国车载修改配置
            this.templateDualWifiDefaultSsidAlone="dot11 ssid #{ssid}\r\n";
//this.templateDualWifiDefaultSsidAlone="dot11 ssid #{ssid}-5G\r\n";
            //均不开启下，有密码模板
            this.onlyOneSsidWithPwd="\tauthentication key-management wpa 2\r\n" +
            "\twpa-psk ascii #{pwd}\r\n" +
            "!\r\n" +
            "interface dot11radio 1\r\n" +
            "\tip address 10.10.10.10 255.255.0.0\r\n" +
            "\tssid #{ssid}\r\n" +
                //美国车载wifi需要
                "\tencryption mode ciphers aes-ccm\r\n"+
            //"\tencryption mode ciphers tkip\r\n" +
            "!\r\n";

            this.onlyOneDefaultSsidWithPwd="\tauthentication key-management wpa 2\r\n" +
            "\twpa-psk ascii #{pwd}\r\n" +
            "!\r\n" +
            "interface dot11radio 2\r\n" +
            "\tip address 10.10.10.10 255.255.0.0\r\n" +
            //美国车载wifi需要
            "\tssid #{ssid}\r\n" +
                "\tencryption mode ciphers aes-ccm\r\n"+
            //"\tssid #{ssid}-5G\r\n" +
            //"\tencryption mode ciphers tkip\r\n" +
            "!\r\n";
            //均不开启下，无密码模板
            this.onlyOneSsidWithNoPwd="!\r\ninterface dot11radio 1\r\n" +
            "\tip address 10.10.10.10 255.255.0.0\r\n" +
            "\tip dhcp-server range 10.10.20.1 10.10.40.255\r\n"+
            "\tip dhcp-server enable\r\n"+
            "\tssid #{ssid}\r\n" +
            "!\r\n";

            this.dualWifiOnlyOneSsidWithNoPwd="!\r\ninterface dot11radio 1\r\n" +
            "\tssid #{ssid}\r\n" +
            "!\r\n";
            this.dualWifiOnlyOneSsidWithNoPwdWith5G="!\r\ninterface dot11radio 2\r\n" +
            //美国车载wifi需要
            "\tssid #{ssid}\r\n" +
            //"\tssid #{ssid}-5G\r\n" +
            "!\r\n";
            //第二种情况
            //启用多ssid不启用多ap
            this.templateWithMultiSsidNoMultiAp="no satemgmt enable\r\n" +
            "!\r\n"+
            "portal interface dot11radio  1.1\r\n"+
            "!\r\n";
            this.templateDualWifiWithMultiSsidNoMultiAp="no satemgmt enable\r\n" +
            "!\r\n"+
            "portal interface bridge 1\r\n"+
            "!\r\n";
            //"no dot11 ssid\r\n";
            //ssid模板,有密码时
            this.templateMultiSsidNoPwd="dot11 ssid #{ssid}\r\n" +
            "\tvlan #{order}\r\n";
            this.templateDualWifiMultiSsidNoPwd="dot11 ssid #{ssid}-5G\r\n" +
            "\tvlan #{order}\r\n";
            //ssid模板，无密码时
            this.templateMultiSsidNoPwd1_1="dot11 ssid #{ssid}\r\n" +
                //"!\r\n" +
            "\tvlan #{order}\r\n";
            this.templateDualWifiMultiSsidNoPwd1_1="dot11 ssid #{ssid}-5G\r\n" +
                //"!\r\n" +
            "\tvlan #{order}\r\n";
            //ssid有密码模板
            this.templateMultiSsidWithPwd="\tauthentication key-management wpa 2\r\n" +
            "\twpa-psk ascii #{pwd}\r\n";
            this.templateDualWifiMultiSsidWithPwd="\tauthentication key-management wpa 2\r\n" +
            "\twpa-psk ascii #{pwd}\r\n";
            //启动多ssid
            this.templateMultiSsidStart="interface dot11radio 1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tmbssid\r\n"
            ;
            this.templateDualWifiMultiSsidStart="interface dot11radio 2\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tmbssid\r\n";
            //有哪些ssid，ssid是否加密
            this.templateMultiSsidList="\tssid #{ssid}\r\n";
            //美国车载需要修改
            this.templdateDualWifiMultiSsidList="\tssid #{ssid}\r\n";
            //this.templdateDualWifiMultiSsidList="\tssid #{ssid}-5G\r\n";
            //美国车载
            this.templateMultiSsidLock="\tencryption vlan #{order} mode ciphers aes-ccm\r\n";
            //this.templateMultiSsidLock="\tencryption vlan #{order} mode ciphers tkip\r\n";
            this.templateDualWifiMultiSsidLock="\tencryption vlan #{order} mode ciphers aes-ccm\r\n";
            //this.templateDualWifiMultiSsidLock="\tencryption vlan #{order} mode ciphers tkip\r\n";

            this.templateEndSsidList="!\r\n";

            this.templateSsidBlock="interface dot11radio #{ssid_number}\r\n" +
            "\tip address #{ip_address} #{ip_block}\r\n" +
            "\tip dhcp-server range #{start_ip} #{end_ip}\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n";
            this.templateDualWifiSsidBlock="bridge #{order}\r\n" +
            "interface dot11radio #{ssid_number}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n" +
            "interface dot11radio #{ssid_5g}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n" +
            "interface bridge #{order}\r\n" +
            "\tip address #{ip_address} #{ip_block}\r\n" +
            "\tip dhcp-server range #{start_ip} #{end_ip}\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n";
            //第三种情况
            //不启用多SSID、启用多AP协作
            this.templateNoMultiSsidWithMultiApPre="interface fastethernet 1/1\r\n" +
            "\tswitchport mode trunk\r\n" +
            "\tswitchport trunk native vlan 4000\r\n" +
            "\tswitchport trunk allowed vlan add 11\r\n" +
            "!\r\n" +
            "interface vlan 11\r\n" +
            "!\r\n" +
            "interface vlan 4000\r\n" +
            "\tip address 172.31.10.1 255.255.255.0\r\n" +
            "\tip dhcp-server range 172.31.10.100 172.31.10.200\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n";
            this.templateNoMultiSsidWithMultiApShort="no satemgmt enable\r\n" +
            "dot11 ssid #{ssid}\r\n";
            //无密码时
            this.templateNoMultiSsidWithMultiApNoPwd="!\r\n" +
            "interface dot11radio 1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "\tno encryption mode ciphers\r\n" +
            "\tno encryption vlan 1 mode ciphers\r\n" +
            "\tno encryption vlan 2 mode ciphers\r\n" +
            "\tno encryption vlan 3 mode ciphers\r\n" +
            "\tno encryption vlan 4 mode ciphers\r\n" +
            "\tssid #{ssid}\r\n";
            this.templateNoMultiSsidWithMultiApSuff="!\r\nbridge 1\r\n" +
            "interface bridge 1\r\n" +
            "\tip address 10.10.10.10 255.255.0.0\r\n" +
            "\tip dhcp-server range 10.10.20.1 10.10.40.255\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1\r\n" +
            "\tbridge-group 1\r\n" +
            "!\r\n" +
            "interface vlan 11\r\n" +
            "\tbridge-group 1\r\n" +
            "!\r\n" +
            "portal interface bridge 1\r\n" +
            "!\r\n" +
            "satemgmt enable\r\n" +
            "!\r\n";
            this.templateDualWifiNoMultiSsidWithMultiApSuff="!\r\nbridge 1\r\n" +
            "interface bridge 1\r\n" +
            "\tip address 10.10.10.10 255.255.0.0\r\n" +
            "\tip dhcp-server range 10.10.20.1 10.10.40.255\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1\r\n" +
            "\tbridge-group 1\r\n" +
            "!\r\n" +
            "interface dot11radio 2\r\n" +
            "\tbridge-group 1\r\n" +
            "!\r\n" +
            "interface vlan 11\r\n" +
            "\tbridge-group 1\r\n" +
            "!\r\n" +
            "portal interface bridge 1\r\n" +
            "!\r\n" +
            "satemgmt enable\r\n" +
            "!\r\n";
            //第四种情况
            //启用多ssid和多ap
            this.templateMultiSsidMultiAp="interface fastethernet 1/1\r\n" +
            "\tswitchport mode trunk\r\n" +
            "\tswitchport trunk native vlan 4000\r\n" +
            "\tswitchport trunk allowed vlan add 11\r\n" +
            "\tswitchport trunk allowed vlan add 12\r\n" +
            "\tswitchport trunk allowed vlan add 13\r\n" +
            "\tswitchport trunk allowed vlan add 14\r\n" +
            "!\r\n" +
            "interface vlan 11\r\n" +
            "!\r\n" +
            "interface vlan 12\r\n" +
            "!\r\n" +
            "interface vlan 13\r\n" +
            "!\r\n" +
            "interface vlan 14\r\n" +
            "!\r\n" +
            "interface vlan 4000\r\n" +
            "\tip address 172.31.10.1 255.255.255.0\r\n" +
            "\tip dhcp-server range 172.31.10.100 172.31.10.200\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n";
            this.templateMultiSsidMultiApPre="";
            this.templateBridgeblock="!\r\n" +
            "bridge #{order}\r\n"+
            "interface bridge #{order}\r\n" +
            "\tip address #{ip_address} #{ip_block}\r\n" +
            "\tip dhcp-server range #{start_ip} #{end_ip}\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio #{ssid_number}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n" +
            "interface vlan 1#{order}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n";
            this.templateDualWifiBridgeblock="!\r\n" +
            "bridge #{order}\r\n"+
            "interface bridge #{order}\r\n" +
            "\tip address #{ip_address} #{ip_block}\r\n" +
            "\tip dhcp-server range #{start_ip} #{end_ip}\r\n" +
            "\tip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio #{ssid_number}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n" +
            "interface dot11radio #{ssid_5g}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n" +
            "interface vlan 1#{order}\r\n" +
            "\tbridge-group #{order}\r\n" +
            "!\r\n";
            this.templateMultiSsidMultiApMid="interface dot11radio 1.1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.2\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.3\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.4\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n";
            this.templateDualWifiMultiSsidMultiApMid="interface dot11radio 1.1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.2\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.3\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 1.4\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 2.1\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 2.2\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 2.3\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n" +
            "interface dot11radio 2.4\r\n" +
            "\tno ip address\r\n" +
            "\tno ip dhcp-server enable\r\n" +
            "!\r\n";
            this.templateMultiSsidMultiApSuff="portal interface bridge 1\r\n" +
            "!\r\n" +
            "satemgmt enable\r\n" +
            "!\r\n";

            this.templateStrPortalHomepage="!\r\n"+
            "portal homepage #{homepage}\r\n"+
            "!\r\n";
            //有推送网址时的模板
            this.templateStrWithHostIp="!\r\n" +
            "interface dot11radio 1\r\n" +
            "ip address 10.10.10.10 255.255.0.0\r\n" +
            "ip dhcp-server range 10.10.20.1 10.10.40.255\r\n"+
            "ip dhcp-server enable\r\n" +
            "!\r\n"+
            "ip host qq.360yutu.cn 10.10.10.10  \r\n"+
            "ip host qq.u2wifi.cn 10.10.10.10  \r\n"+
            "ip host #{host} 10.10.10.10  \r\n"+
            "!\r\n";
            //有推送网址时，供config1_1显示
            this.templateStrWithHostIp1_1="!\r\n" +
            "interface dot11radio 1\r\n" +
            "ip dhcp-server range 10.10.20.1 10.10.40.255\r\n"+
            "ip dhcp-server enable\r\n" +
            "!\r\n" +
            "ip host qq.360yutu.cn 10.10.10.10\r\n"+
            "ip host qq.u2wifi.cn 10.10.10.10\r\n"+
            "ip host #{host} 10.10.10.10\r\n"+
            "!\r\n";
            //启用多ssid，禁用多ap时或者启用多ap，禁用ssid或者任意启用
            this.templateStrWithHostIp1_2="ip host #{host} 10.10.10.10\r\n"+
            "!\r\n";
            //没有推送网址时的模板
            this.templateStrNoHostIp="!\r\n"+
            "no ip host #{host}\r\n"+
            "!\r\n";
            //强制登录开启时的模板
            this.templateStrWithPeriod="portal relogin-period #{relogin_period}\r\n"+
            "!\r\n";
            //强制登录关闭时的模板
            this.templateStrNoPeriod="no portal relogin-period\r\n"+
            "!\r\n";
            //开启微信连wifi时，登录超时模板
            this.templateStrWifiLoginTimeout="portal login timeout #{relogin_period}\r\n" +
            "!\r\n";
            //关闭微信连wifi时，登录超时模板
            this.templateStrNoWifiLoginTimeout="no portal login timeout\r\n" +
            "!\r\n";
            //这个是有某个会员认证方式的模板
            this.templateAuthenticationModeYes="portal authentication mode #{mode}\r\n";
            //这个是没有某个会员认证方式的模板
            this.templateAuthenticationModeNo="no portal authentication mode #{mode}\r\n";
//                                                "portal authentication mode #{one-click}\r\n"+
//                                                "portal authentication mode #{sms}\r\n"+
//                                                "portal authentication mode #{weixin}\r\n"+
//                                                "portal authentication mode #{weibo}\r\n" +
//                                                "!\r\n";
            //（单个）发布点配置信息的模板，如果有多个则重复添加这些字符串
            //另外需要在第一个发布点配置信息模板前添加一句（其他发布点配置信息模板前不用添加）"no remote-sync\r\nno chronos\r\n";
            this.templateStrPortal="remote-sync #{name} flag rainbow\r\n"+
            "local directory #{devicePath}\r\n"+
            "priority #{priority}\r\n"+
            "!\r\n"+
            "chronos #{name}.rsync #{unit} #{syncCycleTime} #{syncTimeInterval} \r\n"+
            "!\r\n";
            //为设备默认添加一个发布点ads
            this.templateForAds="remote-sync ads flag rainbow\r\n"+
            "local directory ads\r\n"+
            "priority high\r\n"+
            "!\r\n"+
            "chronos ads.rsync every-minutes 15 between hour 0 and 23 on weekday 0,1,2,3,4,5,6 \r\n"+
            "!\r\n";
            //配置最后添加的模板
            this.templateStrEnd="write\r\n#end";

            this.count=0;
            this.blackCollection=[];
            this.tempBlackCollection=[];
            this.whiteCollection=[];
            this.tempWhiteCollection=[];
            this.tableTemplate = new TableTemplate({
                infoModule: function() {
                    if (info === null) {
                        info = new Info({
                            selector: $("#info-table")
                        });
                    }

                    return info;
                },
                selector: this.element,
                service: service,
                contentColumns: columns,
                events : {
                    "afterSelect" : function(resources){
                        var isAllGateway = this.verifyGateway(resources);
                        var isSameModel = this.verifySameModel(resources)
                        if(resources.length==0){
                            if (isAllGateway && isSameModel&&self.getawayConfig.management){
                                self.configBtn.show();
                            }else{
                                self.configBtn.hide();
                            }
                        }
                        else{
                            cloud.Ajax.request({
                                url:"api/models/"+resources.first().modelId,
                                type:"GET",
                                parameters:{
                                    verbose:100
                                },
                                success:function(data){
                                    if (isAllGateway && isSameModel&&data.result.system&&self.getawayConfig.management){
                                        self.configBtn.show();
                                    }else{
                                        self.configBtn.hide();
                                    }
                                }
                            });
                        }
                    },
                    scope : this
                }
            });

            this.addToolbarItems();
            this._renderSearch(this.toolbar);
            this.gatewayMgr = null;
            this.window = null;
            var self = this;
            locale.render({element:this.element});
            $("#tag-overview-itembox").find(".cloud-item").live("click",function(){
                if($(this).attr("id") == "tag-overview-tag-1"){
                    $("#toolbar-search-box").show();
                }else{
                    $("#toolbar-search-box").hide();
                }
            });

            this.empower();
        },

        empower: function() {
            var self=this;
            self.getawayConfig = permission.app("_gateway");
            if(!self.getawayConfig.write) {
                this.tableTemplate.modules.content.addBtn.hide();
                this.tableTemplate.modules.content.deleteBtn.hide();
            }
            if(!self.getawayConfig.import) {
                this.importBtn.hide();
                this.IMSIBtn.hide();
            }
            if(!self.getawayConfig.management) {
                this.configBtn.hide();
            }
            if(!self.getawayConfig.public_config){
                this.portalConfigBtn.hide();
            }

            //this.labelBtn.hide();

            //this.IMSIBtn.hide();
        },

        verifiedDeviceModel: function(obj) {
            var self = this;
            if (obj.resources) {
                self.renderAndOpenGatewayManage({resources:obj.resources,business:obj.type});
            } else {
//				alert("Select the same model device , Please!");
            }
        },


        verifySameModel : function(resources){
            if (resources.length == 0){
                return true;
            }
            var modelId = resources.first().modelId;
            if (resources.all(function(resource) {
                    return resource.modelId == modelId;
                })) {
                return true;
            }else {
                return false;
            }
        },

        verifyGateway : function(resources){
            var result = true;

            var plcIds = resources.pluck("plcId");
            plcIds.find(function(plcId){
                if (plcId != 0) {
                    result = false;
                    return true;
                }
            });
//          console.log(result, "verifyGateway");
            return result;
        },

        addToolbarItems: function() {
            var self = this;
            var toolbar = this.tableTemplate.getToolbar();
            var configBtn = new Button({
                imgCls: "cloud-icon-config",
                title: locale.get("gateway_management"),
                lang:"{title:gateway_management}",
                id:"dev-overview-gatewayConfigMgr",
                cls:"dev-table-gatawayMgr",
                events: {
                    click: function() {
                        var selectedResouces = this.tableTemplate.modules.content.getSelectedResources();
                        if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
                            dialog.render({lang:"please_select_at_least_one_config_item"});
                        } else {
                            this.verifiedDeviceModel({resources:selectedResouces,business:"config"});
                        }
                    },
                    scope: this
                }
            });
            this.configBtn = configBtn;
//			var upgradeBtn = new Button({
//				imgCls: "cloud-icon-upgrade",
//				events: {
//					click: function() {
//						var selectedResouces = this.tableTemplate.modules.content.getSelectedResources();
//						if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
//						} else {
//							this.verifiedDeviceModel(selectedResouces, "upgrade");
//						}
//					},
//					scope: this
//				}
//			});
            var labelBtn = new Button({
                imgCls: "cloud-icon-label",
                lang:"{title:batch_tag}",
                events: {
                    click: function() {
                        var selectedResouces = this.tableTemplate.modules.content.getSelectedResources();
                        if (selectedResouces.length == 0) {
//							alert("At least select one item , Please!");
                            dialog.render({lang:"please_select_at_least_one_config_item"});
                        } else {
                            var resources = new Hash();
                            selectedResouces.each(function(resource) {
                                resources.set(resource._id, resource.name);
                            });
                            self.renderTagManager(resources.toObject());
                        }
                    },
                    scope: this
                }
            });
            this.labelBtn = labelBtn;

            var importBtn = new Button({
                imgCls: "cloud-icon-daoru",
                title: locale.get("batch_import"),
                lang:"{title:batch_import}",
                events: {
                    click: function() {
                        this.renderBatchImport();
                    },
                    scope: this
                }
            });
            this.importBtn = importBtn;

            var IMSIBtn=new Button({
                imgCls:"cloud-icon-shouquan",
                title:locale.get("imsi_mobilenumber"),
                lang:"{title:imsi_mobilenumber}",
                events:{
                    click:function(){
                        this.renderMISIImport();
                    },
                    scope:this
                }
            });
            this.IMSIBtn = IMSIBtn;
            toolbar.appendRightItems([IMSIBtn,labelBtn, /*importBtn, */configBtn], -1);
            this.toolbar = toolbar;
        },
        renderMISIImport:function(){
            if(this.MISIImport){
                this.MISIImport.destroy();
            }
            this.MISIImport=new MISIImport({
                events:{
                    "onMISIImportSuc":function(){
                        self.overview.reloadTags();
                    }
                }
            });
        },
        renderBatchImport : function(){
            var self = this;
            if (this.batchImport){
                this.batchImport.destroy();
            }
            this.batchImport = new BatchImport({
                events : {
                    "onBatchImportSuc" : function(){
//						console.log("onBatchImportSuc");
                        self.tableTemplate.reloadTags();
                    }
                }
            });

        },

        renderAndOpenGatewayManage: function(obj){
            var self = this;
            if (!this.window) {
                this.window = new _Window({
                    container: "body",
                    title: locale.get("gateway_management"),//"网关管理",
                    lang:"{title:gateway_management}",//
                    top: "center",
                    left: "center",
                    height: 600,
                    width: 1300,
                    mask: true,
                    drag:true,
                    content: "<div id='overview-window-el'></div>",
                    events: {
                        "onClose": function() {
                            this.gatewayMgr.destroy();
                            this.window = null;
                        },
                        scope: this
                    }
                });
                require(["../gateway-manage/gateway-manage"], function(GatewayManage) {
                    self.gatewayMgr = new GatewayManage({
                        selector: "#overview-window-el",
                        resources: obj.resources
                    });
                });
                this.window.show();
            } else {
//				require(["../gateway-manage/gateway-manage"], function(GatewayManage) {
//					self.gatewayMgr = new GatewayManage({
//						selector: "#overview-window-el",
//						resources: obj.resources
//					});
//				});
//				this.window.show();
            }
        },

        renderTagManager: function(resources) {
            var self = this;
            if (this.tagManager){
                this.tagManager.destroy();
            };
            this.tagManager = new TagManager({
                obj: resources
            });
            this.tagManager.on({
                "onComplete" : function(){
                    self.tableTemplate && (self.tableTemplate.reloadTags("clicked"));
                }
            })
        },
        _renderSearch:function(toolbar){
            var self = this;
            var elements = {
                box:"toolbar-search-box",
                hint:"toolbar-search-hint",
                input:"toolbar-search-input",
                button:"toolbar-search-button",
                portal:"toolbar-portal-config"
            }
            //draw search
            var toolbarElement = "#" + toolbar.id;
            var toolbarLeftElement = "." + $(toolbar["leftDiv"][0]).attr("class");
            var toolbarRightElement = "." + $(toolbar["rightDiv"][0]).attr("class");
            var searchBox = $("<form>").attr("id",elements.box).attr("class",elements.box);
            var $hint = $("<input>").attr("type","text").attr("id",elements.hint).attr("class",elements.hint).attr("lang","value:enter_the_gateway_name");
            var $input = $("<input>").attr("type","text").attr("id",elements.input).attr("class",elements.input).css("display","none");
            var $button = $("<input>").attr("type","button").attr("id",elements.button).attr("class",elements.button);
            searchBox.append($hint).append($input).append($button);
            var portalButton=$("<span>").attr({
                "id":elements.portal
            }).css({
                "float":"left",
                "position":"relative",
                "top":"3px"
            });
            $(toolbarElement).find(toolbarLeftElement).after(searchBox.css({
                "margin-left":"15px"
            })).after(portalButton);
            this.portalConfigBtn = new Button({
                container:"#"+elements.portal,
                text:locale.get("portal_config"),
                events:{
                    click:function(){
                        if(self.window){
                            self.window=null;
                        }
                        self.window=new _Window({
                            container: "body",
                            title: locale.get("portal_config"),//"网关管理",
                            lang:"{title:portal_config}",//
                            top: "center",
                            left: "center",
                            height: 750,
                            width: 650,
                            mask: true,
                            drag:true,
                            content: "<div id='portal_config_wrapper'></div>",
                            events: {
                                "onClose": function() {
//                                    this.gatewayMgr.destroy();
                                    this.window = null;
                                    self.formData=null;
                                    self.countNumber=0;
                                    self.statusFlag=undefined;
                                },
                                scope: this
                            }
                        });
                        self.window.show();
                        self._renderPortalConfigForm("portal_config_wrapper");
                    },
                    scope:this
                }
            });
            var updateCount = function(returnData){
                var contentTable = self.tableTemplate.modules.content;
                var display = contentTable.display;
                var currentCount;
                if(returnData.total <= display){
                    currentCount = returnData.total;
                }else{
                    currentCount = display;
                }
                contentTable.selectedCount = 0;
                contentTable.total = returnData.total;
                contentTable.totalCount = currentCount;
                contentTable.updateCountInfo();
            };
            var refreshPage = function(data){
                var contentTable=self.tableTemplate.modules.content;
                contentTable.page.reset(data);
                var tempArray=[];
//				contentTable._renderPaging(Math.ceil(total/display),1,display);
                if(!inputValue){
                    service.getResourcesIds=function(start,limit,callback,context){
                        cloud.Ajax.request({
                            url:"api/devices",
                            type:"get",
                            parameters:{
                                cursor:start,
                                limit:limit,
                                verbose:1
                            },
                            success:function(data){
                                data.result = data.result.pluck("_id");
                                callback.call(context || this, data);
                            }
                        })
                    }
                }
                else{
                    service.getResourcesIds=function(start, limit, callback, context) {
                        cloud.Ajax.request({
                            url : "api/devices",
                            type : "get",
                            parameters:{
                                name:inputValue,
                                cursor:start,
                                limit:limit,
                                verbose:1
                            },
                            success : function(dataByName) {
                                cloud.Ajax.request({
                                    url:"api/devices",
                                    type:"get",
                                    parameters:{
                                        serial_number:inputValue,
                                        cursor:start,
                                        limit:limit,
                                        verbose:1
                                    },
                                    success:function(dataBySerialNumber){
                                        dataBySerialNumber.result=dataBySerialNumber.result.concat(tempArray);
                                        dataByName.result.each(function(one){
                                            var flag=false;
                                            for(var i=0;i<dataBySerialNumber.result.length;i++){
                                                if(one._id===dataBySerialNumber.result[i]._id){
                                                    flag=true;
                                                    break;
                                                }
                                            }
                                            if(!flag){
                                                dataBySerialNumber.result.push(one);
                                            }
                                        });
                                        tempArray=dataBySerialNumber.result.slice(limit);
                                        dataBySerialNumber.result=dataBySerialNumber.result.slice(0,limit);
                                        dataBySerialNumber.total=total_gateway;
                                        var data=dataBySerialNumber;
                                        data.result = data.result.pluck("_id");
                                        callback.call(context || this, data);
                                    }
                                })
                            }
                        });
                    };
                }

            };
            //search event
            $("#" + elements.hint).click(function(){
                $(this).hide();
                $("#" + elements.input).show().focus();
            });
            var searchFunction=function(){
                var display = self.tableTemplate.modules.content.display;
//					console.log("self.tableTemplate.modules",self.tableTemplate.modules);
                self.tableTemplate.service.getResourcesIds = service.getResourcesIds;
//					self.tableTemplate.modules.tag.loadTags(false);
                self.tableTemplate.hideInfo();
                cloud.util.mask(self.element);
                $("#" + elements.hint).hide();
                $("#" + elements.input).show().focus();
                var pattern=/^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/i;
                inputValue = $("#" + elements.input).val().replace(/\s/g,"");
                var param = {
                    verbose:100,
                    limit:0,
                    plc_id:0
                }
                inputValue=inputValue.match(pattern);
                if(inputValue!==null&&inputValue.length !== 0){
//						param.name = inputValue;
                    inputValue=inputValue.toString();
                    param.serial_number = inputValue;
                    Model.device({
                        method:"query_list",
                        param:param,
                        success:function(dataBySerialNumber){
//										var newArr = data.result;
//										self.tableTemplate.modules.content.content.clearTableData();
//										self.tableTemplate.modules.content.content.add(newArr);
//										updateCount(data);
//										refreshPage(data);
//										cloud.util.unmask();
                            delete param.serial_number;
                            param.name = inputValue;
                            Model.device({
                                method:"query_list",
                                param:param,
                                success:function(dataByName){
                                    dataByName.result.each(function(one){
                                        var flag=false;
                                        for(var i=0;i<dataBySerialNumber.result.length;i++){
                                            if(one._id===dataBySerialNumber.result[i]._id){
                                                flag=true;
                                                break;
                                            }
                                        }
                                        if(!flag){
                                            dataBySerialNumber.result.push(one);
                                        }
                                    });
                                    dataBySerialNumber.total=dataBySerialNumber.result.length;
                                    total_gateway=dataBySerialNumber.total;
                                    var data=dataBySerialNumber;
                                    data.result=data.result.slice(0,display);
                                    var newArr = data.result;
                                    self.tableTemplate.modules.content.content.clearTableData();
                                    self.tableTemplate.modules.content.content.add(newArr);
                                    updateCount(data);
                                    refreshPage(data);
                                    cloud.util.unmask();
                                }
                            });

                        }
                    });


                }else{
                    param.limit=display;
                    Model.device({
                        method:"query_list",
                        param:param,
                        success:function(data){
//								console.log(data);
                            var newArr = data["result"];
                            self.tableTemplate.modules.content.content.clearTableData();
                            self.tableTemplate.modules.content.content.add(newArr);
                            updateCount(data);
                            refreshPage(data);
                            cloud.util.unmask();
                        }
                    });
                }
            };
            $("#" + elements.button).click(searchFunction);
            $("#" + elements.input).keypress(function(event){
                if(event.keyCode==13){
                    searchFunction();
                }
            });
        },
        _renderPortalConfigForm:function(id){
            var self=this;
            self.portalConfigForm=$("<form>");
            var html="<ul style='border:1px solid #EBE9E9'>" +
                "<li class='form_line first_li_title'>" +
                "<span id='close_config' style='float: left'></span>" +
                "<span id='start_config' style='float: left'></span>" +
                "<span id='submit_config'></span><span id='cancell_config'></span>" +
                "<span id='edit_button'></span>" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:ssid_name_1+:' for='hot_pot_name'></label><input class='validate[required,custom[username]]' id='hot_pot_name' type='text'>" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label for='first_ssid_pwd' class='varible_name' lang='text:password'></label><input class='validate[custom[wifipwd]]' type='text' id='first_ssid_pwd' />" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:multi_ssid+:'></label><span lang='text:yes'></span><input id='multi_ssid_yes' name='enable_multi_ssid_checkbox' type='radio' />" +
                "<span class='checkbox_text' lang='text:no'></span><input name='enable_multi_ssid_checkbox' id='multi_ssid_no' type='radio' />" +
                "<div id='multi_ssid_wrapper' style='max-height: auto;overflow-y: scroll;overflow-x: hidden;width:500px;margin-left: 20px'>" +
                "<div class='multi_ssid' style='border-top: 0px!important;margin-top:10px!important'>" +
                "<div class='div_line' >" +
                "<label class='varible_name' lang='text:ssid_name_2+:' for='hot_pot_name_2'></label><input class='validate[required,custom[username]]' id='hot_pot_name_2' type='text'>" +
                "</div>" +
                "<div class='div_line'>" +
                "<label for='second_ssid_pwd' class='varible_name' lang='text:password'></label><input class='validate[custom[wifipwd]]' type='text' id='second_ssid_pwd' />" +
                "</div>" +
                "</div>" +
                "<div class='multi_ssid'>" +
                "<div class='div_line'>" +
                "<label class='varible_name' lang='text:ssid_name_3+:' for='hot_pot_name_3'></label><input class='validate[custom[username]]' id='hot_pot_name_3' type='text'>" +
                "</div>" +
                "<div class='div_line'>" +
                "<label for='third_ssid_pwd' class='varible_name' lang='text:password'></label><input class='validate[custom[wifipwd]]' type='text' id='third_ssid_pwd' />" +
                "</div>" +
                "</div>" +
                "<div class='multi_ssid'>" +
                "<div class='div_line'>" +
                "<label class='varible_name' lang='text:ssid_name_4+:' for='hot_pot_name_4'></label><input class='validate[custom[username]]' id='hot_pot_name_4' type='text'>" +
                "</div>" +
                "<div class='div_line'>" +
                "<label for='forth_ssid_pwd' class='varible_name' lang='text:password'></label><input class='validate[custom[wifipwd]]' type='text' id='forth_ssid_pwd' />" +
                "</div>" +
                "</div>" +
                "</div>" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:multi_ap_assitant+:'></label><span lang='text:yes'></span><input id='multi_ap_yes' name='multi_ap_checkbox' type='radio' />" +
                "<span class='checkbox_text' lang='text:no'></span><input name='multi_ap_checkbox' id='multi_ap_no' type='radio' />" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:portal_website+:' for='portal_website'></label><input class='validate[required]' id='portal_website' type='text'>" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:point_to_portal+:'></label><span lang='text:yes'></span><input id='point_yes' name='point_to_router_checkbox' type='radio' />" +
                "<span class='checkbox_text' lang='text:no'></span><input name='point_to_router_checkbox' id='point_no' type='radio' />" +
                "</li>" +
                "<li class='form_line multi_config_1_1'>" +
                "<label class='varible_name' lang='text:use_portal_forced_to_login_in+:'></label>" +
                "<span lang='text:yes'></span><input id='use_yes' name='portal_forced_to_login_in_checkbox' type='radio' /><span class='checkbox_text' lang='text:no'></span><input id='use_no' name='portal_forced_to_login_in_checkbox' type='radio' />" +
                "</li>" +
                "<li class='form_line show_when_yes multi_config_1_1'>" +
                "<label class='varible_name' lang='text:portal_forced_to_login_in+:' for='portal_forced_to_login_in'></label>" +
                "<input class='validate[required,custom[uniqueNumber]]' id='portal_forced_to_login_in' type='text'><span lang='text:minutes'></span>" +
                "</li>" +
                "<li class='form_line user_authenticate multi_config_1_1'>" +
                "<label class='varible_name' lang='text:member_authenticate+:'></label>" +
                "<ul id='member_autenticate_wrapper'>" +
                "<li class='for_member_authenticate'><input id='a_key_to_internet' type='checkbox'><label class='choice_line' for='a_key_to_internet' lang='text:a_key_to_internet'></label></li>" +
                "<li class='for_member_authenticate'><input id='sms_renzheng' type='checkbox'><label class='choice_line' for='sms_renzheng' lang='text:sms'></label></li>" +
                "<li id='wechat_wifi_li_check' class='for_member_authenticate' style='display:none'><input id='wechat_wifi' type='checkbox' checked='checked'><label class='choice_line' for='wechat_wifi' lang='text:wechat_wifi'></label></li>" +
                "<li class='for_member_authenticate wehchat_renzheng'><input id='wechat_renzheng' type='checkbox'><label class='choice_line' for='wechat_renzheng' lang='text:weichat_code'></label>" +
                "<div style='padding-top: 10px' class='wehchat_renzheng'>" +
                "<label class='url_random_number_wrapper'><input id='random_number' type='text' readonly class=''/>" +
                "<span lang='title:reset' id='get_again' class='cloud-icon-default cloud-icon-reset'></span></label><span id='get_url'></span>" +
                "</div>" +
                "</li>" +
                "<li class='wechat_code_warns multi_config_1_1'><label lang='text:wechat_warn_tips'></label>" +
//                "<label id='click_here_clear' lang='{text:click_here,title:clear_old_number}'></label><label lang='text:clear_old_number'></label>" +
                "</li>" +
                "<li class='for_member_authenticate multi_config_1_1'><input id='qq_renzheng' type='checkbox'><label class='choice_line' for='qq_renzheng' lang='text:qq'></label></li>" +
                "<li class='for_member_authenticate multi_config_1_1'><input id='sina_webo_renzheng' type='checkbox'><label class='choice_line' for='sina_webo_renzheng' lang='text:sina_webo'></label></li>" +
                "</ul>" +
                "</li>"+
                "<li class='form_line heavy_line'>" +
                "<li>" +
            	"<label class='varible_name' lang='text:flow_threshold+:' for='hot_pot_name'></label>" +
            	"<input id='flow_config_threshold' type='text' class='validate[required,custom[number]]' disabled='disabled'>" +
            	"<span>(MB)</span>" +
            	"</li>" +
                "<label class='varible_name' lang='text:limit_of_internet+:'></label>" +
                "<div id='show_when_edit_model' style='margin-left: 170px;margin-top: 15px'>" +
                "<input lang='placeholder:cannot_be_empty' class='' id='website_going_added' type='text'><span id='add_to'></span><select id='list_select_wb' style='margin-left: 15px'>" +
                "<option lang='text:whitelist' value='0'>白名单</option>" +
                "<option lang='text:blacklist' value='1'>黑名单</option>" +
                "</select>" +
                "</div>" +
                "<div style='margin-left: 170px;width: 400px;margin-top: 15px'><span class='title_toolbar active_default' id='whitelist_button' lang='text:whitelist'></span><span class='title_toolbar normal_default' id='blacklist_button' lang='text:blacklist'></span></div>" +
                "<div class='white_black_wrapper'>" +
                "<div class='white_black_list_wrapper real_white_list'>" +
                "<ul id='real_white_list'></ul>" +
                "</div>" +
                "<div style='display:none' class='white_black_list_wrapper real_black_list'>" +
                "<ul id='real_black_list'></ul>" +
                "</div>" +
                "</div>" +
                "</li>" +
                "<li class='form_line micro_define'>" +
                    //"<span id='submit_config'></span><span id='cancell_config'></span>" +
                "</li>" +
                "</ul>";
            $(html).appendTo(self.portalConfigForm).find("#wechat_wifi").click(function (e) {
                if($(this).attr("checked")){
                    $("#wechat_renzheng").attr({
                        "checked":false
                    }).attr("disabled","disabled");
                    $("#sina_webo_renzheng").attr({
                        "checked":false
                    }).attr("disabled","disabled");
                    $("#qq_renzheng").attr({
                        "checked":false
                    }).attr("disabled","disabled");
                    
                    self.portalConfigForm.find("#use_yes").trigger("click").end()
                        .find("#portal_forced_to_login_in").val(480).end()
                        .find("#use_yes").attr("disabled","disabled").end()
                        .find("#use_no").attr("disabled","disabled").end()
                        .find("#portal_forced_to_login_in").attr("disabled","disabled");
                }else{
                    $("#wechat_renzheng").removeAttr("disabled");
                    $("#sina_webo_renzheng").removeAttr("disabled");
                    $("#qq_renzheng").removeAttr("disabled");
                    self.portalConfigForm.find("#use_yes").removeAttr("disabled").end()
                        .find("#use_no").removeAttr("disabled").end()
                        .find("#portal_forced_to_login_in").removeAttr("disabled");
                }
            });
            self.portalConfigForm.appendTo("#"+id);
            validator.render(self.portalConfigForm,{
                "promptPosition":"topRight"
            });
            self.renderButtons();
            self._renderCss();
            self.bindPortalConfigFormEvents();
            self.renderPortalConfigForm();
            self.renderFlowThreshold();
            locale.render();
        },
        randomNumberFactory:function(){
            var letterArr="abcdefghijklmnopqrstuvwxyz0123456789";
            var result="";
            for(var i=0;i<5;i++){
                var position=parseInt(Math.random()*36);
                var temp=letterArr.slice(position,position+1);
                result=result+temp;
            }
            return result;
        },
        bindPortalConfigFormEvents:function(){
            var self=this;
            var whiteButton=self.portalConfigForm.find("#whitelist_button");
            var blackButton=self.portalConfigForm.find("#blacklist_button");
            self.portalConfigForm.find("#get_again").click(function(){
                var third=this;
                var currentFuc=arguments.callee;
                $(third).unbind();
//                console.log("1");
                var result=self.randomNumberFactory();
                cloud.util.mask("#member_autenticate_wrapper");
                cloud.Ajax.request({
                    url:"api/wifi_third_auth/code",
                    type:"POST",
                    parameters:{
                        code:result,
                        as_type:5
                    },
                    success:function(){
                        self.portalConfigForm.find("#random_number").val(result);
                        $(third).click(currentFuc);
                        self.portalConfigForm.find("#random_number").val(result);
                        self.portalConfigForm.find("li.wechat_code_warns").show();
                        self.formData.mode.weixin.randomNumber=result;
                        cloud.util.unmask("#member_autenticate_wrapper");
                    }
                });
            });
            self.portalConfigForm.find("label#click_here_clear").click(function(){
                //TODO
//                cloud.Ajax.request({
//                    url:"",
//                    type:"",
//                    success:function(){
//
//                    }
//                });
            });
            whiteButton.click(function(){
                self.blackOrWhite=0;
                $(this).removeClass("normal_default").addClass("active_default");
                blackButton.removeClass("active_default").addClass("normal_default");
                self.portalConfigForm.find(".real_white_list").show().end().find(".real_black_list").hide();
            });
            blackButton.click(function(){
                self.blackOrWhite=1;
                $(this).removeClass("normal_default").addClass("active_default");
                whiteButton.removeClass("active_default").addClass("normal_default");
                self.portalConfigForm.find(".real_white_list").hide().end().find(".real_black_list").show();
            });
            self.portalConfigForm.find("#use_yes").click(function(){
                self.portalConfigForm.find(".show_when_yes").show("linear");
//                console.log("123");
            });
            self.portalConfigForm.find("#use_no").click(function(){
                self.portalConfigForm.find(".show_when_yes").hide("linear")
            });
            self.portalConfigForm.find("#multi_ssid_yes").click(function () {
                self.portalConfigForm.find("#multi_ssid_wrapper").show();
            }).end()
                .find("#multi_ssid_no").click(function(){
                    self.portalConfigForm.find("#multi_ssid_wrapper").hide();
                }).end()
                .find("#multi_ssid_wrapper").bind("scroll",function(e){

                });
        },
        renderPortalConfigForm:function(){
            var self=this;
            cloud.util.mask("#ui-window-content");
            cloud.Ajax.request({
                url:"api/content_sync/public_config",
                type:"GET",
                success:function(data){
                    try{
                        self.formData=JSON.parse(data.result.frontEndConfig);
                        //console.log(self.formData);
                    }catch (e){

                    }
                    if(!self.formData){
                        self.formData={
                            judge:true,
                            config_switch:false,
                            ssid:"FreeWifi",
                            pwd:"",
                            multi_ssid:false,
                            ssid_arr:null,
                            multi_ap:false,
                            homepage:"wifi.go",
                            ip:true,
                            relogin:false,
                            relogin_period:"",
                            mode:{
                                one_click:false,
                                sms:true,
                                weixin:{
                                    weixin:false,
                                    randomNumber:""
                                },
                                wechat:true,
                                weibo:false,
                                qq:false
                            }
                        }
                    }else{
                        if(self.formData.ssid){
                            self.formData.config_switch=true;
                        }
                    }
                    self.originConfigSwitch=self.formData.config_switch;
                    cloud.Ajax.request({
                        url:"api/wifi_third_auth/code",
                        type:"GET",
                        parameters:{
                            as_type:5
                        },
                        success:function(data){
                            var code=data.result.find(function(one){
                                return one.state==1;
                            });
                            if(self.formData.config_switch){
                                if(code&&code.code){
                                    self.formData.mode.weixin.randomNumber=code.code;
                                }
                            }
                            self.setPortalConfigForm();
                            self.disableInput();
                            cloud.util.unmask("#ui-window-content");
                        },
                        error:function(err){
//                            var code=data.result.find(function(one){
//                                return one.state==1;
//                            });
//                            if(code&&code.code){
                            self.formData.mode.weixin.randomNumber=undefined;
//                            }
                            self.setPortalConfigForm();
                            self.disableInput();
                            self.getUrlButton.hide();
                            cloud.util.unmask("#ui-window-content");
                        }
                    });
                },
                error:function(){
                    self.disableInput();
                    self.getUrlButton.hide();
                    cloud.util.unmask("#ui-window-content");
                }
            });
            //测试
//            self.formData={
//                ssid:"Inportal800",
//                homepage:"wifi.go",
//                ip:true,
//                relogin:false,
//                relogin_period:30
//            }
        },
        setPortalConfigFormExceptList:function(){
            var self=this;
            if(self.formData.config_switch){
                self.portalConfigForm.find("input#website_going_added").val("");
                if(self.formData){
                    self.portalConfigForm.find("#hot_pot_name").val(self.formData.ssid);
                    self.portalConfigForm.find("#portal_website").val(self.formData.homepage);
                    if(self.formData.ip){
                        self.portalConfigForm.find("#point_yes").attr({
                            "checked":"checked"
                        })
                    }else{
                        self.portalConfigForm.find("#point_no").attr({
                            "checked":"checked"
                        })
                    }
//                self.portalConfigForm.find("input#a_key_to_internet").attr({"checked":"checked"});
//                self.portalConfigForm.find("input#sms_renzheng").attr({"checked":"checked"});
//                self.portalConfigForm.find("input#wechat_renzheng").attr({"checked":"checked"});
//                self.portalConfigForm.find("input#sina_webo_renzheng").attr({"checked":"checked"});
                    if(self.formData.relogin){
                        self.portalConfigForm.find("#use_yes").attr({
                            "checked":"checked"
                        }).end().find("li.show_when_yes").show();
                        self.portalConfigForm.find("#portal_forced_to_login_in").val(self.formData.relogin_period);
                    }else{
                        self.portalConfigForm.find("#use_no").attr({
                            "checked":"checked"
                        }).end().find("li.show_when_yes").hide();
                        self.portalConfigForm.find("#portal_forced_to_login_in").val("");
                    }
                    self.setMultSsidInfo();
                    if(self.formData.mode){
                        if(self.formData.mode.one_click){
                            self.portalConfigForm.find("#a_key_to_internet").attr({
                                "checked":"checked"
                            });
                        }
                        if(self.formData.mode.sms){
                            self.portalConfigForm.find("#sms_renzheng").attr({
                                "checked":"checked"
                            });
                        }
                        if(self.formData.mode.weixin.weixin){
                            self.portalConfigForm.find("#wechat_renzheng").attr({
                                "checked":"checked"
                            })
                        }
                        if(self.formData.mode.wechat){
                            self.portalConfigForm.find("#wechat_wifi").attr({
                                "checked":"checked"
                            });
                        }else{
                            self.portalConfigForm.find("#wechat_wifi").attr({
                                "checked":"checked"
                            });
                        }
                        if(self.formData.mode.qq){
                            self.portalConfigForm.find("#qq_renzheng").attr({
                                "checked":"checked"
                            })
                        }
                        if(self.formData.mode.weibo){
                            self.portalConfigForm.find("#sina_webo_renzheng").attr({
                                "checked":"checked"
                            })
                        }
                        self.portalConfigForm.find("#random_number").val(self.formData.mode.weixin.randomNumber);
                    }
                }
            }else{
                self.portalConfigForm.find(".multi_config_1_1").hide("linear");
                self.editButton.hide();
                self.startConfigButton.show();
            }

        },
        setPortalConfigForm:function(){
            var self=this;
            self.setPortalConfigFormExceptList();
            self.renderWhiteBlackList();
        },
        renderWhiteBlackList:function(){
            var self=this;
            var whiteList=[];
            var blackList=[];
            cloud.util.mask("li.heavy_line");
            cloud.Ajax.request({
                url:"api/black_white",
                type:"GET",
                parameters:{
                    type:1,
                    blackOrWhite:0,
                    verbose:100,
                    limit:30
                },
                success:function(data){
                    data.result.each(function(one){
                        whiteList.push(one);
                    });
                    cloud.Ajax.request({
                        url:"api/black_white",
                        type:"GET",
                        parameters:{
                            type:1,
                            blackOrWhite:1,
                            verbose:100,
                            limit:30
                        },
                        success:function(data){
                            data.result.each(function(one){
                                blackList.push(one);
                            });
                            cloud.util.unmask("li.heavy_line");
                            self._rendeWhiteBlackList({
                                white:whiteList,
                                black:blackList
                            });
                        }
                    })
                }
            })
        },
        _rendeWhiteBlackList:function(opt){
            var self=this;
            self.portalConfigForm.find("#real_white_list").empty();
            self.portalConfigForm.find("#real_black_list").empty();
            var whiteUl=self.portalConfigForm.find("#real_white_list");
            var blackUl=self.portalConfigForm.find("#real_black_list");
            if(opt.white&&opt.white.length!=0){
                for(var i=0;i<opt.white.length;i++){
                    self.count++;
                    var liEle=$("<li></li>").addClass("white-black-list-li");
                    if(i%2==0){
                        liEle.addClass("jishuhang");
                    }else{
                        liEle.addClass("oushuhang");
                    }
                    var spanEle=$("<span></span>").appendTo(liEle).text(opt.white[i].name).addClass("website_description left-margin").css({
//                        "text-align":"center"
                    }).attr({
                        "id":opt.white[i]._id,
                        "title":opt.white[i].name
                    });
                    var buttonEle=$("<span></span>").attr({
                        "id":"list_"+self.count
                    }).css({
                        "line-height":"0px",
                        "position":"relative",
                        "float":"right",
                        "right":"10px"
                    }).appendTo(liEle);
//                    buttonEle.id=buttonEle.attr("id");
                    liEle.button=new Button({
                        container:liEle.find("#list_"+self.count),
                        text:locale.get("delete1"),
                        events:{
                            click:function(context,args,event){
                                if(event.target.nodeName.toLowerCase()=="a"){
                                    var liEle=$(event.target).parent().parent();
                                }else{
                                    var liEle=$(event.target).parent().parent().parent();
                                }
                                cloud.util.mask("li.heavy_line");
                                cloud.Ajax.request({
                                    url:"api/black_white/"+liEle.find("span.left-margin").attr("id"),
                                    type:"DELETE",
                                    success:function(data){
                                        liEle.remove();
                                        liEle=null;
                                        cloud.util.unmask("li.heavy_line");
                                    }
                                });
                            },
                            scope:self
                        }
                    });
//                    liEle.button.hide();
//                    self.whiteCollection.push(liEle);
                    self.whiteCollection.push(liEle);
                    liEle.appendTo(whiteUl);
                }
            }
            if(opt.black&&opt.black.length!=0){
                for(var j=0;j<opt.black.length;j++){
                    self.count++;
                    var liEle=$("<li></li>").addClass("white-black-list-li");
                    if(j%2==0){
                        liEle.addClass("jishuhang");
                    }else{
                        liEle.addClass("oushuhang");
                    }
                    spanEle=$("<span></span>").appendTo(liEle).text(opt.black[j].name).addClass("website_description left-margin").css({
//                        "text-algin":"center"
                    }).attr({
                        "id":opt.black[j]._id,
                        "title":opt.black[j].name
                    });
                    var buttonEle=$("<span></span>").attr({
                        "id":"list_"+self.count
                    }).css({
                        "line-height":"0px",
                        "position":"relative",
                        "float":"right",
                        "right":"10px"
                    }).appendTo(liEle);
//                    buttonEle.id=buttonEle.attr("id");s
                    liEle.button=new Button({
                        container:liEle.find("#list_"+self.count),
                        text:locale.get("delete1"),
                        events:{
                            click:function(context,args,event){
                                if(event.target.nodeName.toLowerCase()=="a"){
                                    var liEle=$(event.target).parent().parent();
                                }else{
                                    var liEle=$(event.target).parent().parent().parent();
                                }
                                cloud.util.mask("li.heavy_line");
                                cloud.Ajax.request({
                                    url:"api/black_white/"+liEle.find("span.left-margin").attr("id"),
                                    type:"DELETE",
                                    success:function(data){
                                        liEle.remove();
                                        liEle=null;
                                        cloud.util.unmask("li.heavy_line");
                                    }
                                });
                            },
                            scope:self
                        }
                    });
//                    liEle.button.hide();
//                    self.blackCollection.push(liEle);
                    self.blackCollection.push(liEle);
                    liEle.appendTo(blackUl);
                }
            }
        },
        getPortalConfigFormDualwifi_1_1:function(data){
            var self=this;
            var result="";
            result=result+self.templateDualWifiForAll;
            self.templateShit="";
            //if(self.formData.config_switch){
            if(!data.multi_ssid&&!data.multi_ap){
                //有推送网址，供着shit 5G使用
                self.templateShit="!\r\n" +
                "bridge 1\r\n" +
                "interface bridge 1\r\n" +
                "ip address 10.10.10.10  255.255.0.0\r\n" +
                "ip dhcp-server range 10.10.20.1 10.10.40.255\r\n"+
                "ip dhcp-server enable\r\n" +
                "!\r\n" +
                "interface dot11radio 1\r\n" +
                "\tbridge-group 1\r\n" +
                "!\r\n" +
                "interface dot11radio 2\r\n" +
                "\tbridge-group 1\r\n" +
                "!\r\n" +
                "ip host qq.360yutu.cn 10.10.10.10 \r\n"+
                "ip host qq.u2wifi.cn 10.10.10.10 \r\n"+
                "ip host #{host} 10.10.10.10 \r\n"+
                "!\r\n";
                result=result+self.templateDualWifiNoMultiSsidNoMultiAp;
                var template_1=new Template(self.templateDualWifiSsidAlone);
                result=result+template_1.evaluate(data);
                var templateStr;
                if(data.pwd){
                    templateStr=self.onlyOneSsidWithPwd;
                    var template_2=new Template(templateStr);
                    result=result+template_2.evaluate(data);
                    var template_3=new Template(self.templateDualWifiDefaultSsidAlone);
                    result=result+template_3.evaluate(data);
                    var template_4=new Template(self.onlyOneDefaultSsidWithPwd);
                    result=result+template_4.evaluate(data);
                }else{
                    templateStr=self.dualWifiOnlyOneSsidWithNoPwd;
                    var template_2=new Template(templateStr);
                    result=result+template_2.evaluate(data);
                    var template_3=new Template(self.templateDualWifiDefaultSsidAlone);
                    result=result+template_3.evaluate(data);
                    var template_4=new Template(self.dualWifiOnlyOneSsidWithNoPwdWith5G);
                    result=result+template_4.evaluate(data);
                }

            }else if(data.multi_ssid&&!data.multi_ap){
                //result=result+self.templateWithMultiSsidNoMultiAp;
                result=result+self.templateDualWifiWithMultiSsidNoMultiAp;
                data.order=1;
                if(data.pwd){
                    var template_1=new Template(self.templateMultiSsidNoPwd);
                    result=result+template_1.evaluate(data);
                    var template_2=new Template(self.templateMultiSsidWithPwd);
                    result=result+template_2.evaluate(data);
                    result=result+self.templateEndSsidList;
                    //美国车载wifi要求注释掉
                    //var template_3=new Template(self.templateDualWifiMultiSsidNoPwd);
                    //result=result+template_3.evaluate(data);
                    //var template_4=new Template(self.templateDualWifiMultiSsidWithPwd);
                    //result=result+template_4.evaluate(data);
                    //result=result+self.templateEndSsidList;
                }else{
                    var template_1=new Template(self.templateMultiSsidNoPwd1_1);
                    result=result+template_1.evaluate(data);
                    result=result+self.templateEndSsidList;
                    //美国车载wifi要求注释掉
                    //var template_2=new Template(self.templateDualWifiMultiSsidNoPwd1_1);
                    //result=result+template_2.evaluate(data);
                    //result=result+self.templateEndSsidList;
                }
                var arraySsidList=data.ssid_arr;
                arraySsidList.map(function (one,i) {
                    one.order=i+2;
                    if(one.ssid){
                        one.ssid_number="1."+one.order;
                        one.ssid_5g="2."+one.order;
                        var preIp="192.169."+one.order;
                        one.ip_address=preIp+".1";
                        one.start_ip=preIp+".2";
                        one.end_ip=preIp+".254";
                        one.ip_block="255.255.255.0";
                    }
                });
                var tempResult="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_3=new Template(self.templateMultiSsidNoPwd);
                        tempResult=tempResult+template_3.evaluate(one);
                        if(one.pwd){
                            var template_4=new Template(self.templateMultiSsidWithPwd);
                            tempResult=tempResult+template_4.evaluate(one);
                        }
                        tempResult=tempResult+self.templateEndSsidList;
                        //美国车载WiFi要求注释掉
                        //var template_4=new Template(self.templateDualWifiMultiSsidNoPwd);
                        //tempResult=tempResult+template_4.evaluate(one);
                        //if(one.pwd){
                        //    var template_5=new Template(self.templateDualWifiMultiSsidWithPwd);
                        //    tempResult=tempResult+template_5.evaluate(one);
                        //}
                        //tempResult=tempResult+self.templateEndSsidList;
                    }
                });
                result=result+tempResult;

                result=result+self.templateMultiSsidStart;
                var template_5=new Template(self.templateMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templateMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;
                result=result+self.templateDualWifiMultiSsidStart;
                var template_5=new Template(self.templdateDualWifiMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateDualWifiMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templdateDualWifiMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateDualWifiMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;

                data.ssid_number="1.1";
                data.ip_address="10.10.10.10";
                data.start_ip="10.10.20.1";
                data.end_ip="10.10.40.255";
                data.ip_block="255.255.0.0";
                data.ssid_5g="2.1";
                var template_9=new Template(self.templateDualWifiSsidBlock);
                result=result+template_9.evaluate(data);
                var listBlock="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        listBlock=listBlock+template_9.evaluate(one);
                    }
                });
                result=result+listBlock;
            }else if(!data.multi_ssid&&data.multi_ap){
                result=result+self.templateNoMultiSsidWithMultiApPre;
                result=result+"no satemgmt enable\r\n";
                var template_1=new Template(self.templateDualWifiSsidAlone);
                result=result+template_1.evaluate(data);
                var tempStr="";
                if(data.pwd){
                    tempStr=self.onlyOneSsidWithPwd;
                    var template_2=new Template(tempStr);
                    result=result+template_2.evaluate(data);
                    var template_3=new Template(self.templateDualWifiDefaultSsidAlone);
                    result=result+template_3.evaluate(data);
                    var template_4=new Template(self.onlyOneDefaultSsidWithPwd);
                    result=result+template_4.evaluate(data);
                }else{
                    tempStr=self.dualWifiOnlyOneSsidWithNoPwd;
                    var template_2=new Template(tempStr);
                    result=result+template_2.evaluate(data);
                    var template_3=new Template(self.templateDualWifiDefaultSsidAlone);
                    result=result+template_3.evaluate(data);
                    var template_4=new Template(self.dualWifiOnlyOneSsidWithNoPwdWith5G);
                    result=result+template_4.evaluate(data);
                }
                result=result+self.templateDualWifiNoMultiSsidWithMultiApSuff;
            }else{
                result=result+self.templateMultiSsidMultiAp;
                data.order=1;
                var template_0=new Template(self.templateMultiSsidNoPwd);
                result=result+template_0.evaluate(data);
                result=result+self.templateEndSsidList;
                //美国车载
                //var template=new Template(self.templateDualWifiMultiSsidNoPwd);
                //result=result+template.evaluate(data);
                //result=result+self.templateEndSsidList;
                if(data.pwd){
                    var template_1=new Template(self.templateMultiSsidNoPwd);
                    result=result+template_1.evaluate(data);
                    var template_2=new Template(self.templateMultiSsidWithPwd);
                    result=result+template_2.evaluate(data);
                    result=result+self.templateEndSsidList;
                    //美国车载
                    //var template_3=new Template(self.templateDualWifiMultiSsidNoPwd);
                    //result=result+template_3.evaluate(data);
                    //var template_4=new Template(self.templateDualWifiMultiSsidWithPwd);
                    //result=result+template_4.evaluate(data);
                    //result=result+self.templateEndSsidList;
                }
                var arraySsidList=data.ssid_arr;
                arraySsidList.map(function (one,i) {
                    one.order=i+2;
                    if(one.ssid){
                        one.ssid_number="1."+one.order;
                        one.ssid_5g="2."+one.order;
                        var preIp="192.169."+one.order;
                        one.ip_address=preIp+".1";
                        one.start_ip=preIp+".2";
                        one.end_ip=preIp+".254";
                        one.ip_block="255.255.255.0";
                    }
                });
                var tempResult="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_3=new Template(self.templateMultiSsidNoPwd);
                        tempResult=tempResult+template_3.evaluate(one);
                        if(one.pwd){
                            var template_4=new Template(self.templateMultiSsidWithPwd);
                            tempResult=tempResult+template_4.evaluate(one);
                        }
                        tempResult=tempResult+self.templateEndSsidList;
                    }
                });
                result=result+tempResult;
                result=result+self.templateMultiSsidStart;
                var template_5=new Template(self.templateMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templateMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;
                result=result+self.templateDualWifiMultiSsidStart;
                var template_5=new Template(self.templdateDualWifiMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateDualWifiMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templdateDualWifiMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateDualWifiMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;
                result=result+self.templateDualWifiMultiSsidMultiApMid;
                data.ssid_number="1.1";
                data.ssid_5g="2.1";
                data.ip_address="10.10.10.10";
                data.start_ip="10.10.20.1";
                data.end_ip="10.10.40.255";
                data.ip_block="255.255.0.0";
                var template_9=new Template(self.templateDualWifiBridgeblock);
                result=result+template_9.evaluate(data);
                var listBlock="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        listBlock=listBlock+template_9.evaluate(one);
                    }
                });
                result=result+listBlock;
                result=result+self.templateMultiSsidMultiApSuff;
            }
            //}
            return result;
        },
        getPortalConfigForm_1_1:function(data){
            var self=this;
            var result="";
            result=result+self.templateForAll;
            //if(self.formData.config_switch){
            if(!data.multi_ssid&&!data.multi_ap){
                var template_1=new Template(self.templateNoMultiSsidNoMultiAp);
                result=result+template_1.evaluate(data);
                var templateStr;
                if(data.pwd){
                    templateStr=self.onlyOneSsidWithPwd;

                }else{
                    templateStr=self.onlyOneSsidWithNoPwd;
                }
                var template_2=new Template(templateStr);
                result=result+template_2.evaluate(data);
            }else if(data.multi_ssid&&!data.multi_ap){
                result=result+self.templateWithMultiSsidNoMultiAp;
                data.order=1;
                if(data.pwd){
                    var template_1=new Template(self.templateMultiSsidNoPwd);
                    result=result+template_1.evaluate(data);
                    var template_2=new Template(self.templateMultiSsidWithPwd);
                    result=result+template_2.evaluate(data);
                }else{
                    var template_1=new Template(self.templateMultiSsidNoPwd1_1);
                    result=result+template_1.evaluate(data);
                }
                result=result+self.templateEndSsidList;
                var arraySsidList=data.ssid_arr;
                arraySsidList.map(function (one,i) {
                    one.order=i+2;
                    if(one.ssid){
                        one.ssid_number="1."+one.order;
                        var preIp="192.169."+one.order;
                        one.ip_address=preIp+".1";
                        one.start_ip=preIp+".2";
                        one.end_ip=preIp+".254";
                        one.ip_block="255.255.255.0";
                    }
                });
                var tempResult="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_3=new Template(self.templateMultiSsidNoPwd);
                        tempResult=tempResult+template_3.evaluate(one);
                        if(one.pwd){
                            var template_4=new Template(self.templateMultiSsidWithPwd);
                            tempResult=tempResult+template_4.evaluate(one);
                        }
                        tempResult=tempResult+self.templateEndSsidList;
                    }
                });
                result=result+tempResult;
                result=result+self.templateMultiSsidStart;
                var template_5=new Template(self.templateMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templateMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;
                data.ssid_number="1.1";
                data.ip_address="10.10.10.10";
                data.start_ip="10.10.20.1";
                data.end_ip="10.10.40.255";
                data.ip_block="255.255.0.0";
                var template_9=new Template(self.templateSsidBlock);
                result=result+template_9.evaluate(data);
                var listBlock="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        listBlock=listBlock+template_9.evaluate(one);
                    }
                });
                result=result+listBlock;
            }else if(!data.multi_ssid&&data.multi_ap){
                result=result+self.templateNoMultiSsidWithMultiApPre;
                var template_1=new Template(self.templateNoMultiSsidWithMultiApShort);
                result=result+template_1.evaluate(data);
                var tempStr="";
                if(data.pwd){
                    tempStr=self.onlyOneSsidWithPwd;
                }else{
                    tempStr=self.templateNoMultiSsidWithMultiApNoPwd;
                }
                var template_2=new Template(tempStr);
                result=result+template_2.evaluate(data);
                result=result+self.templateNoMultiSsidWithMultiApSuff;
            }else{
                result=result+self.templateMultiSsidMultiAp+self.templateMultiSsidMultiApPre;
                data.order=1;
                if(data.pwd){
                    var template_1=new Template(self.templateMultiSsidNoPwd);
                    result=result+template_1.evaluate(data);
                    var template_2=new Template(self.templateMultiSsidWithPwd);
                    result=result+template_2.evaluate(data);
                }else{
                    var template_1=new Template(self.templateMultiSsidNoPwd1_1);
                    result=result+template_1.evaluate(data);
                }
                result=result+self.templateEndSsidList;
                var arraySsidList=data.ssid_arr;
                arraySsidList.map(function (one,i) {
                    one.order=i+2;
                    if(one.ssid){
                        one.ssid_number="1."+one.order;
                        var preIp="192.169."+one.order;
                        one.ip_address=preIp+".1";
                        one.start_ip=preIp+".2";
                        one.end_ip=preIp+".254";
                        one.ip_block="255.255.255.0";
                    }
                });
                var tempResult="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_3=new Template(self.templateMultiSsidNoPwd);
                        tempResult=tempResult+template_3.evaluate(one);
                        if(one.pwd){
                            var template_4=new Template(self.templateMultiSsidWithPwd);
                            tempResult=tempResult+template_4.evaluate(one);
                        }
                        tempResult=tempResult+self.templateEndSsidList;
                    }
                });
                result=result+tempResult;
                result=result+self.templateMultiSsidStart;
                var template_5=new Template(self.templateMultiSsidList);
                result=result+template_5.evaluate(data);
                if(data.pwd){
                    var template_6=new Template(self.templateMultiSsidLock);
                    result=result+template_6.evaluate(data);
                }
                arraySsidList.each(function(one){
                    if(one.ssid){
                        var template_7=new Template(self.templateMultiSsidList);
                        result=result+template_7.evaluate(one);
                        if(one.pwd){
                            var template_8=new Template(self.templateMultiSsidLock);
                            result=result+template_8.evaluate(one);
                        }
                    }
                });
                result=result+self.templateEndSsidList;
                result=result+self.templateMultiSsidMultiApMid;
                data.ssid_number="1.1";
                data.ip_address="10.10.10.10";
                data.start_ip="10.10.20.1";
                data.end_ip="10.10.40.255";
                data.ip_block="255.255.0.0";
                var template_9=new Template(self.templateBridgeblock);
                result=result+template_9.evaluate(data);
                var listBlock="";
                arraySsidList.each(function(one){
                    if(one.ssid){
                        listBlock=listBlock+template_9.evaluate(one);
                    }
                });
                result=result+listBlock;
                result=result+self.templateMultiSsidMultiApSuff;
            }
            //}
            return result;
        },
        getPortalConfigForm:function(){
            var self=this;
            var data={};
            cloud.util.mask("#portal_config_wrapper");
            cloud.Ajax.request({
                url:"api/publish_point",
                type:"GET",
                parameters:{
                    verbose:100,
                    limit:0,
                    status:1
                },
                success:function(returnData){
                    if(self.formData.config_switch){
                        var tempObjForOldSsid={};
                        tempObjForOldSsid.oldSsid=self.formData.ssid;
                        data.config_switch=self.formData.config_switch;
                        data.ssid=self.portalConfigForm.find("#hot_pot_name").val();
                        data.homepage=self.portalConfigForm.find("#portal_website").val();
                        data.homepage=data.homepage.replace(/^[a-z]*:\/\//,"");
                        data.pwd=self.portalConfigForm.find("#first_ssid_pwd").val();
                        data.multi_ssid=self.portalConfigForm.find("#multi_ssid_yes").attr("checked");
                        var obj=[];
                        var name_2=self.portalConfigForm.find("#hot_pot_name_2").val();
                        var pwd_2=self.portalConfigForm.find("#second_ssid_pwd").val();
                        var name_3=self.portalConfigForm.find("#hot_pot_name_3").val();
                        var pwd_3=self.portalConfigForm.find("#third_ssid_pwd").val();
                        var name_4=self.portalConfigForm.find("#hot_pot_name_4").val();
                        var pwd_4=self.portalConfigForm.find("#forth_ssid_pwd").val();
                        var tempObj={};
                        tempObj.ssid=name_2;
                        tempObj.pwd=pwd_2;
                        obj[0]=tempObj;
                        var tempObj1={};
                        tempObj1.ssid=name_3;
                        tempObj1.pwd=pwd_3;
                        obj[1]=tempObj1;
                        var tempObj2={};
                        tempObj2.ssid=name_4;
                        tempObj2.pwd=pwd_4;
                        obj[2]=tempObj2;
                        data.ssid_arr=obj;
                        data.multi_ap=self.portalConfigForm.find("#multi_ap_yes").attr("checked");
//                    var _position=data.homepage.indexOf("/");
                        var tempHomepage=data.homepage;
//                    if(_position!=-1){
//                        data.homepage=data.homepage.slice(0,_position)
//                    }

                        data.host = tempHomepage.replace(/^[a-z]*:\/\//,"");
                        var _position = data.host.indexOf("/");
                        if(_position!=-1){
                            data.host=data.host.slice(0,_position)
                        }

                        var radioChecked=self.portalConfigForm.find("#point_yes").attr("checked");
                        data.ip=radioChecked;
                        var reloginRadio=self.portalConfigForm.find("#use_yes").attr("checked");
                        data.relogin=reloginRadio;
                        data.mode={};
                        var one_click=self.portalConfigForm.find("#a_key_to_internet").attr("checked");
                        data.mode.one_click=one_click;
                        var sms=self.portalConfigForm.find("#sms_renzheng").attr("checked");
                        data.mode.sms=sms;
                        var weixin=self.portalConfigForm.find("#wechat_renzheng").attr("checked");
                        var randomNumber=self.portalConfigForm.find("#random_number").val();
                        data.mode.weixin={};
                        data.mode.weixin.randomNumber=randomNumber;
                        data.mode.weixin.weixin=weixin;
                        var wechat=self.portalConfigForm.find("#wechat_wifi").attr("checked");
                        wechat=true;
                        data.mode.wechat=wechat;
                        //如果打开了微信连wifi，则关闭微信验证码
                        if(data.mode.wechat){
                            data.mode.weixin.weixin="";
                        }
                        var qq=self.portalConfigForm.find("#qq_renzheng").attr("checked");
                        data.mode.qq=qq;
                        var weibo=self.portalConfigForm.find("#sina_webo_renzheng").attr("checked");
                        data.mode.weibo=weibo;
                        data.relogin_period=self.portalConfigForm.find("#portal_forced_to_login_in").val();
//                    data.memberAuth=[];
                        var result_1="";
                        if(tempObjForOldSsid.oldSsid!=data.ssid){
                            var template_random=new Template(self.templateStrUpdateSsid);
                            var result_1=template_random.evaluate(tempObjForOldSsid);
                        }
                        var template_1=new Template(self.templateStrWithoutPortal);
                        result_1=result_1+template_1.evaluate(data);
                        var resultNew_1=self.getPortalConfigForm_1_1(data);
                        var resultShit=self.getPortalConfigFormDualwifi_1_1(data);
                        var template_1_1=new Template(self.templateStrPortalHomepage);
                        result_1=result_1+template_1_1.evaluate(data);
                        resultNew_1=resultNew_1+template_1_1.evaluate(data);
                        resultShit=resultShit+template_1_1.evaluate(data);
                        var templateStr,templateStr1_1,templateStrShit;
                        if(data.ip){
                            templateStr=self.templateStrWithHostIp;
                            if(!data.multi_ssid&&!data.multi_ap){
                                templateStr1_1=self.templateStrWithHostIp1_1;
                                templateStrShit=self.templateShit;
                            }else{
                                templateStrShit=templateStr1_1=self.templateStrWithHostIp1_2;
                            }
                        }else{
                            templateStrShit=templateStr=templateStr1_1=self.templateStrNoHostIp;
                        }
                        var template_2=new Template(templateStr);
                        var result_2=template_2.evaluate(data);
                        result_1=result_1+result_2;
                        var template_2_1=new Template(templateStr1_1);
                        var result_2_1=template_2_1.evaluate(data);
                        resultNew_1=resultNew_1+result_2_1;
                        var template_shit=new Template(templateStrShit);
                        resultShit=resultShit+template_shit.evaluate(data);
                        var template_3=new Template(self.templateStrWithPeriod);
                        var result_3;
                        if(data.relogin){
                            result_3=template_3.evaluate(data);
                        }else{
                            result_3=self.templateStrNoPeriod;
                        }
                        var result_3_1;
                        if(data.mode.wechat){
                            data.relogin_period=480;
                            result_3=template_3.evaluate(data);
                            var template_3_1=new Template(self.templateStrWifiLoginTimeout);
                            result_3_1=template_3_1.evaluate(data);
                        }else{
                            result_3_1=self.templateStrNoWifiLoginTimeout;
                        }
                        result_1=result_1+result_3;
                        resultNew_1=resultNew_1+result_3;
                        resultShit=resultShit+result_3;
                        result_1=result_1+result_3_1;
                        resultNew_1=resultNew_1+result_3_1;
                        resultShit=resultShit+result_3_1;
                        var result_4="no remote-sync\r\nno chronos\r\n";
                        var result_4_1="no remote-sync\r\nno chronos\r\n";
                        returnData.result.each(function(one){
                            if(one.priority==1){
                                one.priority="high";
                            }else if(one.priority==2){
                                one.priority="medium";
                            }else if(one.priority==3){
                                one.priority="low";
                            }
                            one.syncCycleTime=one.syncCycleTime/(1000*60);
                            if(one.syncCycleTime<=30){
                                one.unit="every-minutes";
                            }else if(one.syncCycleTime>30&&one.syncCycleTime<1440){
                                one.syncCycleTime=one.syncCycleTime/60;
                                one.unit="every-hours";
                            }else if(one.syncCycleTime>1440){
                                one.syncCycleTime=one.syncCycleTime/1440;
                                one.unit="every-days";
                            }
                            var template_4=new Template(self.templateStrPortal);
                            var result=template_4.evaluate(one);
                            result_4=result_4+result;
                            result_4_1=result_4_1+result;
                        });
                        result_1=result_1+result_4+self.templateForAds;
                        resultNew_1=resultNew_1+result_4_1+self.templateForAds;
                        resultShit=resultShit+result_4_1+self.templateForAds;
                        if(data.mode.one_click){
                            var templateMode=new Template(self.templateAuthenticationModeYes);

                        }else{
                            var templateMode=new Template(self.templateAuthenticationModeNo);
                        }
                        var tempObj={};
                        tempObj.mode="one-click";
                        var result_5=templateMode.evaluate(tempObj);
                        if(data.mode.sms){
                            templateMode=new Template(self.templateAuthenticationModeYes);
                        }else{
                            templateMode=new Template(self.templateAuthenticationModeNo);
                        }
                        tempObj.mode="sms";
                        result_5=result_5+templateMode.evaluate(tempObj);
                        if(data.mode.weixin.weixin){
                            templateMode=new Template(self.templateAuthenticationModeYes);
                        }else{
                            templateMode=new Template(self.templateAuthenticationModeNo);
                        }
                        tempObj.mode="weixin";
                        result_5=result_5+templateMode.evaluate(tempObj);
                        if(data.mode.wechat){
                            templateMode=new Template(self.templateAuthenticationModeYes);
                        }else{
                            templateMode = new Template(self.templateAuthenticationModeNo);
                        }
                        tempObj.mode="wechat";
                        result_5=result_5+templateMode.evaluate(tempObj);
                        if(data.mode.weibo){
                            templateMode=new Template(self.templateAuthenticationModeYes);
                        }else {
                            templateMode = new Template(self.templateAuthenticationModeNo);
                        }
                        tempObj.mode="weibo";
                        result_5=result_5+templateMode.evaluate(tempObj);
                        if(data.mode.qq){
                            templateMode=new Template(self.templateAuthenticationModeYes);
                        }else{
                            templateMode=new Template(self.templateAuthenticationModeNo);
                        }
                        tempObj.mode="qq";
                        result_5=result_5+templateMode.evaluate(tempObj);
                        result_5=result_5+"!\r\n";
                        data.config=result_1+result_5+self.templateStrEnd;
                        data.config_1_1=resultNew_1+result_5+self.templateStrEnd;
                        data.config_dualwifi=resultShit+result_5+self.templateStrEnd;
//                    var listObj=self.getWhiteBlackList();
//                    data.black=listObj.black;
//                    data.white=listObj.white;
//                    return data;
                        data.homepage=tempHomepage;
                        self.data=data;
                    }else{
                        //var data={};
                        data.config=self.templateForAll+"!\r\n"+self.templateStrEnd;
                        data.config_1_1=data.config;
                        data.config_dualwifi=data.config;
                        self.data=data;
                    }
                    self.data.config_switch=self.formData.config_switch;
                    cloud.Ajax.request({
                        url:"api/devices",
                        type:"GET",
                        parameters:{
                            verbose:100,
                            limit:0
                        },
                        success:function(data){
                            var tempArr=[];
                            data.result.each(function(one){
                                var tempObj={};
                                tempObj.deviceId=one._id;
                                tempObj.deviceName=one.name;
                                tempObj.siteId=one.siteId;
                                tempObj.siteName=one.siteName;
                                tempArr.push(tempObj);
                            });
                            self.data.devices=tempArr;
                            self.submit();
                        }
                    });

                }
            })
        },
        submit:function(){
            var self=this;
            var config_1_1,config_dualwifi,config;
            config_1_1=self.data.config_1_1;
            config_dualwifi=self.data.config_dualwifi;
            config=self.data.config;
            delete self.data.config;
            delete self.data.config_dualwifi;
            delete self.data.config_1_1;
            cloud.Ajax.request({
                url:"api/content_sync/public_config",
                type:"POST",
                data:{
                    config:config,
                    frontEndConfig:JSON.stringify(self.data),
                    devices:self.data.devices,
                    config1_1:config_1_1,
                    config_dualwifi:config_dualwifi
                },
                success:function(data){
                    self.formData=self.data;
                    self.statusFlag=self.formData.config_switch;
                    self.originConfigSwitch=self.formData.config_switch;
                    if(!self.formData.config_switch){
                        self.editButton.hide();
                        self.startConfigButton.show();
                    }
                    self.saveFlowThreshold();
                    cloud.util.unmask("#portal_config_wrapper");
                }
            })
        },
        saveFlowThreshold:function(){
            var self=this;
            var limit=self.portalConfigForm.find("#flow_config_threshold").val();
            cloud.Ajax.request({
                url:"api/traffic/limit",
                type:"POST",
                data:{
                	limit:parseInt(limit*1024)
                },
                success:function(data){
                    
                }
            })
        },
        renderFlowThreshold:function(){
            var self=this;
            cloud.Ajax.request({
                url:"api/traffic/limit",
                type:"GET",
                success:function(data){
                	var limit=data.limit;
                	limit=limit/1024;
                	limit=limit.toFixed(2);
                	self.portalConfigForm.find("#flow_config_threshold").val(limit);
                }
            })
        },
//        getWhiteBlackList:function(){
//            var self=this;
//            var whiteList=self.portalConfigForm.find("#real_white_list");
//            var blackList=self.portalConfigForm.find("#real_black_list");
//            var whiteListSpan=whiteList.find("span.left-margin");
//            var blackListSpan=blackList.find("span.left-margin");
//            var whiteListArr=[];
//            var blackListArr=[];
//            for(var i=0;i<whiteListSpan.size();i++){
//                whiteListArr.push($(whiteListSpan[i]).text());
//            }
//            var whiteListSpan=blackList.find("span.left-margin");
//            for(var j=0;j<blackListSpan.size();j++){
//                blackListArr.push($(blackListSpan[j]).text());
//            }
//            return {
//                black:blackListArr,
//                white:whiteListArr
//            }
//        },
        enableInput:function(){
            var self=this;
            self.portalConfigForm.find("#hot_pot_name").removeAttr("disabled");
            self.portalConfigForm.find("#portal_website").removeAttr("disabled");
            self.portalConfigForm.find("#flow_config_threshold").removeAttr("disabled");
            self.portalConfigForm.find("input[name=point_to_router_checkbox]").removeAttr("disabled");
            self.portalConfigForm.find("#portal_forced_to_login_in").removeAttr("disabled");
            self.portalConfigForm.find("input[name=portal_forced_to_login_in_checkbox]").removeAttr("disabled");
            self.portalConfigForm.find("ul#member_autenticate_wrapper input").removeAttr("disabled");
            var flag=self.portalConfigForm.find("#wechat_wifi").attr("checked");
            if(flag){
                self.portalConfigForm.find("#wechat_renzheng").attr({
                    "checked":false,
                    "disabled":"disabled"
                }).end()
                .find("#sina_webo_renzheng").attr({
                    "checked":false,
                    "disabled":"disabled"
                }).end()
                .find("#qq_renzheng").attr({
                    "checked":false,
                    "disabled":"disabled"
                }).end()
                    .find("#use_yes").attr({
                        "disabled":"disabled"
                    }).end()
                    .find("#use_no").attr({
                        "disabled":"disabled"
                    }).end()
                    .find("#portal_forced_to_login_in").attr({
                        "disabled":"disabled"
                    });
            };
            self.portalConfigForm.find("input[name=enable_multi_ssid_checkbox]").removeAttr("disabled").end()
                .find("input[name=multi_ap_checkbox]").removeAttr("disabled").end()
                .find("#first_ssid_pwd").removeAttr("disabled").end()
                .find(".multi_ssid input").removeAttr("disabled");
            self.portalConfigForm.find("span#get_again").show();
            self.getUrlButton.show();
            self.submitConfigBtn.show();
            self.cancellConfigBtn.show();
//            self.portalConfigForm.find("#show_when_edit_model").show();
//            self.whiteCollection.each(function(one){
//                one.button.show();
//            });
//            self.blackCollection.each(function(one){
//                one.button.show();
//            });
//            self.tempBlackCollection.each(function(one){
//                one.button.show();
//            });
//            self.tempWhiteCollection.each(function(one){
//                one.button.show();
//            });
        },
        disableInput:function(){
            var self=this;
            self.portalConfigForm.find("#hot_pot_name").attr({
                "disabled":"disabled"
            });
            self.portalConfigForm.find("#portal_website").attr({
                "disabled":"disabled"
            });
            self.portalConfigForm.find("input[name=point_to_router_checkbox]").attr({
                "disabled":"disabled"
            });
            self.portalConfigForm.find("#portal_forced_to_login_in").attr({
                "disabled":"disabled"
            });

            self.portalConfigForm.find("#flow_config_threshold").attr({
                "disabled":"disabled"
            });

            self.portalConfigForm.find("input[name=portal_forced_to_login_in_checkbox]").attr({
                "disabled":"disabled"
            });
            self.portalConfigForm.find("ul#member_autenticate_wrapper input").attr({
                "disabled":"disabled"
            });
            self.portalConfigForm.find("input[name=enable_multi_ssid_checkbox]").attr({
                "disabled":"disabled"
            }).end()
                .find("input[name=multi_ap_checkbox]").attr({
                    "disabled":"disabled"
                }).end()
                .find("#first_ssid_pwd").attr({
                    "disabled":"disabled"
                }).end()
                .find(".multi_ssid input").attr({
                    "disabled":"disabled"
                });
            self.portalConfigForm.find("#website_going_added").val("");
//            self.portalConfigForm.find("#show_when_edit_model").hide();
            self.portalConfigForm.find("span#get_again").hide();
            self.portalConfigForm.find("li.wechat_code_warns").hide();
//            self.getUrlButton.hide();
            self.submitConfigBtn.hide();
            self.cancellConfigBtn.hide();
//            self.whiteCollection.each(function(one){
//                one.button.hide();
//            });
//            self.blackCollection.each(function(one){
//                one.button.hide();
//            });
//            self.tempBlackCollection.each(function(one){
//                one.button.hide();
//            });
//            self.tempWhiteCollection.each(function(one){
//                one.button.hide();
//            });
        },
        renderButtons:function(){
            var self=this;
            self.addToButton=new Button({
                container:self.portalConfigForm.find("#add_to"),
                text:locale.get("add_to"),
                events:{
                    click:function(){
                        var flag=$("#website_going_added").val();
                        if(flag){
                            cloud.util.mask(".heavy_line");
                            cloud.Ajax.request({
                                url:"api/black_white",
                                type:"POST",
                                data:{
                                    blackOrWhite:self.portalConfigForm.find("#list_select_wb").val(),
                                    type:1,
                                    name:flag
                                },
                                success:function(data){
                                    self.createLine(data.result);
                                    cloud.util.unmask(".heavy_line");
                                }
                            });
                            ;
                        }else{
                            $("#website_going_added").focus();
                        }
                    },
                    scope:this
                }
            });
            self.submitConfigBtn=new Button({
                container:self.portalConfigForm.find("#submit_config"),
                text:locale.get("submit"),
                events:{
                    click:function(){
                        if(validator.result(self.portalConfigForm)){
                            self.getPortalConfigForm();
                            self.disableInput();
                            self.editButton.show();
                            self.startConfigButton.hide();
                            self.closeConfigButton.hide();
                            self.cancellConfigBtn.enable();
                            self.saveFlag=1;
                        }
//                        self.window.destroy();
//                        self.destroy();
                    },
                    scope:this
                }
            });
            self.cancellConfigBtn=new Button({
                container:self.portalConfigForm.find("#cancell_config"),
                text:locale.get("cancelText"),
                events:{
                    click:function(){
                        self.tempBlackCollection=[];
                        self.tempWhiteCollection=[];
                        self.blackCollection=[];
                        self.whiteCollection=[];
                        self.formData.config_switch=self.originConfigSwitch;
                        if(typeof self.statusFlag=="undefined"){
                            self.statusFlag=self.formData.config_switch;
                        }
                        if(!self.statusFlag){
                            self.closeConfigButton.hide();
                            self.startConfigButton.show();
                            self.editButton.hide();
                            self.portalConfigForm.find("li.multi_config_1_1").hide("linear").find("*").hide("linear").end()
                                .find("input[type=text]").val("");
                        }
                        if(self.formData.config_switch){
                            self.portalConfigForm.find("li.multi_config_1_1").show("linear").find("*").show("linear");
                            self.portalConfigForm.find("#wechat_wifi_li_check").hide();
                            self.setPortalConfigFormExceptList();
                            self.disableInput();
                            self.editButton.show();
                            self.startConfigButton.hide();
                            self.closeConfigButton.hide();
                        }else{
                            if(self.originConfigSwitch){
                                self.portalConfigForm.find("li.multi_config_1_1").hide("linear").find("*").hide("linear").end()
                                    .find("input[type=text]").val("");
                                self.setPortalConfigFormExceptList();
                                self.disableInput();
                                //self.editButton.show();
                                self.startConfigButton.show();
                                self.closeConfigButton.hide();
                            }
                        }
                        self.setPortalConfigFormExceptList();
                        self.disableInput();
                        if(!self.originConfigSwitch){
                            self.editButton.hide();
                            self.startConfigButton.show();
                        }else{
                            self.editButton.show();
                            self.startConfigButton.hide();
                            self.closeConfigButton.hide();
                        }
                    },
                    scope:this
                }
            });
            self.editButton=new Button({
                container:self.portalConfigForm.find("#edit_button"),
                title:locale.get("edit"),
                imgCls:"cloud-icon-edit",
                events:{
                    click:function(){
                        self.enableInput();
                        self.editButton.hide();
                        if(!self.formData.config_switch){
                            self.startConfigButton.show();
                            self.closeConfigButton.hide();
                        }else{
                            self.startConfigButton.hide();
                            self.closeConfigButton.show();
                        }
                    },
                    scope:this
                }
            });
            self.closeConfigButton=new Button({
                container:self.portalConfigForm.find("#close_config"),
                title:locale.get("close_config"),
                text:locale.get("close_config"),
                imgCls:null,
                events:{
                    click:function(){
                        self.formData.config_switch=false;
                        self.formData.closeConfigClick=true;
                        if(typeof self.statusFlag=="undefined"){
                            self.statusFlag=false;
                        }
                        self.closeConfigButton.hide();
                        self.startConfigButton.show();
                        self.portalConfigForm.find("li.multi_config_1_1").hide("linear").find("*").hide("linear").end()
                            .find("input[type=text]").val("");
                        self.portalConfigForm.find("#wechat_wifi_li_check").hide();
                    }
                }
            });
            self.closeConfigButton.hide();
            self.startConfigButton=new Button({
                container:self.portalConfigForm.find("#start_config"),
                title:locale.get("start_config"),
                imgCls:null,
                text:locale.get("start_config"),
                events:{
                    click:function(){
                        self.countNumber=1;
                        self.formData.config_switch=true;
                        self.formData.startConfigClick=true;
                        if(typeof self.statusFlag=="undefined"){
                            self.statusFlag=false;
                        }
                        if(self.formData.config_switch){
                            self.submitConfigBtn.show();
                            self.cancellConfigBtn.show();
                            self.cancellConfigBtn.enable();
                            self.enableInput();
                        }
                        self.closeConfigButton.show();
                        self.startConfigButton.hide();
                        self.portalConfigForm.find("li.multi_config_1_1").show("linear").find("*").show("linear");
                        self.portalConfigForm.find("#wechat_wifi_li_check").hide();
                        self.setPortalConfigFormExceptList();
                    }
                }
            });
            self.startConfigButton.hide();
            self.getUrlButton=new Button({
                container:self.portalConfigForm.find("span#get_url"),
                text:locale.get("generate_link"),
                events:{
                    click:function(){
//                        var value=self.portalConfigForm.find("#random_number").val();
//                       var urlStr="http://api.m.inhand.com.cn:5280/api/gateway/validate_code?grant_type=code&as_type=5&code="+encodeURIComponent(value);
//                        self.motaiHtml(urlStr);
                    },
                    scope:this
                }
            });
            ZeroClipboard.config({ swfPath: "../../cloud/resources/flashs/ZeroClipboard.swf" });
            var client=new ZeroClipboard($("span#get_url a")[0]);
            client.on("ready",function(readyEvent){
                client.on("copy",function(event){
                    var dataSource=document.getElementById("random_number");
                    var value=self.portalConfigForm.find("#random_number").val();
                    var urlStr="http://api.m.inhand.com.cn:5280/api/gateway/validate_code?grant_type=code&as_type=5&code="+encodeURIComponent(value);
                    client.setData("text/plain",urlStr);
                    self.motaiHtml(urlStr);
                })
            });
        },
        setMultSsidInfo:function(){
            var self=this;
            self.portalConfigForm.find("#first_ssid_pwd").val(self.formData.pwd);
            if(self.formData.multi_ssid){
                self.portalConfigForm.find("#multi_ssid_yes").trigger("click").attr({
                    "checked":true
                });
                var hash=self.formData.ssid_arr;
                var name_2=hash[0].ssid;
                var pwd_2=hash[0].pwd;
                var name_3=hash[1].ssid;
                var pwd_3=hash[1].pwd;
                var name_4=hash[2].ssid;
                var pwd_4=hash[2].pwd;
                self.portalConfigForm.find("#hot_pot_name_2").val(name_2).end()
                    .find("#second_ssid_pwd").val(pwd_2).end()
                    .find("#hot_pot_name_3").val(name_3).end()
                    .find("#third_ssid_pwd").val(pwd_3).end()
                    .find("#hot_pot_name_4").val(name_4).end()
                    .find("#forth_ssid_pwd").val(pwd_4);
            }else{
                self.portalConfigForm.find("#multi_ssid_no").trigger("click").attr({
                    "checked":true
                });
            }
            if(self.formData.multi_ap){
                self.portalConfigForm.find("#multi_ap_yes").trigger("click").attr({
                    "checked":true
                });;
            }else{
                self.portalConfigForm.find("#multi_ap_no").trigger("click").attr({
                    "checked":true
                });
            }
        },
        motaiHtml:function(str){
            var self = this;
            self.motaiEle = $("<div></div>").appendTo($("#ui-window-content").parent()).css({
                "position": "absolute",
                "width": "100%",
                "height": "100%",
                "background-color": "rgba(255,255,255,0)",
                "top": "0px",
                "left": "0px"
            });
            $("<div><p id='tips_motai'></p><div style='background-color:rgb(225, 242, 245) '><p id='system_tips' class='motai_text'></p><p id='text_description_sync' class='motai_text'></p></div><span id='yes_continue'></span><span id='no_continue'></span></div>").css({
                "margin": "150px 120px",
                "width": "400px",
                "height": "180px",
                "background-color": "rgb(255,255,255)",
                "border": "1px solid rgb(222,222,222)",
                "border-radius": "6px",
                "position": "absolute"
            }).appendTo(self.motaiEle);
            self.motaiEle.find("#tips_motai").text(locale.get("prompt")).css({
                "height": "35px",
                "font-size": "14px",
                "font-weight": "bold",
                "line-height": "35px",
                "margin-left": "10px"
            });
            self.motaiEle.find("#text_description_sync").text(str);
            self.motaiEle.find("#system_tips").text(locale.get("url_success"));
            var tempBtn=new Button({
                container: self.motaiEle.find("#yes_continue").css({
                    "margin-left": "330px",
                    "top": "10px",
                    "position": 'relative'
                }),
                text: locale.get("close"),
                events: {
                    click: function () {
                        self.motaiEle.remove();
//                        self.motaiEle = null;
//                        tempBtn=null;
                    },
                    scope: this
                }
            });
            self.motaiEle.find(".motai_text").css({
//                    "text-align": "center",
                "font-size": "14px",
//                    "width": "360px",
                "margin-left": "10px",
//                "margin-top":"35px",
                "border": "1px solid rgb(225, 242, 245)",
                "line-height": "20px",
                "background-color": "rgb(225, 242, 245)",
                "color": "rgb(0,0,0)",
                "border-radius": "6px"
            });
            self.motaiEle.find("#system_tips").css({
                "height":"30px",
                "line-height":"30px"
            });
            self.motaiEle.find("#text_description_sync").css({
                "height": "70px"
            });
        },
        createLine:function(data){
            var self=this;
            var website=self.portalConfigForm.find("input#website_going_added").val();
            var list=self.portalConfigForm.find("#list_select_wb").val();
            self.count++;
            if(list==0){
                self.portalConfigForm.find("span#whitelist_button").trigger("click");
                var whiteUl=self.portalConfigForm.find("#real_white_list");
                var liEle=$("<li></li>").addClass("white-black-list-li");
                liEle.addClass("jishuhang");
                var spanEle=$("<span></span>").appendTo(liEle).text(website).addClass("website_description left-margin").css({
//                    "text-align":"center"
                }).attr({
                    "title":website
                });
                var buttonEle=$("<span></span>").attr({
                    "id":"list_"+self.count
                }).css({
                    "line-height":"0px",
                    "position":"relative",
                    "float":"right",
                    "right":"10px"
                }).appendTo(liEle);
                var liEleArr=whiteUl.children();
                for(var i=0;i<liEleArr.length;i++){
                    if($(liEleArr[i]).hasClass("special_line")){
                        $(liEleArr[i]).remove();
                    }else if($(liEleArr[i]).hasClass("jishuhang")){
                        $(liEleArr[i]).removeClass("jishuhang").addClass("oushuhang");
                    }else if($(liEleArr[i]).hasClass("oushuhang")){
                        $(liEleArr[i]).removeClass("oushuhang").addClass("jishuhang");
                    }
                }
                whiteUl.prepend(liEle);
                liEle.id=data._id;
                liEle.button=new Button({
                    container:"#list_"+self.count,
                    text:locale.get("delete1"),
                    events:{
                        click:function(){
                            var name=liEle.find("span.left-margin").text();
                            cloud.util.mask(".heavy_line");
                            cloud.Ajax.request({
                                url:"api/black_white/"+liEle.id,
                                type:"DELETE",
                                success:function(data){
                                    liEle.remove();
                                    liEle=null;
                                    cloud.util.unmask(".heavy_line");
                                }
                            });
                            cloud.util.unmask(".heavy_line");
                        },
                        scope:this
                    }
                });
                self.tempWhiteCollection.push(liEle);
            }else{
                self.portalConfigForm.find("span#blacklist_button").trigger("click");
                var blackUl=self.portalConfigForm.find("#real_black_list");
                var liEle=$("<li></li>").addClass("white-black-list-li");
                liEle.addClass("jishuhang");
                var spanEle=$("<span></span>").appendTo(liEle).text(website).addClass("website_description left-margin").css({
//                    "text-align":"center"
                }).attr({
                    "title":website
                });
                var buttonEle=$("<span></span>").attr({
                    "id":"list_"+self.count
                }).css({
                    "line-height":"0px",
                    "position":"relative",
                    "float":"right",
                    "right":"10px"
                }).appendTo(liEle);
                liEle.id=data._id;
                var liEleArr=blackUl.children();
                for(var i=0;i<liEleArr.length;i++){
                    if($(liEleArr[i]).hasClass("special_line")){
                        $(liEleArr[i]).remove();
                    }else if($(liEleArr[i]).hasClass("jishuhang")){
                        $(liEleArr[i]).removeClass("jishuhang").addClass("oushuhang");
                    }else if($(liEleArr[i]).hasClass("oushuhang")){
                        $(liEleArr[i]).removeClass("oushuhang").addClass("jishuhang");
                    }
                }
                blackUl.prepend(liEle);
                liEle.button=new Button({
                    container:"#list_"+self.count,
                    text:locale.get("delete1"),
                    events:{
                        click:function(){
                            var name=liEle.find("span.left-margin").text();
                            cloud.util.mask(".heavy_line");
                            cloud.Ajax.request({
                                url:"api/black_white/"+liEle.id,
                                type:"DELETE",
                                success:function(data){
                                    liEle.remove();
                                    liEle=null;
                                    cloud.util.unmask(".heavy_line");
                                }
                            });
                        },
                        scope:this
                    }
                });
                self.tempBlackCollection.push(liEle);
            }
        },
        _renderCss:function(){
            var self=this;
            self.portalConfigForm.find(".white_black_wrapper").css({
                "position":"relative",
                "margin-left":"170px",
                "height":"200px",
                "width":"400px"
            });
            self.portalConfigForm.find(".white_black_list_wrapper").css({
                "position":"absolute",
                "top":"0px",
                "left":"0px",
                "width":"400px",
                "height":"200px",
                "overflow-y":"scroll",
                "overflow-x":"hidden",
                "border-left":"1px solid #EBE9E9",
                "border-bottom":"1px solid #EBE9E9"
            });
            self.portalConfigForm.find("li.for_member_authenticate").css({
                "margin-top":"8px"
            });
            self.portalConfigForm.find("ul#member_autenticate_wrapper").css({
                "margin-left":"170px",
                "margin-top":"6px"
            });
            self.portalConfigForm.find("span#get_url").css({
                "margin-left":"10px",
                "vertical-align":"2px"
            });
            self.portalConfigForm.find("label.url_random_number_wrapper").css({
                "display": "inline-block",
                "height": "23px",
                "width": "165px",
                "border": "1px solid #c9c9c9",
                "margin-left": "10px"
            });
            self.portalConfigForm.find("input#random_number").css({
                "border":"none"
            });
            self.portalConfigForm.find("span#get_again").css({
                "display":"inline-block",
                "position":"relative",
                "top":"4px",
                "cursor":"pointer"
            });
            self.portalConfigForm.find("label.wechat_label").css({
                "margin-left":"23px",
                "vertical-align":"-5px"
            });
            self.portalConfigForm.find("input#random_number").css({
                "margin-left":"10px"
            });
            self.portalConfigForm.find("label.choice_line").css({
                "margin-left":"10px"
            });
            $("#portal_config_wrapper").css({
                "margin":"0px auto",
                "width":"600px"
            });
            self.portalConfigForm.find("#add_to").css({
                "position":"relative",
                "top":"-2px",
                "left":"10px"
            });
            self.portalConfigForm.find(".checkbox_text").css({
                "margin-left":"20px"
            });
            self.portalConfigForm.find("#edit_button").css({
                "float":"right"
            });
            self.portalConfigForm.find("#submit_config").parent().css({
                "text-align":"right"
            }).end().css({
                "margin-right":"30px"
            });
            //self.portalConfigForm.find("#cancell_config").css({
            //    "margin-right":"100px"
            //});
            self.portalConfigForm.find(".title_toolbar").css({
                "display":"inline-block",
                "width":"80px",
                "text-align":"center",
                "cursor":"pointer",
                "height":"25px",
                "line-height":"25px"
            });
            self.portalConfigForm.find("#portal_forced_to_login_in").css({
                "width":"40px"
            });
            $(".varible_name").css({
                "display": "inline-block",
                "width": "170px"
            });
            $(".div_line .varible_name").css({
                "width":"140px"
            });
            $(".form_line").css({
                "margin-top":"15px",
                "margin-left":"10px"
            });
            $(".div_line").css({
                "margin-top":"5px",
                "margin-left":"10px"
            });
            $(".micro_define").css({
                "margin-top":"5px"
            });
            $(".multi_ssid").css({
                "border-top": "1px solid #e6e6e6",
                "margin-top": "5px",
                "width": "320px"
            });
            self.portalConfigForm.find("li.first_li_title").css({
                "height":"20px",
                "margin-top":"5px"
            });
            self.portalConfigForm.find("#random_number").css({
                "letter-spacing":"5px",
                "font-weight":"bold",
                "font-size":"14px"
            });
            self.portalConfigForm.find("li.wechat_code_warns").css({
                "display":"inline-block",
                "margin-left":"70px",
                "color":"#8D5353",
                "font-size":"10px"
            });
            self.portalConfigForm.find("label#click_here_clear").css({
                "color":"rgb(51, 137, 229)",
                "text-decoration":"underline",
                "cursor":"pointer"
            });
            self.portalConfigForm.find("li.wechat_code_warns").css({
                "display":"none"
            });
//            self.setGetUrl();
        },
        destroy: function() {
//			console.log("device - destroy() - table","destroy");
            this.tableTemplate.destroy();
            this.tableTemplate.element.empty();
            this.tableTemplate = null;
        }
    });
    return MyDeviceTable;
});