"use strict";require.config({baseUrl:"/js/",paths:{jquery:"lib/jquery-3.3.1.min",zepto:"lib/zepto",flexible:"lib/flexible",handlebars:"lib/handlebars-v4.0.11",swiper:"lib/swiper-4.1.6.min",index:"index/index",text:"lib/require.text",template:"../template/",temp:"common/temp",lazyload:"lib/jquery.lazyload",search:"search/index",detail:"detail/index",getUrl:"common/getUrl",menu:"menu/index",text1:"text/index",base64:"lib/jquery.base64",loagin:"loagin/index"},shim:{lazyload:{exports:"lazyload",deps:["jquery"]},base64:{exports:"base64",deps:["jquery"]}}}),require(["flexible"]);