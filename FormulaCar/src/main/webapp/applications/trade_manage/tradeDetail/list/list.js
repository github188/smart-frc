define(function(require) {
    var cloud = require("cloud/base/cloud");
    var html = require("text!./list.html");
    require("cloud/lib/plugin/jquery-ui");
    var layout = require("cloud/lib/plugin/jquery.layout");
    var Paging = require("cloud/components/paging");
    var Button = require("cloud/components/button");
    var Table = require("cloud/components/table");
    var validator = require("cloud/components/validator");
    var Service = require("../../service");
    var TradeInfo = require("./info");
    var Content = require("./content");
    require("./css/table.css");
    require("./css/style.css");
    var list = Class.create(cloud.Component, {
        initialize: function($super, options) {
            $super(options);
            this.display = null;
            this.pageDisplay = 30;
            this.elements = {
                content: {
                    id: "trade-content"
                },
                info: {
                    id: "trade-info"
                }
            };
            this.render();
        },
        render: function() {

            this._renderHtml();
            this._renderLayout();
            this._renderContent();
        },
        _renderHtml: function() {
            this.element.html(html);
        },
        specialTypeConvertor: function(value) {
            var display = value;

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


        },
        _renderLayout: function() {
            var self = this;
            this.right = $('<div class="rightNav"></div>').appendTo($(".trade"));
            var height = document.body.scrollHeight - $("#user-header").height();
            var top = $("#user-header").height();
            this.rightSide = $("<div id='trade-info'  class='automat-right' style='top:" + top + "px;min-height:" + height + "px;overflow: auto;width:400px;display:none;'></div>").appendTo(this.right);
            this.rightbar = $("<div></div>").appendTo(this.right);
            $("#trade-content").css({
                "position": "relative"
            });
            self._animate(false);
        },
        _renderInfo: function() {
            var self = this;
            this.info = new TradeInfo({
                selector: "#" + this.elements.info.id,
                events: {
                    "hide": function() {
                        self._animate(false);
                    },
                    "refund": function() {
                        var orderNo = $("#order_no").text();
                        var oid = $("#oid").val();
                        var _id = $("#_id").val();
                        var trade_pay_style = $("#payStyles").val();
                        dialog.render({
                            lang: "affirm_refund",
                            buttons: [{
                                lang: "affirm",
                                click: function() {
                                    /*
                                     * 支付方式;1:百付宝，2:微信公众号支付，3:支付宝 ,
                                     * 4 现金支付,5 刷卡 ,6 扫胸牌,7 取货码,8 游戏,9 声波支付,
                                     * 10 POS机,11 一卡通,12 农行掌上银行支付
                                     */
                                    cloud.util.mask("#trade-info");
                                    if (trade_pay_style == 1) { //百付宝
                                        Service.refundBaifubao(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 2 || trade_pay_style == 13) { //微信
                                        Service.refund(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 3 || trade_pay_style == 9 || trade_pay_style == 19) {
                                        //window.open("https://mbillexprod.alipay.com/enterprise/sellQuery.htm");
                                        Service.refundAlipay(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 8) { //微信
                                        Service.refund(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 12) { //农行
                                        Service.refundAbc(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 14) { //会员支付
                                        Service.refundVip(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 15) { //翼支付
                                        Service.refundBest(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 16) { //京东支付
                                        Service.refundJD(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 21) { //银联支付
                                        Service.refundUnionPay(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    } else if (trade_pay_style == 23) { //扫码支付
                                        Service.refundQrcodePay(orderNo, oid, _id, function(data) {
                                            cloud.util.unmask("#trade-info");
                                            if (data == "FAIL") {
                                                dialog.render({
                                                    lang: "refunding_error"
                                                });
                                            } else {
                                                dialog.render({
                                                    lang: "refunded"
                                                });
                                            }
                                            self._renderLoadData(_id);
                                        });
                                    }

                                    dialog.close();
                                }
                            }, {
                                lang: "cancel",
                                click: function() {
                                    dialog.close();
                                }
                            }]
                        });

                    }
                }
            });
        },
        _renderContent: function() {
            var self = this;
            this.content = new Content({
                selector: "#" + self.elements.content.id,
                events: {
                    "click": function(data) {

                        self._renderInfo();
                        self._renderLoadData(data);
                        self._animate(true);
                    }
                }
            });
        },
        _renderLoadData: function(id) {
            var self = this;
            cloud.util.mask("#trade-info");
            Service.getTradeById(id, function(data) {
                self.data = data;
                //出货方式
                if (data.result.deliverStyle) {
                    if (data.result.deliverStyle == '1') {
                        $("#deliver_style").text(locale.get({
                            lang: "automatic_shipment"
                        }));
                    } else if (data.result.deliverStyle == '2') {
                        $("#deliver_style").text(locale.get({
                            lang: "code_shipment"
                        }));
                    }
                } else {
                    $("#deliver_style").text(locale.get({
                        lang: "automatic_shipment"
                    }));
                }
                $("#order_no").text(data.result.orderNo == null ? "" : data.result.orderNo);
                $("#phone").text(data.result.phone == null ? "" : data.result.phone);
                $("#runningNo").text(data.result.tradeNo == null ? "" : data.result.tradeNo);
                $("#tradeNo").text(data.result.transaction_id == null ? "" : data.result.transaction_id);
                $("#oid").val(data.result.oid == null ? "" : data.result.oid);
                $("#_id").val(data.result._id == null ? "" : data.result._id);
                $("#payStyles").val(data.result.payStyle);
                if (data.result.payStyle == 10) {
                    $("#pos_card_num").text(data.result.posCardNum == null ? "" : data.result.posCardNum);
                    $("#pos_terminal_num").text(data.result.posTerminalNum == null ? "" : data.result.posTerminalNum);
                    $("#pos_trans_sn").text(data.result.posTransSN == null ? "" : data.result.posTransSN);
                    if (data.result.posTransTime != 0) {
                        $("#pos_trans_time").text(data.result.posTransTime == null ? "" : data.result.posTransTime);
                    }
                    $("#pos_sys_sn").text(data.result.posSysSN == null ? "" : data.result.posSysSN);
                    $("#pos_merchant_num").text(data.result.posMerchantNum == null ? "" : data.result.posMerchantNum);
                } else {
                    $("#card_num").css("display", "none");
                    $("#terminal_num").css("display", "none");
                    $("#trans_sn").css("display", "none");
                    $("#trans_time").css("display", "none");
                    $("#sys_sn").css("display", "none");
                    $("#merchant_num").css("display", "none");
                }
                if (data.result.createTime != 0) {
                    $("#trade_time").text(data.result.createTime == null ? "" : cloud.util.dateFormat(new Date(data.result.createTime), "yyyy-MM-dd hh:mm:ss"));
                }
                //                if (data.result.traCreateTime != 0) {
                //                    $("#trade_times").text(data.result.traCreateTime == null ? "" : cloud.util.dateFormat(new Date(data.result.traCreateTime), "yyyy-MM-dd hh:mm:ss"));
                //                }
                if (data.result.notice_ts != 0) {
                    $("#notice_ts").text(data.result.notice_ts == null ? "" : cloud.util.dateFormat(new Date(data.result.notice_ts), "yyyy-MM-dd hh:mm:ss"));
                }
                if (data.result.exec_ts != 0) {
                    $("#exec_ts").text(data.result.exec_ts == null ? "" : cloud.util.dateFormat(new Date(data.result.exec_ts), "yyyy-MM-dd hh:mm:ss"));
                }

                if (data.result.refundTime != 0) {
                    $("#refundTime").text(data.result.refundTime == null ? "" : cloud.util.dateFormat(new Date(data.result.refundTime), "yyyy-MM-dd hh:mm:ss"));
                }
                $("#trade_automat_number").text(data.result.assetId == null ? "" : data.result.assetId);
                $("#trade_product_name").text(data.result.goodsName == null ? "" : data.result.goodsName);
                $("#trade_price").text(data.result.price == null ? "" : data.result.price / 100);
                //                $("#counts_of_phone").text(data.result.count == null ? "" : data.result.count);
                //会员支付
                if (data.result.payStyle == 14) {
                    $("#special_offer_price").text(data.result.coupon_amount == null ? "" : data.result.coupon_amount / 100);
                } else {
                    $("#special_offer_price").text(data.result.price_2 == null ? "" : data.result.price_2 / 100);
                }

                //$("#special_offer_price").text(data.result.price_2 == null? "" : data.result.price_2 / 100);
                $("#special_offer_type").text(data.result.specialType == null ? "" : self.specialTypeConvertor(data.result.specialType));
                if (data.result.price_2 != null && data.result.specialType != null) {
                    if (data.result.specialType == 1) {
                        $("#special_offer_type").after("<span class='icon-focus'></span>");
                    } else if (data.result.specialType == 2) {
                        $("#special_offer_type").after("<span class='icon-one'></span>");
                    } else if (data.result.specialType == 3) {
                        $("#special_offer_type").after("<span class='icon-perference'></span>");
                    } else if (data.result.specialType == 4) {
                        $("#special_offer_type").after("<span class='icon-discount'></span>");
                    }

                }

                if (data.result.payTime != 0) {
                    $("#trade_pay_time").text(data.result.payTime == null ? "" : cloud.util.dateFormat(new Date(data.result.payTime), "yyyy-MM-dd hh:mm:ss"));
                }

                if (data.result.payStatus == 0) {
                    var display = locale.get({
                        lang: "trade_pay_status_0"
                    });
                    $("#trade_pay_status").text(display);
                } else if (data.result.payStatus == 1) {
                    var display = locale.get({
                        lang: "trade_pay_status_1"
                    });
                    $("#trade_pay_status").text(display);
                    $("#automat_site_add").css("display", "block");
                } else if (data.result.payStatus == 2) {
                    var display = locale.get({
                        lang: "trade_pay_status_2"
                    });
                    $("#trade_pay_status").text(display);
                } else if (data.result.payStatus == 3) {
                    var display = locale.get({
                        lang: "payment_timeout"
                    });
                    $("#trade_pay_status").text(display);
                }

                $("#refundFailReason").text(data.result.refundFailReason != null ? data.result.refundFailReason : "");

                if (data.result.deliverStatus == -1) {
                    var deliver_status = locale.get({
                        lang: "deliver_status_11"
                    }); //待出货
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 0) {
                    var deliver_status = locale.get({
                        lang: "deliver_status_0"
                    }); //出货成功
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 1) {
                    var deliver_status = locale.get({
                        lang: "no_stock_no_shipment"
                    }); //出货成功
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 2) {
                    var deliver_status = locale.get({
                        lang: "trade_deliver_status_fail_1"
                    }); //售空  出货失败
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 3) {
                    var deliver_status = locale.get({
                        lang: "deliver_status_1"
                    }); //出货失败
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 4) { //出货通知发送失败
                    var deliver_status = locale.get({
                        lang: "trade_deliver_status_fail_2"
                    });
                    $("#deliver_status").text(deliver_status);
                } else if (data.result.deliverStatus == 5) { //支付超时
                    var deliver_status = locale.get({
                        lang: "trade_deliver_status_fail_5"
                    });
                    $("#deliver_status").text(deliver_status);
                }

                if (data.result.refundStatus) {
                    if (data.result.refundStatus == 1) {

                        $("#refundStatus1").text(locale.get({
                            lang: "refunding"
                        }));
                        $("#automat_site_add").hide();
                    } else if (data.result.refundStatus == 2) {

                        $("#refundStatus1").text(locale.get({
                            lang: "refunded"
                        }));
                        $("#automat_site_add").hide();
                    } else if (data.result.refundStatus == 3) {
                        $("#refundStatus1").text(locale.get({
                            lang: "refunding_error"
                        }));
                    } else if (data.result.refundStatus == 4) {
                        $("#refundStatus1").text(locale.get({
                            lang: "need_to_re_aunch_the_refund"
                        }));
                    } else if (data.result.refundStatus == 5) {
                        $("#refundStatus1").text(locale.get({
                            lang: "to_send"
                        }));
                    }
                }


                if (data.result.payStyle) {

                    if (data.result.payStyle == 1) {
                        var paystyle = locale.get({
                            lang: "trade_baifubao"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 2) {
                        var paystyle = locale.get({
                            lang: "trade_wx_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 3) {
                        var paystyle = locale.get({
                            lang: "trade_alipay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 4) {
                        var paystyle = locale.get({
                            lang: "trade_cash_payment"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 5) { //添加6,7,8:
                        var paystyle = locale.get({
                            lang: "trade_swing_card"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 6) {
                        var paystyle = locale.get({
                            lang: "trade_scanner_card"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 7) {
                        var paystyle = locale.get({
                            lang: "trade_claim_number"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 8) {
                        var paystyle = locale.get({
                            lang: "trade_game"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 9) {
                        var paystyle = locale.get({
                            lang: "trade_soundwave_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 10) {
                        var paystyle = locale.get({
                            lang: "trade_pos_mach"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 11) {
                        var paystyle = locale.get({
                            lang: "one_card_solution"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 12) {
                        var paystyle = locale.get({
                            lang: "trade_abc_palm_bank"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 13) {
                        var paystyle = locale.get({
                            lang: "wechat_reversescan_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 14) {
                        var paystyle = locale.get({
                            lang: "trade_vip"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 15) {
                        var paystyle = locale.get({
                            lang: "trade_best_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 16) {
                        var paystyle = locale.get({
                            lang: "trade_jd_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 19) {
                        var paystyle = locale.get({
                            lang: "trade_reversescan_pay"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 20) {
                        var paystyle = locale.get({
                            lang: "integral_exchange"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 21) {
                        var paystyle = locale.get({
                            lang: "UnionPay_payment"
                        });
                        $("#trade_pay_style").text(paystyle);
                    } else if (data.result.payStyle == 23) {
                        var paystyle = locale.get({
                            lang: "QrcodePay_payment"
                        });
                        if (data.result.payType) {
                            $("#qrcode").css("display", "block");
                            if (data.result.payType == "2") {
                                paystyle = paystyle + "(微信扫码)";
                            } else if (data.result.payType == "3") {
                                paystyle = paystyle + "(支付宝扫码)";
                            }
                        }
                        $("#trade_pay_style").text(paystyle);

                    } else if (data.result.payStyle == 24) {
                        var paystyle = locale.get({
                            lang: "IcbcPay_payment"
                        });
                        $("#trade_pay_style").text(paystyle);
                    }

                }

                if (data.result.payStyle) {
                    var onLinePay = ["1", "2", "3", "9", "12", "13", "14", "15", "16", "19", "20", "21", "23"];
                    var outLinePay = ["4", "5", "6", "7", "8", "10", "11"];

                    var payStyle = data.result.payStyle;
                    var paySf = $.inArray(payStyle, onLinePay); //判断是否为线上支付 
                    var outPayStyle = $.inArray(payStyle, outLinePay); //线下支付
                    if (paySf >= 0) {

                        if (data.result.payStatus == 1 && (data.result.refundStatus == 0 || data.result.refundStatus == 3) && (data.result.deliverStatus == 0 || data.result.deliverStatus == 1 || data.result.deliverStatus == 2 || data.result.deliverStatus == 3 || data.result.deliverStatus == 4 || data.result.deliverStatus == 5)) {

                            if (permission.app("transaction_detail").write) {
                                $("#automat_site_add").css("display", "block");
                            } else {
                                $("#automat_site_add").css("display", "none");
                            }

                            if (data.result.price == 0) {
                                $("#automat_site_add").css("display", "none");
                            }

                        } else {
                            $("#automat_site_add").css("display", "none");
                        }

                    } else {
                        $("#automat_site_add").css("display", "none");
                    }

                    if (payStyle == 20) {
                        $("#automat_site_add").css("display", "none");
                    }
                }

                cloud.util.unmask("#trade-info");
            });
        },
        _animate: function(flag) {
            var self = this;
            if (flag == "right" || flag == false) {
                setTimeout(function() {
                    self.rightSide.stop().animate({
                        right: "-400px"
                    }, 300, "swing");
                    self.rightbar.stop().animate({
                        right: "0px",
                        opacity: "1"
                    }, 300, "swing");
                }, 200);
            }
            if (flag == "left" || flag == true) {
                self.rightSide.stop().animate({
                    right: "0px"
                }, 300, "swing");
                self.rightbar.stop().animate({
                    right: "300px",
                    opacity: "0"
                }, 300, "swing");
            }
        }
    });
    return list;
});