"use strict";define(["jquery","temp","lazyload","text!template/dl-list.html"],function(e,i,t,s){var n=window.localStorage,a=JSON.parse(n.getItem("searchinfo"))||[];function c(){i(e(".historytext").html(),a,".history-list")}c(),e.getJSON("/api/searchKey").done(function(t){i(e(".text").html(),t,".search-init")}),e(".search-input__btn").on("click",function(){var t=e(this).prev().val();""!=t&&(a.unshift(t),n.setItem("searchinfo",JSON.stringify(a)),c(),e.getJSON("/api/result",{value:t},function(t){"success"==t.message?(i(s,t.cont,".search-cont"),e("img.lazy").lazyload({effect:"fadeIn",container:e(".search-cont")})):e(".search-cont").html(t.message)}))}),e(".history-list").on("click","em",function(){var t=e(this).data("id");a.splice(t,1),n.setItem("searchinfo",JSON.stringify(a)),c()})});