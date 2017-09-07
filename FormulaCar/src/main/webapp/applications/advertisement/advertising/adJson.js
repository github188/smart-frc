/**
 * Created by Inhand on 15-3-16.
 */
define(function(){

    var JsonData = [
        {
            "name":"默认广告位",
            "_id":"ad_id_default",
            "width":"123",
            "height":"321"
        },{
            "name":"未命名广告位1",
            "_id":"ad_id_01",
            "width":"123",
            "height":"321"
        },{
            "name":"未命名广告位2",
            "_id":"ad_id_02",
            "width":"123",
            "height":"321"
        },{
            "name":"未命名广告位3",
            "_id":"ad_id_03",
            "width":"123",
            "height":"321"
        }/*,{
         "name":"欢迎页面广告位1",
         "_id":"JKDSJFDSLJFKDSLDF",
         "width":"123",
         "height":"321"
         },{
         "name":"欢迎页面广告位1",
         "_id":"JKDSJFDSLJFKDSLDF",
         "width":"123",
         "height":"321"
         },*/
    ]

    var test = [
        {"rtype": "ad_id_default", "banners": []},
        {"rtype": "ad_id_01", "banners": [
            {"metaId": "e90d00dfa5f94afa8f5a1448100a679d", "metaname": "图片2", "type": 1, "trade": "1", "url": "www.2.com", "picHeight": 128, "picWidth": 128, "ext": "png", "bannerLocationId": "micro_site_02", "updateTime": 1426499401160, "_id": "5506a749e4b0e45ae5fbf0fa"}
        ]},
        {"rtype": "ad_id_02", "banners": [
            {"metaId": "22c1b29ad2584434bbcbdae7565fb1f4", "metaname": "1232313132", "type": 1, "trade": "1", "url": "321", "picHeight": 128, "picWidth": 128, "ext": "png", "bannerLocationId": "micro_site_03", "updateTime": 1426500188574, "_id": "5506aa5ce4b0b6e4ee083537"}
        ]},
        {"rtype": "ad_id_03", "banners": [
            {"metaId": "2164fea6a44d4cf1be64898120032e6d", "metaname": "123133", "type": 1, "trade": "1", "url": "21313123", "picHeight": 130, "picWidth": 190, "ext": "gif", "bannerLocationId": "micro_site_04", "createTime": 1426500208852, "updateTime": 1426500208852, "_id": "5506aa70e4b0b6e4ee083539"}
        ]}
    ]

    return JsonData;
});
