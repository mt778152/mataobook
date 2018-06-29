var homeData = require('./index/home');
var page1 = require('./index/recommend1');
var page2 = require('./index/recommend2');
var page3 = require('./index/recommend3');
var searchkey = require('./search/searchKey');
var searchResult = require('./search/search');
var detail = require('./detail/352876');
var chapter = require('./reader/chapter-list');
var render1 = require('./reader/data1');
var render2 = require('./reader/data2');
var render3 = require('./reader/data3');
var render4 = require('./reader/data4');



var data = {
    '/api/index': homeData,
    '/api/loadmore?pagenum=1&limit=20': page1,
    '/api/loadmore?pagenum=2&limit=20': page2,
    '/api/loadmore?pagenum=3&limit=20': page3,
    '/api/bookself': page1,
    '/api/searchKey': searchkey,
    '/api/detail?id=352876': detail,
    '/api/chapter?id=352876': chapter,
    '/api/reader?chapterNum=1': render1,
    '/api/reader?chapterNum=2': render2,
    '/api/reader?chapterNum=3': render3,
    '/api/reader?chapterNum=4': render4,

};
module.exports = function(url) {
    if (/\/api\/result/.test(url)) {
        var n = url.split('?')[1];
        //解码
        var val = decodeURIComponent(n.split('=')[1]);
        var reg = new RegExp(val, 'g');
        var obj = {
            message: "暂无数据",
            cont: []
        };
        var newarr = searchResult.items.filter(function(v, i) { //filter 过滤数组
            v.authors = v.role[0][1];
            v.summary = v.intro;
            return reg.test(v.title) || reg.test(v.intro) || reg.test(v.role[0][1]);
        });
        // console.log(newarr)
        if (newarr.length) {
            obj.message = "success";
            obj.cont = newarr;
        }
        return obj;
    };
    // console.log(url)
    return data[url]
}