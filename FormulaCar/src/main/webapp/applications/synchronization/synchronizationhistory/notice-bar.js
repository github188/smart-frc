/**
 * Created by zhouyunkui on 14-6-15.
 */
define(function(require){
    var cloud = require("cloud/base/cloud");
    require("cloud/lib/plugin/jquery-ui");
    require("cloud/resources/css/jquery-ui.css");
    var Button = require("cloud/components/button");
    //	require("./jquery.multiselect.css");
    var NoticeBar = Class.create(cloud.Component, {
        initialize:function($super,options){
            $super(options);
            this.render();
            this.selectorEle=$(options.selector);
        },
        render:function(){

        }
    });

    return NoticeBar;

});