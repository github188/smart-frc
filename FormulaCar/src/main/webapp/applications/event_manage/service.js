define(function(require) {
    require("cloud/base/cloud");
    var Common = require("../../common/js/common");
    var Service = Class.create({
        initialize: function() {},
        getAllLine: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/automatline/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAreaDataByUserId: function(userId, callback, context) {
            cloud.Ajax.request({
                url: "api/smartUser/" + userId,
                type: "GET",
                success: function(data) {
                    //console.log(data);
                    var roleType = permission.getInfo().roleType;
                    if (data && data.result && data.result.area && data.result.area.length > 0 && roleType != 51 || roleType == 51) {

                        var searchData = {};
                        if (roleType != 51) {
                            searchData = {
                                "areaId": data.result.area
                            };
                        }

                        searchData.limit = -1;
                        searchData.cursor = 0;
                        cloud.Ajax.request({
                            url: "api/areaMan/list",
                            type: "GET",
                            parameters: searchData,
                            success: function(data) {
                                callback.call(context || self, data);
                            }
                        });
                    } else {
                        callback.call(context || this, data);
                    }
                }
            });
        },
        getAreaByUserId: function(userId, callback, context) {
            cloud.Ajax.request({
                url: "api/smartUser/" + userId,
                type: "GET",
                success: function(data) {

                    callback.call(context || this, data);

                }
            });
        },
        getReminderById: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/alarm_subscribe/" + id,
                type: "GET",
                success: function(data) {

                    callback.call(context || this, data);

                }
            });
        },
        updateAlarmReminder: function(id, finalData, callback, context) {
            cloud.Ajax.request({
                url: "api/alarm_subscribe/" + id,
                type: "PUT",
                data: finalData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        addAlarmReminder: function(finalData, callback, context) {
            cloud.Ajax.request({
                url: "api/alarm_subscribe/add",
                type: "POST",
                data: finalData,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        deleteReminder: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/alarm_subscribe/" + id,
                type: "delete",
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getreminderList: function(parameters, limit, cursor, callback, context) {
            parameters.limit = limit;
            parameters.cursor = cursor;
            cloud.Ajax.request({
                url: "api/alarm_subscribe/list",
                type: "get",
                parameters: parameters,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAlarmList: function(parameters, limit, cursor, callback, context) {
            parameters.limit = limit;
            parameters.cursor = cursor;
            cloud.Ajax.request({
                url: "api/smart_alarm/list",
                type: "get",
                parameters: parameters,
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        updateAlarm: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/smart_alarm",
                type: "PUT",
                parameters: {
                    event_id: id
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
        getAllLines: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            cloud.Ajax.request({
                url: "api/automatline/list",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getAllAutomatsByPage: function(searchData, limit, cursor, callback, context) {
            var self = this;
            searchData.limit = limit;
            searchData.cursor = cursor;
            searchData.verbose = 100;
            cloud.Ajax.request({
                url: "api/automat/list_new",
                type: "GET",
                parameters: searchData,
                success: function(data) {
                    callback.call(context || self, data);
                }
            });
        },
        getLinesByUserId: function(userId, callback, context) {
            cloud.Ajax.request({
                url: "api/smartUser/" + userId,
                type: "GET",
                success: function(data) {
                    if (data && data.result && data.result.area) {
                        cloud.Ajax.request({
                            url: "api/automatline/list",
                            type: "GET",
                            parameters: {
                                areaId: data.result.area,
                                cursor: 0,
                                limit: -1
                            },
                            success: function(data) {
                                callback.call(context || this, data);
                            }
                        });
                    } else {
                        callback.call(context || this, data);
                    }
                }
            });
        },
        getLineInfoByUserId: function(id, callback, context) {
            cloud.Ajax.request({
                url: "api/automatline/" + id + "/line",
                type: "GET",
                parameters: {
                    limit: -1,
                    cursor: 0
                },
                success: function(data) {
                    callback.call(context || this, data);
                }
            });
        },
    });

    return new Service();

});