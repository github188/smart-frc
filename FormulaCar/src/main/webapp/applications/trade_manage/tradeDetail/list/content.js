define(function(require) {
    var cloud = require("cloud/base/cloud");
    require("cloud/base/fixTableHeaderV");
    var html = require("text!./content.html");
    require("cloud/lib/plugin/jquery-ui");
    var NoticeBar = require("./notice-bar");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var Service = require("../../service");
    require("./css/style.css");
    var countdown = 60;
    var timer;
    var columns = [{
            "title": locale.get({
                lang: "automat_no1"
            }),
            "dataIndex": "assetId",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "car_id"
            }),
            "dataIndex": "cid",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "user_name"
            }),
            "dataIndex": "cid",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "track_number"
            }),
            "dataIndex": "cid",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "site"
            }),
            "dataIndex": "siteName",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "automat_line"
            }),
            "dataIndex": "lineName",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "stage_type"
            }),
            "dataIndex": "machineType",
            "cls": null,
            "width": "70px",
            render: machineTypeConvertor
        }, {
            "title": locale.get({
                lang: "trade_price"
            }),
            "dataIndex": "price",
            "cls": null,
            "width": "70px",
            render: priceConvertor
        }, {
            "title": locale.get({
                lang: "weight"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "70px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "opponent1"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "70px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "opponent2"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "70px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "result_racing"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "70px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "image"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "70px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "game_duration"
            }),
            "dataIndex": "createTime",
            "cls": null,
            "width": "150px",
            render: dateConvertor
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }
    ];
    var columns2 = [{
            "title": locale.get({
                lang: "automat_no1"
            }),
            "dataIndex": "assetId",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "device_shelf_number"
            }),
            "dataIndex": "cid",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "device_shelf_type"
            }),
            "dataIndex": "machineType",
            "cls": null,
            "width": "90px",
            render: machineTypeConvertor
        }, {
            "title": locale.get({
                lang: "automat_cargo_road_id"
            }),
            "dataIndex": "locationId",
            "cls": null,
            "width": "50px"
        }, {
            "title": locale.get({
                lang: "trade_product_name"
            }),
            "dataIndex": "goodsName",
            "cls": null,
            "width": "120px"
        }, {
            "title": locale.get({
                lang: "trade_price"
            }),
            "dataIndex": "price",
            "cls": null,
            "width": "80px",
            render: priceConvertor
        }, {
            "title": locale.get({
                lang: "trade_pay_style"
            }),
            "dataIndex": "payStyle",
            "cls": null,
            "width": "90px",
            render: typeConvertor
        }, {
            "title": locale.get({
                lang: "trade_secondpayprice"
            }),
            "dataIndex": "secondPayAmount",
            "cls": null,
            "width": "80px",
            render: priceConvertor
        }, {
            "title": locale.get({
                lang: "trade_secondPay_style"
            }),
            "dataIndex": "secondPayStyle",
            "cls": null,
            "width": "90px",
            render: typeConvertor
        },
        /*{
                    "title": locale.get({lang: "special_offer_price"}),//优惠价格
                    "dataIndex": "price_2",
                    "cls": null,
                    "width": "90px",
                    render: specialPriceConvertor
                },{
                    "title": locale.get({lang: "special_offer_type"}),//优惠方式
                    "dataIndex": "specialType",
                    "cls": null,
                    "width": "90px",
                    render: specialTypeConvertor
                },*/
        {
            "title": locale.get({
                lang: "trade_pay_status"
            }),
            "dataIndex": "payStatus",
            "cls": null,
            "width": "90px",
            render: payStatusConvertor
        }, {
            "title": locale.get({
                lang: "deliver_status"
            }),
            "dataIndex": "deliverStatus",
            "cls": null,
            "width": "70px",
            render: deliverConvertor
        }, {
            "title": locale.get({
                lang: "automat_line"
            }),
            "dataIndex": "lineName",
            "cls": null,
            "width": "100px"
        }, {
            "title": locale.get({
                lang: "refund_status"
            }),
            "dataIndex": "refundStatus",
            "cls": null,
            "width": "90px",
            render: refundStatus
        }, {
            "title": locale.get({
                lang: "trade_order_time"
            }),
            "dataIndex": "createTime",
            "cls": null,
            "width": "150px",
            render: dateConvertor
        }, {
            "title": "",
            "dataIndex": "id",
            "cls": "_id" + " " + "hide"
        }
    ];

    function priceConvertor(value, type) {
        if (value == null) {
            return value
        }
        return value / 100;
    }

    function specialPriceConvertor(value, type) {
        if (value) {
            return value / 100;
        }

    }

    function refundStatus(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({
                        lang: "none"
                    }); //无
                    break;
                case 1:
                    display = locale.get({
                        lang: "refunding"
                    }); //正在退款
                    break;
                case 2:
                    display = locale.get({
                        lang: "refunded"
                    }); //退款成功
                    break;
                case 3:
                    display = locale.get({
                        lang: "refunding_error"
                    }); //退款失败
                    break;
                case 4:
                    display = locale.get({
                        lang: "need_to_re_aunch_the_refund"
                    }); //退款需要重新发起
                    break;
                case 5:
                    display = locale.get({
                        lang: "to_send"
                    }); //转入代发
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }

    function deliverConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 2:
                    display = locale.get({
                        lang: "deliver_status_1"
                    }); //出货失败 售空 
                    break;
                case 0:
                    display = locale.get({
                        lang: "deliver_status_0"
                    }); //出货成功
                    break;
                case 1:
                    display = locale.get({
                        lang: "no_stock_no_shipment"
                    }); //没有存货，无法出货
                    break;
                case 3:
                    display = locale.get({
                        lang: "deliver_status_1"
                    }); //出货失败
                    break;
                case 4:
                    display = locale.get({
                        lang: "deliver_status_1"
                    }); //出货失败 出货通知发送失败
                    break;
                case -1:
                    display = locale.get({
                        lang: "deliver_status_11"
                    }); //待出货
                    break;
                case 5:
                    display = locale.get({
                        lang: "trade_deliver_status_fail_5"
                    }); //出货失败，支付超时
                    break;

                default:
                    break;
            }
            return display;
        } else {
            return value;
        }

    }

    function dateConvertor(value, type) {
        if (type === "display") {
            return cloud.util.dateFormat(new Date(value), "yyyy-MM-dd hh:mm:ss");
        } else {
            return value;
        }
    }

    function payStatusConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 0:
                    display = locale.get({
                        lang: "trade_pay_status_0"
                    });
                    break;
                case 1:
                    display = locale.get({
                        lang: "trade_pay_status_1"
                    });
                    break;
                case 2:
                    display = locale.get({
                        lang: "trade_pay_status_2"
                    });
                    break;
                case 3:
                    display = locale.get({
                        lang: "payment_timeout"
                    });
                    break;

                default:
                    break;
            }
            return display;
        } else {
            return value;
        }

    }

    function specialTypeConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case 1:
                    display = locale.get({
                        lang: "focus_deliver_water"
                    });
                    break;
                case 2:
                    display = locale.get({
                        lang: "buy_deliver_one"
                    });
                    break;
                case 3:
                    display = locale.get({
                        lang: "buy_discount"
                    });
                    break;
                case 4:
                    display = locale.get({
                        lang: "buy_discount_perference"
                    });
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }

    }

    function machineTypeConvertor(value, type) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case "1":
                    display = locale.get({
                        lang: "drink_machine"
                    });
                    break;
                case "2":
                    display = locale.get({
                        lang: "spring_machine"
                    });
                    break;
                case "3":
                    display = locale.get({
                        lang: "grid_machine"
                    });
                    break;
                default:
                    break;
            }
            return display;
        } else {
            return value;
        }
    }

    function typeConvertor(value, type, row) {
        var display = "";
        if ("display" == type) {
            switch (value) {
                case "1":
                    display = locale.get({
                        lang: "trade_baifubao"
                    }); //百付宝
                    break;
                case "2":
                    display = locale.get({
                        lang: "trade_wx_pay"
                    }); //微信公众号支付
                    break;
                case "3":
                    display = locale.get({
                        lang: "trade_alipay"
                    }); //支付宝
                    break;
                case "4":
                    display = locale.get({
                        lang: "trade_cash_payment"
                    }); //现金支付
                    break;
                case "5":
                    display = locale.get({
                        lang: "trade_swing_card"
                    }); //刷卡
                    break;
                    //case "6":
                    //  display = locale.get({lang: "trade_scanner_card"});/* 扫胸牌 */
                    //break;
                case "7":
                    display = locale.get({
                        lang: "trade_claim_number"
                    }); /* 取货码 */
                    break;
                case "8":
                    display = locale.get({
                        lang: "trade_game"
                    }); /* 游戏 */
                    break;
                case "9":
                    display = locale.get({
                        lang: "trade_soundwave_pay"
                    }); /* 声波支付 */
                    break;
                case "10":
                    display = locale.get({
                        lang: "trade_pos_mach"
                    }); /* POS机 */
                    break;
                case "11":
                    display = locale.get({
                        lang: "one_card_solution"
                    }); /* 一卡通 */
                    break;
                case "12":
                    display = locale.get({
                        lang: "trade_abc_palm_bank"
                    }); /* 农行掌银支付 */
                    break;
                case "13":
                    display = locale.get({
                        lang: "wechat_reversescan_pay"
                    }); /* 微信反扫 */
                    break;
                case "14":
                    display = locale.get({
                        lang: "trade_vip"
                    }); /* 会员支付 */
                    break;
                case "15":
                    display = locale.get({
                        lang: "trade_best_pay"
                    }); /* 翼支付 */
                    break;
                case "16":
                    display = locale.get({
                        lang: "trade_jd_pay"
                    }); /* 京东支付 */
                    break;
                case "19":
                    display = locale.get({
                        lang: "trade_reversescan_pay"
                    }); /* 支付宝反扫 */
                    break;
                case "20":
                    display = locale.get({
                        lang: "integral_exchange"
                    }); /* 积分兑换 */
                    break;
                case "21":
                    display = locale.get({
                        lang: "UnionPay_payment"
                    }); /* 银联支付 */
                    break;
                case "23":
                    display = locale.get({
                        lang: "QrcodePay_payment"
                    }); /* 扫码支付 */
                    break;
                case "24":
                    display = locale.get({
                        lang: "IcbcPay_payment"
                    }); /* 融e联 */
                    break;
                default:
                    break;
            }

            return display;
        } else {
            return value;
        }
    }
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = 30;
            this.pageDisplay = 30;
            this.elements = {
                bar: {
                    id: "trade_list_bar",
                    "class": null
                },
                table: {
                    id: "trade_list_table",
                    "class": null
                },
                paging: {
                    id: "trade_list_paging",
                    "class": null
                }
            };
            this.render();
        },
        render: function() {
            this._renderHtml();
            this._renderNoticeBar();
            this._renderTable();
        },
        _renderHtml: function() {
            this.element.html(html);
            $("#trades_list").css("width", $(".wrap").width());
            $("#trade_list_paging").css("width", $(".wrap").width());

            $("#trades_list").css("height", $("#content-operation-menu").height() - $(".container-hd").height() - $(".main_hd").height());

            var listHeight = $("#trades_list").height();
            var barHeight = $("#trade_list_bar").height();
            var pageHeight = $("#trade_list_paging").height();
            var tableHeight = listHeight - barHeight - pageHeight - 5;
            $("#trade_list_table").css("height", tableHeight);

        },
        stripscript: function(s) {
            var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
            var rs = "";
            for (var i = 0; i < s.length; i++) {
                rs = rs + s.substr(i, 1).replace(pattern, '');
            }
            return rs;
        },
        _renderTable: function() {
            var self = this;
            var language = locale._getStorageLang();
            if (language == "en") {
                columns = columns2;
            }

            this.listTable = new Table({
                selector: "#trade_list_table",
                columns: columns,
                datas: [],
                pageSize: 100,
                autoWidth: false,
                pageToolBar: false,
                checkbox: "multi",
                events: {
                    onRowClick: function(data) {

                        this.listTable.unselectAllRows();
                        var rows = this.listTable.getClickedRow();
                        this.listTable.selectRows(rows);
                        self.fire("click", data._id);
                    },
                    onRowRendered: function(tr, data, index) {
                        var self = this;

                        if (data.deliverStatus != 0) {
                            $(tr).find("td").eq(11).css("color", "#FFA500");
                        }
                        if (data.price_2 != null && data.specialType != null) {
                            if (data.specialType == 1) {
                                $(tr).find("td").eq(6).append("<span class='icon-focus'></span>");
                            } else if (data.specialType == 2) {
                                $(tr).find("td").eq(6).append("<span class='icon-one'></span>");
                            } else if (data.specialType == 3) {
                                $(tr).find("td").eq(6).append("<span class='icon-perference'></span>");
                            } else if (data.specialType == 4) {
                                $(tr).find("td").eq(6).append("<span class='icon-discount'></span>");
                            }

                        }
                    },
                    scope: this
                }
            });
            var height = $("#trade_list_table").height() + "px";
            $("#trade_list_table-table").freezeHeaderV({
                'height': height
            });
            this.setDataTable();
        },
        setDataTable: function() {
            this.loadData();
        },
        loadData: function() {
            var self = this;
            var pageDisplay = self.display;
            //删除jQuery的table样式，自定义宽度
            // $("#trade_list_table-table").removeClass("dataTable");
            // $("#trade_list_table-table").addClass("tradeTable");
            var userline = "";
            var payStyle = "";
            if ($("#userarea").attr("multiple") != undefined) {
                userline = $("#userline").multiselect("getChecked").map(function() { //线路
                    return this.value;
                }).get();

                payStyle = $("#payStyle").multiselect("getChecked").map(function() { //支付方式
                    return this.value;
                }).get();
            }

            var payStatus = $("#payStatus").val(); //支付状态
            if (payStatus) {
                payStatus = payStatus - 1;
            } else {
                payStatus = 1;
            }
            var machineType = $("#machineType").val();
            var searchValue_assetId = $("#searchValue_assetId").val();
            var searchValue_goodsName = $("#searchValue_goodsName").val();
            var searchValue_orderNo = $("#searchValue_orderNo").val();
            var searchValue_siteName = $("#searchValue_siteName").val();
            if (searchValue_siteName) {
                searchValue_siteName = self.stripscript(searchValue_siteName);
            }
            if (searchValue_goodsName) {
                searchValue_goodsName = self.stripscript(searchValue_goodsName);
            }

            if (searchValue_assetId) {
                searchValue_assetId = self.stripscript(searchValue_assetId);
            }
            if (searchValue_orderNo) {
                searchValue_orderNo = self.stripscript(searchValue_orderNo);
            }
            var deliverStatus = $("#deliverStatus").val(); //出货状态
            if (deliverStatus) {

            } else {
                deliverStatus = 1;
            }
            var refundStatus = $("#refundStatus").val();
            var selectedId = $("#reportType").find("option:selected").val();
            if (selectedId == undefined || selectedId == 0) {
                //$("#times_date").val("");
                //$("#times_month").val("");
            }


            var nowDate = new Date();
            var start = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 00:00:00")).getTime() / 1000;
            var end = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 23:59:59")).getTime() / 1000;


            var byDate = $("#times_date").val(); //日
            var byMonth = $("#times_month").val(); //月
            if (byDate) {
                start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
            }
            if (byMonth) {
                var year = byMonth.split('/')[0];

                var months = byMonth.split('/')[1];
                var maxday = new Date(year, months, 0).getDate();
                if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                } else if (months == 2) {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/" + maxday + " 23:59:59")).getTime() / 1000;
                } else {
                    start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                    end = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                }
            }

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

                if (userline.length == 0) {
                    userline = lineIds;
                }
                cloud.util.mask("#trade_list_table");

                Service.getTradeList(0, pageDisplay, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType, function(data) {
                    var total = data.total;
                    this.totalCount = data.result.length;
                    data.total = total;
                    self.listTable.render(data.result);
                    self._renderpage(data, 1);
                    cloud.util.unmask("#trade_list_table");
                });

            });
        },
        _renderpage: function(data, start) {
            var self = this;
            if (this.page) {
                this.page.reset(data);
            } else {
                this.page = new Paging({
                    selector: $("#trade_list_paging"),
                    data: data,
                    current: 1,
                    total: data.total,
                    limit: this.pageDisplay,
                    requestData: function(options, callback) {
                        cloud.util.mask("#trade_list_table");
                        var userline = $("#userline").multiselect("getChecked").map(function() { //线路
                            return this.value;
                        }).get();

                        var payStyle = $("#payStyle").multiselect("getChecked").map(function() { //支付方式
                            return this.value;
                        }).get();

                        var deliverStatus = $("#deliverStatus").val(); //出货状态
                        if (deliverStatus) {

                        } else {
                            deliverStatus = 1;
                        }
                        var payStatus = $("#payStatus").val(); //支付状态
                        if (payStatus) {
                            payStatus = payStatus - 1;
                        } else {
                            payStatus = 1;
                        }
                        var refundStatus = $("#refundStatus").val();
                        var machineType = $("#machineType").val();
                        var searchValue_assetId = $("#searchValue_assetId").val();
                        var searchValue_goodsName = $("#searchValue_goodsName").val();
                        var searchValue_orderNo = $("#searchValue_orderNo").val();
                        var searchValue_siteName = $("#searchValue_siteName").val();
                        if (searchValue_siteName) {
                            searchValue_siteName = self.stripscript(searchValue_siteName);
                        }
                        if (searchValue_goodsName) {
                            searchValue_goodsName = self.stripscript(searchValue_goodsName);
                        }

                        if (searchValue_assetId) {
                            searchValue_assetId = self.stripscript(searchValue_assetId);
                        }
                        if (searchValue_orderNo) {
                            searchValue_orderNo = self.stripscript(searchValue_orderNo);
                        }
                        var nowDate = new Date();
                        var start = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 00:00:00")).getTime() / 1000;
                        var end = (new Date(nowDate.getFullYear() + "/" + (nowDate.getMonth() + 1) + "/" + nowDate.getDate() + " 23:59:59")).getTime() / 1000;

                        var selectedId = $("#reportType").find("option:selected").val();
                        if (selectedId == undefined || selectedId == 0) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            start = '';
                            end = '';
                        } else if (selectedId == 1) {
                            $("#times_month").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        } else if (selectedId == 2) {
                            $("#times_date").val("");
                            $("#times_start").val("");
                            $("#times_end").val("");
                        } else if (selectedId == 3) {
                            $("#times_date").val("");
                            $("#times_month").val("");
                            var startTime = $("#times_start").val(); //开始时间
                            var endTime = $("#times_end").val(); //结束时间
                            start = (new Date(startTime)).getTime() / 1000;
                            end = (new Date(endTime)).getTime() / 1000;
                        }


                        var byDate = $("#times_date").val(); //日
                        var byMonth = $("#times_month").val(); //月
                        if (byDate) {
                            start = (new Date(byDate + " 00:00:00")).getTime() / 1000;
                            end = (new Date(byDate + " 23:59:59")).getTime() / 1000;
                        }
                        if (byMonth) {
                            var year = byMonth.split('/')[0];

                            var months = byMonth.split('/')[1];
                            var maxday = new Date(year, months, 0).getDate();
                            if (months == 1 || months == 3 || months == 5 || months == 7 || months == 8 || months == 10 || months == 12) {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/31" + " 23:59:59")).getTime() / 1000;
                            } else if (months == 2) {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/" + maxday + " 23:59:59")).getTime() / 1000;
                            } else {
                                start = (new Date(byMonth + "/01" + " 00:00:00")).getTime() / 1000;
                                end = (new Date(byMonth + "/30" + " 23:59:59")).getTime() / 1000;
                            }
                        }

                        if (userline.length == 0) {
                            userline = self.lineIds;
                        }

                        Service.getTradeList(options.cursor, options.limit, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType, function(data) {
                            callback(data);
                            cloud.util.unmask("#trade_list_table");
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
        settime: function() {
            var self = this;
            if (countdown == 1) {
                $("#trade_list_table-table").find('td').each(function(index, item) {
                    if (index == 8) {
                        $(item).text(locale.get({
                            lang: "payment_timeout"
                        }));
                    }
                });
            } else {
                $("#trade_list_table-table").find('td').each(function(index, item) {
                    if (index == 8) {
                        $(item).text(locale.get({
                            lang: "trade_pay_status_0"
                        }) + "(" + countdown + ")");
                    }
                });
                countdown--;
                timer = setTimeout(function() {
                    self.settime();
                }, 1000)
            }
        },
        _renderNoticeBar: function() {
            var self = this;
            this.noticeBar = new NoticeBar({
                selector: "#trade_list_bar",
                events: {
                    query: function(payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType) { //查询
                        cloud.util.mask("#trade_list_table");
                        var pageDisplay = self.display;

                        if (start) {} else {
                            start = '';
                        }
                        if (end) {} else {
                            end = '';
                        }
                        Service.getTradeList(0, pageDisplay, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, start, end, refundStatus, payStatus, userline, deliverStatus, machineType, function(data) {
                            var total = data.total;
                            this.totalCount = data.result.length;
                            data.total = total;
                            self.listTable.render(data.result);
                            self._renderpage(data, 1);
                            cloud.util.unmask("#trade_list_table");
                            window.clearInterval(timer);
                            if (data && data.result.length > 0) {
                                for (var i = 0; i < data.result.length; i++) {
                                    if (data.result[i].timer > 0) {
                                        //倒计时
                                        countdown = data.result[i].timer;
                                        self.settime();
                                    }
                                }
                            }
                        });
                    },

                    exports: function(payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, startTime, endTime, refundStatus, payStatus, userline, deliverStatus, machineType, refundStatus) { //导出
                        var len = $("#search-bar").find("a").length;
                        var id = $("#search-bar").find("a").eq(len - 1).attr("id");
                        $("#" + id).after("<span style='margin-left:6px;' id='bexport'>" + locale.get({
                            lang: "being_export"
                        }) + "</span>");
                        $("#" + id).hide();

                        var language = locale._getStorageLang() === "en" ? 1 : 2;
                        var host = cloud.config.FILE_SERVER_URL;
                        var reportName = "TradeReport.xlsx";
                        var uid = cloud.storage.sessionStorage("accountInfo").split(",")[1].split(":")[1];
                        var userName = cloud.storage.sessionStorage("accountInfo").split(",")[2].split(":")[1];

                        var now = Date.parse(new Date()) / 1000;
                        var path = "/home/trade/" + now + "/" + reportName;
                        var url = host + "/api/vmreports/getTradeExcel?report_name=" + reportName + "&path=" + path + "&access_token=" + cloud.Ajax.getAccessToken();

                        Service.createTradeExcel(uid, userName, payStyle, searchValue_assetId, searchValue_goodsName, searchValue_orderNo, searchValue_siteName, startTime, endTime, refundStatus, payStatus, userline, deliverStatus, machineType, now, refundStatus, language, function(data) {
                            if (data.status == "doing" && data.operation == "export") {
                                dialog.render({
                                    lang: "export_large_task"
                                });
                            } else if (data.status == "failure" && data.operation == "export") {
                                dialog.render({
                                    lang: "export_large_task_exit"
                                });
                            } else {

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

                                    Service.findTradeExcel(now, "trade.txt", function(data) {

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
                                                lang: "role_e"
                                            }) + "</span>");
                                            $("#" + id).show();
                                        }
                                    })
                                }, 5000);
                            }
                        });
                    }
                }
            });
        }
    });

    return list;
});