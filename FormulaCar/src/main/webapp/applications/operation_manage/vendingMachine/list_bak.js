define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../../common/js/common");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var html = require("text!./list.html");
    var Service = require("./service");
    var NoticeBar = require("./notice-bar");
    var Table = require("cloud/components/table");
    var Button = require("cloud/components/button");
    var Paging = require("cloud/components/paging");
    var ImportProduct = require("./importAndOutport/importdevice-window");
    var AddDevice = require("./add/adddevice-windowV2");
    var SeeDevice = require("./see/seedevice-window");
    var UpdateDevice = require("./updateV2/updatedevice-window");

    var drink = new Template(
            "<img id='drink' src='./operation_manage/vendingMachine/images/drink.png' title='饮料机' style='vertical-align:middle;'></img>")
        .evaluate({});
    var spring = new Template(
            "<img id='spring' src='./operation_manage/vendingMachine/images/spring.png'  title='弹簧机' style='vertical-align:middle;'></img>")
        .evaluate({});
    var grid = new Template(
            "<img id='grid' src='./operation_manage/vendingMachine/images/grid.png'  title='格子柜' style='vertical-align:middle;'></img>")
        .evaluate({});
    var coffee = new Template(
            "<img id='coffee' src='./operation_manage/vendingMachine/images/coffee.png' title='咖啡机'  style='vertical-align:middle;'></img>")
        .evaluate({});
    var wine = new Template(
            "<img id='wine' src='./operation_manage/vendingMachine/images/wine.png'  title='白酒机' style='vertical-align:middle;'></img>")
        .evaluate({});


    var five = new Template(
            "<img id='5' src='./operation_manage/vendingMachine/images/5.png'  style='vertical-align:middle;'></img>")
        .evaluate({});
    var one = new Template(
            "<img id='1' src='./operation_manage/vendingMachine/images/1.png'  style='vertical-align:middle;'></img>")
        .evaluate({});
    var all = new Template(
            "<img id='1' src='./operation_manage/vendingMachine/images/1.png'  style='vertical-align:middle;'></img>" +
            "<img id='5' src='./operation_manage/vendingMachine/images/5.png'  style='vertical-align:middle;'></img>")
        .evaluate({});

    var columns_other = [{
        "title": locale.get({
            lang: "network"
        }),
        "dataIndex": "online",
        "cls": null,
        "width": "6%",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({
                            lang: "offline"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: offlineStr
                            });
                        break;
                    case 0:
                        var onlineStr = locale.get({
                            lang: "online"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: onlineStr
                            });
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
        "title": locale.get({
            lang: "numbers"
        }),
        "dataIndex": "assetId",
        "cls": null,
        "width": "12%",
        render: function(data, type, row) {
            var display = "";
            display += new Template(
                    "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatAsset' style='line-height: 25px;'><span style='color: #09c;cursor: pointer;'>" + data + "</span></div>")
                .evaluate({
                    status: ''
                });

            return display;
        }
    }, {
        "title": locale.get( "the_stage_name"),
        "dataIndex": "name",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get({
            lang: "automat_site_name"
        }),
        "dataIndex": "siteName",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get({
            lang: "line_man_name"
        }),
        "dataIndex": "lineName",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "stage_type"),
        "dataIndex": "stage_type",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "opening_time"),
        "dataIndex": "opening_time",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "cars_number"),
        "dataIndex": "cars_number",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "track_number"),
        "dataIndex": "track_number",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "manufacturer"),
        "dataIndex": "manufacturer",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get( "hot_rank"),
        "dataIndex": "hot_rank",
        "cls": null,
        "width": "12%"
    }, {
        "title": locale.get({
            lang: "create_time"
        }),
        "dataIndex": "createTime",
        "cls": null,
        "width": "14%",
        render: function(data, type, row) {
            return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
        }
    }];



    var columns = [{
        "title": locale.get({
            lang: "network"
        }),
        "dataIndex": "online",
        "cls": null,
        "width": "35px",
        render: function(data, type, row) {
            var display = "";
            if ("display" == type) {
                switch (data) {
                    case 1:
                        var offlineStr = locale.get({
                            lang: "offline"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-offline\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: offlineStr
                            });
                        break;
                    case 0:
                        var onlineStr = locale.get({
                            lang: "online"
                        });
                        display += new Template(
                                "<div  style = \"display : inline-block;\" class = \"cloud-table-online\" title = \"#{status}\"}></div>")
                            .evaluate({
                                status: onlineStr
                            });
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
        "title": locale.get({
            lang: "numbers"
        }),
        "dataIndex": "assetId",
        "cls": null,
        "width": "120px",
        render: function(data, type, row) {
            var display = "";
            display += new Template(
                    "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatAsset' style='line-height: 25px;'><span style='color: #09c;cursor: pointer;'>" + data + "</span></div>")
                .evaluate({
                    status: ''
                });

            return display;
        }
    }, , {
        "title": "售货机名称",
        "dataIndex": "name",
        "cls": null,
        "width": "120px"
    }, {
        "title": locale.get({
            lang: "automat_site_name"
        }),
        "dataIndex": "siteName",
        "cls": null,
        "width": "120px"
    }, {
        "title": locale.get({
            lang: "line_man_name"
        }),
        "dataIndex": "lineName",
        "cls": null,
        "width": "120px"
    }, {
        "title": locale.get({
            lang: "automat_sale"
        }), //是否可售卖
        "dataIndex": "vendingState",
        "cls": null,
        "width": "70px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.isSale && data.isSale == 1) {
                    display += new Template(
                            "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatShelf' style='line-height: 25px;'><span style='color: rgb(69, 139, 0);'>" + locale.get({
                                lang: "automat_can_be_sold"
                            }) + "</span></div>")
                        .evaluate({
                            status: ''
                        });
                } else if (data.isSale == 0) {
                    display += new Template(
                            "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatShelf' style='line-height: 25px;'><span style='color: red;'>" + locale.get({
                                lang: "automat_can_not_be_sold"
                            }) + "</span></div>")
                        .evaluate({
                            status: ''
                        });
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }

            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "shelf_status"
        }), //售空状态
        "dataIndex": "vendingState",
        "cls": null,
        "width": "80px",
        render: function(data, type, row) {
            var display = "";
            var sum = "";
            var flag = 0;
            if (data) {
                if (data.shelvesSumState && data.shelvesSumState.length > 0) {
                    for (var i = 0; i < data.shelvesSumState.length; i++) {
                        if (data.shelvesSumState[i].shelfSoldSum || data.shelvesSumState[i].shelfSoldSum == 0) {
                            if (i == data.shelvesSumState.length - 1) {
                                sum = sum + data.shelvesSumState[i].shelfSoldSum;
                            } else {
                                sum = sum + data.shelvesSumState[i].shelfSoldSum + "/";
                            }
                            if (data.shelvesSumState[i].shelfSoldSum == 0) {
                                flag = flag + 1;
                            }
                        }
                    }
                    if (flag == data.shelvesSumState.length) {
                        display += new Template(
                                "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatShelf shelf_status' style='line-height: 25px;'><span style='color: rgb(69, 139, 0);cursor: pointer;'>" + locale.get({
                                    lang: "device_normal"
                                }) + "</span></div>")
                            .evaluate({
                                status: ''
                            });

                    } else {
                        display += new Template(
                                "<div id='" + row._id + "' assetId='" + row.assetId + "' class='automatShelf shelf_status' style='line-height: 25px;'><span style='color: red;cursor: pointer;'>" + sum + "</span></div>")
                            .evaluate({
                                status: ''
                            });
                    }
                } else {
                    display = "<div><span>未知</span></div>";
                }
            } else {
                display = "<div><span>未知</span></div>";
            }

            return display;

        }
    }, {
        "title": locale.get({
            lang: "automat_fault_status"
        }),
        "dataIndex": "vendingState",
        "cls": null,
        "width": "80px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.vendingFault && data.vendingFault.length > 0) {
                    for (var i = 0; i < data.vendingFault.length; i++) {
                        if (data.vendingFault[i].ccode != "90037" && data.vendingFault[i].ccode != "90038") {
                            display = locale.get({
                                lang: "fault"
                            });
                            break;
                        } else {
                            display = locale.get({
                                lang: "device_normal"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "device_normal"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "automat_cargo_road_amount"
        }),
        "dataIndex": "vendingState",
        "cls": null,
        "width": "60px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.shelvesSumState && data.shelvesSumState.length > 0) {
                    for (var i = 0; i < data.shelvesSumState.length; i++) {
                        if (i == data.shelvesSumState.length - 1) {
                            display = display + data.shelvesSumState[i].shelfSum;
                        } else {
                            display = display + data.shelvesSumState[i].shelfSum + "/";
                        }
                    }
                } else {
                    display = "未知";
                }
            } else {
                display = "未知";
            }
            return display;

        }
    }, {
        "title": locale.get({
            lang: "automat_vendor_type"
        }),
        "dataIndex": "vendingState",
        "cls": null,
        "width": "120px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.shelvesSumState && data.shelvesSumState.length > 0) {
                    for (var i = 0; i < data.shelvesSumState.length; i++) {
                        if (data.shelvesSumState[i].type == 1) {
                            display += drink;
                        } else if (data.shelvesSumState[i].type == 2) {
                            display += spring;
                        } else if (data.shelvesSumState[i].type == 3) {
                            display += grid;
                        } else if (data.shelvesSumState[i].type == 4) {
                            display += coffee;
                        } else if (data.shelvesSumState[i].type == 5) {
                            display += win;
                        }
                    }
                } else {
                    display = "未知";
                }
            } else {
                display = "未知";
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "product_manufacturer"
        }),
        "dataIndex": "config",
        "cls": null,
        "width": "100px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                display = data.vender;
                display = Common.getLangVender(display);
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "automat_five"
        }), //5角数
        "dataIndex": "vendingState",
        "cls": null,
        "width": "60px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.coin5Count) {
                    if (data.coin5Count >= 0) {
                        display = data.coin5Count;
                    } else {
                        display = "0";
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }

                if (data.vendingFault && data.vendingFault.length > 0) {
                    for (var i = 0; i < data.vendingFault.length; i++) {
                        if (data.vendingFault[i].ccode == "90037") {
                            display = locale.get({
                                lang: "the_lack_of_currency"
                            });
                            break;
                        }
                    }
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "automat_one"
        }), //1元数
        "dataIndex": "vendingState",
        "cls": null,
        "width": "60px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.coin10Count) {
                    if (data.coin10Count >= 0) {
                        display = data.coin10Count;
                    } else {
                        display = "0";
                    }

                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }

                if (data.vendingFault && data.vendingFault.length > 0) {
                    for (var i = 0; i < data.vendingFault.length; i++) {
                        if (data.vendingFault[i].ccode == "90038") {
                            display = locale.get({
                                lang: "the_lack_of_currency"
                            });
                            break;
                        }
                    }
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "automat_door"
        }), //开门状态
        "dataIndex": "vendingState",
        "cls": null,
        "width": "50px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.doorState && data.doorState == 1) {
                    display = locale.get({
                        lang: "automat_open_the_door"
                    });
                } else if (data.doorState == 0) {
                    display = locale.get({
                        lang: "automat_close_the_door"
                    });
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "temperature_value"
        }), //食品机温度
        "dataIndex": "vendingState",
        "cls": null,
        "width": "100px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid != 'master') {
                            if (data.temperState[i].temperDetail.leftRmTem) {
                                if (data.temperState[i].temperDetail.leftRmTem >= -30) {
                                    display = data.temperState[i].temperDetail.leftRmTem;
                                } else {
                                    display = locale.get({
                                        lang: "automat_unknown"
                                    });
                                }

                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "upper_lower_limit_of_refrigeration_temperature"
        }), //制冷温度上限/下限
        "dataIndex": "vendingState",
        "cls": null,
        "width": "110px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.cryTemUL && data.temperState[i].temperDetail.cryTemDL) {
                                var cryTemUL = data.temperState[i].temperDetail.cryTemUL; //制冷温度上限
                                var cryTemDL = data.temperState[i].temperDetail.cryTemDL; //制冷温度下限
                                display = cryTemUL + '/' + cryTemDL;
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "upper_lower_limit_of_thermal_temperature"
        }), //制热温度上限/下限
        "dataIndex": "vendingState",
        "cls": null,
        "width": "110px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.heatTemUL && data.temperState[i].temperDetail.heatTemDL) {
                                var heatTemUL = data.temperState[i].temperDetail.heatTemUL; //制热温度上限
                                var heatTemDL = data.temperState[i].temperDetail.heatTemDL; //制热温度下限
                                display = heatTemUL + '/' + heatTemDL;
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "energy_saving"
        }), //节能
        "dataIndex": "vendingState",
        "cls": null,
        "width": "80px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.engyOnT && data.temperState[i].temperDetail.engyOffT) {
                                var engyOnT = data.temperState[i].temperDetail.engyOnT;
                                var engyOffT = data.temperState[i].temperDetail.engyOffT;
                                display = '开[' + engyOnT + ']' + '<br/>' + '关[' + engyOffT + ']';
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "fluorescent_lamp"
        }), //日光灯
        "dataIndex": "vendingState",
        "cls": null,
        "width": "80px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.lampOnT && data.temperState[i].temperDetail.lampOffT) {
                                var lampOnT = data.temperState[i].temperDetail.lampOnT;
                                var lampOffT = data.temperState[i].temperDetail.lampOffT;
                                display = '开[' + lampOnT + ']' + '<br/>' + '关[' + lampOffT + ']';
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "left_ventricular_temperature"
        }), //左室温度
        "dataIndex": "vendingState",
        "cls": null,
        "width": "70px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.leftRmTem) {
                                if (data.temperState[i].temperDetail.leftRmTem > 128) {
                                    display = data.temperState[i].temperDetail.leftRmTem - 256;
                                }
                                if (data.temperState[i].temperDetail.leftRmTem >= -30) {
                                    display = data.temperState[i].temperDetail.leftRmTem;
                                } else {
                                    display = locale.get({
                                        lang: "automat_unknown"
                                    });
                                }
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "right_ventricular_temperature"
        }), //右室温度
        "dataIndex": "vendingState",
        "cls": null,
        "width": "70PX",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            if (data.temperState[i].temperDetail.rightRmTem) {
                                if (data.temperState[i].temperDetail.rightRmTem > 128) {
                                    display = data.temperState[i].temperDetail.rightRmTem - 256;
                                }
                                if (data.temperState[i].temperDetail.rightRmTem >= -30) {
                                    display = data.temperState[i].temperDetail.rightRmTem;
                                } else {
                                    display = locale.get({
                                        lang: "automat_unknown"
                                    });
                                }
                            } else {
                                display = locale.get({
                                    lang: "automat_unknown"
                                });
                            }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "peripheral_control"
        }), //外设控制
        "dataIndex": "vendingState",
        "cls": null,
        "width": "110px",
        render: function(data, type, row) {
            var display = "";
            if (data) {
                if (data.temperState && data.temperState.length > 0) {
                    for (var i = 0; i < data.temperState.length; i++) {
                        if (data.temperState[i].cid == 'master') {
                            //  if(data.temperState[i].temperDetail.leftRmRef && data.temperState[i].temperDetail.rightRmRef && data.temperState[i].temperDetail.leftRmHeat && data.temperState[i].temperDetail.rightRmHeat && data.temperState[i].temperDetail.lampNorOp && data.temperState[i].temperDetail.lampAut){
                            var leftRmRef = data.temperState[i].temperDetail.leftRmRef;
                            if (leftRmRef == 1) {
                                leftRmRef = locale.get({
                                    lang: "left_ref"
                                });
                            } else if (leftRmRef == 0) {
                                leftRmRef = ""
                            }
                            var rightRmRef = data.temperState[i].temperDetail.rightRmRef;
                            if (rightRmRef == 1) {
                                rightRmRef = locale.get({
                                    lang: "right_ref"
                                });
                                rightRmRef = "," + rightRmRef;
                            } else if (rightRmRef == 0) {
                                rightRmRef = ""
                            }
                            var leftRmHeat = data.temperState[i].temperDetail.leftRmHeat;
                            if (leftRmHeat == 1) {
                                leftRmHeat = locale.get({
                                    lang: "left_heat"
                                });
                                leftRmHeat = "," + leftRmHeat;
                            } else if (leftRmHeat == 0) {
                                leftRmHeat = ""
                            }
                            var rightRmHeat = data.temperState[i].temperDetail.rightRmHeat;
                            if (rightRmHeat == 1) {
                                rightRmHeat = locale.get({
                                    lang: "right_heat"
                                });
                                rightRmHeat = "," + rightRmHeat;
                            } else if (rightRmHeat == 0) {
                                rightRmHeat = ""
                            }
                            var lampNorOp = data.temperState[i].temperDetail.lampNorOp;
                            if (lampNorOp == 1) {
                                lampNorOp = locale.get({
                                    lang: "all_open"
                                });
                                lampNorOp = "," + lampNorOp;
                            } else if (lampNorOp == 0) {
                                lampNorOp = ""
                            }
                            var lampAut = data.temperState[i].temperDetail.lampAut;
                            if (lampAut == 1) {
                                lampAut = locale.get({
                                    lang: "hand_open"
                                });
                                lampAut = "," + lampAut;
                            } else if (lampAut == 0) {
                                lampAut = ""
                            }
                            display = leftRmRef + rightRmRef + leftRmHeat + rightRmHeat + lampNorOp + lampAut;
                            if (leftRmRef == 0 && rightRmRef == 0 && leftRmHeat == 0 && rightRmHeat == 0 && lampNorOp == 0 && lampAut == 0) {
                                display = ""
                            }
                            //      }
                            //                              else{
                            //                                  display = locale.get({lang: "automat_unknown"});
                            //                              }
                        } else if (data.temperState[i].cid != 'master') {
                            display = locale.get({
                                lang: "automat_unknown"
                            });
                        }
                    }
                } else {
                    display = locale.get({
                        lang: "automat_unknown"
                    });
                }
            } else {
                display = locale.get({
                    lang: "automat_unknown"
                });
            }
            return display;
        }
    }, {
        "title": locale.get({
            lang: "create_time"
        }),
        "dataIndex": "createTime",
        "cls": null,
        "width": "150px",
        render: function(data, type, row) {
            return cloud.util.dateFormat(new Date(data), "yyyy-MM-dd hh:mm:ss");
        }
    }];


    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.deviceIdArr = [];
            this.cidArr = [];
            this.onlineType = options.onlineType;
            this.element.html(html);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "device_list_bar",
                    "class": null
                },
                table: {
                    id: "device_list_table",
                    "class": null
                },
                paging: {
                    id: "device_list_paging",
                    "class": null
                }
            };
            $(function() {
                $("#dialog").dialog({
                    autoOpen: false,
                    show: {
                        effect: "blind",
                        duration: 1000
                    },
                    hide: {
                        effect: "explode",
                        duration: 1000
                    }
                });

            });
            this._render();


        },
        _render: function() {

            $("#device_list").css("width", $(".wrap").width());
            $("#device_list_paging").css("width", $(".wrap").width());

            $("#device_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#device_list").height();
            var barHeight = $("#device_list_bar").height() * 2;
            var tableHeight = listHeight - barHeight - 7;
            $("#device_list_table").css("height", tableHeight);

            require(["cloud/base/fixTableHeaderV"], function(Account) {
                var height = $("#device_list_table").height() + "px";
                $("#device_list_table-table").freezeHeaderV({
                    'height': height
                });
            });

            this._renderTable();
            this._renderNoticeBar();
        },
        _renderBtn: function() {
            var self = this;
            $(".automatAsset").click(function() {
                var _id = $(this)[0].id;
                var assetId = $(this)[0].attributes[1];
                this.seeDevice = new SeeDevice({
                    selector: "body",
                    deviceId: _id,
                    automatNo: assetId,
                    deviceIdArr: self.automatIds,
                    tab: 3,
                    events: {
                        "getDeviceList": function() {
                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                        }
                    }
                });
            });

            $(".shelf_status").click(function() {
                var _id = $(this)[0].id;
                var assetId = $(this)[0].attributes[1];
                this.seeDevice = new SeeDevice({
                    selector: "body",
                    deviceId: _id,
                    automatNo: assetId,
                    deviceIdArr: self.automatIds,
                    tab: 4,
                    events: {
                        "getDeviceList": function() {
                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                        }
                    }
                });
            });
        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        getFaultCode: function(data) {
            var display = "";
            if (data == "90011") {
                display = "驱动板故障";
            } else if (data == "90012") {
                display = "系统时钟故障";
            } else if (data == "90013") {
                display = "左室传感器故障";
            } else if (data == "90014") {
                display = "右室传感器故障";
            } else if (data == "90015") {
                display = "红外模块故障";
            } else if (data == "90016") {
                display = "读卡器故障";
            } else if (data == "90021") {
                display = "连接故障";
            } else if (data == "90022") {
                display = "纸币器驱动马达故障";
            } else if (data == "90023") {
                display = "纸币器钱箱被移除";
            } else if (data == "90024") {
                display = "纸币器钱箱已满";
            } else if (data == "90025") {
                display = "纸币器rom校验错误";
            } else if (data == "90026") {
                display = "纸币器传感器故障";
            } else if (data == "90027") {
                display = "纸币器堵塞";
            } else if (data == "90028") {
                display = "纸币器停用";
            } else if (data == "90031") {
                display = "硬币器连接故障";
            } else if (data == "90032") {
                display = "硬币器工作电压低";
            } else if (data == "90033") {
                display = "硬币器传感器故障";
            } else if (data == "90034") {
                display = "硬币器ROM校验错误";
            } else if (data == "90035") {
                display = "硬币器接收堵塞";
            } else if (data == "90036") {
                display = "硬币器支出堵塞";
            } else if (data == "90037") {
                display = "5角缺币";
            } else if (data == "90038") {
                display = "1元缺币";
            } else if (data == "90039") {
                display = "硬币器异常移除";
            } else if (data == "900311") {
                display = "硬币器停用";
            } else if (data == "90041") {
                display = "扩展柜1通讯故障";
            } else if (data == "90042") {
                display = "扩展柜2通讯故障";
            } else if (data == "90043") {
                display = "扩展柜3通讯故障";
            } else if (data == "90044") {
                display = "扩展柜4通讯故障";
            } else if (data == "90045") {
                display = "扩展柜5通讯故障";
            } else if (data == "90046") {
                display = "扩展柜6通讯故障";
            } else if (data == "90047") {
                display = "扩展柜7通讯故障";
            } else if (data == "90048") {
                display = "扩展柜8通讯故障";
            }

            return display;

        },
        _renderTable: function() {
            var self = this;
            var column = columns_other;
            var currentHost = window.location.hostname;
            if (currentHost == "longyuniot.com") { //澳柯玛longyuniot.com
                column = columns;
            }


            this.listTable = new Table({
                selector: "#device_list_table",
                columns: column,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "full",
                events: {
                    onRowClick: function(data) {
                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;
                        //售卖状态
                        var sellstate = $(tr).find("td").eq(6).text();
                        if (sellstate == locale.get({
                                lang: "automat_can_be_sold"
                            })) {
                            $(tr).find("td").eq(6).css("color", "#458B00");
                        } else if (sellstate == locale.get({
                                lang: "automat_can_not_be_sold"
                            })) {
                            $(tr).find("td").eq(6).css("color", "red");
                        }

                        //库存
                        var c = $(tr).find("td").eq(7).text();
                        var d = $(tr).find("td").eq(8).text();
                        if (c == locale.get({
                                lang: "device_normal"
                            })) {
                            $(tr).find("td").eq(7).css("color", "#458B00");
                        } else if (c != locale.get({
                                lang: "automat_unknown"
                            })) {
                            $(tr).find("td").eq(7).css("color", "red");
                        }

                        //                        var warnsHtml = "";
                        //                        if(currentHost == "localhost"){//澳柯玛longyuniot.com
                        //                          
                        //                          if(d != locale.get({lang: "automat_unknown"})){
                        //                              if(data.vendingState && data.vendingState.vendingFault){
                        //                                  var faults = data.vendingState.vendingFault;
                        //                                  for(var n=0;n<faults.length;n++){
                        //                                      if(n==0){
                        //                                          warnsHtml = "<div style='text-align: center; opacity: 0.8;'>"+data.assetId+"<span id='close' class='ui-window-title-close' style='display: inline-block;width: 16px;height: 16px;'></span></div>";
                        //                                          
                        //                                      }
                        //                                      //var pcodef = self.getFaultCode(faults[n].pcode);
                        //                                      var ccodef = self.getFaultCode(faults[n].ccode);
                        //                                      warnsHtml+="<li>"+(n+1)+".&nbsp;&nbsp;"+ccodef+"</li>"
                        //                                      
                        //                                  }
                        //                              }
                        //                              
                        //                              
                        //                          }
                        //                          
                        //                      }
                        if (currentHost == "longyuniot.com") {
                            var fv = $(tr).find("td").eq(12).text();
                            var oe = $(tr).find("td").eq(13).text();
                            if (fv == locale.get({
                                    lang: "the_lack_of_currency"
                                })) {
                                $(tr).find("td").eq(12).css("color", "red");
                            }
                            if (oe == locale.get({
                                    lang: "the_lack_of_currency"
                                })) {
                                $(tr).find("td").eq(13).css("color", "red");
                            }

                        }
                        //故障
                        if (d == locale.get({
                                lang: "device_normal"
                            })) {
                            $(tr).find("td").eq(8).css("color", "#458B00");

                        } else if (d != locale.get({
                                lang: "automat_unknown"
                            })) {
                            if (currentHost == "longyuniot.com") {
                                $(tr).find("td").eq(8).css("color", "red");
                                //                                $(tr).find("td").eq(8).css("cursor","pointer");
                                //                              $(tr).find("td").eq(8).mouseover(function (e){
                                //                                  
                                //                                  $(".test").html("");
                                //                                  var warns = "<ul style='height: 190px;overflow: auto;width: 210px;'>" +
                                //                                  warnsHtml+
                                //                                          "</ul>";
                                //                                  $(".test").append(warns); 
                                //                                  $(".test").show();  
                                //                                  
                                //                                  $("#close").mouseover(function (e){
                                //                                      if($("#close").hasClass("ui-window-title-close-active")){
                                //                                          
                                //                                      }else{
                                //                                          $("#close").addClass("ui-window-title-close-active");
                                //                                      }
                                //                                      
                                //                                      
                                //                                  }).mouseout(function (e){
                                //                                      if($("#close").hasClass("ui-window-title-close-active")){
                                //                                          $("#close").removeClass("ui-window-title-close-active");
                                //                                      }
                                //                                      
                                //                                  })
                                //                                  $("#close").bind("click",function(){
                                //                                      
                                //                                      $(".test").html("");
                                //                                      $(".test").hide();
                                //                                      
                                //                                  });
                                //                                  
                                //                              }).mouseout(function (e){
                                //                                  
                                //                                  //$(".test").hide();
                                //                              })

                            } else {
                                /*if(d == "1"){
                                    $(tr).find("td").eq(6).html("<span class='fivem'>5</span>");
                                }else if(d == "2"){
                                    $(tr).find("td").eq(6).html("<span class='onem'>1</span>");
                                }else if(d == "12"){
                                    $(tr).find("td").eq(6).html("<span class='onem'>1</span><span class='fivem'>5</span>");
                                }*/
                            }
                        }

                    },
                    scope: this
                }
            });

            this.setDataTable();
        },
        setDataTable: function() {
            this.loadTableData(30, 0, "");
        },
        loadTableData: function(limit, cursor, areaVal) {
            cloud.util.mask("#device_list_table");

            var self = this;

            var online = $("#online").val();
            if (online) {
                //0 在线 1离线
                if (online == -1) {
                    online = '';
                }
            } else {
                //查所有
                if (cloud.style == 1) {
                    if (cloud.online != null && cloud.online == 0) {
                        online = 0;
                    } else if (cloud.online && cloud.online == 1) {
                        online = 1;
                    }
                }
            }



            var areaId = "";
            var lineId = "";

            if ($("#userarea").attr("multiple") != undefined) {
                areaId = $("#userarea").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
                lineId = $("#userline").multiselect("getChecked").map(function() { //
                    return this.value;
                }).get();
            }

            var lineFlag = 1;
            if (areaId.length != 0) {
                if ($("#userline").find("option").length <= 0) {
                    lineFlag = 0;
                }
            }
            var search = $("#search").val();
            var searchValue = $("#searchValue").val();
            if (searchValue) {
                searchValue = self.stripscript(searchValue);
            }

            var siteName = null;
            var assetId = null;
            var name = null;
            var vender = null;
            if (search) {
                if (search == 0) {
                    assetId = $("#searchValue").val();
                } else if (search == 1) {
                    siteName = searchValue; //点位名称
                } else if (search == 2) {
                    name = searchValue; //售货机名称
                } else if (search == 3) {
                    vender = $('#vender option:selected').val();
                    if (vender == '0') {
                        vender = '';
                    }
                }
            }

            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
            var roleType = permission.getInfo().roleType;
            Service.getAreaByUserId(userId, function(areadata) {

                var areaIds = [];
                if (areadata && areadata.result && areadata.result.area && areadata.result.area.length > 0) {
                    areaIds = areadata.result.area;
                }
                if (roleType == 51) {
                    areaIds = [];
                }
                if (areaId.length != 0) {
                    areaIds = areaId;
                }

                if (roleType != 51 && areaIds.length == 0) {
                    areaIds = ["000000000000000000000000"];
                }
                cloud.Ajax.request({
                    url: "api/automatline/list",
                    type: "GET",
                    parameters: {
                        areaId: areaIds,
                        cursor: 0,
                        limit: -1
                    },
                    success: function(linedata) {
                        var lineIds = [];
                        if (linedata && linedata.result && linedata.result.length > 0) {
                            for (var i = 0; i < linedata.result.length; i++) {
                                lineIds.push(linedata.result[i]._id);
                            }
                        }

                        if (roleType == 51 && areaId.length == 0) {
                            lineIds = [];
                        }
                        if (lineId.length != 0) {
                            lineIds = lineId;
                        } else {
                            if (lineFlag == 0) {
                                lineIds = ["000000000000000000000000"];
                            }
                        }

                        if (roleType != 51 && lineIds.length == 0) {
                            lineIds = ["000000000000000000000000"];
                        }
                        self.lineIds = lineIds;
                        if (self.onlineType) {
                            self.searchData = {
                                "online": online,
                                "siteName": siteName,
                                "assetId": assetId,
                                "lineId": lineIds,
                                "name": name,
                                "vender": vender,
                                "onlineType": self.onlineType
                            };
                        } else {
                            self.searchData = {
                                "online": online,
                                "siteName": siteName,
                                "assetId": assetId,
                                "name": name,
                                "vender": vender,
                                "lineId": lineIds
                            };
                        }

                        Service.getAllAutomatsByPage(self.searchData, limit, cursor, function(data) {
                            var total = data.result.length;
                            self.pageRecordTotal = total;
                            self.totalCount = data.result.length;

                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            self._renderBtn();
                            cloud.util.unmask("#device_list_table");
                        }, self);

                        Service.getAllAutomatIds(self.searchData, -1, 0, function(data) {

                            if (data && data.result) {
                                var automatIds = [];
                                if (data.result && data.result.length > 0) {
                                    for (var i = 0; i < data.result.length; i++) {
                                        automatIds.push(data.result[i]._id);
                                    }
                                }
                                self.automatIds = automatIds.reverse();
                            }

                        }, self);

                    }
                });
            });

        },
        _renderpage: function(data, start) {
            var self = this;
            if (self.page) {
                self.page.reset(data);
            } else {
                self.page = new Paging({
                    selector: $("#device_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#device_list_table");
                        Service.getAllAutomatsByPage(self.searchData, options.limit, options.cursor, function(data) {
                            self.pageRecordTotal = data.total - data.cursor;
                            callback(data);
                            self._renderBtn();
                            cloud.util.unmask("#device_list_table");
                        });
                    },
                    turn: function(data, nowPage) {

                        self.totalCount = data.result.length;
                        self.listTable.clearTableData();
                        self.listTable.render(data.result);
                        self.nowPage = parseInt(nowPage);

                    },
                    events: {
                        "displayChanged": function(display) {
                            self.display = parseInt(display);
                        }
                    }
                });
                this.nowPage = start;
            }
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#device_list_bar",
                onlineType: self.onlineType,
                events: {
                    query: function(searchData) {
                        self.loadTableData($(".paging-limit-select").val(), 0, '');
                        /*cloud.util.mask("#device_list_table");
                         var pageDisplay =  self.display;
                         self.searchData = searchData;
                         Service.getAllAutomatsByPage(self.searchData, pageDisplay, 0, function(data) {
                             var total = data.result.length;
                             for(var i = 0 ;i<total;i++){
                                self.deviceIdArr.push(data.result[i]._id);
                             }

                             self.pageRecordTotal = total;
                             self.totalCount = data.result.length;
                             self.listTable.render(data.result);
                             self._renderpage(data, 1);
                             self._renderBtn();
                             cloud.util.unmask("#device_list_table");
                         }, self);  
                         
                         Service.getAllAutomatIds(self.searchData,-1, 0, function(data) {
                             if(data && data.result){
                                 var automatIds=[];
                                 if(data.result && data.result.length>0){
                                      for(var i=0;i<data.result.length;i++){
                                          automatIds.push(data.result[i]._id);
                                      }
                                 }
                                 self.automatIds = automatIds.reverse();
                             }
                             
                         }, self);*/
                    },
                    add: function() { //添加
                        var languge = localStorage.getItem("language");
                        if (this.addDevice) {
                            this.addDevice.destroy();
                        }
                        if (languge == "en") {
                            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                            var roleType = permission.getInfo().roleType;
                            Service.getLinesByUserId(userId, function(linedata) {
                                var lineIds = [];
                                if (linedata && linedata.result && linedata.result.length > 0) {
                                    for (var i = 0; i < linedata.result.length; i++) {
                                        lineIds.push(linedata.result[i]._id);
                                    }
                                }
                                if (roleType == 51) {
                                    lineIds = [];
                                }
                                if (roleType != 51 && lineIds.length == 0) {
                                    lineIds = ["000000000000000000000000"];
                                }
                                self.lineIds = lineIds;
                                Service.getAllEnableSitesByPage({
                                    "lineId": lineIds
                                }, -1, 0, function(siteData) {
                                    if (siteData.result && siteData.result.length > 0) {
                                        require(["./add/adddevice-window-en"], function(AddDevice_en) {
                                            if (!this.AddDevice_en) {
                                                this.addDevice = new AddDevice_en({
                                                    selector: "body",
                                                    events: {
                                                        "getDeviceList": function() {
                                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                        }
                                                    }
                                                });
                                            }
                                        });


                                    } else {
                                        dialog.render({
                                            lang: "not_free_site"
                                        });
                                    }
                                }, self);

                            });

                        } else {

                            var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                            var roleType = permission.getInfo().roleType;
                            Service.getLinesByUserId(userId, function(linedata) {
                                var lineIds = [];
                                if (linedata && linedata.result && linedata.result.length > 0) {
                                    for (var i = 0; i < linedata.result.length; i++) {
                                        lineIds.push(linedata.result[i]._id);
                                    }
                                }
                                if (roleType == 51) {
                                    lineIds = [];
                                }
                                if (roleType != 51 && lineIds.length == 0) {
                                    lineIds = ["000000000000000000000000"];
                                }
                                self.lineIds = lineIds;
                                Service.getAllEnableSitesByPage({
                                    "lineId": lineIds
                                }, -1, 0, function(siteData) {
                                    if (siteData.result && siteData.result.length > 0) {

                                        this.addDevice = new AddDevice({
                                            selector: "body",
                                            events: {
                                                "getDeviceList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });

                                    } else {
                                        dialog.render({
                                            lang: "not_free_site"
                                        });
                                    }
                                }, self);

                            });


                        }
                    },
                    update: function() { //修改
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            if (this.updateDevice) {
                                this.updateDevice.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {
                                require(["./updateV2/updatedevice-window-en"], function(UpdateDevice_en) {
                                    if (!this.UpdateDevice_en) {
                                        this.updateDevice = new UpdateDevice_en({
                                            selector: "body",
                                            deviceId: _id,
                                            onlineType: self.onlineType,
                                            events: {
                                                "getDeviceList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });
                                    }
                                });

                            } else {
                                this.updateDevice = new UpdateDevice({
                                    selector: "body",
                                    deviceId: _id,
                                    onlineType: self.onlineType,
                                    events: {
                                        "getDeviceList": function() {
                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                        }
                                    }
                                });
                            }

                        }
                    },
                    see: function() {
                        var selectedResouces = self.getSelectedResources();
                        if (selectedResouces.length === 0) {
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                        } else if (selectedResouces.length >= 2) {
                            dialog.render({
                                lang: "select_one_gateway"
                            });
                        } else {
                            var _id = selectedResouces[0]._id;
                            var assetId = selectedResouces[0].assetId;
                            if (this.seeDevice) {
                                this.seeDevice.destroy();
                            }
                            var languge = localStorage.getItem("language");
                            if (languge == "en") {
                                require(["./see/seedevice-window-en"], function(SeeDevice_en) {
                                    if (!this.SeeDevice_en) {
                                        this.seeDevice = new SeeDevice_en({
                                            selector: "body",
                                            deviceId: _id,
                                            automatNo: assetId,
                                            deviceIdArr: self.automatIds,
                                            events: {
                                                "getDeviceList": function() {
                                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                                }
                                            }
                                        });
                                    }
                                });

                            } else {
                                this.seeDevice = new SeeDevice({
                                    selector: "body",
                                    deviceId: _id,
                                    automatNo: assetId,
                                    deviceIdArr: self.automatIds,
                                    events: {
                                        "getDeviceList": function() {
                                            self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                        }
                                    }
                                });
                            }
                        }
                    },
                    del: function() {
                        cloud.util.mask("#content-table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#content-table");
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                            return;
                        } else {
                            cloud.util.unmask("#content-table");
                            var ids = "";
                            for (var i = 0; i < idsArr.length; i++) {
                                if (i == idsArr.length - 1) {
                                    ids = ids + idsArr[i]._id;
                                } else {
                                    ids = ids + idsArr[i]._id + ",";
                                }
                            }
                            dialog.render({
                                lang: "affirm_delete",
                                buttons: [{
                                    lang: "affirm",
                                    click: function() {
                                        cloud.util.mask("#device_list_table");
                                        Service.deleteAutomatsByIds(ids, function(data) {
                                            if (self.pageRecordTotal == 1) {
                                                var cursor = ($(".paging-page-current").val() - 2) * $(".paging-limit-select").val();
                                                if (cursor < 0) {
                                                    cursor = 0;
                                                }
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                            } else {
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                            }
                                            self.pageRecordTotal = self.pageRecordTotal - 1;
                                            /*if(data.failure>0){
                                                var a= locale.get({lang: "total_has"});
                                                var b = locale.get({lang: "tai"});
                                                var c =  locale.get({lang: "delete_failed"});
                                                var d =  locale.get({lang: "delete_failed_reson"});
                                                var message = a+data.failure+b+c+","+d;
                                               dialog.render({text:message});
                                               
                                               
                                               
                                            }else{
                                               dialog.render({lang: "deletesuccessful"});
                                            }*/
                                            dialog.render({
                                                lang: "deletesuccessful"
                                            });

                                        }, self);
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        cloud.util.unmask("#device_list_table");
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    },
                    imReport: function() {
                        if (this.imPro) {
                            this.imPro.destroy();
                        }
                        this.imPro = new ImportProduct({
                            selector: "body",
                            events: {
                                "getDeviceList": function() {
                                    self.loadTableData($(".paging-limit-select  option:selected").val(), ($(".paging-page-current").val() - 1) * $(".paging-limit-select").val(), "");
                                }
                            }
                        });
                    },
                    exReport: function() {
                        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "deviceList.xlsx";

                        var parameters = "&access_token=" + cloud.Ajax.getAccessToken();
                        var online = $("#online").val();
                        if (online) {
                            if (online == -1) {
                                online = '';
                            }
                        }
                        var userline = $("#userline").multiselect("getChecked").map(function() { //线路                        
                            return this.value;
                        }).get();
                        var search = $("#search").val();
                        var searchValue = $("#searchValue").val();
                        if (searchValue) {
                            searchValue = self.stripscript(searchValue);
                        }

                        var siteName = null;
                        var assetId = null;
                        var name = null;
                        if (search) {
                            if (search == 0) {
                                assetId = $("#searchValue").val();
                            } else if (search == 1) {
                                siteName = searchValue; //点位名称
                            } else if (search == 2) {
                                name = searchValue; //售货机名称
                            }
                        }
                        var userId = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                        var roleType = permission.getInfo().roleType;
                        Service.getLinesByUserId(userId, function(linedata) {
                            var lineIds = [];
                            if (linedata.result && linedata.result.length > 0) {
                                for (var i = 0; i < linedata.result.length; i++) {
                                    lineIds.push(linedata.result[i]._id);
                                }
                            }
                            if (roleType == 51) {
                                lineIds = [];
                            }
                            if (roleType != 51 && lineIds.length == 0) {
                                lineIds = ["000000000000000000000000"];
                            }
                            self.lineIds = lineIds;
                            if (userline.length == 0) {
                                userline = lineIds;
                            }

                            if (online != null && online != "") {
                                parameters += "&online=" + online;
                            }
                            if (siteName != null && siteName != "") {
                                parameters += "&siteName=" + siteName;
                            }
                            if (assetId != null && assetId != "") {
                                parameters += "&assetId=" + assetId;
                            }
                            if (name != null && name != "") {
                                parameters += "&name=" + name;
                            }
                            if (userline != null && userline.length > 0) {
                                parameters += "&lineId=" + userline;
                            }
                            if (language) {
                                parameters += "&language=" + language;
                            }
                            var now = Date.parse(new Date()) / 1000;
                            var oid = cloud.storage.sessionStorage("accountInfo").split(",")[0].split(":")[1];
                            parameters += "&time=" + now;
                            parameters += "&oid=" + oid;
                            var path = "/home/deviceList/" + now + "/" + reportName;
                            var url = host + "/api/vmreports/getAutomatListExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();
                            Service.createDeviceListExcel(parameters, function(data) {
                                if (data) {
                                    var len = $("#search-bar").find("a").length;
                                    var id = $("#search-bar").find("a").eq(len - 1).attr("id");
                                    $("#" + id).html("");
                                    if (document.getElementById("bexport") != undefined) {
                                        $("#bexport").show();
                                    } else {
                                        $("#" + id).after("<span style='margin-left:6px;' id='bexport'>" + locale.get({
                                            lang: "being_export"
                                        }) + "</span>");
                                    }
                                    $("#" + id).hide();

                                    var timer = setInterval(function() {
                                        Service.findDeviceListExcel(now, "deviceList.txt", function(data) {
                                            if (data.onlyResultDTO.result.res == "ok") {
                                                cloud.util.ensureToken(function() {
                                                    window.open(url, "_self");
                                                });
                                                clearInterval(timer);
                                                $("#" + id).html("");
                                                if ($("#bexport")) {
                                                    $("#bexport").hide();
                                                }
                                                $("#" + id).append("<span class='cloud-button-item cloud-button-text'>" + locale.get({
                                                    lang: "export"
                                                }) + "</span>");
                                                $("#" + id).show();
                                            }
                                        })
                                    }, 5000);
                                }
                            });
                            /* cloud.util.ensureToken(function() {
                                 window.open(url+parameters, "_self");
                             });   */
                        });
                    },
                    auth: function() {
                        cloud.util.mask("#content-table");
                        var idsArr = self.getSelectedResources();
                        if (idsArr.length == 0) {
                            cloud.util.unmask("#content-table");
                            dialog.render({
                                lang: "please_select_at_least_one_config_item"
                            });
                            return;
                        } else {
                            var ids = "";
                            for (var i = 0; i < idsArr.length; i++) {
                                if (i == idsArr.length - 1) {
                                    ids = ids + idsArr[i]._id;
                                } else {
                                    ids = ids + idsArr[i]._id + ",";
                                }
                                /*var siteName = idsArr[i].siteName;
                                 var lineName = idsArr[i].lineName;
                                 
                                 if(siteName == null || lineName == null){
                                     dialog.render({lang: "please_add_site_line_for_device"});
                                     return;
                                 }*/


                            }
                            dialog.render({
                                lang: "affirm_authentication",
                                buttons: [{
                                    lang: "affirm",
                                    click: function() {
                                        cloud.util.mask("#device_list_table");
                                        Service.authAutomatsByIds(ids, function(data) {
                                            if (self.pageRecordTotal == 1) {
                                                var cursor = ($(".paging-page-current").val() - 2) * $(".paging-limit-select").val();
                                                if (cursor < 0) {
                                                    cursor = 0;
                                                }
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                            } else {
                                                self.loadTableData($(".paging-limit-select  option:selected").val(), cursor, "");
                                            }
                                            self.pageRecordTotal = self.pageRecordTotal - 1;
                                            dialog.render({
                                                lang: "authentication_success"
                                            });
                                        }, self);
                                        dialog.close();
                                    }
                                }, {
                                    lang: "cancel",
                                    click: function() {
                                        cloud.util.unmask("#device_list_table");
                                        dialog.close();
                                    }
                                }]
                            });
                        }
                    }
                }
            });
            $("#buttonDiv a.cloud-button").show();
        },
        getSelectedResources: function() {
            var self = this;
            var rows = self.listTable.getSelectedRows();
            var selectedRes = new Array();
            rows.each(function(row) {
                selectedRes.push(self.listTable.getData(row));
            });
            return selectedRes;
        }
    });
    return list;
});